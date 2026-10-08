FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json
COPY shared/package.json shared/package.json
RUN npm ci --workspace=@vayurakshak/backend --workspace=@vayurakshak/shared
COPY shared/ shared/
COPY backend/ backend/
RUN npm run build:backend

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=4000 HOST=0.0.0.0 DATA_MODE=demo
COPY --from=build --chown=node:node /app/backend/dist ./dist
COPY --from=build --chown=node:node /app/backend/package.json ./package.json
USER node
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||4000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node","dist/server.js"]
