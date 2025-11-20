import { generateNaughtyCoins, updateNaughtyCoin } from './naughtyCoinEngine'
import type { NaughtyCoin, NaughtyCoinFilters, SortField, SortDirection } from './naughtyCoinTypes'

export class NaughtyCoinFeed {
  private coins: NaughtyCoin[] = []
  private listeners: Set<(coins: NaughtyCoin[]) => void> = new Set()
  private updateInterval: number | null = null

  constructor() {
    this.coins = generateNaughtyCoins(15)
  }

  subscribe(listener: (coins: NaughtyCoin[]) => void): () => void {
    this.listeners.add(listener)
    listener(this.coins)
    
    return () => {
      this.listeners.delete(listener)
    }
  }

  startUpdates(intervalMs: number = 5000): void {
    if (this.updateInterval !== null) return
    
    this.updateInterval = window.setInterval(() => {
      this.coins = this.coins.map(coin => 
        Math.random() > 0.7 ? updateNaughtyCoin(coin) : coin
      )
      this.notifyListeners()
    }, intervalMs)
  }

  stopUpdates(): void {
    if (this.updateInterval !== null) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.coins))
  }

  getCoins(): NaughtyCoin[] {
    return this.coins
  }

  getCoinById(id: string): NaughtyCoin | undefined {
    return this.coins.find(coin => coin.id === id)
  }

  filterCoins(filters: NaughtyCoinFilters): NaughtyCoin[] {
    let filtered = [...this.coins]

    if (filters.riskLevel && filters.riskLevel.length > 0) {
      filtered = filtered.filter(coin => filters.riskLevel!.includes(coin.riskLevel))
    }

    if (filters.minScore !== undefined) {
      filtered = filtered.filter(coin => coin.scamAlertScore >= filters.minScore!)
    }

    if (filters.maxScore !== undefined) {
      filtered = filtered.filter(coin => coin.scamAlertScore <= filters.maxScore!)
    }

    if (filters.scamTypes && filters.scamTypes.length > 0) {
      filtered = filtered.filter(coin => 
        coin.scamTypes.some(type => filters.scamTypes!.includes(type))
      )
    }

    if (filters.recentlyDetected) {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(coin => coin.firstDetected >= sevenDaysAgo)
    }

    if (filters.isActive !== undefined) {
      filtered = filtered.filter(coin => coin.isActive === filters.isActive)
    }

    return filtered
  }

  sortCoins(coins: NaughtyCoin[], field: SortField, direction: SortDirection): NaughtyCoin[] {
    return [...coins].sort((a, b) => {
      let aValue: number | Date
      let bValue: number | Date

      switch (field) {
        case 'scamAlertScore':
          aValue = a.scamAlertScore
          bValue = b.scamAlertScore
          break
        case 'victimCount':
          aValue = a.victimCount
          bValue = b.victimCount
          break
        case 'totalLoss':
          aValue = a.totalLoss
          bValue = b.totalLoss
          break
        case 'firstDetected':
          aValue = a.firstDetected.getTime()
          bValue = b.firstDetected.getTime()
          break
        default:
          return 0
      }

      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

  refresh(): void {
    this.coins = generateNaughtyCoins(15)
    this.notifyListeners()
  }
}

export const naughtyCoinFeed = new NaughtyCoinFeed()
