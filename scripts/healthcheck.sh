#!/bin/sh
# ==============================================================================
# Quiblah Muslim - Container & System Health Monitor
# ==============================================================================

TARGET_URL="${1:-http://localhost:8000}"
TIMEOUT_SEC="${2:-5}"

echo "[*] Checking service health at ${TARGET_URL} (timeout: ${TIMEOUT_SEC}s)..."

if command -v curl >/dev/null 2>&1; then
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout "${TIMEOUT_SEC}" "${TARGET_URL}/")
elif command -v wget >/dev/null 2>&1; then
    if wget --spider --timeout="${TIMEOUT_SEC}" -q "${TARGET_URL}/"; then
        STATUS="200"
    else
        STATUS="500"
    fi
else
    echo "[!] Error: Neither curl nor wget found."
    exit 1
fi

if [ "$STATUS" = "200" ]; then
    echo "[✓] Health Check PASSED: HTTP ${STATUS} OK"
    exit 0
else
    echo "[✕] Health Check FAILED: HTTP ${STATUS}"
    exit 1
fi
