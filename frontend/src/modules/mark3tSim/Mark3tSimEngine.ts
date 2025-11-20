import type {
  SimSession,
  VirtualPortfolio,
  VirtualTrade,
  SimPerformance,
  SimAsset,
  ProjectionData,
} from './mark3tSimTypes'
import { generateSimAssets } from './mockMark3tSimFeed'

const INITIAL_BALANCE = 100000
const GAS_FEE_BASE = 2.5

class Mark3tSimEngine {
  private sessions: Map<string, SimSession> = new Map()
  private portfolios: Map<string, VirtualPortfolio> = new Map()
  private assets: SimAsset[] = []

  constructor() {
    this.assets = generateSimAssets()
    setInterval(() => {
      this.updateAssetPrices()
      this.updateOpenTrades()
    }, 3000)
  }

  private updateAssetPrices() {
    this.assets = this.assets.map((asset) => ({
      ...asset,
      currentPrice: asset.currentPrice * (1 + (Math.random() - 0.5) * 0.02),
      change24h: asset.change24h + (Math.random() - 0.5) * 0.5,
    }))
  }

  private updateOpenTrades() {
    this.portfolios.forEach((portfolio) => {
      portfolio.openTrades = portfolio.openTrades.map((trade) => {
        const asset = this.assets.find((a) => a.id === trade.assetId)
        if (!asset) return trade

        const currentPrice = asset.currentPrice
        const priceDiff = trade.type === 'buy' 
          ? (currentPrice - trade.entryPrice) 
          : (trade.entryPrice - currentPrice)
        
        const unrealizedPnL = (priceDiff * trade.amount * trade.leverage) - trade.gasFee

        if (trade.type === 'buy' && currentPrice <= trade.liquidationPrice) {
          return { ...trade, status: 'liquidated' as const, unrealizedPnL: -trade.amount }
        }
        if (trade.type === 'sell' && currentPrice >= trade.liquidationPrice) {
          return { ...trade, status: 'liquidated' as const, unrealizedPnL: -trade.amount }
        }

        return {
          ...trade,
          currentPrice,
          unrealizedPnL,
        }
      })

      this.recalculatePortfolio(portfolio.sessionId)
    })
  }

  startSession(userId: string): SimSession {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const session: SimSession = {
      id: sessionId,
      userId,
      startTime: Date.now(),
      initialBalance: INITIAL_BALANCE,
      status: 'active',
    }

    const portfolio: VirtualPortfolio = {
      sessionId,
      userId,
      balance: INITIAL_BALANCE,
      initialBalance: INITIAL_BALANCE,
      totalValue: INITIAL_BALANCE,
      openTrades: [],
      closedTrades: [],
      unrealizedPnL: 0,
      realizedPnL: 0,
      totalPnL: 0,
      winRate: 0,
      tradeCount: 0,
    }

    this.sessions.set(sessionId, session)
    this.portfolios.set(sessionId, portfolio)

    return session
  }

  loadSession(sessionId: string): { session: SimSession; portfolio: VirtualPortfolio } | null {
    const session = this.sessions.get(sessionId)
    const portfolio = this.portfolios.get(sessionId)

    if (!session || !portfolio) return null

    return { session, portfolio }
  }

  getActiveSessions(userId: string): SimSession[] {
    return Array.from(this.sessions.values()).filter(
      (session) => session.userId === userId && session.status === 'active'
    )
  }

  getAssets(): SimAsset[] {
    return this.assets
  }

  getAssetById(assetId: string): SimAsset | undefined {
    return this.assets.find((a) => a.id === assetId)
  }

