"""
Arbitrage tools for MCP server.
"""

from typing import Dict, Any, List
import sys
import os

# Add arbitrage_engine to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))))

from arbitrage_engine.engine import ArbitrageEngine


class ArbitrageTools:
    """Tools for arbitrage analysis."""
    
    def __init__(self):
        """Initialize arbitrage tools."""
        self.engine = ArbitrageEngine(demo_mode=False)
    
    def get_schemas(self) -> List[Dict[str, Any]]:
        """Get tool schemas."""
        return [
            {
                "name": "arbitrage.find_opportunities",
                "description": "Find arbitrage opportunities across exchanges",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "symbol": {
                            "type": "string",
                            "description": "Trading pair symbol (optional, finds all if not specified)"
                        },
                        "min_profit_pct": {
                            "type": "number",
                            "description": "Minimum profit percentage threshold",
                            "default": 0.5
                        }
                    }
                }
            },
            {
                "name": "arbitrage.get_statistics",
                "description": "Get arbitrage engine statistics",
                "parameters": {
                    "type": "object",
                    "properties": {}
                }
            }
        ]
    
    async def execute(
        self,
        method: str,
        parameters: Dict[str, Any],
        context: Dict[str, Any] = None
    ) -> Any:
        """Execute a tool method."""
        if method == "find_opportunities":
            return await self._find_opportunities(parameters)
        elif method == "get_statistics":
            return await self._get_statistics(parameters)
        else:
            raise ValueError(f"Unknown method: {method}")
    
    async def _find_opportunities(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Find arbitrage opportunities."""
        opportunities = self.engine.find_opportunities()
        
        # Filter by symbol if provided
        symbol = params.get("symbol")
        if symbol:
            opportunities = [opp for opp in opportunities if opp.symbol == symbol]
        
        # Filter by minimum profit
        min_profit = params.get("min_profit_pct", 0.5)
        opportunities = [opp for opp in opportunities if opp.net_profit_pct >= min_profit]
        
        return {
            "opportunities": [
                {
                    "symbol": opp.symbol,
                    "buy_exchange": opp.buy_exchange,
                    "sell_exchange": opp.sell_exchange,
                    "buy_price": opp.buy_price,
                    "sell_price": opp.sell_price,
                    "spread_pct": opp.spread_pct,
                    "net_profit_pct": opp.net_profit_pct,
                    "estimated_profit_usd": opp.estimated_profit_usd
                }
                for opp in opportunities
            ],
            "count": len(opportunities)
        }
    
    async def _get_statistics(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Get engine statistics."""
        return self.engine.get_statistics()
