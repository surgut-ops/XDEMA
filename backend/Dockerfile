FROM node:18-bullseye AS base
WORKDIR /app

# Устанавливаем build-инструменты и OpenSSL один раз для всех стадий
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    python3 \
    build-essential \
  && rm -rf /var/lib/apt/lists/*

# Зависимости + сборка
FROM base AS builder
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# Продакшен: только собранное приложение и зависимости
FROM base AS runner
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
# Копируем prisma ДО npm install, чтобы postinstall (prisma generate) видел schema
COPY --from=builder /app/prisma ./prisma
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
EXPOSE 3001
CMD ["node", "dist/main.js"]
