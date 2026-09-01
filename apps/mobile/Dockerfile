# Build context: repo root (to access shared/ packages)
# Runs the Expo dev server — for local testing via docker-compose only.
# Production builds (APK/IPA) go through EAS Build, not Docker.
# Build stages use node:22-alpine (shell required for npm).
# Final runner uses Docker Hardened Image (no shell needed at runtime).
FROM node:22-alpine AS build-base
WORKDIR /app

FROM build-base AS dev
COPY package*.json ./
COPY apps/mobile/package*.json ./apps/mobile/
RUN npm install
ENV EXPO_NO_DOTENV=1
EXPOSE 8081

FROM build-base AS deps
COPY package*.json ./
COPY apps/mobile/package*.json ./apps/mobile/
RUN npm ci --workspace=apps/mobile

FROM dhi.io/node:22-alpine AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY shared ./shared
COPY apps/mobile ./apps/mobile
WORKDIR /app/apps/mobile
ENV EXPO_NO_DOTENV=1
EXPOSE 8081
CMD ["npx", "expo", "start", "--localhost"]
