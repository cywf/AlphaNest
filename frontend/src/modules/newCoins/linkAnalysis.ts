import type { LinkAnalysisGraph, SocialGraphNode, NewCoin, NetworkMetrics } from './types'

const INFLUENCER_NAMES = [
  'CryptoKing', 'BlockchainQueen', 'DeFiGuru', 'NFTCollector',
  'MetaverseExplorer', 'TokenAnalyst', 'ChainHunter', 'CoinWhisperer'
]

const COMMUNITY_NAMES = [
  'CryptoManiacs', 'DeFi Degenerates', 'NFT Enthusiasts', 'Web3 Builders',
  'Blockchain Pioneers', 'Token Holders', 'DAO Members', 'Metaverse Citizens'
]

function generateInfluencers(count: number): SocialGraphNode[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `influencer-${i}`,
    name: INFLUENCER_NAMES[i % INFLUENCER_NAMES.length] + (i >= INFLUENCER_NAMES.length ? ` #${Math.floor(i / INFLUENCER_NAMES.length) + 1}` : ''),
    type: 'influencer' as const,
    connections: 1000 + Math.floor(Math.random() * 50000),
    influence: 60 + Math.floor(Math.random() * 40),
  }))
}

function generateCommunities(count: number): SocialGraphNode[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `community-${i}`,
    name: COMMUNITY_NAMES[i % COMMUNITY_NAMES.length] + (i >= COMMUNITY_NAMES.length ? ` #${Math.floor(i / COMMUNITY_NAMES.length) + 1}` : ''),
    type: 'community' as const,
    connections: 500 + Math.floor(Math.random() * 10000),
    influence: 30 + Math.floor(Math.random() * 50),
  }))
}

function generateDevelopers(count: number): SocialGraphNode[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `developer-${i}`,
    name: `DevTeam_${String.fromCharCode(65 + i)}`,
    type: 'developer' as const,
    connections: 200 + Math.floor(Math.random() * 5000),
    influence: 40 + Math.floor(Math.random() * 40),
  }))
}

function generateInvestors(count: number): SocialGraphNode[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `investor-${i}`,
    name: `VC_Fund_${i + 1}`,
    type: 'investor' as const,
    connections: 100 + Math.floor(Math.random() * 2000),
    influence: 50 + Math.floor(Math.random() * 50),
  }))
}

export function generateLinkAnalysis(coin: NewCoin): LinkAnalysisGraph {
  const sentimentFactor = coin.sentimentScore / 100
  const hypeFactor = coin.hypeLevel === 'viral' ? 1.5 : coin.hypeLevel === 'trending' ? 1.2 : coin.hypeLevel === 'growing' ? 0.8 : 0.5
  
  const baseNodes = Math.floor(5 + sentimentFactor * 10)
  const totalNodes = Math.floor(baseNodes * hypeFactor)
  
  const influencerCount = Math.floor(totalNodes * 0.3)
  const communityCount = Math.floor(totalNodes * 0.4)
  const developerCount = Math.floor(totalNodes * 0.2)
  const investorCount = Math.floor(totalNodes * 0.1)
  
  const nodes: SocialGraphNode[] = [
    ...generateInfluencers(influencerCount),
    ...generateCommunities(communityCount),
    ...generateDevelopers(developerCount),
    ...generateInvestors(investorCount),
  ]
  
  const totalReach = nodes.reduce((sum, node) => sum + node.connections, 0)
  const averageInfluence = nodes.length > 0 
    ? nodes.reduce((sum, node) => sum + node.influence, 0) / nodes.length 
    : 0
  const viralityScore = Math.min(100, (totalReach / 1000) * (averageInfluence / 50))
  
  return {
    nodes,
    coinId: coin.id,
    totalReach,
    viralityScore,
  }
}

export function calculateNetworkMetrics(graph: LinkAnalysisGraph): NetworkMetrics {
  const byType = {
    influencer: graph.nodes.filter(n => n.type === 'influencer').length,
    community: graph.nodes.filter(n => n.type === 'community').length,
    developer: graph.nodes.filter(n => n.type === 'developer').length,
    investor: graph.nodes.filter(n => n.type === 'investor').length,
  }
  
  const totalNodes = graph.nodes.length
  const averageConnections = totalNodes > 0
    ? graph.nodes.reduce((sum, n) => sum + n.connections, 0) / totalNodes
    : 0
  const averageInfluence = totalNodes > 0
    ? graph.nodes.reduce((sum, n) => sum + n.influence, 0) / totalNodes
    : 0
  
  return {
    totalNodes,
    byType,
    averageConnections,
    averageInfluence,
  }
}
