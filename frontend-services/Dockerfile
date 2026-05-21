# ── Frontend: Build con Vite + Servir con Nginx ──

# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Servir con Nginx
FROM nginx:alpine

# Copiar los archivos estáticos del build
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
