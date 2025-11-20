import type { NewCoin, RiskLevel, HypeLevel } from './types'
import { clamp } from '@/lib/format'

const COIN_NAMES = [
  { name: 'NeuralNet AI', symbol: 'NNET', tags: ['AI', 'Machine Learning', 'DeFi'] },
  { name: 'QuantumChain', symbol: 'QNTM', tags: ['Quantum', 'Security', 'Layer-1'] },
  { name: 'MetaSphere', symbol: 'META', tags: ['Metaverse', 'Gaming', 'NFT'] },
  { name: 'CyberVault', symbol: 'CVLT', tags: ['Privacy', 'Security', 'Storage'] },
  { name: 'NeonSwap', symbol: 'NEON', tags: ['DEX', 'DeFi', 'AMM'] },
  { name: 'AstroDAO', symbol: 'ASTRO', tags: ['DAO', 'Governance', 'Community'] },
  { name: 'VortexChain', symbol: 'VRTX', tags: ['Layer-1', 'Scalability', 'Fast'] },
  { name: 'EchoToken', symbol: 'ECHO', tags: ['Social', 'Communication', 'Web3'] },
  { name: 'PulseCore', symbol: 'PLSE', tags: ['Infrastructure', 'Staking', 'PoS'] },
  { name: 'ZeroGravity', symbol: 'ZERO', tags: ['Gaming', 'VR', 'Metaverse'] },
]

function generateSentimentScore(): number {
  const base = Math.random()
  let score = 0
  
  if (base > 0.8) {
    score = 75 + Math.random() * 25
  } else if (base > 0.5) {
    score = 50 + Math.random() * 25
  } else if (base > 0.2) {
    score = 25 + Math.random() * 25
  } else {
    score = Math.random() * 25
  }
  
  return clamp(score, 0, 100)
}

function getRiskLevel(sentimentScore: number, daysUntilLaunch: number): RiskLevel {
  if (sentimentScore < 30 || daysUntilLaunch < 1) return 'extreme'
  if (sentimentScore < 50 || daysUntilLaunch < 3) return 'high'
  if (sentimentScore < 70) return 'medium'
  return 'low'
}

function getHypeLevel(sentimentScore: number): HypeLevel {
  if (sentimentScore >= 80) return 'viral'
  if (sentimentScore >= 60) return 'trending'
  if (sentimentScore >= 40) return 'growing'
  return 'quiet'
}

function generateSourceLinks(): Array<{
  type: 'twitter' | 'telegram' | 'discord' | 'website' | 'github'
  url: string
  followers?: number
  activity: 'low' | 'medium' | 'high'
}> {
  const types: Array<'twitter' | 'telegram' | 'discord' | 'website' | 'github'> = [
    'twitter',
    'telegram',
    'discord',
    'website',
    'github',
  ]
  
  const numLinks = 2 + Math.floor(Math.random() * 3)
  const selectedTypes = types.sort(() => Math.random() - 0.5).slice(0, numLinks)
  
  return selectedTypes.map((type) => ({
    type,
    url: `https://${type}.com/${Math.random().toString(36).substring(7)}`,
    followers: type === 'twitter' ? Math.floor(Math.random() * 100000) : undefined,
    activity: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)],
  }))
}

export function generateNewCoins(count: number = 10): NewCoin[] {
  const coins: NewCoin[] = []
  const now = new Date()
  
  for (let i = 0; i < Math.min(count, COIN_NAMES.length); i++) {
    const coinInfo = COIN_NAMES[i]
    const daysUntilLaunch = Math.floor(Math.random() * 45)
    const launchDate = new Date(now.getTime() + daysUntilLaunch * 24 * 60 * 60 * 1000)
    const sentimentScore = generateSentimentScore()
    
    coins.push({
      id: `coin-${i}-${Date.now()}`,
      coinName: coinInfo.name,
      symbol: coinInfo.symbol,
      launchDate,
      daysUntilLaunch,
      sentimentScore,
      sourceLinks: generateSourceLinks(),
      riskLevel: getRiskLevel(sentimentScore, daysUntilLaunch),
      hypeLevel: getHypeLevel(sentimentScore),
      description: `Revolutionary ${coinInfo.tags[0]} project with innovative technology`,
      marketCap: daysUntilLaunch === 0 ? Math.floor(Math.random() * 10000000) : undefined,
      discoveredAt: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      tags: coinInfo.tags,
    })
  }
  
  return coins.sort((a, b) => b.sentimentScore - a.sentimentScore)
}

export function updateCoinSentiment(coin: NewCoin): NewCoin {
  const change = (Math.random() - 0.5) * 10
  const newScore = clamp(coin.sentimentScore + change, 0, 100)
  
  return {
    ...coin,
    sentimentScore: newScore,
    hypeLevel: getHypeLevel(newScore),
    riskLevel: getRiskLevel(newScore, coin.daysUntilLaunch),
  }
}
