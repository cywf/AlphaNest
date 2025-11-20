"""
Background worker for polling arbitrage opportunities.
"""

import time
import logging
import json
from typing import Optional
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from arbitrage_engine.engine import ArbitrageEngine

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


class ArbitragePoller:
    """Background poller for arbitrage opportunities."""

    def __init__(self, poll_interval: int = 10, demo_mode: bool = False):
        """Initialize the poller.

        Args:
            poll_interval: Seconds between polls
            demo_mode: Whether to use demo data
        """
        self.poll_interval = poll_interval
        self.demo_mode = demo_mode
        self.engine = ArbitrageEngine(demo_mode=demo_mode)
        self.running = False

    def start(self):
        """Start polling for opportunities."""
        self.running = True
        logger.info(f"Starting arbitrage poller (demo_mode={self.demo_mode})")

        while self.running:
            try:
                logger.info("Polling for arbitrage opportunities...")
                opportunities = self.engine.find_opportunities()

                logger.info(f"Found {len(opportunities)} opportunities")

                # Log top opportunities
                for i, opp in enumerate(opportunities[:5], 1):
                    logger.info(
                        f"  {i}. {opp.symbol}: "
                        f"Buy {opp.buy_exchange} @ ${opp.buy_price:.2f}, "
                        f"Sell {opp.sell_exchange} @ ${opp.sell_price:.2f}, "
                        f"Net Profit: {opp.net_profit_pct:.2f}%"
                    )

                # In production, would store in Redis or database here

            except Exception as e:
                logger.error(f"Error during polling: {e}", exc_info=True)

            # Wait for next poll
            time.sleep(self.poll_interval)

    def stop(self):
        """Stop the poller."""
        logger.info("Stopping arbitrage poller")
        self.running = False


def main():
    """Main entry point."""
    import argparse

    parser = argparse.ArgumentParser(description="Arbitrage opportunity poller")
    parser.add_argument(
        "--interval",
        type=int,
        default=10,
        help="Poll interval in seconds (default: 10)",
    )
    parser.add_argument(
        "--demo",
        action="store_true",
        help="Run in demo mode with mock data",
    )

    args = parser.parse_args()

    poller = ArbitragePoller(
        poll_interval=args.interval,
        demo_mode=args.demo,
    )

    try:
        poller.start()
    except KeyboardInterrupt:
        poller.stop()
        logger.info("Poller stopped by user")


if __name__ == "__main__":
    main()
