# Honks API

API backend du projet Honks, basée sur NestJS.

## Démarrage

```bash
# depuis la racine du monorepo
npm install
npm run -w apps/api start:dev   # http://localhost:3000
```

- Health check : `GET /health` (utilisé par Docker/Swarm)
- Routes métier : préfixe `/api/v1/...`
- Configuration : `ConfigModule` NestJS global (`.env` en dev, variables
  d'environnement en conteneur).

## Tests

```bash
npm run -w apps/api test        # unitaires
npm run -w apps/api test:e2e    # end-to-end
npm run -w apps/api lint
```

## Docker

```bash
# contexte = racine du repo
docker build -f apps/api/Dockerfile -t honks-api .
```
