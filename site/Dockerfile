# Dashboard Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Install git (required for some npm dependencies that use git URLs)
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the site
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built files and dependencies from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 3000

# Use Astro preview mode (or a simple HTTP server for static files)
CMD ["node", "./dist/server/entry.mjs"]
