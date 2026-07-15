# Build context: repo root (to access shared/ packages)
FROM node:20-alpine AS base
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
COPY shared ./shared
COPY apps/api ./apps/api
WORKDIR /app/apps/api
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/apps/api/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main"]
