# Build context: repo root (to access shared/ packages)
# Base image: Docker Hardened Image (dhi.io/node:22-alpine) — Node 20 est EOL depuis avril 2026
FROM dhi.io/node:22-alpine@sha256:bda5b84db93934e4c35ef4da0fca279955c78be97dbb6bd7837d33d57d13f562 AS base
WORKDIR /app

FROM base AS dev
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm install
EXPOSE 3000

FROM base AS deps
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm ci --workspace=apps/api

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY shared ./shared
COPY apps/api ./apps/api
WORKDIR /app/apps/api
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app/apps/api
COPY --from=build /app/apps/api/dist ./dist
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/apps/api/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main"]
