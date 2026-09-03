# ---- Stage 1: dependencies + build ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Remove devDependencies para copiar só o necessário no stage final
RUN npm prune --omit=dev

# ---- Stage 2: runtime ----
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

USER app

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:${PORT:-3000}/${API_PREFIX:-api}/health || exit 1

CMD ["node", "dist/main"]
