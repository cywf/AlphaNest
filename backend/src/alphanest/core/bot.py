"""
Main trading bot engine.
Coordinates all components and executes the trading loop.
"""

import logging
import time
from typing import Dict, Any
from datetime import datetime

from alphanest.core.config import Config
from alphanest.core.ai_manager import AIAssistantManager
from alphanest.data.ingestion import DataIngestionService
from alphanest.strategies.base import StrategyManager

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class TradingBot:
    """
    Main trading bot that orchestrates all components.
    """

    def __init__(self, config: Config):
        self.config = config
        self.running = False

        # Initialize components
        logger.info("Initializing AlphaNest Trading Bot...")

        self.data_service = DataIngestionService(
            symbols=config.data.symbols, data_sources=config.data.data_sources
        )

        self.ai_manager = AIAssistantManager(
            {
                "openai_api_key": config.ai.openai_api_key,
                "model": config.ai.model,
                "temperature": config.ai.temperature,
            }
        )

        self.strategy_manager = StrategyManager(
            {"risk_per_trade": config.trading.risk_per_trade}
        )

        logger.info("AlphaNest initialization complete")

    def analyze_market(self, symbol: str, price: float) -> Dict[str, Any]:
        """
        Perform comprehensive market analysis for a symbol.

        Args:
            symbol: Trading symbol
            price: Current price

        Returns:
            Complete analysis with recommendations
        """
        market_data = {
            "symbol": symbol,
            "price": price,
            "timestamp": datetime.now().isoformat(),
        }

        # Get AI analysis
        ai_analysis = self.ai_manager.analyze_market(market_data)

        # Get strategy signals
        strategy_signals = self.strategy_manager.get_signals(market_data)
        consensus_signal = self.strategy_manager.get_consensus_signal(strategy_signals)

        # Get AI recommendation
        ai_recommendation = self.ai_manager.get_recommendation(ai_analysis)

        return {
            "symbol": symbol,
            "price": price,
            "timestamp": market_data["timestamp"],
            "ai_analysis": ai_analysis,
            "strategy_signals": strategy_signals,
            "consensus_signal": consensus_signal,
            "ai_recommendation": ai_recommendation,
            "final_decision": self._make_final_decision(
                consensus_signal, ai_recommendation
            ),
        }

    def _make_final_decision(self, strategy_signal: str, ai_recommendation: str) -> str:
        """
        Make final trading decision combining strategy and AI inputs.

        Args:
            strategy_signal: Signal from strategies
            ai_recommendation: Recommendation from AI

        Returns:
            Final decision (BUY, SELL, HOLD)
        """
        # Conservative approach: both must agree for BUY/SELL
        if strategy_signal == ai_recommendation:
            return strategy_signal
        else:
            return "HOLD"

    def run_analysis_cycle(self):
        """Run a single analysis cycle for all tracked symbols."""
        logger.info("=" * 60)
        logger.info("Starting analysis cycle")
        logger.info("=" * 60)

        # Get current market data
        market_snapshot = self.data_service.get_market_snapshot()
        logger.info(f"Market snapshot: {market_snapshot['timestamp']}")

        # Analyze each symbol
        for symbol, price in market_snapshot["prices"].items():
            if price is None:
                logger.warning(f"No price data available for {symbol}")
                continue

            logger.info(f"\nAnalyzing {symbol}...")
            analysis = self.analyze_market(symbol, price)

            logger.info(f"  Price: ${price:.2f}")
            logger.info(f"  Strategy Signal: {analysis['consensus_signal']}")
            logger.info(f"  AI Recommendation: {analysis['ai_recommendation']}")
            logger.info(f"  Final Decision: {analysis['final_decision']}")

            # In production, this would execute trades if trading is enabled
            if self.config.trading.enabled and analysis["final_decision"] != "HOLD":
                logger.info(
                    f"  [SIMULATION] Would execute {analysis['final_decision']} order for {symbol}"
                )

        logger.info("\nAnalysis cycle complete")

    def run(self, iterations: int = None):
        """
        Run the trading bot.

        Args:
            iterations: Number of iterations to run (None for infinite)
        """
        self.running = True
        iteration = 0

        logger.info("AlphaNest Trading Bot starting...")
        logger.info(f"Environment: {self.config.environment}")
        logger.info(f"Trading enabled: {self.config.trading.enabled}")
        logger.info(f"Tracked symbols: {self.config.data.symbols}")

        try:
            while self.running:
                self.run_analysis_cycle()

                iteration += 1
                if iterations is not None and iteration >= iterations:
                    logger.info(f"Completed {iterations} iterations")
                    break

                # Wait before next cycle
                sleep_time = self.config.data.refresh_interval
                logger.info(f"\nWaiting {sleep_time} seconds until next cycle...")
                time.sleep(sleep_time)

        except KeyboardInterrupt:
            logger.info("\nShutdown signal received")
        finally:
            self.stop()

    def stop(self):
        """Stop the trading bot."""
        self.running = False
        logger.info("AlphaNest Trading Bot stopped")


def main():
    """Main entry point."""
    from alphanest.core.config import load_config

    try:
        config = load_config()
        bot = TradingBot(config)
        bot.run()
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        logger.info("Please set OPENAI_API_KEY environment variable or update config")
    except Exception as e:
        logger.error(f"Error starting bot: {e}")
        raise


if __name__ == "__main__":
    main()
