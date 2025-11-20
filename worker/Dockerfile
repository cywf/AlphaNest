# Worker Service
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir schedule

# Copy worker and arbitrage engine code
COPY worker/ ./worker/
COPY arbitrage-engine/ ./arbitrage-engine/

# Run the worker
CMD ["python", "-m", "worker.poller", "--interval", "10"]
