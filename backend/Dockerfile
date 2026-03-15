# XDEMA Backend — одноэтапная сборка (NestJS + Prisma)
FROM node:18-bullseye-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates python3 build-essential \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npx prisma generate && npm run build
RUN npm prune --production

EXPOSE 3001
CMD ["node", "dist/main.js"]
