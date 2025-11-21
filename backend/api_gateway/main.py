"""
Main API Gateway for AlphaNest Arbitrage Platform.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import os
import sys

from .routes import arbitrage, membership, auth, market

# Add backend to path for chat module
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

try:
    from backend.chat import router as chat_router

    CHAT_ENABLED = True
except ImportError:
    CHAT_ENABLED = False
    logging.warning("Chat module not available")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="AlphaNest Arbitrage API",
    description="Cryptocurrency arbitrage analysis platform",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(market.router)
app.include_router(arbitrage.router)
app.include_router(membership.router)
app.include_router(wallet.router)
app.include_router(analysis.router)

# Include chat router if available
if CHAT_ENABLED:
    app.include_router(chat_router)
    logger.info("Chat endpoints enabled")


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "AlphaNest Arbitrage API",
        "version": "0.1.0",
        "status": "running",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "api-gateway",
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler."""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc) if os.getenv("DEBUG") else "An error occurred",
        },
    )


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
