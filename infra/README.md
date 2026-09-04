# Kubernetes  Honks  mise en place

---

> Prérequis : 2+ machines Linux (ou VMs). Toutes les machines doivent pouvoir se joindre mutuellement sur le réseau.

### 0. Préparer la connectivité réseau

**Vérifier que les machines se voient** (depuis chaque node) :

```bash
ping <IP_MASTER>
ping <IP_WORKER_1>
```

Si ça ne répond pas, les machines ne sont pas sur le même réseau ou un firewall bloque. Régler d'abord ça avant de continuer.

**Ouvrir les ports K3s sur le master** (si firewall actif) :

```bash
# ufw (Ubuntu/Debian)
sudo ufw allow 6443/tcp      # API server - workers → master
sudo ufw allow 8472/udp      # Flannel VXLAN - trafic inter-nodes
sudo ufw allow 10250/tcp     # kubelet API - métriques entre nodes
sudo ufw allow 51820/udp     # WireGuard (si activé)
sudo ufw reload

# firewalld (CentOS/RHEL/Fedora)
sudo firewall-cmd --permanent --add-port=6443/tcp
sudo firewall-cmd --permanent --add-port=8472/udp
sudo firewall-cmd --permanent --add-port=10250/tcp
sudo firewall-cmd --reload
```

**Ouvrir les mêmes ports sur les workers** (ils doivent aussi accepter le trafic Flannel) :

```bash
sudo ufw allow 8472/udp
sudo ufw allow 10250/tcp
sudo ufw reload
```

**Configurer les IPs statiques** (fortement recommandé - si une IP change, le cluster casse) :

```bash
# Vérifier l'IP actuelle de chaque machine
ip a | grep inet

# Sur Ubuntu avec Netplan (/etc/netplan/00-installer-config.yaml) :
# ethernets:
#   eth0:
#     dhcp4: no
#     addresses: [192.168.1.10/24]
#     gateway4: 192.168.1.1
#     nameservers:
#       addresses: [8.8.8.8]
sudo netplan apply
```

**Configurer `/etc/hosts` sur chaque machine** pour la résolution par nom :

```bash
# Sur toutes les machines (master et workers)
sudo tee -a /etc/hosts << EOF
192.168.1.10  honks-master
192.168.1.11  honks-worker-1
192.168.1.12  honks-worker-2
EOF
```

**Configurer SSH sans mot de passe** (optionnel mais pratique pour administrer) :

```bash
# Depuis machine locale vers master
ssh-keygen -t ed25519 -C "honks-cluster"
ssh-copy-id user@<IP_MASTER>
ssh-copy-id user@<IP_WORKER_1>
```

**Synchroniser les horloges !!** (etcd est sensible aux drifts de temps) :

```bash
# Sur toutes les machines
sudo apt install -y chrony          # ou ntp
sudo systemctl enable --now chrony
chronyc tracking                    # vérifier la sync
```

Dernier check

```bash
# Depuis le master
ping -c 2 honks-worker-1
ping -c 2 honks-worker-2

# Depuis un worker
nc -zv <IP_MASTER> 6443
```

---

### 1. Installer K3s sur le master (version lighweight de k8s)

```bash
curl -sfL https://get.k3s.io | sh -
```

Récupérer le token pour joindre les workers :

```bash
sudo cat /var/lib/rancher/k3s/server/node-token
```

Récupérer le kubeconfig et le copier en local :

```bash
sudo cat /etc/rancher/k3s/k3s.yaml
# Remplacer 127.0.0.1 par l'IP du master, puis copier dans ~/.kube/config en local
```

Vérifier que le master est Ready :

```bash
kubectl get nodes
```

---

### 2. Joindre les workers au cluster

Sur **chaque worker**, remplacer `<MASTER_IP>` et `<NODE_TOKEN>` :

```bash
curl -sfL https://get.k3s.io | K3S_URL=https://<MASTER_IP>:6443 K3S_TOKEN=<NODE_TOKEN> sh -
```

Depuis le master, vérifier que les workers apparaissent :

```bash
kubectl get nodes
# Attendre que tous soient en STATUS Ready
```

---

### 3. Installer l'operator CloudNativePG (CNPG)

CNPG gère le cluster PostgreSQL. Il faut l'installer avant de créer la base.

```bash
  kubectl apply --server-side -f https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.23/releases/cnpg-1.23.0.yaml
```

Attendre que l'operator soit Running :

```bash
kubectl get pods -n cnpg-system -w
```

---

### 4. Cloner le repo et se positionner

```bash
git clone https://github.com/Honks-esgi/projet_annuel_honks_5IWJ.git
cd projet_annuel_honks_5IWJ
```

---

### 5. Créer les namespaces

```bash
kubectl apply -f infra/k8s/namespaces.yaml
```

