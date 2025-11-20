# API Gateway
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir fastapi uvicorn pydantic

# Copy API gateway and arbitrage engine code
COPY api_gateway/ ./api_gateway/
COPY arbitrage_engine/ ./arbitrage_engine/

# Expose port
EXPOSE 8000

# Run the API gateway
CMD ["uvicorn", "api_gateway.main:app", "--host", "0.0.0.0", "--port", "8000"]
