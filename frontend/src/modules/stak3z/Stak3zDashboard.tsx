import { useState, useEffect, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StakingPoolGrid } from './StakingPoolGrid'
import { stakeEngine } from './stakeEngine'
import type { Pool, PoolFilters, Chain, RiskTier } from './stakeTypes'
import { MagnifyingGlass, Drop, TrendUp, Warning, ChartBar, Target } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface Stak3zDashboardProps {
  onPoolClick: (poolId: string) => void
}

export function Stak3zDashboard({ onPoolClick }: Stak3zDashboardProps) {
  const [pools, setPools] = useState<Pool[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<PoolFilters>({
    chains: [],
    apyRange: [0, 150],
    riskTiers: [],
    poolType: 'all',
    showTrending: false,
    searchQuery: '',
  })

  const [liveMetrics, setLiveMetrics] = useState({
    totalTVL: 0,
    activePools: 0,
    avgAPY: 0,
    sentiment: 'Bullish',
  })

  useEffect(() => {
    setIsLoading(true)
    const allPools = stakeEngine.getPools()
    setPools(allPools)
    setIsLoading(false)

    const totalTVL = allPools.reduce((sum, pool) => sum + pool.tvl, 0)
    const avgAPY = allPools.reduce((sum, pool) => sum + pool.apy.total, 0) / allPools.length
    
    setLiveMetrics({
      totalTVL,
      activePools: allPools.length,
      avgAPY,
      sentiment: Math.random() > 0.5 ? 'Bullish' : 'Neutral',
    })
  }, [])

  const filteredPools = useMemo(() => {
    return pools.filter((pool) => {
      if (filters.chains.length > 0 && !filters.chains.includes(pool.chain)) {
        return false
      }

      if (pool.apy.total < filters.apyRange[0] || pool.apy.total > filters.apyRange[1]) {
        return false
      }

      if (filters.riskTiers.length > 0 && !filters.riskTiers.includes(pool.riskTier)) {
        return false
      }

      if (filters.poolType === 'stable' && pool.riskTier !== 'low') {
        return false
      }

      if (filters.poolType === 'volatile' && pool.riskTier === 'low') {
        return false
      }

      if (filters.showTrending && pool.status !== 'trending' && pool.status !== 'hot') {
        return false
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        const matchesName = pool.name.toLowerCase().includes(query)
        const matchesToken = pool.tokens.some(t => 
          t.symbol.toLowerCase().includes(query) || 
          t.name.toLowerCase().includes(query)
        )
        const matchesChain = pool.chain.toLowerCase().includes(query)
        
        if (!matchesName && !matchesToken && !matchesChain) {
          return false
        }
      }

      return true
    })
  }, [pools, filters])

  const riskDistribution = useMemo(() => {
    const total = filteredPools.length
    if (total === 0) return { low: 0, medium: 0, high: 0 }
    
    const counts = filteredPools.reduce(
      (acc, pool) => {
        acc[pool.riskTier]++
        return acc
      },
      { low: 0, medium: 0, high: 0 } as Record<RiskTier, number>
    )

    return {
      low: (counts.low / total) * 100,
      medium: (counts.medium / total) * 100,
      high: (counts.high / total) * 100,
    }
  }, [filteredPools])

  const toggleChain = (chain: Chain) => {
    setFilters((prev) => ({
      ...prev,
      chains: prev.chains.includes(chain)
        ? prev.chains.filter((c) => c !== chain)
        : [...prev.chains, chain],
    }))
  }

  const toggleRiskTier = (tier: RiskTier) => {
    setFilters((prev) => ({
      ...prev,
      riskTiers: prev.riskTiers.includes(tier)
        ? prev.riskTiers.filter((t) => t !== tier)
        : [...prev.riskTiers, tier],
    }))
  }

  const formatTVL = (tvl: number) => {
    if (tvl >= 1000000000) return `$${(tvl / 1000000000).toFixed(2)}B`
    if (tvl >= 1000000) return `$${(tvl / 1000000).toFixed(2)}M`
    if (tvl >= 1000) return `$${(tvl / 1000).toFixed(0)}K`
    return `$${tvl.toFixed(0)}`
  }

  const chains: Chain[] = ['ethereum', 'polygon', 'bsc', 'arbitrum', 'optimism', 'avalanche']

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-wider text-primary drop-shadow-[0_0_20px_rgba(99,220,255,0.5)]">
          STAK3Z
        </h1>
        <p className="text-muted-foreground">Liquidity Pools & Staking</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glow-border bg-card/50 backdrop-blur-sm p-6 group hover:scale-[1.02] transition-all">
          <div className="flex items-start justify-between mb-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <ChartBar className="h-6 w-6 text-primary" />
            </div>
            <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30 text-xs">LIVE</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-1">Total TVL</p>
          <p className="text-2xl font-bold">{formatTVL(liveMetrics.totalTVL)}</p>
          <div className="mt-2 h-1 bg-background/50 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse" style={{ width: '100%' }} />
          </div>
        </Card>

        <Card className="glow-border bg-card/50 backdrop-blur-sm p-6 group hover:scale-[1.02] transition-all">
          <div className="flex items-start justify-between mb-2">
            <div className="bg-secondary/10 p-2 rounded-lg">
              <Drop className="h-6 w-6 text-secondary" />
            </div>
            <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30 text-xs">LIVE</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-1">Active Pools</p>
          <p className="text-2xl font-bold">{liveMetrics.activePools}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {filteredPools.length} matching filters
          </p>
        </Card>

        <Card className="glow-border bg-card/50 backdrop-blur-sm p-6 group hover:scale-[1.02] transition-all">
          <div className="flex items-start justify-between mb-2">
            <div className="bg-chart-4/10 p-2 rounded-lg">
              <TrendUp className="h-6 w-6 text-chart-4" />
            </div>
            <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30 text-xs">LIVE</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-1">Average APY</p>
          <p className="text-2xl font-bold">{liveMetrics.avgAPY.toFixed(2)}%</p>
          <p className="text-xs text-chart-4 mt-2">+5.2% this week</p>
        </Card>

        <Card className="glow-border bg-card/50 backdrop-blur-sm p-6 group hover:scale-[1.02] transition-all">
          <div className="flex items-start justify-between mb-2">
            <div className="bg-accent/10 p-2 rounded-lg">
              <Target className="h-6 w-6 text-accent" />
            </div>
            <Badge className={cn(
              'text-xs',
              liveMetrics.sentiment === 'Bullish' ? 'bg-chart-2/20 text-chart-2 border-chart-2/30' : 'bg-muted/20 text-muted-foreground border-muted/30'
            )}>
              {liveMetrics.sentiment}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-1">Network Sentiment</p>
          <p className="text-2xl font-bold">
            {liveMetrics.sentiment === 'Bullish' ? '📈' : '➡️'}
          </p>
          <p className="text-xs text-muted-foreground mt-2">Market confidence high</p>
        </Card>
      </div>

      <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-accent">◈</span>
          Risk Distribution
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-chart-2 w-20">Low</span>
            <div className="flex-1 h-3 bg-background/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-chart-2 to-chart-2/50 rounded-full transition-all duration-500"
                style={{ width: `${riskDistribution.low}%` }}
              />
            </div>
            <span className="text-sm font-mono w-16 text-right">{riskDistribution.low.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-secondary w-20">Medium</span>
            <div className="flex-1 h-3 bg-background/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-secondary to-secondary/50 rounded-full transition-all duration-500"
                style={{ width: `${riskDistribution.medium}%` }}
              />
            </div>
            <span className="text-sm font-mono w-16 text-right">{riskDistribution.medium.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-accent w-20">High</span>
            <div className="flex-1 h-3 bg-background/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-accent/50 rounded-full transition-all duration-500"
                style={{ width: `${riskDistribution.high}%` }}
              />
            </div>
            <span className="text-sm font-mono w-16 text-right">{riskDistribution.high.toFixed(1)}%</span>
          </div>
        </div>
      </Card>

      <Card className="glow-border bg-card/50 backdrop-blur-sm p-6 space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-accent">◈</span>
          Filters
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Search</Label>
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pools, tokens, chains..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                  className="pl-10 bg-background/50 border-primary/30"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Pool Type</Label>
              <Select
                value={filters.poolType}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, poolType: value as 'stable' | 'volatile' | 'all' }))}
              >
                <SelectTrigger className="bg-background/50 border-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pools</SelectItem>
                  <SelectItem value="stable">Stable Only</SelectItem>
                  <SelectItem value="volatile">Volatile Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm text-muted-foreground">Show Trending Only</Label>
                <Switch
                  checked={filters.showTrending}
                  onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, showTrending: checked }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">
                APY Range: {filters.apyRange[0]}% - {filters.apyRange[1]}%
              </Label>
              <Slider
                value={filters.apyRange}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, apyRange: value as [number, number] }))}
                min={0}
                max={150}
                step={5}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Chains</Label>
              <div className="flex flex-wrap gap-2">
                {chains.map((chain) => (
                  <Button
                    key={chain}
                    size="sm"
                    variant="outline"
                    onClick={() => toggleChain(chain)}
                    className={cn(
                      'text-xs',
                      filters.chains.includes(chain)
                        ? 'bg-primary/20 text-primary border-primary/40'
                        : 'bg-background/50 border-primary/20'
                    )}
                  >
                    {chain.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Risk Level</Label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as RiskTier[]).map((tier) => (
                  <Button
                    key={tier}
                    size="sm"
                    variant="outline"
                    onClick={() => toggleRiskTier(tier)}
                    className={cn(
                      'flex-1 text-xs',
                      filters.riskTiers.includes(tier)
                        ? tier === 'low'
                          ? 'bg-chart-2/20 text-chart-2 border-chart-2/40'
                          : tier === 'medium'
                          ? 'bg-secondary/20 text-secondary border-secondary/40'
                          : 'bg-accent/20 text-accent border-accent/40'
                        : 'bg-background/50 border-primary/20'
                    )}
                  >
                    {tier.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <p className="text-sm text-muted-foreground">
            Showing {filteredPools.length} of {pools.length} pools
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setFilters({
              chains: [],
              apyRange: [0, 150],
              riskTiers: [],
              poolType: 'all',
              showTrending: false,
              searchQuery: '',
            })}
            className="bg-background/50 border-primary/20"
          >
            Reset Filters
          </Button>
        </div>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="text-accent">◈</span>
          Available Pools
        </h2>
        <StakingPoolGrid
          pools={filteredPools}
          onPoolClick={onPoolClick}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
