"""
Market analysis feed API routes.
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import logging
import random

from ..auth import optional_api_key

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/analysis", tags=["analysis"])

# Configuration constants
FEED_ITEM_TIME_OFFSET_SECONDS = 30  # Time offset between feed items
DEFAULT_FEED_COUNT = 10  # Default number of items in feed
MAX_FEED_COUNT = 50  # Maximum number of items in feed

# Constants for generating analysis items
COIN_SYMBOLS = ["BTC", "ETH", "DOGE", "SHIB", "PEPE", "BONK", "FLOKI", "WOJAK"]
NFT_COLLECTIONS = ["CryptoPunks", "BAYC", "Azuki", "Doodles", "Moonbirds", "CloneX"]

ANALYSIS_TEMPLATES = {
    "market-trend": [
        "Major price movement detected in {coin}",
        "Trading volume surge for {coin} across exchanges",
        "Market momentum shift detected - bullish pattern forming",
        "Cross-exchange price convergence for {coin}",
    ],
    "osint-alert": [
        "Suspicious wallet cluster identified with {count} connections",
        "New honeypot contract deployed - high risk",
        "Social media manipulation campaign detected",
        "Coordinated pump activity identified",
    ],
    "whale-movement": [
        "Whale wallet transferred {amount}M in {coin}",
        "Large holder accumulation pattern detected",
        "Major exchange withdrawal - {amount}M {coin}",
        "Whale wallet splitting holdings across multiple addresses",
    ],
    "nft-surge": [
        "{collection} floor price jumped {percent}% in 1 hour",
        "Unusual NFT trading volume in {collection}",
        "New whale entered {collection} - purchased {count} items",
        "NFT wash trading suspected in {collection}",
    ],
    "arbitrage": [
        "{percent}% arbitrage opportunity on {coin}",
        "Cross-chain arbitrage window opening for {coin}",
        "Price discrepancy detected between Binance and Coinbase",
        "DEX-CEX arbitrage opportunity for {coin}",
    ],
    "scam-alert": [
        "Rug pull warning: {coin} liquidity decreasing rapidly",
        "Token contract shows malicious functions",
        "Developer wallet dumping {coin} tokens",
        "Fake airdrop scam targeting {coin} holders",
    ],
    "clan-activity": [
        "Clan war territory shift - Alpha Squad gaining ground",
        "New clan formed with {count} members",
        "Clan cooperation detected on {coin} arbitrage",
        "Top clan reached 1M points milestone",
    ],
    "liquidity-pool": [
        "High-yield pool detected: {percent}% APY on {coin}",
        "Liquidity imbalance alert in {coin} pool",
        "Stablecoin pool surge - TVL increased {percent}%",
        "Volatile pool reward spike: {coin} up {percent}%",
        "New liquidity pool launched with {amount}M TVL",
        "Impermanent loss warning: {coin} pool volatility high",
    ],
    "sim-trading": [
        "Virtual whale buy event detected in MARK3T-SIM",
        "High-profit simulation cluster forming for {coin}",
        "Sentiment-driven virtual rally in MARK3T-SIM",
        "Training session surge among top clans",
        "Simulated liquidity squeeze detected for {coin}",
        "MARK3T-SIM: {count} traders hit profit targets",
        "Virtual trading volume spike - {coin} trending",
        "Clan training event: Massive MARK3T-SIM activity",
    ],
}

SUMMARIES = {
    "market-trend": "Real-time analysis shows significant movement. Volume increased {percent}% across major exchanges.",
    "osint-alert": "OSINT systems detected unusual patterns. Risk assessment: elevated. Monitor closely.",
    "whale-movement": "Large wallet activity tracked. Movement size: ${amount}M. Impact analysis ongoing.",
    "nft-surge": "NFT analytics show rapid price action. Floor price momentum detected in {collection}.",
    "arbitrage": "Price differential identified. Potential profit: {percent}%. Window closing soon.",
    "scam-alert": "⚠️ HIGH RISK: Scam indicators detected. Avoid interaction. Multiple red flags present.",
    "clan-activity": "Clan intelligence update. Activity spike detected. Strategic significance: medium.",
    "liquidity-pool": "Liquidity analysis shows {percent}% movement. Pool dynamics shifting. Monitor for opportunities.",
    "sim-trading": "MARK3T-SIM virtual trading arena shows increased activity. Training effectiveness: high.",
}

TAG_OPTIONS = {
    "market-trend": ["Trending", "Volume", "Price Action"],
    "osint-alert": ["OSINT", "High Risk", "Investigation"],
    "whale-movement": ["Whale Alert", "Large Transfer", "Movement"],
    "nft-surge": ["NFT", "Volume Surge", "Floor Price"],
    "arbitrage": ["Arbitrage", "Opportunity", "Time Sensitive"],
    "scam-alert": ["SCAM", "Warning", "High Risk"],
    "clan-activity": ["Clans", "Territory", "Competition"],
    "liquidity-pool": ["STAK3Z", "Liquidity", "Yield", "TVL"],
    "sim-trading": ["MARK3T-SIM", "Training", "Virtual", "Simulation"],
}

SEVERITIES = {
    "market-trend": "medium",
    "osint-alert": "high",
    "whale-movement": "high",
    "nft-surge": "medium",
    "arbitrage": "medium",
    "scam-alert": "critical",
    "clan-activity": "low",
    "liquidity-pool": "medium",
    "sim-trading": "low",
}

DEEP_LINKS = {
    "market-trend": {"type": "arbitrage", "label": "View {coin} in ArbScan"},
    "osint-alert": {"type": "wallet", "label": "View Wallet Dossier"},
    "whale-movement": {"type": "wallet", "label": "View Whale Wallet"},
    "nft-surge": {"type": "market", "label": "Browse {collection}"},
    "arbitrage": {"type": "arbitrage", "label": "Trade {coin}"},
    "scam-alert": {"type": "coin", "label": "View {coin} Report"},
    "clan-activity": {"type": "clan", "label": "View Clan Wars"},
    "liquidity-pool": {"type": "market", "label": "View {coin} Pools in STAK3Z"},
    "sim-trading": {"type": "market", "label": "Open MARK3T-SIM"},
}


def generate_analysis_item() -> AnalysisItem:
    """Generate a single random analysis item.

    Returns:
        AnalysisItem with randomized data
    """
    categories = list(ANALYSIS_TEMPLATES.keys())
    category = random.choice(categories)
    template = random.choice(ANALYSIS_TEMPLATES[category])

    # Generate random values
    coin = random.choice(COIN_SYMBOLS)
    collection = random.choice(NFT_COLLECTIONS)
    amount = round(random.uniform(10, 60), 1)
    percent = round(random.uniform(5, 35), 1)
    count = random.randint(5, 55)

    # Format title
    title = (
        template.replace("{coin}", coin)
        .replace("{collection}", collection)
        .replace("{amount}", str(amount))
        .replace("{percent}", str(percent))
        .replace("{count}", str(count))
    )

    # Format summary
    summary = (
        SUMMARIES[category]
        .replace("{coin}", coin)
        .replace("{collection}", collection)
        .replace("{amount}", str(amount))
        .replace("{percent}", str(percent))
    )

    # Format deep link
    deep_link_template = DEEP_LINKS[category]
    deep_link = {
        "type": deep_link_template["type"],
        "id": coin if category != "clan-activity" else "alpha-squad",
        "label": deep_link_template["label"]
        .replace("{coin}", coin)
        .replace("{collection}", collection),
    }

    # Generate metadata
    metadata = {
        "coinSymbol": coin if category != "clan-activity" else None,
        "volumeChange": round(random.uniform(-20, 100), 2),
        "priceChange": round(random.uniform(-10, 40), 2),
    }

    if category == "arbitrage":
        metadata["profitPercentage"] = percent

    # Generate unique ID
    item_id = f"analysis-{int(datetime.now().timestamp() * 1000)}-{random.randint(1000, 9999)}"

    return AnalysisItem(
        id=item_id,
        timestamp=datetime.now(),
        category=category,
        title=title,
        summary=summary,
        tags=TAG_OPTIONS[category],
        severity=SEVERITIES[category],
        deep_link=deep_link,
        metadata=metadata,
    )


@router.get("/feed")
async def get_analysis_feed(
    count: int = DEFAULT_FEED_COUNT,
    api_key: Optional[str] = Depends(optional_api_key),
) -> List[AnalysisItem]:
    """Get market analysis feed.

    Args:
        count: Number of analysis items to return (default: 10, max: 50)
        api_key: Optional API key

    Returns:
        List of market analysis items
    """
    # Limit count to reasonable range
    count = min(max(count, 1), MAX_FEED_COUNT)

    logger.info(f"Generating analysis feed with {count} items")

    # Generate analysis items
    items = []
    for i in range(count):
        item = generate_analysis_item()
        # Adjust timestamp to create a feed history
        item.timestamp = datetime.fromtimestamp(
            datetime.now().timestamp() - (i * FEED_ITEM_TIME_OFFSET_SECONDS)
        )
        items.append(item)

    return items


@router.get("/feed/latest")
async def get_latest_analysis(
    api_key: Optional[str] = Depends(optional_api_key),
) -> AnalysisItem:
    """Get the latest analysis item.

    Args:
        api_key: Optional API key

    Returns:
        Single latest market analysis item
    """
    logger.info("Generating latest analysis item")
    return generate_analysis_item()


@router.get("/categories")
async def get_analysis_categories(
    api_key: Optional[str] = Depends(optional_api_key),
) -> Dict[str, Any]:
    """Get available analysis categories.

    Args:
        api_key: Optional API key

    Returns:
        Dictionary of analysis categories and their metadata
    """
    return {
        "categories": [
            {
                "id": category,
                "name": category.replace("-", " ").title(),
                "severity": SEVERITIES[category],
                "tags": TAG_OPTIONS[category],
            }
            for category in ANALYSIS_TEMPLATES.keys()
        ]
    }
