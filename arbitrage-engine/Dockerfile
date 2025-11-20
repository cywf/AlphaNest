# Arbitrage Engine
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir fastapi uvicorn websockets

# Copy arbitrage engine code
COPY arbitrage-engine/ ./arbitrage-engine/

# Expose port
EXPOSE 8001

# Run the engine
CMD ["uvicorn", "arbitrage-engine.router:router", "--host", "0.0.0.0", "--port", "8001"]
