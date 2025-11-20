"""
Core arbitrage engine for detecting cross-exchange opportunities.
"""

import time
import logging
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from .exchanges import (
    BinanceConnector,
    CoinbaseConnector,
    KucoinConnector,
    KrakenConnector,
    BybitConnector,
)

logger = logging.getLogger(__name__)


@dataclass
class ArbitrageOpportunity:
    """Represents an arbitrage opportunity between exchanges."""
    
    symbol: str
    buy_exchange: str
    sell_exchange: str
    buy_price: float
    sell_price: float
    spread_pct: float
    net_profit_pct: float
    estimated_profit_usd: float
    volume_24h: float
    timestamp: int


class ArbitrageEngine:
    """Main arbitrage detection engine."""
    
    def __init__(self, demo_mode: bool = False):
        """Initialize arbitrage engine.
        
        Args:
            demo_mode: If True, use mocked data for demonstration
        """
        self.demo_mode = demo_mode
        self.exchanges = {
            "Binance": BinanceConnector(),
            "Coinbase": CoinbaseConnector(),
            "KuCoin": KucoinConnector(),
            "Kraken": KrakenConnector(),
            "Bybit": BybitConnector(),
        }
        
        # Common trading pairs to monitor
        self.watched_symbols = [
            "BTC/USDT",
            "ETH/USDT",
            "BNB/USDT",
            "SOL/USDT",
            "XRP/USDT",
        ]
        
        # Minimum spread threshold to consider (in percentage)
        self.min_spread_threshold = 0.5
        
        # Cache for price data
        self.price_cache: Dict[str, Dict[str, Dict]] = {}
        self.cache_ttl = 10  # seconds
        
    def get_demo_data(self) -> List[ArbitrageOpportunity]:
        """Generate mock arbitrage data for demo mode.
        
        Returns:
            List of mock arbitrage opportunities
        """
        timestamp = int(time.time() * 1000)
        
        # Generate realistic-looking demo opportunities
        demo_opportunities = [
            ArbitrageOpportunity(
                symbol="BTC/USDT",
                buy_exchange="Binance",
                sell_exchange="Coinbase",
                buy_price=43250.00,
                sell_price=43450.00,
                spread_pct=0.46,
                net_profit_pct=0.25,
                estimated_profit_usd=108.12,
                volume_24h=125000000.0,
                timestamp=timestamp,
            ),
            ArbitrageOpportunity(
                symbol="ETH/USDT",
                buy_exchange="KuCoin",
                sell_exchange="Kraken",
                buy_price=2280.50,
                sell_price=2295.75,
                spread_pct=0.67,
                net_profit_pct=0.42,
                estimated_profit_usd=95.85,
                volume_24h=85000000.0,
                timestamp=timestamp,
            ),
            ArbitrageOpportunity(
                symbol="SOL/USDT",
                buy_exchange="Bybit",
                sell_exchange="Binance",
                buy_price=98.45,
                sell_price=98.95,
                spread_pct=0.51,
                net_profit_pct=0.30,
                estimated_profit_usd=29.40,
                volume_24h=42000000.0,
                timestamp=timestamp,
            ),
            ArbitrageOpportunity(
                symbol="BNB/USDT",
                buy_exchange="Binance",
                sell_exchange="KuCoin",
                buy_price=315.20,
                sell_price=316.85,
                spread_pct=0.52,
                net_profit_pct=0.31,
                estimated_profit_usd=48.75,
                volume_24h=28000000.0,
                timestamp=timestamp,
            ),
            ArbitrageOpportunity(
                symbol="XRP/USDT",
                buy_exchange="Coinbase",
                sell_exchange="Bybit",
                buy_price=0.6125,
                sell_price=0.6155,
                spread_pct=0.49,
                net_profit_pct=0.20,
                estimated_profit_usd=12.25,
                volume_24h=65000000.0,
                timestamp=timestamp,
            ),
        ]
        
        return demo_opportunities
    
    def fetch_prices(self, symbol: str) -> Dict[str, Dict]:
        """Fetch current prices from all exchanges for a symbol.
        
        Args:
            symbol: Trading pair symbol (e.g., BTC/USDT)
            
        Returns:
            Dictionary mapping exchange names to price data
        """
        prices = {}
        
        for exchange_name, connector in self.exchanges.items():
            try:
                ticker = connector.get_ticker(symbol)
                prices[exchange_name] = ticker
            except Exception as e:
                logger.error(f"Error fetching price from {exchange_name}: {e}")
                
        return prices
    
    def calculate_spread(
        self,
        buy_price: float,
        sell_price: float,
        buy_exchange: str,
        sell_exchange: str,
    ) -> Tuple[float, float]:
        """Calculate spread percentage and net profit after fees.
        
        Args:
            buy_price: Price to buy at
            sell_price: Price to sell at
            buy_exchange: Exchange to buy from
            sell_exchange: Exchange to sell to
            
        Returns:
            Tuple of (spread_pct, net_profit_pct)
        """
        # Calculate raw spread
        spread = sell_price - buy_price
        spread_pct = (spread / buy_price) * 100
        
        # Get trading fees
        buy_fees = self.exchanges[buy_exchange].get_trading_fees()
        sell_fees = self.exchanges[sell_exchange].get_trading_fees()
        
        # Calculate total fees (using taker fees as worst case)
        total_fee_pct = (buy_fees["taker"] + sell_fees["taker"]) * 100
        
        # Net profit after fees
        net_profit_pct = spread_pct - total_fee_pct
        
        return spread_pct, net_profit_pct
    
    def find_opportunities(self) -> List[ArbitrageOpportunity]:
        """Find arbitrage opportunities across all exchanges.
        
        Returns:
            List of arbitrage opportunities
        """
        if self.demo_mode:
            return self.get_demo_data()
        
        opportunities = []
        timestamp = int(time.time() * 1000)
        
        for symbol in self.watched_symbols:
            prices = self.fetch_prices(symbol)
            
            if len(prices) < 2:
                continue
            
            # Find best buy and sell prices
            exchange_names = list(prices.keys())
            
            for i, buy_exchange in enumerate(exchange_names):
                for sell_exchange in exchange_names[i + 1:]:
                    buy_price = prices[buy_exchange].get("ask", 0)
                    sell_price = prices[sell_exchange].get("bid", 0)
                    
                    if buy_price == 0 or sell_price == 0:
                        continue
                    
                    spread_pct, net_profit_pct = self.calculate_spread(
                        buy_price, sell_price, buy_exchange, sell_exchange
                    )
                    
                    # Check if spread meets threshold
                    if net_profit_pct >= self.min_spread_threshold:
                        opportunity = ArbitrageOpportunity(
                            symbol=symbol,
                            buy_exchange=buy_exchange,
                            sell_exchange=sell_exchange,
                            buy_price=buy_price,
                            sell_price=sell_price,
                            spread_pct=spread_pct,
                            net_profit_pct=net_profit_pct,
                            estimated_profit_usd=net_profit_pct * 100,  # Assuming $10k position
                            volume_24h=0.0,  # Would need to fetch from exchange
                            timestamp=timestamp,
                        )
                        opportunities.append(opportunity)
        
        # Sort by net profit percentage
        opportunities.sort(key=lambda x: x.net_profit_pct, reverse=True)
        
        return opportunities
    
    def get_statistics(self) -> Dict:
        """Get engine statistics.
        
        Returns:
            Dictionary with statistics
        """
        return {
            "exchanges_monitored": len(self.exchanges),
            "symbols_watched": len(self.watched_symbols),
            "min_spread_threshold": self.min_spread_threshold,
            "demo_mode": self.demo_mode,
        }
