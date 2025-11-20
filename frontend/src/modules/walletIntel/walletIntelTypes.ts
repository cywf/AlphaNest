export type WalletRiskLevel = 'low' | 'medium' | 'high' | 'critical'

export type WalletRiskTag = 
  | 'Confirmed Scammer'
  | 'Rug Pull Operator'
  | 'Honeypot Deployer'
  | 'Wash Trader'
  | 'Mixer User'
  | 'Suspicious Actor'
  | 'Token Siphoner'
  | 'Coordinated Dumper'

export type TransactionPattern = 
  | 'burst_activity'
  | 'coordinated_timing'
  | 'mixer_usage'
  | 'rapid_dumps'
  | 'siphoning'
  | 'wash_trading'

export type SuspiciousTransaction = {
  hash: string
  timestamp: Date
  from: string
  to: string
  value: number
  token: string
  flagReason: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export type ConnectedWallet = {
  address: string
  connectionStrength: number
  transactionCount: number
  relationship: 'direct' | 'indirect' | 'cluster'
  scamScore: number
}

export type TokenInvolvement = {
  tokenName: string
  tokenSymbol: string
  contractAddress: string
  firstInteraction: Date
  scamScore: number
  role: 'deployer' | 'early_holder' | 'dumper' | 'victim'
  victimCount?: number
}

export type BehaviorMetrics = {
  burstActivityScore: number
  launderingLikelihoodScore: number
  timingCorrelationScore: number
  mixerUsageScore: number
}

export type WalletCluster = {
  id: string
  name: string
  memberCount: number
  totalScamScore: number
  coordinationScore: number
}

export type ScamWallet = {
  address: string
  label: string
  scamScore: number
  riskLevel: WalletRiskLevel
  riskTags: WalletRiskTag[]
  numberOfRugPulls: number
  flaggedConnections: number
  lastSeenActivity: Date
  firstDetected: Date
  totalValue: number
  transactionCount: number
  suspiciousTransactions: SuspiciousTransaction[]
  connectedWallets: ConnectedWallet[]
  tokenInvolvements: TokenInvolvement[]
  behaviorMetrics: BehaviorMetrics
  cluster?: WalletCluster
  detectionPatterns: TransactionPattern[]
}

export type WalletSortField = 
  | 'scamScore' 
  | 'numberOfRugPulls' 
  | 'flaggedConnections'
  | 'lastSeenActivity'
  | 'totalValue'

export type WalletSortDirection = 'asc' | 'desc'

export type WalletFilters = {
  riskLevel?: WalletRiskLevel[]
  minScore?: number
  maxScore?: number
  riskTags?: WalletRiskTag[]
  hasRugPulls?: boolean
}
