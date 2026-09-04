#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

usage() {
  cat <<EOF
Usage: $0 <command> [args]

Commands:
  master                        Run on the master node — installs K3s and opens firewall ports
  worker <MASTER_IP> <TOKEN>    Run on a worker node — joins the cluster
  cluster <MASTER_IP>           Run locally — applies all k8s manifests via kubectl

Required env vars for 'cluster':
  DB_PASSWORD   PostgreSQL password
  JWT_SECRET    JWT signing secret

Optional env vars for 'cluster':
  MASTER_IP     Can be passed as env var instead of argument
EOF
  exit 1
}

# ---------------------------------------------------------------------------
# master: run this ON the master node
# ---------------------------------------------------------------------------
cmd_master() {
  info "Setting up master node..."

  # Firewall
  if command -v ufw &>/dev/null; then
    info "Opening UFW ports (master)..."
    sudo ufw allow 6443/tcp
    sudo ufw allow 8472/udp
    sudo ufw allow 10250/tcp
    sudo ufw reload
  elif command -v firewall-cmd &>/dev/null; then
    info "Opening firewalld ports (master)..."
    sudo firewall-cmd --permanent --add-port=6443/tcp
    sudo firewall-cmd --permanent --add-port=8472/udp
    sudo firewall-cmd --permanent --add-port=10250/tcp
    sudo firewall-cmd --reload
  else
    warn "No known firewall manager found — skipping port rules"
  fi

  # Time sync
  if ! command -v chronyc &>/dev/null; then
    info "Installing chrony..."
    sudo apt-get install -y chrony 2>/dev/null || sudo yum install -y chrony 2>/dev/null || warn "Could not install chrony"
  fi
  sudo systemctl enable --now chrony || true

  # K3s
  info "Installing K3s on master..."
  curl -sfL https://get.k3s.io | sh -

  info "Waiting for K3s to be ready..."
  until sudo kubectl get nodes 2>/dev/null | grep -q " Ready"; do sleep 3; done

  echo ""
  info "Master is ready. Save these values for your workers:"
  echo ""
  echo "  NODE_TOKEN: $(sudo cat /var/lib/rancher/k3s/server/node-token)"
  echo ""
  info "To use kubectl from your local machine, run:"
  echo "  sudo cat /etc/rancher/k3s/k3s.yaml"
  echo "  Then replace 127.0.0.1 with this machine's IP and copy to ~/.kube/config"
}

# ---------------------------------------------------------------------------
# worker: run this ON each worker node
# ---------------------------------------------------------------------------
cmd_worker() {
  local master_ip="${1:-}"
  local token="${2:-}"
  [[ -z "$master_ip" ]] && error "Missing MASTER_IP. Usage: $0 worker <MASTER_IP> <TOKEN>"
  [[ -z "$token" ]]     && error "Missing TOKEN. Usage: $0 worker <MASTER_IP> <TOKEN>"

  info "Setting up worker node (master: $master_ip)..."

  if command -v ufw &>/dev/null; then
    info "Opening UFW ports (worker)..."
    sudo ufw allow 8472/udp
    sudo ufw allow 10250/tcp
    sudo ufw reload
  fi

  if ! command -v chronyc &>/dev/null; then
    info "Installing chrony..."
    sudo apt-get install -y chrony 2>/dev/null || sudo yum install -y chrony 2>/dev/null || warn "Could not install chrony"
  fi
  sudo systemctl enable --now chrony || true

  info "Joining cluster at $master_ip..."
  curl -sfL https://get.k3s.io | K3S_URL="https://${master_ip}:6443" K3S_TOKEN="$token" sh -

  info "Worker joined. Check on master with: kubectl get nodes"
}

