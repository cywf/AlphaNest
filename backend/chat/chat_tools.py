"""
Chat tools and function definitions.
"""

from typing import List, Dict, Any


# Tool schemas for ChatKit SDK

CHAT_TOOLS = [
    {
        "name": "arbitrage_lookup",
        "description": "Look up cryptocurrency arbitrage opportunities across exchanges",
        "parameters": {
            "type": "object",
            "properties": {
                "symbol": {
                    "type": "string",
                    "description": "Trading pair symbol (e.g., BTC/USDT)",
                },
                "min_profit_pct": {
                    "type": "number",
                    "description": "Minimum profit percentage threshold",
                    "default": 0.5,
                },
            },
            "required": ["symbol"],
        },
    },
    {
        "name": "clan_score_lookup",
        "description": "Get Clan Warz clan scores and rankings",
        "parameters": {
            "type": "object",
            "properties": {
                "clan_id": {"type": "string", "description": "Clan identifier"}
            },
            "required": ["clan_id"],
        },
    },
    {
        "name": "osint_coin_discovery",
        "description": "Discover new cryptocurrency coins using OSINT techniques",
        "parameters": {
            "type": "object",
            "properties": {
                "keywords": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Keywords to search for",
                },
                "min_confidence": {
                    "type": "number",
                    "description": "Minimum confidence score (0-1)",
                    "default": 0.7,
                },
            },
            "required": ["keywords"],
        },
    },
    {
        "name": "scam_wallet_dossier",
        "description": "Generate a dossier for a suspected scam wallet",
        "parameters": {
            "type": "object",
            "properties": {
                "wallet_address": {
                    "type": "string",
                    "description": "Blockchain wallet address",
                },
                "blockchain": {
                    "type": "string",
                    "description": "Blockchain network (ETH, BSC, etc.)",
                    "default": "ETH",
                },
            },
            "required": ["wallet_address"],
        },
    },
    {
        "name": "shop_theme_generator",
        "description": "Generate a shop theme based on style preferences",
        "parameters": {
            "type": "object",
            "properties": {
                "style": {
                    "type": "string",
                    "description": "Theme style (cyberpunk, modern, minimal, etc.)",
                    "enum": ["cyberpunk", "modern", "minimal", "vintage"],
                },
                "primary_color": {
                    "type": "string",
                    "description": "Primary color hex code",
                },
            },
            "required": ["style"],
        },
    },
    {
        "name": "user_onboarding_help",
        "description": "Provide user onboarding assistance",
        "parameters": {
            "type": "object",
            "properties": {
                "step": {
                    "type": "string",
                    "description": "Current onboarding step",
                    "enum": [
                        "welcome",
                        "setup_profile",
                        "connect_wallet",
                        "explore_features",
                    ],
                },
                "user_level": {
                    "type": "string",
                    "description": "User experience level",
                    "enum": ["beginner", "intermediate", "advanced"],
                    "default": "beginner",
                },
            },
            "required": ["step"],
        },
    },
]


def get_tool_schemas() -> List[Dict[str, Any]]:
    """Get all tool schemas for ChatKit."""
    return CHAT_TOOLS


def get_tool_by_name(tool_name: str) -> Dict[str, Any]:
    """Get a specific tool schema by name."""
    for tool in CHAT_TOOLS:
        if tool["name"] == tool_name:
            return tool
    raise ValueError(f"Tool {tool_name} not found")
