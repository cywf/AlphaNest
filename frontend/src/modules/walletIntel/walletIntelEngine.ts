import type { 
  ScamWallet, 
  WalletRiskLevel, 
  WalletRiskTag,
  SuspiciousTransaction,
  ConnectedWallet,
  TokenInvolvement,
  BehaviorMetrics,
  TransactionPattern,
  WalletCluster
} from './walletIntelTypes'
import { clamp } from '@/lib/format'

const WALLET_LABELS = [
  'Entity-14C Orion Hydra Cluster',
  'Shadow Nexus Prime',
  'Phantom Collective Alpha',
  'Dark Pool Operator-7X',
  'Ghost Protocol Network',
  'Vortex Syndicate Unit',
  'Eclipse Cartel Node',
  'Nebula Scam Ring',
  'Abyss Protocol Handler',
  'Crypto Phantom Squad',
  'Digital Shadow Consortium',
  'Black Hole Collective',
  'Rogue Network Cell-9',
  'Chaos Protocol Unit',
  'Void Operator Matrix',
]

const CLUSTER_NAMES = [
  'Hydra Network',
  'Phoenix Cartel',
  'Shadow Syndicate',
  'Eclipse Ring',
  'Vortex Cluster',
  'Nebula Collective',
]

function generateWalletAddress(): string {
  return '0x' + Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
}

function generateTransactionHash(): string {
  return '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
}

function generateSuspiciousTransactions(count: number, walletAddress: string): SuspiciousTransaction[] {
  const transactions: SuspiciousTransaction[] = []
  const now = new Date()
  
  const flagReasons = [
    'Coordinated dump with cluster members',
    'Liquidity drain detected',
    'Token siphoning pattern',
    'Mixer usage detected',
    'Rapid sell-off after pump',
    'Honeypot contract interaction',
    'Wash trading pattern',
    'Suspicious timing correlation',
    'Large transfer to anonymous wallet',
    'Contract ownership manipulation',
  ]
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000)
    const isFrom = Math.random() > 0.5
    
    transactions.push({
      hash: generateTransactionHash(),
      timestamp,
      from: isFrom ? walletAddress : generateWalletAddress(),
      to: isFrom ? generateWalletAddress() : walletAddress,
      value: Math.floor(1000 + Math.random() * 500000),
      token: ['ETH', 'USDT', 'SCAM', 'RUG', 'FAKE'][Math.floor(Math.random() * 5)],
      flagReason: flagReasons[Math.floor(Math.random() * flagReasons.length)],
      severity: (['low', 'medium', 'high', 'critical'] as const)[Math.floor(Math.random() * 4)],
    })
  }
  
  return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

function generateConnectedWallets(count: number): ConnectedWallet[] {
  const wallets: ConnectedWallet[] = []
  
  for (let i = 0; i < count; i++) {
    const relationship = (['direct', 'indirect', 'cluster'] as const)[Math.floor(Math.random() * 3)]
    const connectionStrength = relationship === 'direct' ? 70 + Math.random() * 30 
      : relationship === 'cluster' ? 50 + Math.random() * 30 
      : 20 + Math.random() * 30
    
    wallets.push({
      address: generateWalletAddress(),
      connectionStrength,
      transactionCount: Math.floor(5 + Math.random() * 200),
      relationship,
      scamScore: Math.floor(30 + Math.random() * 70),
    })
  }
  
  return wallets.sort((a, b) => b.connectionStrength - a.connectionStrength)
}

function generateTokenInvolvements(count: number): TokenInvolvement[] {
  const tokens: TokenInvolvement[] = []
  const now = new Date()
  
  const scamTokens = [
    { name: 'SafeMoonV3', symbol: 'SAFEV3' },
    { name: 'SquidGame', symbol: 'SQUID' },
    { name: 'TitanToken', symbol: 'TITAN' },
    { name: 'MetaFloki', symbol: 'MFLOKI' },
    { name: 'RugPull Finance', symbol: 'RUG' },
  ]
  
  for (let i = 0; i < Math.min(count, scamTokens.length); i++) {
    const token = scamTokens[i]
    const role = (['deployer', 'early_holder', 'dumper', 'victim'] as const)[Math.floor(Math.random() * 4)]
    
    tokens.push({
      tokenName: token.name,
      tokenSymbol: token.symbol,
      contractAddress: generateWalletAddress(),
      firstInteraction: new Date(now.getTime() - Math.random() * 180 * 24 * 60 * 60 * 1000),
      scamScore: Math.floor(60 + Math.random() * 40),
      role,
      victimCount: role === 'deployer' ? Math.floor(100 + Math.random() * 2000) : undefined,
    })
  }
  
  return tokens.sort((a, b) => b.scamScore - a.scamScore)
}

function generateBehaviorMetrics(scamScore: number): BehaviorMetrics {
  const factor = scamScore / 100
  
  return {
    burstActivityScore: clamp(Math.floor(30 + Math.random() * 70 * factor), 0, 100),
    launderingLikelihoodScore: clamp(Math.floor(20 + Math.random() * 80 * factor), 0, 100),
    timingCorrelationScore: clamp(Math.floor(40 + Math.random() * 60 * factor), 0, 100),
    mixerUsageScore: clamp(Math.floor(10 + Math.random() * 90 * factor), 0, 100),
  }
}