Vérification : `kubectl get namespaces | grep honks`

---

### 6. Créer les Secrets

> Les secrets ne sont pas dans le repo - à créer manuellement.

**Secret applicatif** (API) dans `honks-app` :

```bash
kubectl create secret generic honks-secrets \
  --from-literal=DB_PASSWORD=<mot_de_passe_db> \
  --from-literal=JWT_SECRET=<jwt_secret> \
  -n honks-app
```

**Secret DB** pour CNPG dans `honks-db` :

```bash
kubectl create secret generic honks-db-credentials \
  --from-literal=username=honks \
  --from-literal=password=<mot_de_passe_db> \
  -n honks-db
```

**Secret TLS** pour l'Ingress (certificat auto-signé) :

```bash
# Générer un certificat auto-signé pour honks.local
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout tls.key -out tls.crt \
  -subj "/CN=honks.local/O=honks"

kubectl create secret tls honks-tls \
  --cert=tls.crt --key=tls.key \
  -n honks-app

rm tls.key tls.crt
```

---

### 7. Appliquer la configuration

```bash
kubectl apply -f infra/k8s/config/configmap.yaml
```

---

### 8. Déployer la base de données (CNPG)

```bash
kubectl apply -f infra/k8s/db/cluster.yaml
```

Attendre que la base soit prête (peut prendre 1–2 min) :

```bash
kubectl get cluster -n honks-db -w
# STATUS doit passer à "Cluster in healthy state"
```

Vérifier les services créés automatiquement par CNPG :

```bash
kubectl get svc -n honks-db
# honks-db-rw (lecture/écriture) et honks-db-ro (lecture seule)
```

---

### 9. Déployer l'API et le Web

```bash
kubectl apply -f infra/k8s/apps/api/
kubectl apply -f infra/k8s/apps/web/
```

Vérifier que les pods démarrent :

```bash
kubectl get pods -n honks-app -w
# Attendre STATUS Running pour honks-api et honks-web
```

---

### 10. Configurer le réseau (Ingress)

```bash
kubectl apply -f infra/k8s/networking/ingress.yaml
```

Ajouter `honks.local` dans `/etc/hosts` sur la machine cliente (remplacer par l'IP du master ou du load balancer) :

```bash
echo "<MASTER_IP>  honks.local" | sudo tee -a /etc/hosts
```

Tester :

```bash
curl -k https://honks.local/api/health
curl -k https://honks.local
```

---

### 11. Déployer le monitoring

```bash
kubectl apply -f infra/k8s/monitoring/
```

Attendre que Prometheus et Grafana soient Running :

```bash
kubectl get pods -n honks-monitoring -w
```

Accéder à Grafana (port-forward) :

```bash
kubectl port-forward svc/grafana 3001:3000 -n honks-monitoring
# Ouvrir http://localhost:3001
# Login de base : admin / admin
```

---

### 12. Vérification

```bash
# Tous les pods Running ?
kubectl get pods -A | grep -v Running | grep -v Completed

# Services accessibles ?
kubectl get svc -A

# Ingress configuré ?
kubectl get ingress -n honks-app

# DB healthy ?
kubectl get cluster -n honks-db

# Métriques correctement scrapées ?
kubectl get pods -n honks-app -o yaml | grep prometheus
```

---

### Résumé des commandes dans l'ordre

```bash
# 0. Réseau - ouvrir les ports sur le master
sudo ufw allow 6443/tcp && sudo ufw allow 8472/udp && sudo ufw allow 10250/tcp && sudo ufw reload
# Idem sur les workers : ufw allow 8472/udp && ufw allow 10250/tcp
# Vérifier connectivité : ping <IP_MASTER> et nc -zv <IP_MASTER> 6443

# 1. K3s master
curl -sfL https://get.k3s.io | sh -

# 2. Workers
curl -sfL https://get.k3s.io | K3S_URL=https://<IP>:6443 K3S_TOKEN=<TOKEN> sh -

# 3. CNPG operator
kubectl apply --server-side -f https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.23/releases/cnpg-1.23.0.yaml

# 4. Namespaces
kubectl apply -f infra/k8s/namespaces.yaml

# 5. Secrets (manuels - voir section 6 ci-dessus)

# 6. Config
kubectl apply -f infra/k8s/config/configmap.yaml

# 7. DB
kubectl apply -f infra/k8s/db/cluster.yaml

# 8. Apps
kubectl apply -f infra/k8s/apps/api/
kubectl apply -f infra/k8s/apps/web/

# 9. Réseau
kubectl apply -f infra/k8s/networking/ingress.yaml

# 10. Monitoring
kubectl apply -f infra/k8s/monitoring/
```

---

**3 namespaces** : `honks-app` · `honks-db` · `honks-monitoring`