#!/bin/sh
# ==============================================================================
# Quiblah Muslim - Automated Production Deployment & Container Orchestration
# ==============================================================================

set -e

APP_NAME="quiblah-muslim"
CONTAINER_PORT="8000"
HOST_PORT="${PORT:-8000}"

echo "========================================================"
echo "  Deploying ${APP_NAME} Production Environment"
echo "========================================================"

# Check Docker availability
if command -v docker >/dev/null 2>&1; then
    echo "[*] Docker detected. Building optimized container image..."
    docker build -t "${APP_NAME}:latest" .
    
    echo "[*] Stopping existing containers if running..."
    docker stop "${APP_NAME}" 2>/dev/null || true
    docker rm "${APP_NAME}" 2>/dev/null || true
    
    echo "[*] Starting production container on port ${HOST_PORT}..."
    docker run -d \
        --name "${APP_NAME}" \
        --restart unless-stopped \
        -p "${HOST_PORT}:${CONTAINER_PORT}" \
        "${APP_NAME}:latest"
        
    echo "[✓] Container successfully launched at http://localhost:${HOST_PORT}"
else
    echo "[*] Docker not found. Starting native Node.js runtime..."
    npm ci --only=production
    npm start
fi
