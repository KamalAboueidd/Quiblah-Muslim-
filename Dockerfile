# Multi-Stage Production Dockerfile for Quiblah Muslim (قبلة المسلم)
# High-performance lightweight container running Node.js Alpine runtime

FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies in a separate layer for maximum caching
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy application assets and source files
COPY . .

# Set container metadata
LABEL maintainer="Kamal Abou Eid <kamal@example.com>" \
      description="Quiblah Muslim - Modern Islamic Progressive Web Application" \
      version="1.0.0"

# Default environment variables
ENV NODE_ENV=production \
    PORT=8000

# Expose HTTP port
EXPOSE 8000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8000/ || exit 1

# Run as non-root node user for enhanced security
USER node

# Start the application server
CMD ["node", "server.js"]
