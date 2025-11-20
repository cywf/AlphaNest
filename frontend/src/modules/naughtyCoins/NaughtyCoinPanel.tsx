import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { NaughtyCoinCard } from './NaughtyCoinCard'
import { naughtyCoinFeed } from './naughtyCoinFeed'
import { ArrowsDownUp, FunnelSimple, Play, Pause } from '@phosphor-icons/react'
import type { NaughtyCoin, NaughtyCoinFilters, SortField, SortDirection, RiskLevel } from './naughtyCoinTypes'

export function NaughtyCoinPanel() {
  const [coins, setCoins] = useState<NaughtyCoin[]>([])
  const [filters, setFilters] = useState<NaughtyCoinFilters>({})
  const [sortField, setSortField] = useState<SortField>('scamAlertScore')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const unsubscribe = naughtyCoinFeed.subscribe((newCoins) => {
      setCoins(newCoins)
    })

    naughtyCoinFeed.startUpdates(6000)

    return () => {
      unsubscribe()
      naughtyCoinFeed.stopUpdates()
    }
  }, [])

  const handleTogglePause = () => {
    if (isPaused) {
      naughtyCoinFeed.startUpdates(6000)
    } else {
      naughtyCoinFeed.stopUpdates()
    }
    setIsPaused(!isPaused)
  }

  const handleRiskFilterChange = (value: string) => {
    if (value === 'all') {
      setFilters(prev => ({ ...prev, riskLevel: undefined }))
    } else {
      setFilters(prev => ({ ...prev, riskLevel: [value as RiskLevel] }))
    }
  }

  const handleActiveFilterChange = (value: string) => {
    if (value === 'all') {
      setFilters(prev => ({ ...prev, isActive: undefined }))
    } else {
      setFilters(prev => ({ ...prev, isActive: value === 'active' }))
    }
  }

  const handleSortChange = (value: string) => {
    setSortField(value as SortField)
  }

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
  }

  const filteredCoins = naughtyCoinFeed.filterCoins(filters)
  const sortedCoins = naughtyCoinFeed.sortCoins(filteredCoins, sortField, sortDirection)

  const riskCounts = {
    critical: coins.filter(c => c.riskLevel === 'critical').length,
    high: coins.filter(c => c.riskLevel === 'high').length,
    medium: coins.filter(c => c.riskLevel === 'medium').length,
    low: coins.filter(c => c.riskLevel === 'low').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-accent">◈</span>
            SK3TCHY-C0INS LIST
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time scam token detection & tracking system
          </p>
        </div>
        
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

      <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Critical</div>
            <div className="text-2xl font-bold font-mono text-red-500">{riskCounts.critical}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">High Risk</div>
            <div className="text-2xl font-bold font-mono text-orange-500">{riskCounts.high}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Medium</div>
            <div className="text-2xl font-bold font-mono text-yellow-500">{riskCounts.medium}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Low Risk</div>
            <div className="text-2xl font-bold font-mono text-green-500">{riskCounts.low}</div>
          </div>
        </div>
      </Card>

      <Card className="glow-border bg-card/50 backdrop-blur-sm p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FunnelSimple size={20} className="text-muted-foreground" />
            <span className="text-sm font-semibold">Filters</span>
          </div>
          
          <div className="flex-1 flex items-center gap-3 flex-wrap">
            <Select onValueChange={handleRiskFilterChange} defaultValue="all">
              <SelectTrigger className="w-[160px] bg-background/50">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={handleActiveFilterChange} defaultValue="all">
              <SelectTrigger className="w-[160px] bg-background/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <ArrowsDownUp size={20} className="text-muted-foreground" />
              <Select onValueChange={handleSortChange} value={sortField}>
                <SelectTrigger className="w-[180px] bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scamAlertScore">Scam Score</SelectItem>
                  <SelectItem value="victimCount">Victim Count</SelectItem>
                  <SelectItem value="totalLoss">Total Loss</SelectItem>
                  <SelectItem value="firstDetected">First Detected</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="icon"
                onClick={toggleSortDirection}
                className="h-9 w-9"
              >
                <ArrowsDownUp 
                  size={16} 
                  className={sortDirection === 'asc' ? 'rotate-180' : ''}
                />
              </Button>
            </div>
          </div>

          <Badge variant="secondary" className="font-mono">
            {sortedCoins.length} / {coins.length}
          </Badge>
        </div>
      </Card>

      {sortedCoins.length === 0 ? (
        <Card className="glow-border bg-card/50 backdrop-blur-sm p-12 text-center">
          <p className="text-muted-foreground">No scam tokens match your filters</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedCoins.map((coin) => (
            <NaughtyCoinCard 
              key={coin.id} 
              coin={coin}
              onClick={() => {
                console.log('Navigate to dossier:', coin.id)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
