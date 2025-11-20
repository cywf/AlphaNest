import type { NaughtyCoin, RiskLevel, ScamType, DetectionSource, DetectionEvent, SuspiciousWallet } from './naughtyCoinTypes'
import { clamp } from '@/lib/format'

const SCAM_TOKEN_NAMES = [
  { name: 'SafeMoonV3', symbol: 'SAFEV3' },
  { name: 'ElonDogeCoin', symbol: 'ELDOG' },
  { name: 'MetaFloki', symbol: 'MFLOKI' },
  { name: 'TitanToken', symbol: 'TITAN' },
  { name: 'SquidGame', symbol: 'SQUID' },
  { name: 'SaveTheKids', symbol: 'KIDS' },
  { name: 'MoonRocket', symbol: 'MOONR' },
  { name: 'ShitaInu', symbol: 'SHITA' },
  { name: 'RugPull Finance', symbol: 'RUG' },
  { name: 'PonziDAO', symbol: 'PONZI' },
  { name: 'ScamSwap', symbol: 'SCAM' },
  { name: 'FakeBTC', symbol: 'FBTC' },
  { name: 'HoneypotETH', symbol: 'HETH' },
  { name: 'PyramidChain', symbol: 'PYRA' },
  { name: 'DumpsterFire', symbol: 'DUMP' },
]

const SCAM_TYPES: ScamType[] = [
  'rug_pull',
  'honeypot',
  'pump_dump',
  'fake_team',
  'clone_scam',
  'phishing',
  'wash_trading',
]

const DETECTION_SOURCES: DetectionSource[] = [
  'reddit',
  'twitter',
  'telegram',
  'discord',
  'darknet',
  'blockchain_analysis',
  'community_report',
]

function generateWalletAddress(): string {
  return '0x' + Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
}

function generateContractAddress(): string {
  return '0x' + Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
}

function generateSuspiciousWallets(count: number, scamScore: number): SuspiciousWallet[] {
  const wallets: SuspiciousWallet[] = []
  const now = new Date()
  
  for (let i = 0; i < count; i++) {
    const firstSeen = new Date(now.getTime() - Math.random() * 180 * 24 * 60 * 60 * 1000)
    const lastSeen = new Date(firstSeen.getTime() + Math.random() * (now.getTime() - firstSeen.getTime()))
    
    const reasons = [
      'Multiple rug pull participations',
      'Coordinated dump timing',
      'Wash trading detected',
      'Token siphoning behavior',
      'Linked to known scammer',
      'Abnormal transaction patterns',
      'Mixer usage detected',
      'Honeypot contract deployer',
    ]
    
    wallets.push({
      address: generateWalletAddress(),
      transactionCount: Math.floor(10 + Math.random() * 1000 * (scamScore / 100)),
      totalValue: Math.floor(1000 + Math.random() * 5000000 * (scamScore / 100)),
      firstSeen,
      lastSeen,
      flagReason: reasons[Math.floor(Math.random() * reasons.length)],
    })
  }
  
  return wallets
}

function generateDetectionEvents(count: number, scamScore: number): DetectionEvent[] {
  const events: DetectionEvent[] = []
  const now = new Date()
  
  const evidenceTemplates = [
    'Liquidity removed from pool',
    'Contract ownership renounced after drain',
    'Coordinated sell-off detected',
    'Team wallet dumped 100% holdings',
    'Social media accounts deleted',
    'Website taken offline',
    'Multiple victim reports',
    'Blacklisted by security scanner',
    'Honeypot function found in contract',
    'Fake audit certificate discovered',
  ]
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - Math.random() * 60 * 24 * 60 * 60 * 1000)
    const source = DETECTION_SOURCES[Math.floor(Math.random() * DETECTION_SOURCES.length)]
    const confidence = 50 + Math.random() * 50 * (scamScore / 100)
    
    events.push({
      source,
      timestamp,
      confidence: clamp(confidence, 0, 100),
      evidence: evidenceTemplates[Math.floor(Math.random() * evidenceTemplates.length)],
    })
  }
  
  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

