# ---- Stage 1: build ----
FROM node:20-alpine AS build
WORKDIR /app

# Instala dependências primeiro (aproveita cache do Docker)
COPY package*.json ./
RUN npm ci

# Copia o restante do código e gera o build de produção
COPY . .
# Variáveis VITE_* podem ser injetadas no build via --build-arg / --build-context
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

# ---- Stage 2: serve com Nginx ----
FROM nginx:1.27-alpine AS production

# Config do Nginx com fallback de SPA (history mode do vue-router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Artefatos estáticos gerados no stage anterior
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
