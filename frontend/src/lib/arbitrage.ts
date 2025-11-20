import type { ArbitrageOpportunity, Cryptocurrency, Exchange } from '@/types/arbitrage'
import { CRYPTOCURRENCIES, EXCHANGES } from '@/types/arbitrage'

const BASE_PRICES: Record<string, number> = {
  BTC: 43250,
  ETH: 2280,
  SOL: 98.5,
  BNB: 315,
  ADA: 0.52,
  DOGE: 0.085,
  XRP: 0.58,
  MATIC: 0.82,
  AVAX: 36.5,
  DOT: 6.85,
}

function getRandomVariation(basePrice: number, variationPercent: number = 0.5): number {
  const variation = (Math.random() - 0.5) * 2 * (variationPercent / 100) * basePrice
  return basePrice + variation
}

function generateExchangePrices(coin: Cryptocurrency): Record<Exchange, number> {
  const basePrice = BASE_PRICES[coin.symbol]
  const prices: Partial<Record<Exchange, number>> = {}
  
  EXCHANGES.forEach(exchange => {
    prices[exchange] = getRandomVariation(basePrice, 2)
  })
  
  return prices as Record<Exchange, number>
}

export function generateArbitrageOpportunities(
  enabledExchanges: Exchange[]
): ArbitrageOpportunity[] {
  const opportunities: ArbitrageOpportunity[] = []
  
  CRYPTOCURRENCIES.forEach(coin => {
    const prices = generateExchangePrices(coin)
    
    let minPrice = Infinity
    let maxPrice = -Infinity
    let minExchange: Exchange = 'Binance'
    let maxExchange: Exchange = 'Coinbase'
    
    enabledExchanges.forEach(exchange => {
      const price = prices[exchange]
      if (price < minPrice) {
        minPrice = price
        minExchange = exchange
      }
      if (price > maxPrice) {
        maxPrice = price
        maxExchange = exchange
      }
    })
    
    const profitPercentage = ((maxPrice - minPrice) / minPrice) * 100
    
    if (profitPercentage > 0.1) {
      opportunities.push({
        coin,
        buyExchange: minExchange,
        sellExchange: maxExchange,
        buyPrice: minPrice,
        sellPrice: maxPrice,
        profitPercentage,
        timestamp: Date.now(),
      })
    }
  })
  
  return opportunities.sort((a, b) => b.profitPercentage - a.profitPercentage)
}

export function calculateProfit(investment: number, profitPercentage: number): number {
  return (investment * profitPercentage) / 100
}

export function getExchangeColor(exchange: Exchange): string {
  const colors: Record<Exchange, string> = {
    Binance: 'oklch(0.70 0.20 80)',
    Coinbase: 'oklch(0.60 0.20 240)',
    KuCoin: 'oklch(0.65 0.22 160)',
    Kraken: 'oklch(0.55 0.18 280)',
    Bybit: 'oklch(0.68 0.22 40)',
  }
  return colors[exchange]
}

export function getProfitTier(profitPercentage: number): 'low' | 'medium' | 'high' {
  if (profitPercentage >= 2) return 'high'
  if (profitPercentage >= 1) return 'medium'
  return 'low'
}
