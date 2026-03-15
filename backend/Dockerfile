# XDEMA Backend — NestJS (для Railway)
FROM node:18-alpine AS base
WORKDIR /app

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
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma
EXPOSE 3001
CMD ["node", "dist/main.js"]
