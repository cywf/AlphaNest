# Simple dev-friendly Dockerfile for the Alpha-N3ST dashboard
FROM node:22-bullseye AS base
WORKDIR /app
ENV ROLLUP_SKIP_NODEJS_NATIVE=true

# Install deps separately to leverage docker layer caching
COPY package*.json ./
# Spark template lockfile is out of sync, so we use install for now.
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 5000
CMD ["npm","run","dev","--","--host","0.0.0.0","--port","5000"]
