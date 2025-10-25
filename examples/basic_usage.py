#!/usr/bin/env python
"""
Example script showing how to use AlphaNest trading bot.

This demonstrates the basic usage of the bot with custom configuration.
"""
import logging
from alphanest.core.config import Config, AIConfig, TradingConfig, DataConfig
from alphanest.core.bot import TradingBot

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def main():
    """Run the example bot."""
    # Create custom configuration
    config = Config(
        ai=AIConfig(
            openai_api_key="your_api_key_here",  # Set your API key
            model="gpt-4",
            temperature=0.7,
        ),
        trading=TradingConfig(
            enabled=False,  # Keep disabled for simulation
            max_position_size=1000.0,
            risk_per_trade=0.02,
        ),
        data=DataConfig(
            refresh_interval=30,  # Analyze every 30 seconds
            symbols=["BTC-USD", "ETH-USD", "AAPL"],
            data_sources=["mock"],  # Use mock data for testing
        ),
        environment="development",
        debug=True,
    )

    logger.info("Starting AlphaNest example...")
    logger.info("Configuration:")
    logger.info(f"  - Environment: {config.environment}")
    logger.info(f"  - Trading enabled: {config.trading.enabled}")
    logger.info(f"  - Tracked symbols: {config.data.symbols}")
    logger.info(f"  - Analysis interval: {config.data.refresh_interval}s")

    # Create and run the bot
    bot = TradingBot(config)

    # Run for 3 iterations as a demo
    logger.info("\nRunning bot for 3 analysis cycles...")
    bot.run(iterations=3)

    logger.info("\nExample complete!")
    logger.info("To run continuously, use: bot.run() without iterations parameter")
    logger.info("To use real trading, set trading.enabled=True and add broker API keys")


if __name__ == "__main__":
    main()
