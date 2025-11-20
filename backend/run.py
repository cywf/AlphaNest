#!/usr/bin/env python
"""
Simple CLI runner for AlphaNest.

Usage:
    python run.py                    # Run with default config
    python run.py --iterations 5     # Run for 5 cycles
    python run.py --help             # Show help
"""
import argparse
import sys
import logging
from alphanest.core.config import load_config
from alphanest.core.bot import TradingBot

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="AlphaNest - AI-Driven Trading Bot",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )

    parser.add_argument(
        "-i",
        "--iterations",
        type=int,
        default=None,
        help="Number of analysis cycles to run (default: infinite)",
    )

    parser.add_argument(
        "-v",
        "--verbose",
        action="store_true",
        help="Enable verbose/debug logging",
    )

    return parser.parse_args()


def main():
    """Main entry point for CLI."""
    args = parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    try:
        # Load configuration
        config = load_config()

        # Create bot
        bot = TradingBot(config)

        # Run bot
        logger.info(f"Starting AlphaNest... (Press Ctrl+C to stop)")
        bot.run(iterations=args.iterations)

    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        logger.info("Please set OPENAI_API_KEY environment variable")
        sys.exit(1)
    except KeyboardInterrupt:
        logger.info("\nShutdown requested by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    main()
