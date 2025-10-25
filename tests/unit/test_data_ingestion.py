"""Unit tests for data ingestion module."""

import pytest
from datetime import datetime, timedelta
from alphanest.data.ingestion import DataIngestionService, MockDataSource


def test_mock_data_source_current_price():
    """Test mock data source returns prices."""
    source = MockDataSource()
    price = source.fetch_current_price("BTC-USD")
    assert price is not None
    assert price > 0


def test_mock_data_source_unknown_symbol():
    """Test mock data source with unknown symbol."""
    source = MockDataSource()
    price = source.fetch_current_price("UNKNOWN")
    assert price is None


def test_mock_data_source_historical_data():
    """Test mock data source returns historical data."""
    source = MockDataSource()
    end_date = datetime.now()
    start_date = end_date - timedelta(days=7)

    data = source.fetch_historical_data("BTC-USD", start_date, end_date)
    assert len(data) > 0
    assert all("date" in item for item in data)
    assert all("close" in item for item in data)


def test_data_ingestion_service_initialization():
    """Test data ingestion service initialization."""
    symbols = ["BTC-USD", "ETH-USD"]
    service = DataIngestionService(symbols)

    assert len(service.symbols) == 2
    assert len(service.data_sources) > 0


def test_data_ingestion_get_current_prices():
    """Test getting current prices for all symbols."""
    symbols = ["BTC-USD", "AAPL"]
    service = DataIngestionService(symbols)

    prices = service.get_current_prices()
    assert "BTC-USD" in prices
    assert "AAPL" in prices
    assert prices["BTC-USD"] > 0


def test_data_ingestion_market_snapshot():
    """Test getting market snapshot."""
    symbols = ["BTC-USD"]
    service = DataIngestionService(symbols)

    snapshot = service.get_market_snapshot()
    assert "timestamp" in snapshot
    assert "prices" in snapshot
    assert "symbols_tracked" in snapshot
    assert snapshot["symbols_tracked"] == 1
