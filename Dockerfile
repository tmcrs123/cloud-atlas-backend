# Step 1: Build the nested app
FROM node:22.12.0-bookworm-slim AS nested-app-build
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY src ./src
RUN npm run build
# CMD ["sh", "-c", "while true; do sleep 30; done"]

# Step 2: Final stage for production
FROM node:22.12.0-bookworm-slim
WORKDIR /app
COPY --from=nested-app-build app/dist ./dist
#dont need app/ here as the package file is at workdir level
COPY package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["node", "dist/server.js"]
# CMD ["sh", "-c", "while true; do sleep 30; done"]
