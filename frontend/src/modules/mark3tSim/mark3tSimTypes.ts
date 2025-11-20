export type TradeType = 'buy' | 'sell'
export type TradeStatus = 'open' | 'closed' | 'liquidated'
export type AssetSource = 'arbscan' | 'coin-fisher' | 'market' | 'stak3z' | 'market-analysis'

export interface SimAsset {
  id: string
  symbol: string
  name: string
  currentPrice: number
  entryPrice?: number
  change24h: number
  volatility: 'low' | 'medium' | 'high' | 'extreme'
  sentiment: 'bullish' | 'bearish' | 'neutral'
  source: AssetSource
  volume24h: number
  marketCap: number
}

export interface VirtualTrade {
  id: string
  sessionId: string
  assetId: string
  assetSymbol: string
  assetName: string
  type: TradeType
  entryPrice: number
  currentPrice: number
  exitPrice?: number
  amount: number
  leverage: number
  timestamp: number
  closeTimestamp?: number
  status: TradeStatus
  unrealizedPnL: number
  realizedPnL?: number
  gasFee: number
  liquidationPrice: number
  riskLevel: 'low' | 'medium' | 'high' | 'extreme'
}

export interface VirtualPortfolio {
  sessionId: string
  userId: string
  balance: number
  initialBalance: number
  totalValue: number
  openTrades: VirtualTrade[]
  closedTrades: VirtualTrade[]
  unrealizedPnL: number
  realizedPnL: number
  totalPnL: number
  winRate: number
  tradeCount: number
}

export interface SimSession {
  id: string
  userId: string
  startTime: number
  endTime?: number
  initialBalance: number
  finalBalance?: number
  status: 'active' | 'completed' | 'abandoned'
  performance?: SimPerformance
}

export interface SimPerformance {
  sessionId: string
  totalProfit: number
  profitPercentage: number
  winningTrades: number
  losingTrades: number
  totalTrades: number
  winRate: number
  bestTrade: VirtualTrade | null
  worstTrade: VirtualTrade | null
  volumeTraded: number
  accuracy: number
  sessionScore: number
  casualScoreEarned: number
  clanContribution: number
  averageHoldTime: number
  maxDrawdown: number
  sharpeRatio: number
}

export interface ProjectionData {
  pricePoints: number[]
  timePoints: number[]
  profitLoss: number[]
  riskZones: { start: number; end: number; level: 'safe' | 'caution' | 'danger' }[]
}

export interface SimMarketEvent {
  id: string
  type: 'whale-buy' | 'profit-cluster' | 'sentiment-rally' | 'training-surge' | 'liquidity-squeeze'
  title: string
  description: string
  assetSymbol?: string
  impact: 'low' | 'medium' | 'high'
  timestamp: number
  clanName?: string
}
