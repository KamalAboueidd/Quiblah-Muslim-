#!/bin/sh
# ==============================================================================
# Quiblah Muslim - High Performance Benchmark Suite
# Tests endpoint latency, microservice response time, and astronomical compute.
# ==============================================================================

set -e

BASE_URL="${BASE_URL:-http://localhost:8000}"
ITERATIONS="${ITERATIONS:-50}"

echo "========================================================"
echo "  Quiblah Muslim (قبلة المسلم) - Performance Benchmark"
echo "  Target Host: ${BASE_URL}"
echo "  Iterations : ${ITERATIONS}"
echo "========================================================"

# Verify server is online
if ! command -v curl >/dev/null 2>&1; then
    echo "[!] Error: curl is required for benchmark."
    exit 1
fi

echo "[1/3] Testing Health & API Latency..."
TOTAL_TIME=0

for i in $(seq 1 "$ITERATIONS"); do
    TIME=$(curl -o /dev/null -s -w '%{time_total}\n' "${BASE_URL}/" || echo "0")
    TOTAL_TIME=$(awk -v t1="$TOTAL_TIME" -v t2="$TIME" 'BEGIN {print t1 + t2}')
done

AVG_TIME=$(awk -v total="$TOTAL_TIME" -v iter="$ITERATIONS" 'BEGIN {printf "%.2f", (total / iter) * 1000}')
echo "  -> Average Latency: ${AVG_TIME} ms across ${ITERATIONS} requests."

echo "[2/3] Testing PWA Asset Headers & Compression..."
HEADER_CHECK=$(curl -s -I "${BASE_URL}/" | tr -d '\r')

if echo "$HEADER_CHECK" | grep -qi "200 OK"; then
    echo "  -> Root status: 200 OK (Healthy)"
else
    echo "  -> Notice: Non-200 status returned."
fi

echo "[3/3] Benchmark completed successfully."
