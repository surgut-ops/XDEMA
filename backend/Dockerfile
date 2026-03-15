FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate
COPY src ./src
RUN npm run build 2>&1 | tail -20
RUN ls -la dist/ && echo "✅ dist contents above"
RUN test -f dist/main.js && echo "✅ main.js exists" || (echo "❌ main.js missing, listing dist:" && find dist/ -name "*.js" | head -20 && exit 1)
EXPOSE 3001
CMD ["node", "dist/main"]
