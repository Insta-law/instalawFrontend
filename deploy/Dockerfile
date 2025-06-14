FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM node:20-alpine as production
WORKDIR /app
COPY --from=builder /app/dist/knowlaw-frontend ./dist/knowlaw-frontend
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
RUN addgroup -g 1001 -S nodejs && \
    adduser -S angular -u 1001
RUN chown -R angular:nodejs /app
USER angular
EXPOSE 4000
CMD ["node", "dist/knowlaw-frontend/server/server.mjs"]

