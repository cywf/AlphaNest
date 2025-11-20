import type { MarketAnalysisItem, AnalysisCategory } from './marketAnalysisTypes'

const COIN_SYMBOLS = ['BTC', 'ETH', 'DOGE', 'SHIB', 'PEPE', 'BONK', 'FLOKI', 'WOJAK']
const NFT_COLLECTIONS = ['CryptoPunks', 'BAYC', 'Azuki', 'Doodles', 'Moonbirds', 'CloneX']
const ANALYSIS_TEMPLATES: Record<AnalysisCategory, string[]> = {
  'market-trend': [
    'Major price movement detected in {coin}',
    'Trading volume surge for {coin} across exchanges',
    'Market momentum shift detected - bullish pattern forming',
    'Cross-exchange price convergence for {coin}',
  ],
  'osint-alert': [
    'Suspicious wallet cluster identified with {count} connections',
    'New honeypot contract deployed - high risk',
    'Social media manipulation campaign detected',
    'Coordinated pump activity identified',
  ],
  'whale-movement': [
    'Whale wallet transferred {amount}M in {coin}',
    'Large holder accumulation pattern detected',
    'Major exchange withdrawal - {amount}M {coin}',
    'Whale wallet splitting holdings across multiple addresses',
  ],
  'nft-surge': [
    '{collection} floor price jumped {percent}% in 1 hour',
    'Unusual NFT trading volume in {collection}',
    'New whale entered {collection} - purchased {count} items',
    'NFT wash trading suspected in {collection}',
  ],
  'arbitrage': [
    '{percent}% arbitrage opportunity on {coin}',
    'Cross-chain arbitrage window opening for {coin}',
    'Price discrepancy detected between Binance and Coinbase',
    'DEX-CEX arbitrage opportunity for {coin}',
  ],
  'scam-alert': [
    'Rug pull warning: {coin} liquidity decreasing rapidly',
    'Token contract shows malicious functions',
    'Developer wallet dumping {coin} tokens',
    'Fake airdrop scam targeting {coin} holders',
  ],
  'clan-activity': [
    'Clan war territory shift - Alpha Squad gaining ground',
    'New clan formed with {count} members',
    'Clan cooperation detected on {coin} arbitrage',
    'Top clan reached 1M points milestone',
  ],
  'liquidity-pool': [
    'High-yield pool detected: {percent}% APY on {coin}',
    'Liquidity imbalance alert in {coin} pool',
    'Stablecoin pool surge - TVL increased {percent}%',
    'Volatile pool reward spike: {coin} up {percent}%',
    'New liquidity pool launched with {amount}M TVL',
    'Impermanent loss warning: {coin} pool volatility high',
  ],
  'sim-trading': [
    'Virtual whale buy event detected in MARK3T-SIM',
    'High-profit simulation cluster forming for {coin}',
    'Sentiment-driven virtual rally in MARK3T-SIM',
    'Training session surge among top clans',
    'Simulated liquidity squeeze detected for {coin}',
    'MARK3T-SIM: {count} traders hit profit targets',
    'Virtual trading volume spike - {coin} trending',
    'Clan training event: Massive MARK3T-SIM activity',
  ],
}

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function generateAnalysisItem(): MarketAnalysisItem {
  const categories: AnalysisCategory[] = [
    'market-trend',
    'osint-alert',
    'whale-movement',
    'nft-surge',
    'arbitrage',
    'scam-alert',
    'clan-activity',
    'liquidity-pool',
    'sim-trading',
  ]
  
  const category = randomChoice(categories)
  const template = randomChoice(ANALYSIS_TEMPLATES[category])
  
  const coin = randomChoice(COIN_SYMBOLS)
  const collection = randomChoice(NFT_COLLECTIONS)
  const amount = (Math.random() * 50 + 10).toFixed(1)
  const percent = (Math.random() * 30 + 5).toFixed(1)
  const count = Math.floor(Math.random() * 50 + 5)
  
  let title = template
    .replace('{coin}', coin)
    .replace('{collection}', collection)
    .replace('{amount}', amount)
    .replace('{percent}', percent)
    .replace('{count}', count.toString())
  
  const summaries: Record<AnalysisCategory, string> = {
    'market-trend': `Real-time analysis shows significant movement. Volume increased ${percent}% across major exchanges.`,
    'osint-alert': `OSINT systems detected unusual patterns. Risk assessment: elevated. Monitor closely.`,
    'whale-movement': `Large wallet activity tracked. Movement size: $${amount}M. Impact analysis ongoing.`,
    'nft-surge': `NFT analytics show rapid price action. Floor price momentum detected in ${collection}.`,
    'arbitrage': `Price differential identified. Potential profit: ${percent}%. Window closing soon.`,
    'scam-alert': `⚠️ HIGH RISK: Scam indicators detected. Avoid interaction. Multiple red flags present.`,
    'clan-activity': `Clan intelligence update. Activity spike detected. Strategic significance: medium.`,
    'liquidity-pool': `Liquidity analysis shows ${percent}% movement. Pool dynamics shifting. Monitor for opportunities.`,
    'sim-trading': `MARK3T-SIM virtual trading arena shows increased activity. Training effectiveness: high.`,
  }
  
  const tagOptions: Record<AnalysisCategory, string[]> = {
    'market-trend': ['Trending', 'Volume', 'Price Action'],
    'osint-alert': ['OSINT', 'High Risk', 'Investigation'],
    'whale-movement': ['Whale Alert', 'Large Transfer', 'Movement'],
    'nft-surge': ['NFT', 'Volume Surge', 'Floor Price'],
    'arbitrage': ['Arbitrage', 'Opportunity', 'Time Sensitive'],
    'scam-alert': ['SCAM', 'Warning', 'High Risk'],
    'clan-activity': ['Clans', 'Territory', 'Competition'],
    'liquidity-pool': ['STAK3Z', 'Liquidity', 'Yield', 'TVL'],
    'sim-trading': ['MARK3T-SIM', 'Training', 'Virtual', 'Simulation'],
  }
  
  const severities: Record<AnalysisCategory, ('low' | 'medium' | 'high' | 'critical')> = {
    'market-trend': 'medium',
    'osint-alert': 'high',
    'whale-movement': 'high',
    'nft-surge': 'medium',
    'arbitrage': 'medium',
    'scam-alert': 'critical',
    'clan-activity': 'low',
    'liquidity-pool': 'medium',
    'sim-trading': 'low',
  }
  
  const deepLinks: Record<AnalysisCategory, MarketAnalysisItem['deepLink']> = {
    'market-trend': { type: 'arbitrage', id: coin, label: `View ${coin} in ArbScan` },
    'osint-alert': { type: 'wallet', id: '0xabc...123', label: 'View Wallet Dossier' },
    'whale-movement': { type: 'wallet', id: '0xdef...456', label: 'View Whale Wallet' },
    'nft-surge': { type: 'market', id: collection, label: `Browse ${collection}` },
    'arbitrage': { type: 'arbitrage', id: coin, label: `Trade ${coin}` },
    'scam-alert': { type: 'coin', id: coin, label: `View ${coin} Report` },
    'clan-activity': { type: 'clan', id: 'alpha-squad', label: 'View Clan Wars' },
    'liquidity-pool': { type: 'market', id: coin, label: `View ${coin} Pools in STAK3Z` },
    'sim-trading': { type: 'market', id: 'mark3t-sim', label: 'Open MARK3T-SIM' },
  }
  
  return {
    id: `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    category,
    title,
    summary: summaries[category],
    tags: tagOptions[category],
    severity: severities[category],
    deepLink: deepLinks[category],
    metadata: {
      coinSymbol: category !== 'clan-activity' ? coin : undefined,
      volumeChange: Math.random() * 100 - 20,
      priceChange: Math.random() * 40 - 10,
      profitPercentage: category === 'arbitrage' ? parseFloat(percent) : undefined,
    },
  }
}

export function generateMockAnalysisFeed(count: number = 10): MarketAnalysisItem[] {
  const items: MarketAnalysisItem[] = []
  
  for (let i = 0; i < count; i++) {
    const item = generateAnalysisItem()
    item.timestamp = new Date(Date.now() - i * 30000)
    items.push(item)
  }
  
  return items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export function getLatestAnalysisItem(): MarketAnalysisItem {
  return generateAnalysisItem()
}
