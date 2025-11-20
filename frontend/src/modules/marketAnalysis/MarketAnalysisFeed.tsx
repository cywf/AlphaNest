import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MarketAnalysisCard } from './MarketAnalysisCard'
import { generateMockAnalysisFeed, getLatestAnalysisItem } from './mockMarketAnalysisFeed'
import { Play, Pause, FunnelSimple, Pulse } from '@phosphor-icons/react'
import type { MarketAnalysisItem, AnalysisCategory } from './marketAnalysisTypes'

interface MarketAnalysisFeedProps {
  onNavigate?: (page: string, id?: string) => void
}

export function MarketAnalysisFeed({ onNavigate }: MarketAnalysisFeedProps) {
  const [items, setItems] = useState<MarketAnalysisItem[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<AnalysisCategory | 'all'>('all')
  const [updateInterval, setUpdateIntervalId] = useState<number | null>(null)

  useEffect(() => {
    setItems(generateMockAnalysisFeed(15))
  }, [])

  useEffect(() => {
    if (!isPaused) {
      const id = window.setInterval(() => {
        const newItem = getLatestAnalysisItem()
        setItems((prev) => [newItem, ...prev].slice(0, 20))
      }, 8000)
      setUpdateIntervalId(id)
      return () => clearInterval(id)
    } else {
      if (updateInterval) {
        clearInterval(updateInterval)
        setUpdateIntervalId(null)
      }
    }
  }, [isPaused])

  const handleTogglePause = () => {
    setIsPaused(!isPaused)
  }

  const handleDeepLink = useCallback(
    (type: string, id: string) => {
      if (!onNavigate) return

      const pageMap: Record<string, string> = {
        market: 'market',
        arbitrage: 'arbitrage',
        wallet: 'scam-wallets',
        coin: 'naughty-coins',
        clan: 'clan-warz',
      }

      const page = pageMap[type]
      if (page) {
        onNavigate(page, id)
      }
    },
    [onNavigate]
  )

  const filteredItems = categoryFilter === 'all' 
    ? items 
    : items.filter(item => item.category === categoryFilter)

  const categoryCounts = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-accent">◈</span>
            Market Analysis Feed
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time intelligence stream from all ALPHA-N3ST systems
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isPaused && (
            <Badge variant="outline" className="gap-1.5 border-chart-2/50 text-chart-2 animate-pulse">
              <Pulse size={12} weight="fill" />
              LIVE
            </Badge>
          )}
          <Button
            variant={isPaused ? 'default' : 'outline'}
            size="sm"
            onClick={handleTogglePause}
            className="gap-2"
          >
            {isPaused ? (
              <>
                <Play size={16} weight="fill" />
                Resume
              </>
            ) : (
              <>
                <Pause size={16} weight="fill" />
                Pause
              </>
            )}
          </Button>
        </div>
      </div>

      <Card className="glow-border bg-card/50 backdrop-blur-sm p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FunnelSimple size={20} className="text-muted-foreground" />
            <span className="text-sm font-semibold">Filter by Category</span>
          </div>

          <Select
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value as AnalysisCategory | 'all')}
          >
            <SelectTrigger className="w-[200px] bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories ({items.length})</SelectItem>
              <SelectItem value="market-trend">Market Trends ({categoryCounts['market-trend'] || 0})</SelectItem>
              <SelectItem value="osint-alert">OSINT Alerts ({categoryCounts['osint-alert'] || 0})</SelectItem>
              <SelectItem value="whale-movement">Whale Movements ({categoryCounts['whale-movement'] || 0})</SelectItem>
              <SelectItem value="nft-surge">NFT Surges ({categoryCounts['nft-surge'] || 0})</SelectItem>
              <SelectItem value="arbitrage">Arbitrage Ops ({categoryCounts['arbitrage'] || 0})</SelectItem>
              <SelectItem value="scam-alert">Scam Alerts ({categoryCounts['scam-alert'] || 0})</SelectItem>
              <SelectItem value="clan-activity">Clan Activity ({categoryCounts['clan-activity'] || 0})</SelectItem>
            </SelectContent>
          </Select>

          <Badge variant="secondary" className="ml-auto font-mono">
            {filteredItems.length} items
          </Badge>
        </div>
      </Card>

      {filteredItems.length === 0 ? (
        <Card className="glow-border bg-card/50 backdrop-blur-sm p-12 text-center">
          <p className="text-muted-foreground">No analysis items match your filter</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item, index) => (
            <MarketAnalysisCard
              key={item.id}
              item={item}
              onDeepLinkClick={handleDeepLink}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  )
}
