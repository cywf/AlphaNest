"""
Arbitrage API routes.
"""

from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict
import logging
import sys
import os

# Add parent directory to path
sys.path.insert(
    0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)

from arbitrage_engine.engine import ArbitrageEngine
from ..auth import MembershipRequired, optional_api_key

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/arbitrage", tags=["arbitrage"])

# Engine instance
_engine: ArbitrageEngine = None


def get_engine() -> ArbitrageEngine:
    """Get or create arbitrage engine instance."""
    global _engine
    if _engine is None:
        demo_mode = os.getenv("DEMO_MODE", "false").lower() == "true"
        _engine = ArbitrageEngine(demo_mode=demo_mode)
    return _engine


@router.get("/demo")
async def get_demo_data() -> List[Dict]:
    """Get demo arbitrage data (no authentication required).

    Returns:
        List of demo arbitrage opportunities
    """
    demo_engine = ArbitrageEngine(demo_mode=True)
    opportunities = demo_engine.get_demo_data()

    return [
        {
            "symbol": opp.symbol,
            "buy_exchange": opp.buy_exchange,
            "sell_exchange": opp.sell_exchange,
            "buy_price": opp.buy_price,
            "sell_price": opp.sell_price,
            "spread_pct": round(opp.spread_pct, 2),
            "net_profit_pct": round(opp.net_profit_pct, 2),
            "estimated_profit_usd": round(opp.estimated_profit_usd, 2),
            "volume_24h": opp.volume_24h,
            "timestamp": opp.timestamp,
        }
        for opp in opportunities
    ]


@router.get("/opportunities")
async def get_opportunities(
    api_key: str = Depends(MembershipRequired()),
    engine: ArbitrageEngine = Depends(get_engine),
) -> List[Dict]:
    """Get real-time arbitrage opportunities (requires membership).

    Args:
        api_key: Verified API key with active membership
        engine: Arbitrage engine instance

    Returns:
        List of arbitrage opportunities
    """
    try:
        opportunities = engine.find_opportunities()
        return [
            {
                "symbol": opp.symbol,
                "buy_exchange": opp.buy_exchange,
                "sell_exchange": opp.sell_exchange,
                "buy_price": opp.buy_price,
                "sell_price": opp.sell_price,
                "spread_pct": round(opp.spread_pct, 2),
                "net_profit_pct": round(opp.net_profit_pct, 2),
                "estimated_profit_usd": round(opp.estimated_profit_usd, 2),
                "volume_24h": opp.volume_24h,
                "timestamp": opp.timestamp,
            }
            for opp in opportunities
        ]
    except Exception as e:
        logger.error(f"Error finding opportunities: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/statistics")
async def get_statistics(
    api_key: str = Depends(optional_api_key),
    engine: ArbitrageEngine = Depends(get_engine),
) -> Dict:
    """Get arbitrage engine statistics (public endpoint).

    Args:
        api_key: Optional API key
        engine: Arbitrage engine instance

    Returns:
        Dictionary with engine statistics
    """
    return engine.get_statistics()
