"""
FastAPI router for arbitrage endpoints.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict
import logging

from .engine import ArbitrageEngine, ArbitrageOpportunity

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/arbitrage", tags=["arbitrage"])

# Global engine instance
_engine: ArbitrageEngine = None


def get_engine() -> ArbitrageEngine:
    """Get or create arbitrage engine instance."""
    global _engine
    if _engine is None:
        _engine = ArbitrageEngine(demo_mode=False)
    return _engine


@router.get("/opportunities")
async def get_opportunities(engine: ArbitrageEngine = Depends(get_engine)) -> List[Dict]:
    """Get current arbitrage opportunities.
    
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
                "spread_pct": opp.spread_pct,
                "net_profit_pct": opp.net_profit_pct,
                "estimated_profit_usd": opp.estimated_profit_usd,
                "volume_24h": opp.volume_24h,
                "timestamp": opp.timestamp,
            }
            for opp in opportunities
        ]
    except Exception as e:
        logger.error(f"Error finding opportunities: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/statistics")
async def get_statistics(engine: ArbitrageEngine = Depends(get_engine)) -> Dict:
    """Get arbitrage engine statistics.
    
    Returns:
        Dictionary with engine statistics
    """
    return engine.get_statistics()


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
            "spread_pct": opp.spread_pct,
            "net_profit_pct": opp.net_profit_pct,
            "estimated_profit_usd": opp.estimated_profit_usd,
            "volume_24h": opp.volume_24h,
            "timestamp": opp.timestamp,
        }
        for opp in opportunities
    ]
