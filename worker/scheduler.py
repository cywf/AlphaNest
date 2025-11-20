"""
Task scheduler for background jobs.
"""

import schedule
import time
import logging
from typing import Callable, List

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


class TaskScheduler:
    """Scheduler for periodic background tasks."""

    def __init__(self):
        """Initialize the scheduler."""
        self.jobs: List[schedule.Job] = []
        self.running = False

    def add_job(
        self,
        func: Callable,
        interval_seconds: int,
        *args,
        **kwargs,
    ):
        """Add a job to the scheduler.

        Args:
            func: Function to execute
            interval_seconds: Interval in seconds
            *args: Positional arguments for the function
            **kwargs: Keyword arguments for the function
        """
        job = schedule.every(interval_seconds).seconds.do(func, *args, **kwargs)
        self.jobs.append(job)
        logger.info(f"Added job: {func.__name__} every {interval_seconds}s")

    def start(self):
        """Start the scheduler."""
        self.running = True
        logger.info("Starting task scheduler")

        while self.running:
            schedule.run_pending()
            time.sleep(1)

    def stop(self):
        """Stop the scheduler."""
        logger.info("Stopping task scheduler")
        self.running = False
        schedule.clear()


def example_task():
    """Example scheduled task."""
    logger.info("Running example task")


def main():
    """Main entry point."""
    scheduler = TaskScheduler()

    # Add example tasks
    scheduler.add_job(example_task, interval_seconds=60)

    try:
        scheduler.start()
    except KeyboardInterrupt:
        scheduler.stop()
        logger.info("Scheduler stopped by user")


if __name__ == "__main__":
    main()
