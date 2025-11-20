export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export type DetectionSource = 
  | 'reddit'
  | 'twitter' 
  | 'telegram'
  | 'discord'
  | 'darknet'
  | 'blockchain_analysis'
  | 'community_report'

export type ScamType = 
  | 'rug_pull'
  | 'honeypot'
  | 'pump_dump'
  | 'fake_team'
  | 'clone_scam'
  | 'phishing'
  | 'wash_trading'

export type SuspiciousWallet = {
  address: string
  transactionCount: number
  totalValue: number
  firstSeen: Date
  lastSeen: Date
  flagReason: string
}

export type DetectionEvent = {
  source: DetectionSource
  timestamp: Date
  confidence: number
  evidence: string
}

export type NaughtyCoin = {
  id: string
  tokenName: string
  symbol: string
  contractAddress: string
  scamAlertScore: number
  riskLevel: RiskLevel
  scamTypes: ScamType[]
  detectionSources: DetectionSource[]
  detectionEvents: DetectionEvent[]
  suspiciousWallets: SuspiciousWallet[]
  victimCount: number
  totalLoss: number
  firstDetected: Date
  lastUpdated: Date
  description: string
  isActive: boolean
}

export type SortField = 'scamAlertScore' | 'victimCount' | 'totalLoss' | 'firstDetected'
export type SortDirection = 'asc' | 'desc'

export type NaughtyCoinFilters = {
  riskLevel?: RiskLevel[]
  minScore?: number
  maxScore?: number
  scamTypes?: ScamType[]
  recentlyDetected?: boolean
  isActive?: boolean
}
