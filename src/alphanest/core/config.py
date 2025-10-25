"""
Configuration management for AlphaNest.
Handles loading and validation of configuration settings.
"""

import os
from typing import Dict, Any, Optional
from dataclasses import dataclass, field


@dataclass
class AIConfig:
    """AI Assistant configuration."""

    openai_api_key: Optional[str] = field(
        default_factory=lambda: os.getenv("OPENAI_API_KEY")
    )
    model: str = "gpt-4"
    temperature: float = 0.7
    max_tokens: int = 2000


@dataclass
class TradingConfig:
    """Trading configuration."""

    enabled: bool = False
    max_position_size: float = 1000.0
    risk_per_trade: float = 0.02
    stop_loss_percent: float = 0.05
    take_profit_percent: float = 0.10


@dataclass
class DataConfig:
    """Data ingestion configuration."""

    refresh_interval: int = 60  # seconds
    symbols: list = field(
        default_factory=lambda: ["BTC-USD", "ETH-USD", "AAPL", "GOOGL"]
    )
    data_sources: list = field(default_factory=lambda: ["mock"])


@dataclass
class Config:
    """Main configuration class."""

    ai: AIConfig = field(default_factory=AIConfig)
    trading: TradingConfig = field(default_factory=TradingConfig)
    data: DataConfig = field(default_factory=DataConfig)
    environment: str = field(
        default_factory=lambda: os.getenv("ENVIRONMENT", "development")
    )
    debug: bool = field(
        default_factory=lambda: os.getenv("DEBUG", "False").lower() == "true"
    )

    @classmethod
    def from_dict(cls, config_dict: Dict[str, Any]) -> "Config":
        """Create Config from dictionary."""
        ai_config = AIConfig(**config_dict.get("ai", {}))
        trading_config = TradingConfig(**config_dict.get("trading", {}))
        data_config = DataConfig(**config_dict.get("data", {}))

        return cls(
            ai=ai_config,
            trading=trading_config,
            data=data_config,
            environment=config_dict.get("environment", "development"),
            debug=config_dict.get("debug", False),
        )

    def validate(self) -> bool:
        """Validate configuration."""
        if self.ai.openai_api_key is None:
            raise ValueError("OPENAI_API_KEY is required")

        if self.trading.risk_per_trade <= 0 or self.trading.risk_per_trade > 1:
            raise ValueError("risk_per_trade must be between 0 and 1")

        return True


def load_config() -> Config:
    """Load configuration from environment and defaults."""
    return Config()
