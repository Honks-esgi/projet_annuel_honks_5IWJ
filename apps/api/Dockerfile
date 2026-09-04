# Build context: repo root (to access shared/ packages)
# Build stages use node:22-alpine (shell required for npm).
# Final runner uses Docker Hardened Image (no shell needed at runtime).
FROM node:22-alpine AS build-base
WORKDIR /app

FROM build-base AS dev
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm install
COPY shared ./shared
COPY apps/api ./apps/api
EXPOSE 3000

FROM build-base AS deps
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm ci --workspace=apps/api

FROM build-base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY shared ./shared
COPY apps/api ./apps/api
WORKDIR /app/apps/api
RUN npm run build

FROM dhi.io/node:22-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app/apps/api
COPY --from=build /app/apps/api/dist ./dist
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/apps/api/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main"]
