export type RiskLevel = 'low' | 'medium' | 'high' | 'extreme'
export type HypeLevel = 'quiet' | 'growing' | 'trending' | 'viral'

export type SourceLink = {
  type: 'twitter' | 'telegram' | 'discord' | 'website' | 'github'
  url: string
  followers?: number
  activity?: 'low' | 'medium' | 'high'
}

export type NewCoin = {
  id: string
  coinName: string
  symbol: string
  launchDate: Date
  daysUntilLaunch: number
  sentimentScore: number
  sourceLinks: SourceLink[]
  riskLevel: RiskLevel
  hypeLevel: HypeLevel
  description: string
  marketCap?: number
  discoveredAt: Date
  tags: string[]
}

export type SocialGraphNode = {
  id: string
  name: string
  type: 'influencer' | 'community' | 'developer' | 'investor'
  connections: number
  influence: number
}

export type LinkAnalysisGraph = {
  nodes: SocialGraphNode[]
  coinId: string
  totalReach: number
  viralityScore: number
}

export type NetworkMetrics = {
  totalNodes: number
  byType: {
    influencer: number
    community: number
    developer: number
    investor: number
  }
  averageConnections: number
  averageInfluence: number
}

export type LaunchWindow = '24h' | '7d' | '30d' | 'all'