# ---------------------------------------------------------------------------
# cluster: run this LOCALLY with kubectl configured
# ---------------------------------------------------------------------------
cmd_cluster() {
  local master_ip="${1:-${MASTER_IP:-}}"
  [[ -z "$master_ip" ]] && error "Missing MASTER_IP. Pass it as argument or set MASTER_IP env var."

  : "${DB_PASSWORD:?DB_PASSWORD env var is required}"
  : "${JWT_SECRET:?JWT_SECRET env var is required}"

  command -v kubectl &>/dev/null || error "kubectl not found in PATH"
  kubectl cluster-info &>/dev/null || error "kubectl cannot reach the cluster — check your kubeconfig"

  # CNPG operator
  info "Installing CloudNativePG operator..."
  kubectl apply --server-side -f \
    https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.23/releases/cnpg-1.23.0.yaml

  info "Waiting for CNPG operator to be ready..."
  kubectl wait --for=condition=available deployment/cnpg-controller-manager \
    -n cnpg-system --timeout=120s

  # Namespaces
  info "Creating namespaces..."
  kubectl apply -f "$REPO_ROOT/infra/k8s/namespaces.yaml"

  # Secrets
  info "Creating application secret (honks-secrets)..."
  kubectl create secret generic honks-secrets \
    --from-literal=DB_PASSWORD="$DB_PASSWORD" \
    --from-literal=JWT_SECRET="$JWT_SECRET" \
    -n honks-app \
    --dry-run=client -o yaml | kubectl apply -f -

  info "Creating DB credentials secret (honks-db-credentials)..."
  kubectl create secret generic honks-db-credentials \
    --from-literal=username=honks \
    --from-literal=password="$DB_PASSWORD" \
    -n honks-db \
    --dry-run=client -o yaml | kubectl apply -f -

  info "Generating TLS certificate for honks.local..."
  local tmpdir
  tmpdir="$(mktemp -d)"
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$tmpdir/tls.key" -out "$tmpdir/tls.crt" \
    -subj "/CN=honks.local/O=honks" 2>/dev/null

  kubectl create secret tls honks-tls \
    --cert="$tmpdir/tls.crt" --key="$tmpdir/tls.key" \
    -n honks-app \
    --dry-run=client -o yaml | kubectl apply -f -
  rm -rf "$tmpdir"

  # ConfigMap
  info "Applying configmap..."
  kubectl apply -f "$REPO_ROOT/infra/k8s/config/configmap.yaml"

  # DB
  info "Deploying PostgreSQL cluster (CNPG)..."
  kubectl apply -f "$REPO_ROOT/infra/k8s/db/cluster.yaml"

  info "Waiting for DB cluster to be healthy (up to 3 min)..."
  local attempts=0
  until kubectl get cluster -n honks-db 2>/dev/null | grep -q "Cluster in healthy state"; do
    sleep 10
    attempts=$((attempts + 1))
    [[ $attempts -ge 18 ]] && { warn "DB cluster not ready after 3 min — check: kubectl get cluster -n honks-db"; break; }
  done

  # Apps
  info "Deploying API and Web..."
  kubectl apply -f "$REPO_ROOT/infra/k8s/apps/api/"
  kubectl apply -f "$REPO_ROOT/infra/k8s/apps/web/"

  info "Waiting for app pods..."
  kubectl wait --for=condition=available deployment --all -n honks-app --timeout=120s || \
    warn "Some deployments not ready — check: kubectl get pods -n honks-app"

  # Ingress
  info "Applying ingress..."
  kubectl apply -f "$REPO_ROOT/infra/k8s/networking/ingress.yaml"

  # Monitoring
  info "Deploying monitoring stack..."
  kubectl apply -f "$REPO_ROOT/infra/k8s/monitoring/"

  # /etc/hosts hint
  echo ""
  info "Add this to /etc/hosts on your client machine:"
  echo "  $master_ip  honks.local"
  echo ""
  info "Test with:"
  echo "  curl -k https://honks.local/api/health"
  echo "  curl -k https://honks.local"
  echo ""
  info "Grafana port-forward:"
  echo "  kubectl port-forward svc/grafana 3001:3000 -n honks-monitoring"
  echo "  -> http://localhost:3001  (admin / admin)"
  echo ""

  # Final status
  info "Cluster status:"
  kubectl get pods -A | grep -v -E "Running|Completed" || true
}

# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
[[ $# -lt 1 ]] && usage

case "$1" in
  master)  cmd_master ;;
  worker)  cmd_worker "${2:-}" "${3:-}" ;;
  cluster) cmd_cluster "${2:-}" ;;
  *)       usage ;;
esac
