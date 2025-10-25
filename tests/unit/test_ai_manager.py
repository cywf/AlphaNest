"""Unit tests for AI manager module."""

import pytest
from alphanest.core.ai_manager import (
    AIAssistantManager,
    AssistantType,
    MarketAnalysisAssistant,
    RiskManagementAssistant,
)


def test_market_analysis_assistant():
    """Test market analysis assistant."""
    config = {"openai_api_key": "test_key"}
    assistant = MarketAnalysisAssistant(config)

    assert assistant.assistant_type == AssistantType.MARKET_ANALYSIS

    result = assistant.analyze({"symbol": "BTC-USD", "price": 45000})
    assert "recommendation" in result
    assert "confidence" in result


def test_risk_management_assistant():
    """Test risk management assistant."""
    config = {"openai_api_key": "test_key"}
    assistant = RiskManagementAssistant(config)

    assert assistant.assistant_type == AssistantType.RISK_MANAGEMENT

    result = assistant.analyze({"symbol": "BTC-USD", "price": 45000})
    assert "risk_level" in result
    assert "suggested_position_size" in result


def test_ai_assistant_manager_initialization():
    """Test AI assistant manager initialization."""
    config = {"openai_api_key": "test_key"}
    manager = AIAssistantManager(config)

    assert len(manager.assistants) > 0
    assert AssistantType.MARKET_ANALYSIS in manager.assistants
    assert AssistantType.RISK_MANAGEMENT in manager.assistants


def test_ai_assistant_manager_get_assistant():
    """Test getting specific assistant."""
    config = {"openai_api_key": "test_key"}
    manager = AIAssistantManager(config)

    market_assistant = manager.get_assistant(AssistantType.MARKET_ANALYSIS)
    assert market_assistant is not None
    assert isinstance(market_assistant, MarketAnalysisAssistant)


def test_ai_assistant_manager_analyze_market():
    """Test market analysis coordination."""
    config = {"openai_api_key": "test_key"}
    manager = AIAssistantManager(config)

    market_data = {"symbol": "BTC-USD", "price": 45000}
    results = manager.analyze_market(market_data)

    assert "market_analysis" in results
    assert "risk_analysis" in results


def test_ai_assistant_manager_get_recommendation():
    """Test getting trading recommendation."""
    config = {"openai_api_key": "test_key"}
    manager = AIAssistantManager(config)

    analysis = {
        "market_analysis": {"recommendation": "BUY"},
        "risk_analysis": {"risk_level": "low"},
    }

    recommendation = manager.get_recommendation(analysis)
    assert recommendation in ["BUY", "SELL", "HOLD"]