function calculateScamAlertScore(
  scamTypes: ScamType[],
  detectionSources: DetectionSource[],
  victimCount: number,
  totalLoss: number
): number {
  let score = 0
  
  score += scamTypes.length * 12
  
  score += detectionSources.length * 8
  
  score += Math.min(30, victimCount / 10)
  
  score += Math.min(20, totalLoss / 100000)
  
  if (detectionSources.includes('blockchain_analysis')) score += 10
  if (detectionSources.includes('darknet')) score += 15
  
  if (scamTypes.includes('rug_pull')) score += 10
  if (scamTypes.includes('honeypot')) score += 8
  
  return clamp(score, 0, 100)
}

function getRiskLevel(scamScore: number): RiskLevel {
  if (scamScore >= 90) return 'critical'
  if (scamScore >= 60) return 'high'
  if (scamScore >= 30) return 'medium'
  return 'low'
}

export function generateNaughtyCoins(count: number = 15): NaughtyCoin[] {
  const coins: NaughtyCoin[] = []
  const now = new Date()
  
  for (let i = 0; i < Math.min(count, SCAM_TOKEN_NAMES.length); i++) {
    const tokenInfo = SCAM_TOKEN_NAMES[i]
    
    const numScamTypes = 1 + Math.floor(Math.random() * 3)
    const scamTypes = SCAM_TYPES
      .sort(() => Math.random() - 0.5)
      .slice(0, numScamTypes)
    
    const numSources = 2 + Math.floor(Math.random() * 5)
    const detectionSources = DETECTION_SOURCES
      .sort(() => Math.random() - 0.5)
      .slice(0, numSources)
    
    const victimCount = Math.floor(10 + Math.random() * 5000)
    const totalLoss = Math.floor(10000 + Math.random() * 10000000)
    
    const scamAlertScore = calculateScamAlertScore(
      scamTypes,
      detectionSources,
      victimCount,
      totalLoss
    )
    
    const riskLevel = getRiskLevel(scamAlertScore)
    
    const numWallets = Math.floor(3 + (scamAlertScore / 100) * 15)
    const suspiciousWallets = generateSuspiciousWallets(numWallets, scamAlertScore)
    
    const numEvents = Math.floor(3 + (scamAlertScore / 100) * 10)
    const detectionEvents = generateDetectionEvents(numEvents, scamAlertScore)
    
    const firstDetected = new Date(now.getTime() - Math.random() * 120 * 24 * 60 * 60 * 1000)
    const lastUpdated = new Date(firstDetected.getTime() + Math.random() * (now.getTime() - firstDetected.getTime()))
    
    const isActive = Math.random() > 0.3
    
    coins.push({
      id: `naughty-${i}-${Date.now()}`,
      tokenName: tokenInfo.name,
      symbol: tokenInfo.symbol,
      contractAddress: generateContractAddress(),
      scamAlertScore,
      riskLevel,
      scamTypes,
      detectionSources,
      detectionEvents,
      suspiciousWallets,
      victimCount,
      totalLoss,
      firstDetected,
      lastUpdated,
      description: `Detected ${scamTypes[0].replace('_', ' ')} scheme with ${detectionSources.length} independent sources confirming suspicious activity.`,
      isActive,
    })
  }
  
  return coins.sort((a, b) => b.scamAlertScore - a.scamAlertScore)
}

export function updateNaughtyCoin(coin: NaughtyCoin): NaughtyCoin {
  const scoreChange = (Math.random() - 0.5) * 5
  const newScore = clamp(coin.scamAlertScore + scoreChange, 0, 100)
  
  const newVictimCount = coin.victimCount + Math.floor(Math.random() * 10)
  const newTotalLoss = coin.totalLoss + Math.floor(Math.random() * 50000)
  
  return {
    ...coin,
    scamAlertScore: newScore,
    riskLevel: getRiskLevel(newScore),
    victimCount: newVictimCount,
    totalLoss: newTotalLoss,
    lastUpdated: new Date(),
  }
}
