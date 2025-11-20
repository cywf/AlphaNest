export type AnalysisCategory =
  | 'market-trend'
  | 'osint-alert'
  | 'whale-movement'
  | 'nft-surge'
  | 'arbitrage'
  | 'scam-alert'
  | 'clan-activity'
  | 'liquidity-pool'
  | 'sim-trading'

export interface MarketAnalysisItem {
  id: string
  timestamp: Date
  category: AnalysisCategory
  title: string
  summary: string
  tags: string[]
  severity?: 'low' | 'medium' | 'high' | 'critical'
  deepLink?: {
    type: 'market' | 'arbitrage' | 'wallet' | 'coin' | 'clan'
    id: string
    label: string
  }
  metadata?: {
    coinSymbol?: string
    walletAddress?: string
    nftCollection?: string
    volumeChange?: number
    priceChange?: number
    profitPercentage?: number
  }
}

export interface MarketAnalysisFilters {
  category?: AnalysisCategory[]
  severity?: ('low' | 'medium' | 'high' | 'critical')[]
  tags?: string[]
  searchTerm?: string
}
