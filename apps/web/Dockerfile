FROM node:20-alpine AS base
WORKDIR /app/apps/web
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS dev
COPY apps/web/package*.json ./
RUN npm install
EXPOSE 3001

FROM base AS deps
COPY apps/web/package*.json ./
RUN npm install

FROM base AS build
COPY --from=deps /app/apps/web/node_modules ./node_modules
COPY apps/web .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./.next/static
COPY --from=build /app/apps/web/public ./public
EXPOSE 3001
ENV PORT=3001
CMD ["npm", "run", "dev"]
