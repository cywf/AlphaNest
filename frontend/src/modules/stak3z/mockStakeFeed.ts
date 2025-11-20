import type { Pool, Token, PoolComposition, APYBreakdown, Chain, RiskTier, PoolStatus } from './stakeTypes'

const CHAINS: Chain[] = ['ethereum', 'polygon', 'bsc', 'arbitrum', 'optimism', 'avalanche']

const TOKENS: Record<string, Token> = {
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    decimals: 6,
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether',
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    decimals: 6,
  },
  DAI: {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    decimals: 18,
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
  },
  WBTC: {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    decimals: 8,
  },
  MATIC: {
    symbol: 'MATIC',
    name: 'Polygon',
    address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
    decimals: 18,
  },
  LINK: {
    symbol: 'LINK',
    name: 'Chainlink',
    address: '0x514910771af9ca656af840dff83e8264ecf986ca',
    decimals: 18,
  },
  UNI: {
    symbol: 'UNI',
    name: 'Uniswap',
    address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    decimals: 18,
  },
  AAVE: {
    symbol: 'AAVE',
    name: 'Aave',
    address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    decimals: 18,
  },
  CRV: {
    symbol: 'CRV',
    name: 'Curve DAO',
    address: '0xd533a949740bb3306d119cc777fa900ba034cd52',
    decimals: 18,
  },
  PEPE: {
    symbol: 'PEPE',
    name: 'Pepe',
    address: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
    decimals: 18,
  },
  SHIB: {
    symbol: 'SHIB',
    name: 'Shiba Inu',
    address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
    decimals: 18,
  },
}

const REWARD_TOKEN: Token = {
  symbol: 'STK3',
  name: 'STAK3Z Token',
  address: '0x0000000000000000000000000000000000000000',
  decimals: 18,
}

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function generateAPY(riskTier: RiskTier): APYBreakdown {
  let baseRange: [number, number]
  
  switch (riskTier) {
    case 'low':
      baseRange = [3, 8]
      break
    case 'medium':
      baseRange = [8, 25]
      break
    case 'high':
      baseRange = [25, 120]
      break
  }
  
  const base = Math.random() * (baseRange[1] - baseRange[0]) + baseRange[0]
  const boosted = base * (Math.random() * 0.3 + 0.1)
  const compounding = (base + boosted) * (Math.random() * 0.15 + 0.05)
  const total = base + boosted + compounding
  
  return { base, boosted, compounding, total }
}

function generatePool(index: number): Pool {
  const poolTypes = [
    { tokens: ['USDC', 'USDT', 'DAI'], name: 'Stablecoin Trio', risk: 'low' as RiskTier },
    { tokens: ['USDC', 'DAI'], name: 'Safe Harbor', risk: 'low' as RiskTier },
    { tokens: ['ETH', 'WBTC'], name: 'Blue Chip Pair', risk: 'medium' as RiskTier },
    { tokens: ['ETH', 'USDC'], name: 'ETH Liquidity', risk: 'medium' as RiskTier },
    { tokens: ['LINK', 'ETH'], name: 'Oracle Power', risk: 'medium' as RiskTier },
    { tokens: ['UNI', 'ETH'], name: 'DEX Native', risk: 'medium' as RiskTier },
    { tokens: ['AAVE', 'ETH'], name: 'DeFi Legends', risk: 'medium' as RiskTier },
    { tokens: ['MATIC', 'ETH'], name: 'L2 Bridge', risk: 'medium' as RiskTier },
    { tokens: ['PEPE', 'ETH'], name: 'Meme Madness', risk: 'high' as RiskTier },
    { tokens: ['SHIB', 'ETH'], name: 'Dog Money', risk: 'high' as RiskTier },
    { tokens: ['CRV', 'ETH'], name: 'Curve Master', risk: 'medium' as RiskTier },
    { tokens: ['USDC', 'USDT', 'DAI', 'ETH'], name: 'Diversified Basket', risk: 'low' as RiskTier },
    { tokens: ['WBTC', 'ETH', 'USDC'], name: 'Institutional Mix', risk: 'medium' as RiskTier },
    { tokens: ['LINK', 'UNI', 'AAVE'], name: 'DeFi Triple', risk: 'high' as RiskTier },
    { tokens: ['PEPE', 'SHIB'], name: 'Pure Degen', risk: 'high' as RiskTier },
    { tokens: ['ETH', 'MATIC', 'LINK'], name: 'Infrastructure Play', risk: 'medium' as RiskTier },
    { tokens: ['DAI', 'USDC'], name: 'Stable Yield', risk: 'low' as RiskTier },
    { tokens: ['AAVE', 'CRV', 'UNI'], name: 'Protocol Basket', risk: 'high' as RiskTier },
    { tokens: ['WBTC', 'USDC'], name: 'BTC Backed', risk: 'low' as RiskTier },
    { tokens: ['ETH', 'USDT'], name: 'Volume King', risk: 'medium' as RiskTier },
  ]
  
  const poolType = poolTypes[index % poolTypes.length]
  const riskTier = poolType.risk
  const tokens = poolType.tokens.map(symbol => TOKENS[symbol])
  const chain = randomChoice(CHAINS)
  const apy = generateAPY(riskTier)
  
  const composition: PoolComposition[] = tokens.map((token, i) => ({
    token,
    weight: tokens.length === 2 ? 50 : (tokens.length === 3 ? 33.33 : 25),
    balance: (Math.random() * 1000000 + 100000).toFixed(2),
  }))
  
  const tvl = Math.random() * 50000000 + 500000
  const volume24h = tvl * (Math.random() * 0.3 + 0.05)
  const fees24h = volume24h * (Math.random() * 0.003 + 0.001)
  const stakerCount = Math.floor(Math.random() * 10000 + 100)
  
  const statuses: PoolStatus[] = ['hot', 'stable', 'high-risk', 'trending']
  let status: PoolStatus
  
  if (riskTier === 'high') {
    status = Math.random() > 0.5 ? 'high-risk' : 'trending'
  } else if (riskTier === 'low') {
    status = 'stable'
  } else {
    status = Math.random() > 0.6 ? 'hot' : 'stable'
  }
  
  const impermanentLossRisk = riskTier === 'low' ? Math.random() * 2 : 
                               riskTier === 'medium' ? Math.random() * 15 + 2 :
                               Math.random() * 50 + 15
  
  return {
    id: `pool-${index + 1}`,
    name: poolType.name,
    tokens,
    composition,
    apy,
    tvl,
    riskTier,
    chain,
    status,
    impermanentLossRisk,
    rewardToken: REWARD_TOKEN,
    lockPeriod: riskTier === 'high' ? undefined : Math.random() > 0.5 ? 7 : 30,
    minStake: riskTier === 'low' ? 100 : riskTier === 'medium' ? 50 : 10,
    maxStake: undefined,
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    volume24h,
    fees24h,
    stakerCount,
  }
}

export function generateMockPools(): Pool[] {
  return Array.from({ length: 20 }, (_, i) => generatePool(i))
}

export function getMockPoolById(poolId: string): Pool | undefined {
  const pools = generateMockPools()
  return pools.find(pool => pool.id === poolId)
}
