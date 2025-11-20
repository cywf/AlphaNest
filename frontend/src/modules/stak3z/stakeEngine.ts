import type { Pool, StakePosition, TransactionRecord, PoolHistoricalData, LiquidityFlow } from './stakeTypes'
import { generateMockPools, getMockPoolById } from './mockStakeFeed'

class StakeEngine {
  private pools: Pool[] = []
  private userPositions: Map<string, StakePosition[]> = new Map()
  private transactions: TransactionRecord[] = []

  constructor() {
    this.pools = generateMockPools()
  }

  getPools(): Pool[] {
    return this.pools
  }

  getPoolDetails(poolId: string): Pool | undefined {
    return this.pools.find(pool => pool.id === poolId)
  }

  getPoolHistoricalData(poolId: string, days: number = 30): PoolHistoricalData[] {
    const data: PoolHistoricalData[] = []
    const pool = this.getPoolDetails(poolId)
    
    if (!pool) return data

    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      const tvlVariation = (Math.random() - 0.5) * 0.1
      const apyVariation = (Math.random() - 0.5) * 0.05
      
      data.push({
        date,
        tvl: pool.tvl * (1 + tvlVariation),
        apy: pool.apy.total * (1 + apyVariation),
        volume: pool.volume24h * (Math.random() * 0.5 + 0.75),
      })
    }
    
    return data
  }

  getLiquidityFlow(poolId: string, hours: number = 24): LiquidityFlow[] {
    const data: LiquidityFlow[] = []
    
    for (let i = hours; i >= 0; i--) {
      const timestamp = new Date()
      timestamp.setHours(timestamp.getHours() - i)
      
      const inflow = Math.random() * 100000
      const outflow = Math.random() * 80000
      
      data.push({
        timestamp,
        inflow,
        outflow,
        netFlow: inflow - outflow,
      })
    }
    
    return data
  }

  async stake(poolId: string, amount: string, userAddress: string): Promise<TransactionRecord> {
    const pool = this.getPoolDetails(poolId)
    
    if (!pool) {
      throw new Error('Pool not found')
    }

    const tx: TransactionRecord = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'stake',
      poolId,
      amount,
      txHash: `0x${Math.random().toString(36).substr(2, 64)}`,
      timestamp: new Date(),
      status: 'pending',
    }

    this.transactions.push(tx)

    setTimeout(() => {
      tx.status = 'confirmed'
      
      const position: StakePosition = {
        id: `pos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        poolId,
        userId: userAddress,
        amount,
        stakedAt: new Date(),
        pendingRewards: '0',
        currentValue: amount,
        profitLoss: 0,
      }

      const userPos = this.userPositions.get(userAddress) || []
      userPos.push(position)
      this.userPositions.set(userAddress, userPos)
    }, 2000)

    return tx
  }

  async unstake(poolId: string, amount: string, userAddress: string): Promise<TransactionRecord> {
    const pool = this.getPoolDetails(poolId)
    
    if (!pool) {
      throw new Error('Pool not found')
    }

    const tx: TransactionRecord = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'unstake',
      poolId,
      amount,
      txHash: `0x${Math.random().toString(36).substr(2, 64)}`,
      timestamp: new Date(),
      status: 'pending',
    }

    this.transactions.push(tx)

    setTimeout(() => {
      tx.status = 'confirmed'
      
      const userPos = this.userPositions.get(userAddress) || []
      const positionIndex = userPos.findIndex(pos => pos.poolId === poolId)
      
      if (positionIndex !== -1) {
        const amountNum = parseFloat(amount)
        const currentAmount = parseFloat(userPos[positionIndex].amount)
        
        if (amountNum >= currentAmount) {
          userPos.splice(positionIndex, 1)
        } else {
          userPos[positionIndex].amount = (currentAmount - amountNum).toString()
        }
        
        this.userPositions.set(userAddress, userPos)
      }
    }, 2000)

    return tx
  }

  async claimRewards(poolId: string, userAddress: string): Promise<TransactionRecord> {
    const pool = this.getPoolDetails(poolId)
    
    if (!pool) {
      throw new Error('Pool not found')
    }

    const userPos = this.userPositions.get(userAddress) || []
    const position = userPos.find(pos => pos.poolId === poolId)
    
    if (!position) {
      throw new Error('No position found')
    }

    const tx: TransactionRecord = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'claim',
      poolId,
      amount: position.pendingRewards,
      txHash: `0x${Math.random().toString(36).substr(2, 64)}`,
      timestamp: new Date(),
      status: 'pending',
    }

    this.transactions.push(tx)

    setTimeout(() => {
      tx.status = 'confirmed'
      position.pendingRewards = '0'
      position.lastClaimAt = new Date()
    }, 2000)

    return tx
  }

  getUserPositions(userAddress: string): StakePosition[] {
    return this.userPositions.get(userAddress) || []
  }

  getUserTransactions(userAddress: string): TransactionRecord[] {
    const positions = this.getUserPositions(userAddress)
    const poolIds = new Set(positions.map(pos => pos.poolId))
    
    return this.transactions.filter(tx => poolIds.has(tx.poolId))
  }

  calculatePendingRewards(position: StakePosition): string {
    const pool = this.getPoolDetails(position.poolId)
    
    if (!pool) return '0'

    const stakedDuration = Date.now() - position.stakedAt.getTime()
    const daysStaked = stakedDuration / (1000 * 60 * 60 * 24)
    const stakedAmount = parseFloat(position.amount)
    
    const annualReward = stakedAmount * (pool.apy.total / 100)
    const dailyReward = annualReward / 365
    const pendingReward = dailyReward * daysStaked
    
    return pendingReward.toFixed(6)
  }

  async approveToken(tokenAddress: string, spenderAddress: string, amount: string): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const txHash = `0x${Math.random().toString(36).substr(2, 64)}`
        resolve(txHash)
      }, 1500)
    })
  }
}

export const stakeEngine = new StakeEngine()
