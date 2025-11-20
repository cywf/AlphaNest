import { useState, useEffect, useCallback } from 'react'
import type { NewCoin, LaunchWindow } from './types'
import { generateNewCoins, updateCoinSentiment } from './sentiment'

export function useNewCoinDiscovery() {
  const [coins, setCoins] = useState<NewCoin[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [filter, setFilter] = useState<LaunchWindow>('all')
  const [minSentiment, setMinSentiment] = useState<number>(0)
  
  useEffect(() => {
    setIsLoading(true)
    const initialCoins = generateNewCoins(10)
    setCoins(initialCoins)
    setIsLoading(false)
  }, [])
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins((currentCoins) => currentCoins.map(updateCoinSentiment))
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  const filteredCoins = coins.filter((coin) => {
    if (coin.sentimentScore < minSentiment) return false
    
    if (filter === '24h' && coin.daysUntilLaunch > 1) return false
    if (filter === '7d' && coin.daysUntilLaunch > 7) return false
    if (filter === '30d' && coin.daysUntilLaunch > 30) return false
    
    return true
  })
  
  const refreshCoins = useCallback(() => {
    setIsLoading(true)
    const newCoins = generateNewCoins(10)
    setCoins(newCoins)
    setIsLoading(false)
  }, [])
  
  return {
    coins: filteredCoins,
    isLoading,
    filter,
    setFilter,
    minSentiment,
    setMinSentiment,
    refreshCoins,
  }
}
