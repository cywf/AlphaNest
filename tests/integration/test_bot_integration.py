"""Integration tests for the full trading bot."""

import pytest
from alphanest.core.config import Config
from alphanest.core.bot import TradingBot


def test_trading_bot_initialization():
    """Test that the trading bot initializes correctly."""
    config = Config()
    config.ai.openai_api_key = "test_key"

    bot = TradingBot(config)

    assert bot.config is not None
    assert bot.data_service is not None
    assert bot.ai_manager is not None
    assert bot.strategy_manager is not None
    assert bot.running is False


def test_trading_bot_single_analysis_cycle():
    """Test running a single analysis cycle."""
    config = Config()
    config.ai.openai_api_key = "test_key"
    config.data.symbols = ["BTC-USD", "AAPL"]

    bot = TradingBot(config)

    # Run a single analysis cycle
    bot.run_analysis_cycle()

    # Verify the bot can analyze without errors
    assert bot.running is False


def test_trading_bot_market_analysis():
    """Test market analysis for a single symbol."""
    config = Config()
    config.ai.openai_api_key = "test_key"

    bot = TradingBot(config)

    # Analyze a specific symbol
    analysis = bot.analyze_market("BTC-USD", 45000.0)

    assert "symbol" in analysis
    assert "price" in analysis
    assert "ai_analysis" in analysis
    assert "strategy_signals" in analysis
    assert "final_decision" in analysis
    assert analysis["symbol"] == "BTC-USD"
    assert analysis["price"] == 45000.0
    assert analysis["final_decision"] in ["BUY", "SELL", "HOLD"]


def test_trading_bot_with_limited_iterations():
    """Test running the bot for a limited number of iterations."""
    config = Config()
    config.ai.openai_api_key = "test_key"
    config.data.symbols = ["BTC-USD"]
    config.data.refresh_interval = 1  # Short interval for testing

    bot = TradingBot(config)

    # Run for just 1 iteration
    bot.run(iterations=1)

    # Bot should have stopped
    assert bot.running is False
