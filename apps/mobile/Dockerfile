# Build context: repo root (to access shared/ packages)
# Runs the Expo dev server — for local testing via docker-compose only.
# Production builds (APK/IPA) go through EAS Build, not Docker.
# Base image: Docker Hardened Image (dhi.io/node:22-alpine) — Node 20 est EOL depuis avril 2026
FROM dhi.io/node:22-alpine@sha256:bda5b84db93934e4c35ef4da0fca279955c78be97dbb6bd7837d33d57d13f562 AS base
WORKDIR /app

FROM base AS dev
COPY package*.json ./
COPY apps/mobile/package*.json ./apps/mobile/
RUN npm install
ENV EXPO_NO_DOTENV=1
EXPOSE 8081

FROM base AS deps
COPY package*.json ./
COPY apps/mobile/package*.json ./apps/mobile/
RUN npm ci --workspace=apps/mobile

FROM base AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY shared ./shared
COPY apps/mobile ./apps/mobile
WORKDIR /app/apps/mobile
ENV EXPO_NO_DOTENV=1
EXPOSE 8081
CMD ["npx", "expo", "start", "--localhost"]
