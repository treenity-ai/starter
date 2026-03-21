# Treenity Starter — production image
FROM node:25-slim

WORKDIR /app
RUN npm i -g tsx

# Cache npm install
COPY package.json package-lock.json ./
RUN npm install

# Copy source
COPY . .

# Build frontend
RUN npx vite build --outDir dist-front

# Server entry
ENV PORT=3211
ENV STATIC_DIR=/app/dist-front
EXPOSE 3211
VOLUME /app/data

CMD ["tsx", "node_modules/@treenity/core/src/server/main.ts", "root.json"]
