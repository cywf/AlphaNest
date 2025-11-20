"""Unit tests for configuration module."""

import pytest
from alphanest.core.config import Config, AIConfig, TradingConfig, DataConfig


def test_config_creation():
    """Test basic config creation."""
    config = Config()
    assert config is not None
    assert config.environment == "development"
    assert isinstance(config.ai, AIConfig)
    assert isinstance(config.trading, TradingConfig)
    assert isinstance(config.data, DataConfig)


def test_ai_config_defaults():
    """Test AI config defaults."""
    ai_config = AIConfig()
    assert ai_config.model == "gpt-4"
    assert ai_config.temperature == 0.7
    assert ai_config.max_tokens == 2000


def test_trading_config_defaults():
    """Test trading config defaults."""
    trading_config = TradingConfig()
    assert trading_config.enabled is False
    assert trading_config.max_position_size == 1000.0
    assert trading_config.risk_per_trade == 0.02


def test_data_config_defaults():
    """Test data config defaults."""
    data_config = DataConfig()
    assert data_config.refresh_interval == 60
    assert len(data_config.symbols) > 0
    assert "BTC-USD" in data_config.symbols


def test_config_from_dict():
    """Test config creation from dictionary."""
    config_dict = {
        "ai": {"model": "gpt-3.5-turbo", "temperature": 0.5},
        "trading": {"enabled": True, "max_position_size": 5000.0},
        "environment": "production",
    }
    config = Config.from_dict(config_dict)
    assert config.ai.model == "gpt-3.5-turbo"
    assert config.ai.temperature == 0.5
    assert config.trading.enabled is True
    assert config.environment == "production"


def test_config_validation_risk_per_trade():
    """Test config validation for risk_per_trade."""
    config = Config()
    config.ai.openai_api_key = "test_key"  # Set API key to pass first validation
    config.trading.risk_per_trade = 1.5

    with pytest.raises(ValueError, match="risk_per_trade must be between 0 and 1"):
        config.validate()
