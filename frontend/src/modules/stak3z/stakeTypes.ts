export type RiskTier = 'low' | 'medium' | 'high'
export type PoolStatus = 'hot' | 'stable' | 'high-risk' | 'trending'
export type Chain = 'ethereum' | 'polygon' | 'bsc' | 'arbitrum' | 'optimism' | 'avalanche'

export interface Token {
  symbol: string
  name: string
  address: string
  decimals: number
  logoUrl?: string
}

export interface PoolComposition {
  token: Token
  weight: number
  balance: string
}

export interface APYBreakdown {
  base: number
  boosted: number
  compounding: number
  total: number
}

export interface Pool {
  id: string
  name: string
  tokens: Token[]
  composition: PoolComposition[]
  apy: APYBreakdown
  tvl: number
  riskTier: RiskTier
  chain: Chain
  status: PoolStatus
  impermanentLossRisk: number
  rewardToken: Token
  lockPeriod?: number
  minStake?: number
  maxStake?: number
  createdAt: Date
  volume24h: number
  fees24h: number
  stakerCount: number
}

export interface StakePosition {
  id: string
  poolId: string
  userId: string
  amount: string
  stakedAt: Date
  lastClaimAt?: Date
  pendingRewards: string
  currentValue: string
  profitLoss: number
}

export interface TransactionRecord {
  id: string
  type: 'stake' | 'unstake' | 'claim'
  poolId: string
  amount: string
  txHash: string
  timestamp: Date
  status: 'pending' | 'confirmed' | 'failed'
}

export interface PoolFilters {
  chains: Chain[]
  apyRange: [number, number]
  riskTiers: RiskTier[]
  poolType: 'stable' | 'volatile' | 'all'
  showTrending: boolean
  searchQuery: string
}

export interface StakeFormData {
  poolId: string
  amount: string
  lockPeriod?: number
}

export interface LiquidityFlow {
  timestamp: Date
  inflow: number
  outflow: number
  netFlow: number
}

export interface PoolHistoricalData {
  date: Date
  tvl: number
  apy: number
  volume: number
}
