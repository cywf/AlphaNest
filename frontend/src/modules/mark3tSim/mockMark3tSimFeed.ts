import type { SimAsset, SimMarketEvent } from './mark3tSimTypes'

const ASSET_POOL: SimAsset[] = [
  {
    id: 'sim-btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    currentPrice: 43250.50,
    change24h: 2.4,
    volatility: 'medium',
    sentiment: 'bullish',
    source: 'arbscan',
    volume24h: 28500000000,
    marketCap: 845000000000,
  },
  {
    id: 'sim-eth',
    symbol: 'ETH',
    name: 'Ethereum',
    currentPrice: 2280.75,
    change24h: -1.2,
    volatility: 'medium',
    sentiment: 'neutral',
    source: 'arbscan',
    volume24h: 12400000000,
    marketCap: 274000000000,
  },
  {
    id: 'sim-sol',
    symbol: 'SOL',
    name: 'Solana',
    currentPrice: 98.30,
    change24h: 8.5,
    volatility: 'high',
    sentiment: 'bullish',
    source: 'coin-fisher',
    volume24h: 3200000000,
    marketCap: 42000000000,
  },
  {
    id: 'sim-bnb',
    symbol: 'BNB',
    name: 'BNB',
    currentPrice: 315.40,
    change24h: 1.8,
    volatility: 'low',
    sentiment: 'bullish',
    source: 'stak3z',
    volume24h: 1800000000,
    marketCap: 48500000000,
  },
  {
    id: 'sim-ada',
    symbol: 'ADA',
    name: 'Cardano',
    currentPrice: 0.52,
    change24h: -3.1,
    volatility: 'medium',
    sentiment: 'bearish',
    source: 'arbscan',
    volume24h: 480000000,
    marketCap: 18400000000,
  },
  {
    id: 'sim-avax',
    symbol: 'AVAX',
    name: 'Avalanche',
    currentPrice: 37.80,
    change24h: 5.2,
    volatility: 'high',
    sentiment: 'bullish',
    source: 'coin-fisher',
    volume24h: 720000000,
    marketCap: 14200000000,
  },
  {
    id: 'sim-dot',
    symbol: 'DOT',
    name: 'Polkadot',
    currentPrice: 6.85,
    change24h: -0.8,
    volatility: 'medium',
    sentiment: 'neutral',
    source: 'arbscan',
    volume24h: 340000000,
    marketCap: 9200000000,
  },
  {
    id: 'sim-matic',
    symbol: 'MATIC',
    name: 'Polygon',
    currentPrice: 0.78,
    change24h: 12.3,
    volatility: 'extreme',
    sentiment: 'bullish',
    source: 'market-analysis',
    volume24h: 620000000,
    marketCap: 7300000000,
  },
  {
    id: 'sim-link',
    symbol: 'LINK',
    name: 'Chainlink',
    currentPrice: 14.60,
    change24h: 4.1,
    volatility: 'medium',
    sentiment: 'bullish',
    source: 'stak3z',
    volume24h: 580000000,
    marketCap: 8400000000,
  },
  {
    id: 'sim-uni',
    symbol: 'UNI',
    name: 'Uniswap',
    currentPrice: 6.25,
    change24h: -2.4,
    volatility: 'high',
    sentiment: 'neutral',
    source: 'market',
    volume24h: 180000000,
    marketCap: 4700000000,
  },
  {
    id: 'sim-atom',
    symbol: 'ATOM',
    name: 'Cosmos',
    currentPrice: 9.45,
    change24h: 3.7,
    volatility: 'medium',
    sentiment: 'bullish',
    source: 'coin-fisher',
    volume24h: 210000000,
    marketCap: 3800000000,
  },
  {
    id: 'sim-xrp',
    symbol: 'XRP',
    name: 'Ripple',
    currentPrice: 0.58,
    change24h: -1.5,
    volatility: 'low',
    sentiment: 'bearish',
    source: 'arbscan',
    volume24h: 1200000000,
    marketCap: 31000000000,
  },
]

const EVENT_TEMPLATES: Omit<SimMarketEvent, 'id' | 'timestamp'>[] = [
  {
    type: 'whale-buy',
    title: 'Virtual Whale Buy Event Detected',
    description: 'Large accumulation pattern detected in simulation cluster',
    impact: 'high',
  },
  {
    type: 'profit-cluster',
    title: 'High-Profit Simulation Cluster Forming',
    description: 'Multiple profitable positions converging in virtual arena',
    impact: 'medium',
  },
  {
    type: 'sentiment-rally',
    title: 'Sentiment-Driven Virtual Rally',
    description: 'Bullish momentum building across training sessions',
    impact: 'medium',
  },
  {
    type: 'training-surge',
    title: 'Training Session Surge Among Top Clans',
    description: 'Elite clans intensifying MARK3T-SIM practice runs',
    impact: 'low',
    clanName: 'Cyber Dragons',
  },
  {
    type: 'liquidity-squeeze',
    title: 'Simulated Liquidity Squeeze Detected',
    description: 'Virtual order book depth declining rapidly',
    impact: 'high',
  },
]

export function generateSimAssets(): SimAsset[] {
  return ASSET_POOL.map((asset) => ({
    ...asset,
    currentPrice: asset.currentPrice * (1 + (Math.random() - 0.5) * 0.05),
    change24h: asset.change24h + (Math.random() - 0.5) * 2,
  }))
}

export function generateSimMarketEvents(count: number = 5): SimMarketEvent[] {
  const events: SimMarketEvent[] = []
  const assets = generateSimAssets()
  
  for (let i = 0; i < count; i++) {
    const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)]
    const asset = assets[Math.floor(Math.random() * assets.length)]
    
    events.push({
      ...template,
      id: `sim-event-${Date.now()}-${i}`,
      timestamp: Date.now() - Math.floor(Math.random() * 3600000),
      assetSymbol: Math.random() > 0.3 ? asset.symbol : undefined,
    })
  }
  
  return events.sort((a, b) => b.timestamp - a.timestamp)
}

export function getAssetById(id: string): SimAsset | undefined {
  return ASSET_POOL.find((asset) => asset.id === id)
}

export function getAssetsBySource(source: SimAsset['source']): SimAsset[] {
  return generateSimAssets().filter((asset) => asset.source === source)
}

export function getTopMovers(limit: number = 5): SimAsset[] {
  return generateSimAssets()
    .sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h))
    .slice(0, limit)
}

export function getHighVolatilityAssets(limit: number = 5): SimAsset[] {
  return generateSimAssets()
    .filter((asset) => asset.volatility === 'high' || asset.volatility === 'extreme')
    .slice(0, limit)
}
