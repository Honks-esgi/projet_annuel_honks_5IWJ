# Honks

[![Lint](https://github.com/Honks-esgi/projet_annuel_honks_5IWJ/actions/workflows/lint.yml/badge.svg)](https://github.com/Honks-esgi/projet_annuel_honks_5IWJ/actions/workflows/lint.yml)
[![Tests](https://github.com/Honks-esgi/projet_annuel_honks_5IWJ/actions/workflows/tests.yml/badge.svg)](https://github.com/Honks-esgi/projet_annuel_honks_5IWJ/actions/workflows/tests.yml)
[![Docker Build & Push](https://github.com/Honks-esgi/projet_annuel_honks_5IWJ/actions/workflows/docker.yml/badge.svg)](https://github.com/Honks-esgi/projet_annuel_honks_5IWJ/actions/workflows/docker.yml)

Honks est un projet composé de trois produits principaux:
- une API backend
- une application web (site vitrine + administration)
- une application mobile

Objectif: permettre a des joueurs d'un meme groupe de se coordonner rapidement autour d'une session de jeu via des notifications et des reponses rapides (Honk back / No Honk), puis d'etendre le modele a une communaute plus large.

## MVP

Le MVP couvre:
- API backend
- Application mobile
- Application web minimale (vitrine et interfaces utiles au pilotage)

Le domaine honks.fr est deja reserve.

## Stack technique

| Domaine | Technologie | Role |
| --- | --- | --- |
| Backend (API) | NestJS | API REST, WebSockets, logique metier, signaling WebRTC |
| Frontend (Web) | Next.js | Interface web React performante, SEO |
| Mobile | React Native | Application Android/iOS, support react-native-webrtc |
| Base de donnees | PostgreSQL | Stockage persistant des donnees metier |
| Authentification | Autentik | Inscription, 2FA, reset MDP, conformite securite |
| Temps reel | Socket.io | Chat et notifications in-app |
| Vocal / WebRTC | Coturn | STUN/TURN pour NAT et pare-feu |
| Infra & Proxy | Docker + Caddy | Conteneurisation et reverse proxy SSL auto |
| Deploiement (IaC) | Ansible | Provisionnement et deploiement reproductibles |
| Registry | Docker Registry | Hebergement interne des images |
| Observabilite | Uptime-Kuma | Supervision uptime des services |
| Analytics | Umami | Mesure d'usage respectueuse RGPD |
| Logs & erreurs | GlitchTip | Tracking des erreurs applicatives |
| Tests | Jest + Playwright | Unitaires, integration, E2E |
| Sauvegarde | Restic | Strategie 3-2-1 chiffree |
| Documentation | Docusaurus | Documentation technique et d'exploitation |
| Gestion projet | GitHub Projects | Organisation agile (kanban, sprints, tickets) |

## Arborescence

```text
honks/
├── apps/
│   ├── api/
│   ├── web/
│   └── mobile/
├── shared/
│   └── types/
├── infra/
│   ├── docker/
│   ├── ansible/
│   ├── monitoring/
│   └── backup/
├── docs/
├── docker-compose.yml
├── package.json
├── README.md
└── .env.example
```

## Organisation du repo

- `apps/api`: service backend NestJS
- `apps/web`: frontend Next.js (vitrine + outils admin)
- `apps/mobile`: application React Native
- `shared/types`: types partages entre applications
- `infra`: docker, iac, monitoring et backup
- `docs`: documentation produit, architecture, runbooks

## Conventions initiales

- Monorepo NPM workspaces
- Un README par composant principal
- Un .gitignore global + un .gitignore local par application
- Fichiers .gitkeep pour versionner les dossiers vides

## Prochaines etapes suggerees

1. Initialiser les workspaces pour API, web et mobile.
2. Ajouter un premier docker-compose de dev.
3. Definir le schema de donnees initial (users, groups, sessions, invites).
4. Ecrire les premiers contrats d'API et evenements temps reel.

