"""
Data ingestion module for market data.
Fetches and processes real-time market data from various sources.
"""

import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)


class DataSource(ABC):
    """Abstract base class for data sources."""

    @abstractmethod
    def fetch_current_price(self, symbol: str) -> Optional[float]:
        """Fetch current price for a symbol."""
        pass

    @abstractmethod
    def fetch_historical_data(
        self, symbol: str, start_date: datetime, end_date: datetime
    ) -> List[Dict[str, Any]]:
        """Fetch historical price data."""
        pass


class MockDataSource(DataSource):
    """Mock data source for testing and development."""

    def __init__(self):
        self.mock_prices = {
            "BTC-USD": 45000.0,
            "ETH-USD": 3000.0,
            "AAPL": 175.0,
            "GOOGL": 140.0,
        }

    def fetch_current_price(self, symbol: str) -> Optional[float]:
        """Return mock price for symbol."""
        price = self.mock_prices.get(symbol)
        if price:
            logger.info(f"Fetched mock price for {symbol}: ${price}")
        return price

    def fetch_historical_data(
        self, symbol: str, start_date: datetime, end_date: datetime
    ) -> List[Dict[str, Any]]:
        """Return mock historical data."""
        logger.info(f"Fetching mock historical data for {symbol}")
        base_price = self.mock_prices.get(symbol, 100.0)

        data = []
        current_date = start_date
        while current_date <= end_date:
            data.append(
                {
                    "date": current_date.isoformat(),
                    "open": base_price * 0.99,
                    "high": base_price * 1.02,
                    "low": base_price * 0.98,
                    "close": base_price,
                    "volume": 1000000,
                }
            )
            current_date += timedelta(days=1)
            base_price *= 1.001  # Slight upward trend

        return data


class DataIngestionService:
    """
    Main service for data ingestion.
    Coordinates fetching data from multiple sources.
    """

    def __init__(self, symbols: List[str], data_sources: Optional[List[str]] = None):
        self.symbols = symbols
        self.data_sources: Dict[str, DataSource] = {}
        self._initialize_sources(data_sources or ["mock"])

    def _initialize_sources(self, source_names: List[str]):
        """Initialize data sources."""
        for source_name in source_names:
            if source_name == "mock":
                self.data_sources["mock"] = MockDataSource()
            # Add other data sources here (Yahoo Finance, Alpha Vantage, etc.)

        logger.info(f"Initialized {len(self.data_sources)} data sources")

    def get_current_prices(self) -> Dict[str, Optional[float]]:
        """Get current prices for all tracked symbols."""
        prices = {}

        for symbol in self.symbols:
            # Try each data source until we get a price
            for source_name, source in self.data_sources.items():
                price = source.fetch_current_price(symbol)
                if price is not None:
                    prices[symbol] = price
                    break

        return prices

    def get_market_snapshot(self) -> Dict[str, Any]:
        """Get a complete market snapshot."""
        prices = self.get_current_prices()

        return {
            "timestamp": datetime.now().isoformat(),
            "prices": prices,
            "symbols_tracked": len(self.symbols),
            "data_sources": list(self.data_sources.keys()),
        }

    def get_historical_data(
        self, symbol: str, days_back: int = 30
    ) -> List[Dict[str, Any]]:
        """Get historical data for a symbol."""
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_back)

        for source in self.data_sources.values():
            data = source.fetch_historical_data(symbol, start_date, end_date)
            if data:
                return data

        return []
