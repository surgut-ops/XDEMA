FROM node:18-bullseye-slim
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate
COPY src ./src
RUN npm run build
RUN test -f dist/main.js && echo "✅ main.js exists" || exit 1
EXPOSE 3001
CMD ["node", "dist/main"]
