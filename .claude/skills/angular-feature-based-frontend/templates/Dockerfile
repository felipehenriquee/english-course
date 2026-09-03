# ---- Stage 1: build ----
FROM node:20-alpine AS build
WORKDIR /app

# Instala dependências primeiro (aproveita cache do Docker)
COPY package*.json ./
RUN npm ci

# Copia o restante do código e gera o build de produção
COPY . .
RUN npm run build:prod

# ---- Stage 2: serve com Nginx ----
FROM nginx:1.27-alpine AS production

# Config do Nginx com fallback de SPA (Angular Router em PathLocationStrategy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Artefatos estáticos gerados no stage anterior.
# __PROJECT_NAME__ deve bater com o nome do projeto em angular.json/outputPath.
COPY --from=build /app/dist/__PROJECT_NAME__/browser /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
