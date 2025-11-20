"""Tests for arbitrage engine module."""

import pytest
import sys
import os

# Add arbitrage_engine to Python path
sys.path.insert(
    0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
)

from arbitrage_engine.engine import ArbitrageEngine, ArbitrageOpportunity
from arbitrage_engine.exchanges.binance import BinanceConnector
from arbitrage_engine.exchanges.coinbase import CoinbaseConnector


def test_arbitrage_engine_initialization():
    """Test ArbitrageEngine initialization."""
    engine = ArbitrageEngine(demo_mode=True)

    assert engine.demo_mode is True
    assert len(engine.exchanges) == 5
    assert "Binance" in engine.exchanges
    assert "Coinbase" in engine.exchanges
    assert len(engine.watched_symbols) > 0


def test_arbitrage_engine_demo_data():
    """Test demo data generation."""
    engine = ArbitrageEngine(demo_mode=True)
    opportunities = engine.get_demo_data()

    assert len(opportunities) == 5
    assert all(isinstance(opp, ArbitrageOpportunity) for opp in opportunities)
    assert all(opp.net_profit_pct > 0 for opp in opportunities)


def test_arbitrage_engine_find_opportunities_demo():
    """Test finding opportunities in demo mode."""
    engine = ArbitrageEngine(demo_mode=True)
    opportunities = engine.find_opportunities()

    assert len(opportunities) > 0
    assert all(isinstance(opp, ArbitrageOpportunity) for opp in opportunities)


def test_arbitrage_engine_statistics():
    """Test getting engine statistics."""
    engine = ArbitrageEngine(demo_mode=True)
    stats = engine.get_statistics()

    assert "exchanges_monitored" in stats
    assert "symbols_watched" in stats
    assert "demo_mode" in stats
    assert stats["demo_mode"] is True
    assert stats["exchanges_monitored"] == 5


def test_arbitrage_spread_calculation():
    """Test spread and profit calculation."""
    engine = ArbitrageEngine(demo_mode=True)

    buy_price = 100.0
    sell_price = 101.0
    spread_pct, net_profit_pct = engine.calculate_spread(
        buy_price, sell_price, "Binance", "Coinbase"
    )

    assert spread_pct > 0
    assert net_profit_pct < spread_pct  # Net should be less due to fees


def test_binance_connector():
    """Test Binance connector."""
    connector = BinanceConnector()

    assert connector.name == "Binance"

    # Test symbol normalization
    normalized = connector.normalize_symbol("BTCUSDT")
    assert "/" in normalized

    # Test fee structure
    fees = connector.get_trading_fees()
    assert "maker" in fees
    assert "taker" in fees
    assert fees["maker"] >= 0
    assert fees["taker"] >= 0


def test_coinbase_connector():
    """Test Coinbase connector."""
    connector = CoinbaseConnector()

    assert connector.name == "Coinbase"

    # Test symbol normalization
    normalized = connector.normalize_symbol("BTC-USD")
    assert normalized == "BTC/USD"

    # Test fee structure
    fees = connector.get_trading_fees()
    assert "maker" in fees
    assert "taker" in fees


def test_arbitrage_opportunity_data_structure():
    """Test ArbitrageOpportunity data structure."""
    engine = ArbitrageEngine(demo_mode=True)
    opportunities = engine.get_demo_data()

    opp = opportunities[0]
    assert hasattr(opp, "symbol")
    assert hasattr(opp, "buy_exchange")
    assert hasattr(opp, "sell_exchange")
    assert hasattr(opp, "buy_price")
    assert hasattr(opp, "sell_price")
    assert hasattr(opp, "spread_pct")
    assert hasattr(opp, "net_profit_pct")
    assert hasattr(opp, "estimated_profit_usd")
    assert hasattr(opp, "timestamp")

    # Verify data types
    assert isinstance(opp.symbol, str)
    assert isinstance(opp.buy_price, float)
    assert isinstance(opp.sell_price, float)
    assert isinstance(opp.spread_pct, float)
    assert isinstance(opp.net_profit_pct, float)
