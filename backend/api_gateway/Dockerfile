# API Gateway
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir fastapi uvicorn pydantic

# Copy API gateway, arbitrage engine, database and backend code
COPY api_gateway/ ./api_gateway/
COPY arbitrage_engine/ ./arbitrage_engine/
COPY database/ ./database/
COPY backend/ ./backend/
COPY alembic/ ./alembic/
COPY alembic.ini .
COPY scripts/ ./scripts/

# Expose port
EXPOSE 8000

# Run initialization script and then start the API gateway
CMD ["/bin/bash", "-c", "./scripts/init_db.sh && uvicorn api_gateway.main:app --host 0.0.0.0 --port 8000"]