  simulateTrade(
    sessionId: string,
    assetId: string,
    type: 'buy' | 'sell',
    amount: number,
    leverage: number = 1,
    simulateGas: boolean = false
  ): VirtualTrade | null {
    const portfolio = this.portfolios.get(sessionId)
    const asset = this.assets.find((a) => a.id === assetId)

    if (!portfolio || !asset) return null

    const gasFee = simulateGas ? GAS_FEE_BASE * (1 + Math.random()) : 0
    const requiredBalance = amount + gasFee

    if (portfolio.balance < requiredBalance) return null

    const volatilityMultiplier = 
      asset.volatility === 'extreme' ? 0.15 :
      asset.volatility === 'high' ? 0.10 :
      asset.volatility === 'medium' ? 0.05 : 0.03

    const liquidationPrice = type === 'buy'
      ? asset.currentPrice * (1 - volatilityMultiplier * leverage)
      : asset.currentPrice * (1 + volatilityMultiplier * leverage)

    const riskLevel = 
      leverage >= 10 || asset.volatility === 'extreme' ? 'extreme' :
      leverage >= 5 || asset.volatility === 'high' ? 'high' :
      leverage >= 2 || asset.volatility === 'medium' ? 'medium' : 'low'

    const trade: VirtualTrade = {
      id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      assetId,
      assetSymbol: asset.symbol,
      assetName: asset.name,
      type,
      entryPrice: asset.currentPrice,
      currentPrice: asset.currentPrice,
      amount,
      leverage,
      timestamp: Date.now(),
      status: 'open',
      unrealizedPnL: -gasFee,
      gasFee,
      liquidationPrice,
      riskLevel,
    }

    portfolio.openTrades.push(trade)
    portfolio.balance -= requiredBalance
    portfolio.tradeCount++

    this.portfolios.set(sessionId, portfolio)
    this.recalculatePortfolio(sessionId)

    return trade
  }

  closeTrade(sessionId: string, tradeId: string): VirtualTrade | null {
    const portfolio = this.portfolios.get(sessionId)
    if (!portfolio) return null

    const tradeIndex = portfolio.openTrades.findIndex((t) => t.id === tradeId)
    if (tradeIndex === -1) return null

    const trade = portfolio.openTrades[tradeIndex]
    const exitPrice = trade.currentPrice

    const priceDiff = trade.type === 'buy'
      ? (exitPrice - trade.entryPrice)
      : (trade.entryPrice - exitPrice)

    const realizedPnL = (priceDiff * trade.amount * trade.leverage) - trade.gasFee

    const closedTrade: VirtualTrade = {
      ...trade,
      exitPrice,
      closeTimestamp: Date.now(),
      status: 'closed',
      realizedPnL,
    }

    portfolio.openTrades.splice(tradeIndex, 1)
    portfolio.closedTrades.push(closedTrade)
    portfolio.balance += trade.amount + realizedPnL

    this.portfolios.set(sessionId, portfolio)
    this.recalculatePortfolio(sessionId)

    return closedTrade
  }

  private recalculatePortfolio(sessionId: string) {
    const portfolio = this.portfolios.get(sessionId)
    if (!portfolio) return

    portfolio.unrealizedPnL = portfolio.openTrades.reduce(
      (sum, trade) => sum + trade.unrealizedPnL,
      0
    )

    portfolio.realizedPnL = portfolio.closedTrades.reduce(
      (sum, trade) => sum + (trade.realizedPnL || 0),
      0
    )

    portfolio.totalPnL = portfolio.unrealizedPnL + portfolio.realizedPnL

    const openTradesValue = portfolio.openTrades.reduce(
      (sum, trade) => sum + trade.amount + trade.unrealizedPnL,
      0
    )

    portfolio.totalValue = portfolio.balance + openTradesValue

    const winningTrades = portfolio.closedTrades.filter(
      (trade) => (trade.realizedPnL || 0) > 0
    ).length

    portfolio.winRate = portfolio.closedTrades.length > 0
      ? (winningTrades / portfolio.closedTrades.length) * 100
      : 0

    this.portfolios.set(sessionId, portfolio)
  }

  calculatePortfolio(sessionId: string): VirtualPortfolio | null {
    const portfolio = this.portfolios.get(sessionId)
    if (!portfolio) return null

    this.recalculatePortfolio(sessionId)
    return this.portfolios.get(sessionId) || null
  }

