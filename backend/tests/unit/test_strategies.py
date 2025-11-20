"""Unit tests for trading strategies."""

import pytest
from alphanest.strategies.base import (
    StrategyManager,
    MomentumStrategy,
    MeanReversionStrategy,
    SignalType,
)


def test_momentum_strategy():
    """Test momentum strategy."""
    config = {"momentum_threshold": 0.02}
    strategy = MomentumStrategy(config)

    assert strategy.name == "Momentum"

    market_data = {"symbol": "BTC-USD", "price": 45000}
    result = strategy.analyze(market_data)

    assert "signal" in result
    assert "confidence" in result
    assert result["symbol"] == "BTC-USD"


def test_mean_reversion_strategy():
    """Test mean reversion strategy."""
    config = {"lookback_period": 20}
    strategy = MeanReversionStrategy(config)

    assert strategy.name == "MeanReversion"

    market_data = {"symbol": "ETH-USD", "price": 3000}
    result = strategy.analyze(market_data)

    assert "signal" in result
    assert result["symbol"] == "ETH-USD"


def test_strategy_manager_initialization():
    """Test strategy manager initialization."""
    config = {"risk_per_trade": 0.02}
    manager = StrategyManager(config)

    assert len(manager.strategies) > 0
    assert "momentum" in manager.strategies
    assert "mean_reversion" in manager.strategies


def test_strategy_manager_get_signals():
    """Test getting signals from all strategies."""
    config = {"risk_per_trade": 0.02}
    manager = StrategyManager(config)

    market_data = {"symbol": "BTC-USD", "price": 45000}
    signals = manager.get_signals(market_data)

    assert "momentum" in signals
    assert "mean_reversion" in signals
    assert all("signal" in s for s in signals.values())


def test_strategy_manager_consensus_signal():
    """Test getting consensus signal."""
    config = {"risk_per_trade": 0.02}
    manager = StrategyManager(config)

    # Test with all HOLD signals
    signals = {"strategy1": {"signal": "HOLD"}, "strategy2": {"signal": "HOLD"}}
    consensus = manager.get_consensus_signal(signals)
    assert consensus == "HOLD"

    # Test with majority BUY
    signals = {
        "strategy1": {"signal": "BUY"},
        "strategy2": {"signal": "BUY"},
        "strategy3": {"signal": "HOLD"},
    }
    consensus = manager.get_consensus_signal(signals)
    assert consensus == "BUY"
