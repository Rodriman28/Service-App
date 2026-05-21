# ── Backend: API Services ──
FROM node:18-alpine AS backend

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY . .

# Crear directorio para la DB si no existe el archivo
RUN mkdir -p /data

EXPOSE 4040

CMD ["node", "index.js"]