  endSession(sessionId: string): SimPerformance | null {
    const session = this.sessions.get(sessionId)
    const portfolio = this.portfolios.get(sessionId)

    if (!session || !portfolio) return null

    portfolio.openTrades.forEach((trade) => {
      this.closeTrade(sessionId, trade.id)
    })

    const updatedPortfolio = this.portfolios.get(sessionId)!

    const winningTrades = updatedPortfolio.closedTrades.filter(
      (trade) => (trade.realizedPnL || 0) > 0
    )
    const losingTrades = updatedPortfolio.closedTrades.filter(
      (trade) => (trade.realizedPnL || 0) <= 0
    )

    const bestTrade = updatedPortfolio.closedTrades.reduce<VirtualTrade | null>(
      (best, trade) => {
        if (!best) return trade
        return (trade.realizedPnL || 0) > (best.realizedPnL || 0) ? trade : best
      },
      null
    )

    const worstTrade = updatedPortfolio.closedTrades.reduce<VirtualTrade | null>(
      (worst, trade) => {
        if (!worst) return trade
        return (trade.realizedPnL || 0) < (worst.realizedPnL || 0) ? trade : worst
      },
      null
    )

    const totalProfit = updatedPortfolio.totalPnL
    const profitPercentage = (totalProfit / portfolio.initialBalance) * 100
    const volumeTraded = updatedPortfolio.closedTrades.reduce(
      (sum, trade) => sum + trade.amount,
      0
    )

    const averageHoldTime = updatedPortfolio.closedTrades.length > 0
      ? updatedPortfolio.closedTrades.reduce(
          (sum, trade) => sum + ((trade.closeTimestamp || Date.now()) - trade.timestamp),
          0
        ) / updatedPortfolio.closedTrades.length
      : 0

    const sessionScore = Math.max(
      0,
      Math.floor(
        (profitPercentage * 10) +
        (updatedPortfolio.winRate * 5) +
        (updatedPortfolio.tradeCount * 2)
      )
    )

    const casualScoreEarned = Math.floor(sessionScore / 10)
    const clanContribution = Math.floor(casualScoreEarned * 1.5)

    const performance: SimPerformance = {
      sessionId,
      totalProfit,
      profitPercentage,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      totalTrades: updatedPortfolio.tradeCount,
      winRate: updatedPortfolio.winRate,
      bestTrade,
      worstTrade,
      volumeTraded,
      accuracy: updatedPortfolio.winRate,
      sessionScore,
      casualScoreEarned,
      clanContribution,
      averageHoldTime,
      maxDrawdown: Math.min(0, totalProfit),
      sharpeRatio: profitPercentage > 0 ? profitPercentage / 10 : 0,
    }

    session.endTime = Date.now()
    session.finalBalance = updatedPortfolio.totalValue
    session.status = 'completed'
    session.performance = performance

    this.sessions.set(sessionId, session)

    return performance
  }

  generateProjection(trade: VirtualTrade): ProjectionData {
    const pricePoints: number[] = []
    const timePoints: number[] = []
    const profitLoss: number[] = []
    const steps = 20

    for (let i = 0; i <= steps; i++) {
      const timeOffset = i * 300000
      const volatility = 0.05
      const trend = trade.type === 'buy' ? 0.002 : -0.002
      const priceChange = trend + (Math.random() - 0.5) * volatility
      const newPrice = trade.entryPrice * (1 + priceChange * i)

      const priceDiff = trade.type === 'buy'
        ? (newPrice - trade.entryPrice)
        : (trade.entryPrice - newPrice)

      const pnl = (priceDiff * trade.amount * trade.leverage) - trade.gasFee

      pricePoints.push(newPrice)
      timePoints.push(timeOffset)
      profitLoss.push(pnl)
    }

    const riskZones = [
      { start: 0, end: steps * 0.3, level: 'safe' as const },
      { start: steps * 0.3, end: steps * 0.7, level: 'caution' as const },
      { start: steps * 0.7, end: steps, level: 'danger' as const },
    ]

    return { pricePoints, timePoints, profitLoss, riskZones }
  }
}

export const mark3tSimEngine = new Mark3tSimEngine()
