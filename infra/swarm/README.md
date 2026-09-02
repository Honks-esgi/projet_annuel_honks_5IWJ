# Honks — Docker Swarm

Déploiement clusterisé de Honks : haute disponibilité (api ×2, web ×3),
secrets Docker, HTTPS automatique, un seul point d'entrée exposé (Traefik).

## Architecture

```
                        Internet (80/443)
                              │
                    ┌─────────▼─────────┐
                    │   Traefik v3      │  stack "proxy" (manager)
                    │   TLS Let's Encrypt│  socket Docker via proxy filtré
                    └─────┬───────┬─────┘
              proxy_public│(overlay)
              ┌───────────▼──┐ ┌──▼───────────┐
              │  api ×2      │ │  web ×3      │   stack "honks"
              │  (NestJS)    │ │  (Next.js)   │
              └──────┬───────┘ └──────────────┘
             backend │ (overlay interne, chiffré)
              ┌──────▼──────┐ ┌──────────────┐
              │ postgres ×1 │ │  redis ×1    │   pinnés: node.labels.db == true
              │ (volume)    │ │  (volume)    │
              └─────────────┘ └──────────────┘
```

Décisions de sécurité :

- **Un seul point d'entrée** : seul Traefik publie des ports (80 → redirection
  443, 443 TLS). Aucun autre service n'est joignable de l'extérieur.
- **Socket Docker jamais exposé à Traefik** : un socket-proxy filtré
  (lecture seule, endpoints Swarm uniquement) s'intercale.
- **Réseau `backend` interne et chiffré** : Postgres/Redis sont invisibles
  depuis l'extérieur ET depuis le réseau edge.
- **Docker Secrets pour les datastores** : postgres (`POSTGRES_PASSWORD_FILE`,
  support natif de l'image) et redis (`requirepass` lu depuis le secret).
  L'API reçoit ses URLs de connexion en variables d'environnement,
  interpolées au déploiement depuis `swarm.env` (présent uniquement sur le
  manager, jamais commité) — choix d'équipe assumé : plus simple, mais
  visible via `docker inspect` sur le cluster.
- **Conteneurs non-root** + resource limits sur chaque service.
- **Rolling updates `start-first`** avec rollback automatique sur échec
  (basé sur les HEALTHCHECK des images).

## Prérequis

- 2 machines minimum (1 manager + 1 worker) — VPS ou VMs, Docker ≥ 24.
- Un nom de domaine pointant vers l'IP du manager (A `honks.fr`,
  A/CNAME `www`, `api`).
- Pare-feu : seuls 22, 80, 443 ouverts au public. Les ports Swarm
  (2377/tcp, 7946/tcp+udp, 4789/udp) uniquement entre les nœuds du cluster.

## Installation

```bash
# 1. Sur le manager
docker swarm init --advertise-addr <IP_PRIVEE_MANAGER>

# 2. Sur chaque worker (token affiché par la commande précédente)
docker swarm join --token <TOKEN> <IP_MANAGER>:2377

# 3. Étiqueter le nœud qui hébergera les données
docker node update --label-add db=true <NODE_ID>

# Vérifier
docker node ls
```

## Déploiement

```bash
cd infra/swarm

# 1. Secrets (une seule fois, sur le manager)
printf 'MotDePassePostgresFort' | docker secret create postgres_password -
printf 'MotDePasseRedisFort'    | docker secret create redis_password -

# 2. Variables de déploiement (docker stack deploy ne lit PAS les .env)
export DOMAIN=honks.fr
export ACME_EMAIL=admin@honks.fr
export REGISTRY=docker.io/jsankare
export TAG=latest
export POSTGRES_PASSWORD='MotDePassePostgresFort'   # le même qu'à l'étape 1
export REDIS_PASSWORD='MotDePasseRedisFort'

# 3. Déployer proxy puis application
docker stack deploy -c stack-proxy.yml proxy
docker stack deploy --with-registry-auth -c stack-app.yml honks
```

Toutes les commandes (dev, preprod, prod, mises à jour) sont dans
[docs/MEMO-DOCKER.md](../../docs/MEMO-DOCKER.md).

## Vérifications (haute dispo)

```bash
docker service ls                          # replicas 2/2 et 3/3
docker service ps honks_api                # répartition sur les nœuds

# Scale up/down
docker service scale honks_web=5

# Tolérance aux pannes : tuer un conteneur, Swarm le replanifie
docker ps --filter name=honks_api -q | head -1 | xargs docker rm -f
docker service ps honks_api                # une nouvelle task démarre

# Persistance : supprimer le conteneur postgres, les données survivent
docker ps --filter name=honks_postgres -q | xargs docker rm -f
```

## Mise à jour (rolling, zéro downtime)

```bash
# Nouvelle image poussée sur le registry, puis (variables déjà exportées) :
export TAG=<nouveau-sha>
docker stack deploy --with-registry-auth -c stack-app.yml honks
# En cas d'échec du healthcheck, Swarm rollback automatiquement.
```

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `stack-proxy.yml` | Traefik + socket-proxy, réseau edge `proxy_public` |
| `stack-app.yml` | api ×2, web ×3, postgres, redis, secrets, réseaux |
| `swarm.env.example` | Référence des variables à exporter avant `docker stack deploy` |
