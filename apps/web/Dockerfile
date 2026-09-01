# Build stages use node:22-alpine (shell required for npm).
# Final runner uses Docker Hardened Image (no shell needed at runtime).
FROM node:22-alpine AS build-base
WORKDIR /app/apps/web
ENV NEXT_TELEMETRY_DISABLED=1

FROM build-base AS dev
COPY apps/web/package*.json ./
RUN npm install
EXPOSE 3001

FROM build-base AS deps
COPY apps/web/package*.json ./
RUN npm install

FROM build-base AS build
COPY --from=deps /app/apps/web/node_modules ./node_modules
COPY apps/web .
RUN npm run build

FROM dhi.io/node:22-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app/apps/web
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./.next/static
COPY --from=build /app/apps/web/public ./public
EXPOSE 3001
ENV PORT=3001
CMD ["node", "server.js"]
