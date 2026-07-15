# Build context: repo root (to access shared/ packages)
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS dev
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
RUN npm install
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3001

FROM base AS deps
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
RUN npm ci --workspace=apps/web

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY shared ./shared
COPY apps/web ./apps/web
WORKDIR /app/apps/web
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app/apps/web
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./.next/static
COPY --from=build /app/apps/web/public ./public
EXPOSE 3001
ENV PORT=3001
CMD ["node", "server.js"]
