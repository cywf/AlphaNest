import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { WalletBadge } from './WalletBadge'
import { generateScamWallets, updateWalletScore } from './walletIntelEngine'
import { truncateAddress, formatCompactNumber } from '@/lib/format'
import { ArrowsDownUp, FunnelSimple, Play, Pause, Warning } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import type { ScamWallet, WalletFilters, WalletSortField, WalletSortDirection, WalletRiskLevel } from './walletIntelTypes'

export function WalletLeaderboard() {
  const [wallets, setWallets] = useState<ScamWallet[]>([])
  const [filters, setFilters] = useState<WalletFilters>({})
  const [sortField, setSortField] = useState<WalletSortField>('scamScore')
  const [sortDirection, setSortDirection] = useState<WalletSortDirection>('desc')
  const [isPaused, setIsPaused] = useState(false)
  const [updateInterval, setUpdateIntervalId] = useState<number | null>(null)

  useEffect(() => {
    setWallets(generateScamWallets(20))
  }, [])

  useEffect(() => {
    if (!isPaused) {
      const id = window.setInterval(() => {
        setWallets(prev => prev.map(wallet => 
          Math.random() > 0.7 ? updateWalletScore(wallet) : wallet
        ))
      }, 7000)
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

  const handleRiskFilterChange = (value: string) => {
    if (value === 'all') {
      setFilters(prev => ({ ...prev, riskLevel: undefined }))
    } else {
      setFilters(prev => ({ ...prev, riskLevel: [value as WalletRiskLevel] }))
    }
  }

  const handleRugPullFilterChange = (value: string) => {
    if (value === 'all') {
      setFilters(prev => ({ ...prev, hasRugPulls: undefined }))
    } else {
      setFilters(prev => ({ ...prev, hasRugPulls: value === 'yes' }))
    }
  }

  const handleSortChange = (value: string) => {
    setSortField(value as WalletSortField)
  }

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
  }

  const filterWallets = (wallets: ScamWallet[]): ScamWallet[] => {
    let filtered = [...wallets]

    if (filters.riskLevel && filters.riskLevel.length > 0) {
      filtered = filtered.filter(w => filters.riskLevel!.includes(w.riskLevel))
    }

    if (filters.minScore !== undefined) {
      filtered = filtered.filter(w => w.scamScore >= filters.minScore!)
    }

    if (filters.maxScore !== undefined) {
      filtered = filtered.filter(w => w.scamScore <= filters.maxScore!)
    }

    if (filters.hasRugPulls) {
      filtered = filtered.filter(w => w.numberOfRugPulls > 0)
    }

    return filtered
  }

  const sortWallets = (wallets: ScamWallet[]): ScamWallet[] => {
    return [...wallets].sort((a, b) => {
      let aValue: number | Date
      let bValue: number | Date

      switch (sortField) {
        case 'scamScore':
          aValue = a.scamScore
          bValue = b.scamScore
          break
        case 'numberOfRugPulls':
          aValue = a.numberOfRugPulls
          bValue = b.numberOfRugPulls
          break
        case 'flaggedConnections':
          aValue = a.flaggedConnections
          bValue = b.flaggedConnections
          break
        case 'lastSeenActivity':
          aValue = a.lastSeenActivity.getTime()
          bValue = b.lastSeenActivity.getTime()
          break
        case 'totalValue':
          aValue = a.totalValue
          bValue = b.totalValue
          break
        default:
          return 0
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

  const filteredWallets = filterWallets(wallets)
  const sortedWallets = sortWallets(filteredWallets)

  const formatDate = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
    return `${Math.floor(diffDays / 30)}mo ago`
  }

  const riskCounts = {
    critical: wallets.filter(w => w.riskLevel === 'critical').length,
    high: wallets.filter(w => w.riskLevel === 'high').length,
    medium: wallets.filter(w => w.riskLevel === 'medium').length,
    low: wallets.filter(w => w.riskLevel === 'low').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-accent">◈</span>
            SCAM-WALL3TS Leaderboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time tracking of fraudulent wallet clusters
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

            <Select onValueChange={handleRugPullFilterChange} defaultValue="all">
              <SelectTrigger className="w-[160px] bg-background/50">
                <SelectValue placeholder="Rug Pulls" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wallets</SelectItem>
                <SelectItem value="yes">Has Rug Pulls</SelectItem>
                <SelectItem value="no">No Rug Pulls</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <ArrowsDownUp size={20} className="text-muted-foreground" />
              <Select onValueChange={handleSortChange} value={sortField}>
                <SelectTrigger className="w-[180px] bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scamScore">Scam Score</SelectItem>
                  <SelectItem value="numberOfRugPulls">Rug Pulls</SelectItem>
                  <SelectItem value="flaggedConnections">Connections</SelectItem>
                  <SelectItem value="lastSeenActivity">Last Activity</SelectItem>
                  <SelectItem value="totalValue">Total Value</SelectItem>
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
            {sortedWallets.length} / {wallets.length}
          </Badge>
        </div>
      </Card>

      <Card className="glow-border bg-card/50 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="font-semibold">Rank</TableHead>
                <TableHead className="font-semibold">Wallet Identity</TableHead>
                <TableHead className="font-semibold text-center">Score</TableHead>
                <TableHead className="font-semibold text-center">Rug Pulls</TableHead>
                <TableHead className="font-semibold text-center">Connections</TableHead>
                <TableHead className="font-semibold">Last Activity</TableHead>
                <TableHead className="font-semibold">Risk Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedWallets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                    No wallets match your filters
                  </TableCell>
                </TableRow>
              ) : (
                sortedWallets.map((wallet, index) => (
                  <motion.tr
                    key={wallet.address}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-border/50 hover:bg-primary/5 transition-colors cursor-pointer"
                    onClick={() => console.log('Navigate to wallet dossier:', wallet.address)}
                  >
                    <TableCell className="font-mono font-semibold">
                      #{index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-semibold text-foreground">{wallet.label}</div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {truncateAddress(wallet.address, 8, 6)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <WalletBadge 
                        riskLevel={wallet.riskLevel} 
                        score={wallet.scamScore}
                        showGlitch={true}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {wallet.numberOfRugPulls > 0 && (
                          <Warning size={16} className="text-red-500" />
                        )}
                        <span className="font-mono font-semibold">
                          {wallet.numberOfRugPulls}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-mono font-semibold text-orange-400">
                        {wallet.flaggedConnections}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatDate(wallet.lastSeenActivity)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {wallet.riskTags.slice(0, 2).map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="text-xs border-accent/50 text-accent"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {wallet.riskTags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{wallet.riskTags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
