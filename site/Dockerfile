# Dashboard Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

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

# Copy built files and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Install production dependencies only
RUN npm install --production

# Expose port
EXPOSE 3000

# Use Astro preview mode (or a simple HTTP server for static files)
CMD ["node", "./dist/server/entry.mjs"]
