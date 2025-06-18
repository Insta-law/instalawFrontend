FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG API_URL
ARG BASE_URL
ARG APP_NAME
RUN sed -i "s|__API_URL__|${API_URL}|g" src/environments/environment.prod.ts && \
    sed -i "s|__BASE_URL__|${BASE_URL}|g" src/environments/environment.prod.ts && \
    sed -i "s|__APP_NAME__|${APP_NAME}|g" src/environments/environment.prod.ts
RUN echo "env.prod.ts after sed:" && cat src/environments/environment.prod.ts
RUN npx ng build knowlaw-frontend --configuration production && \
    npx ng run knowlaw-frontend:server:production
FROM node:20-alpine as production
WORKDIR /app
COPY --from=builder /app/dist/knowlaw-frontend ./dist/knowlaw-frontend
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
RUN addgroup -g 1001 -S nodejs && \
    adduser -S angular -u 1001
RUN chown -R angular:nodejs /app
USER angular
ENV PORT=4000
EXPOSE 4000
CMD ["node", "dist/knowlaw-frontend/server/main.js"]

