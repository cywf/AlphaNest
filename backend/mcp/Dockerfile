# MCP Server
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir fastapi uvicorn pydantic

# Copy source code
COPY backend/mcp/ ./backend/mcp/
COPY arbitrage_engine/ ./arbitrage_engine/

# Expose port
EXPOSE 8002

# Run the MCP server
CMD ["uvicorn", "backend.mcp.server:app", "--host", "0.0.0.0", "--port", "8002"]