function generateCluster(scamScore: number): WalletCluster | undefined {
  if (Math.random() > 0.6) {
    return {
      id: `cluster-${Math.random().toString(36).substring(7)}`,
      name: CLUSTER_NAMES[Math.floor(Math.random() * CLUSTER_NAMES.length)],
      memberCount: Math.floor(5 + Math.random() * 50),
      totalScamScore: Math.floor(scamScore * (0.8 + Math.random() * 0.4)),
      coordinationScore: Math.floor(60 + Math.random() * 40),
    }
  }
  return undefined
}

function calculateWalletScore(
  rugPulls: number,
  connections: number,
  transactionCount: number,
  patterns: TransactionPattern[]
): number {
  let score = 0
  
  score += Math.min(40, rugPulls * 15)
  
  score += Math.min(25, connections * 2)
  
  score += Math.min(15, (transactionCount / 100) * 10)
  
  score += patterns.length * 5
  
  if (patterns.includes('mixer_usage')) score += 10
  if (patterns.includes('coordinated_timing')) score += 8
  
  return clamp(score, 0, 100)
}

function getRiskLevel(score: number): WalletRiskLevel {
  if (score >= 85) return 'critical'
  if (score >= 65) return 'high'
  if (score >= 40) return 'medium'
  return 'low'
}

function getRiskTags(score: number, rugPulls: number, patterns: TransactionPattern[]): WalletRiskTag[] {
  const tags: WalletRiskTag[] = []
  
  if (score >= 85) tags.push('Confirmed Scammer')
  if (rugPulls >= 3) tags.push('Rug Pull Operator')
  if (patterns.includes('mixer_usage')) tags.push('Mixer User')
  if (patterns.includes('wash_trading')) tags.push('Wash Trader')
  if (patterns.includes('siphoning')) tags.push('Token Siphoner')
  if (patterns.includes('coordinated_timing')) tags.push('Coordinated Dumper')
  if (rugPulls >= 1 && rugPulls < 3) tags.push('Suspicious Actor')
  
  if (tags.length === 0) tags.push('Suspicious Actor')
  
  return tags
}

export function generateScamWallets(count: number = 20): ScamWallet[] {
  const wallets: ScamWallet[] = []
  const now = new Date()
  
  for (let i = 0; i < Math.min(count, WALLET_LABELS.length); i++) {
    const rugPulls = Math.floor(Math.random() * 8)
    const flaggedConnections = Math.floor(5 + Math.random() * 50)
    const transactionCount = Math.floor(100 + Math.random() * 10000)
    
    const patterns: TransactionPattern[] = []
    const allPatterns: TransactionPattern[] = [
      'burst_activity',
      'coordinated_timing',
      'mixer_usage',
      'rapid_dumps',
      'siphoning',
      'wash_trading',
    ]
    
    const numPatterns = 1 + Math.floor(Math.random() * 4)
    for (let j = 0; j < numPatterns; j++) {
      const pattern = allPatterns[Math.floor(Math.random() * allPatterns.length)]
      if (!patterns.includes(pattern)) patterns.push(pattern)
    }
    
    const scamScore = calculateWalletScore(rugPulls, flaggedConnections, transactionCount, patterns)
    const riskLevel = getRiskLevel(scamScore)
    const riskTags = getRiskTags(scamScore, rugPulls, patterns)
    
    const address = generateWalletAddress()
    const firstDetected = new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000)
    const lastSeenActivity = new Date(firstDetected.getTime() + Math.random() * (now.getTime() - firstDetected.getTime()))
    
    const numTransactions = Math.floor(5 + (scamScore / 100) * 20)
    const suspiciousTransactions = generateSuspiciousTransactions(numTransactions, address)
    
    const numConnections = Math.floor(5 + (scamScore / 100) * 25)
    const connectedWallets = generateConnectedWallets(numConnections)
    
    const numTokens = Math.floor(2 + (scamScore / 100) * 5)
    const tokenInvolvements = generateTokenInvolvements(numTokens)
    
    const behaviorMetrics = generateBehaviorMetrics(scamScore)
    const cluster = generateCluster(scamScore)
    
    wallets.push({
      address,
      label: WALLET_LABELS[i],
      scamScore,
      riskLevel,
      riskTags,
      numberOfRugPulls: rugPulls,
      flaggedConnections,
      lastSeenActivity,
      firstDetected,
      totalValue: Math.floor(10000 + Math.random() * 5000000),
      transactionCount,
      suspiciousTransactions,
      connectedWallets,
      tokenInvolvements,
      behaviorMetrics,
      cluster,
      detectionPatterns: patterns,
    })
  }
  
  return wallets.sort((a, b) => b.scamScore - a.scamScore)
}

export function updateWalletScore(wallet: ScamWallet): ScamWallet {
  const scoreChange = (Math.random() - 0.5) * 3
  const newScore = clamp(wallet.scamScore + scoreChange, 0, 100)
  
  return {
    ...wallet,
    scamScore: newScore,
    riskLevel: getRiskLevel(newScore),
    lastSeenActivity: new Date(),
  }
}
