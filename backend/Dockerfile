FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate
COPY src ./src
RUN npm run build
RUN ls -la dist/
EXPOSE 3001
CMD ["node", "dist/main"]
