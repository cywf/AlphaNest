import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendUp, 
  TrendDown, 
  Wallet, 
  Target, 
  ChartBar, 
  Lightning,
  Play,
  ArrowRight,
  Sparkle
} from '@phosphor-icons/react'
import { mark3tSimEngine } from './Mark3tSimEngine'
import { authEngine } from '../users/authEngine'
import { generateSimAssets, getTopMovers, getHighVolatilityAssets } from './mockMark3tSimFeed'
import type { SimAsset } from './mark3tSimTypes'
import { motion } from 'framer-motion'

interface Mark3tSimDashboardProps {
  onStartSession: () => void
  onContinueSession: (sessionId: string) => void
  onViewPortfolio: () => void
  onNavigateToTrade: () => void
}

export function Mark3tSimDashboard({
  onStartSession,
  onContinueSession,
  onViewPortfolio,
  onNavigateToTrade,
}: Mark3tSimDashboardProps) {
  const [topMovers, setTopMovers] = useState<SimAsset[]>([])
  const [volatileAssets, setVolatileAssets] = useState<SimAsset[]>([])
  const [activeSessions, setActiveSessions] = useState<any[]>([])
  const [stats, setStats] = useState({
    virtualBalance: 100000,
    dailyProfit: 0,
    totalProfit: 0,
    winRate: 0,
    sessionCount: 0,
    casualScore: 0,
  })

  useEffect(() => {
    const currentUser = authEngine.getCurrentUser()
    if (currentUser) {
      const sessions = mark3tSimEngine.getActiveSessions(currentUser.id)
      setActiveSessions(sessions)
      
      setStats({
        virtualBalance: 100000 + Math.floor(Math.random() * 50000),
        dailyProfit: Math.floor(Math.random() * 5000) - 1000,
        totalProfit: Math.floor(Math.random() * 25000) - 5000,
        winRate: 55 + Math.floor(Math.random() * 30),
        sessionCount: sessions.length + Math.floor(Math.random() * 20),
        casualScore: currentUser.casualScore || 0,
      })
    }

    setTopMovers(getTopMovers(5))
    setVolatileAssets(getHighVolatilityAssets(4))

    const interval = setInterval(() => {
      setTopMovers(getTopMovers(5))
      setVolatileAssets(getHighVolatilityAssets(4))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getSentimentColor = (sentiment: SimAsset['sentiment']) => {
    switch (sentiment) {
      case 'bullish':
        return 'text-primary'
      case 'bearish':
        return 'text-destructive'
      default:
        return 'text-muted-foreground'
    }
  }

  const getVolatilityColor = (volatility: SimAsset['volatility']) => {
    switch (volatility) {
      case 'extreme':
        return 'bg-accent text-accent-foreground'
      case 'high':
        return 'bg-destructive/20 text-destructive'
      case 'medium':
        return 'bg-secondary text-secondary-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Lightning className="text-accent" size={32} weight="fill" />
            MARK3T-SIM
          </h1>
        </div>
        <p className="text-muted-foreground">Virtual Trading Arena — Train. Simulate. Dominate.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Wallet className="text-primary" size={24} />
                <span className="text-sm text-muted-foreground">Virtual Balance</span>
              </div>
            </div>
            <div className="text-2xl font-bold font-mono text-primary">
              ${stats.virtualBalance.toLocaleString()}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ChartBar className="text-accent" size={24} />
                <span className="text-sm text-muted-foreground">Daily Profit</span>
              </div>
            </div>
            <div className={`text-2xl font-bold font-mono ${stats.dailyProfit >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {stats.dailyProfit >= 0 ? '+' : ''}${stats.dailyProfit.toLocaleString()}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="text-secondary" size={24} />
                <span className="text-sm text-muted-foreground">Win Rate</span>
              </div>
            </div>
            <div className="text-2xl font-bold font-mono text-secondary">
              {stats.winRate}%
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendUp className="text-primary" size={24} />
                <span className="text-sm text-muted-foreground">Total Profit</span>
              </div>
            </div>
            <div className={`text-2xl font-bold font-mono ${stats.totalProfit >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {stats.totalProfit >= 0 ? '+' : ''}${stats.totalProfit.toLocaleString()}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Play className="text-accent" size={24} />
                <span className="text-sm text-muted-foreground">Sessions</span>
              </div>
            </div>
            <div className="text-2xl font-bold font-mono text-accent">
              {stats.sessionCount}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="glow-border-accent bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkle className="text-accent" size={24} weight="fill" />
                <span className="text-sm text-muted-foreground">Casual Score</span>
              </div>
            </div>
            <div className="text-2xl font-bold font-mono text-accent">
              {stats.casualScore.toLocaleString()}
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendUp className="text-primary" size={24} />
              Top Movers
            </h2>
            <div className="space-y-3">
              {topMovers.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30 hover:border-primary/50 transition-all cursor-pointer"
                  onClick={onNavigateToTrade}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      {asset.symbol[0]}
                    </div>
                    <div>
                      <div className="font-bold">{asset.symbol}</div>
                      <div className="text-xs text-muted-foreground">{asset.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold">${asset.currentPrice.toLocaleString()}</div>
                    <div className={`text-sm flex items-center gap-1 ${asset.change24h >= 0 ? 'text-primary' : 'text-destructive'}`}>
                      {asset.change24h >= 0 ? <TrendUp size={16} /> : <TrendDown size={16} />}
                      {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lightning className="text-accent" size={24} weight="fill" />
              High Volatility Assets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {volatileAssets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-4 rounded-lg bg-accent/10 border border-accent/30 hover:border-accent transition-all cursor-pointer"
                  onClick={onNavigateToTrade}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg">{asset.symbol}</span>
                    <Badge className={getVolatilityColor(asset.volatility)}>
                      {asset.volatility}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${getSentimentColor(asset.sentiment)}`}>
                      {asset.sentiment}
                    </span>
                    <span className="font-mono text-sm">${asset.currentPrice.toFixed(2)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glow-border-accent bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button
                className="w-full glow-border-accent"
                size="lg"
                onClick={onStartSession}
              >
                <Play size={20} weight="fill" />
                Start New Session
              </Button>
              {activeSessions.length > 0 && (
                <Button
                  className="w-full"
                  variant="secondary"
                  size="lg"
                  onClick={() => onContinueSession(activeSessions[0].id)}
                >
                  <ArrowRight size={20} />
                  Continue Last Session
                </Button>
              )}
              <Button
                className="w-full"
                variant="outline"
                size="lg"
                onClick={onViewPortfolio}
              >
                <Wallet size={20} />
                Open Virtual Portfolio
              </Button>
            </div>
          </Card>

          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold mb-3">AI Training Hints</h2>
            <div className="space-y-2 text-sm">
              <div className="p-3 rounded bg-primary/10 border border-primary/30">
                <span className="text-primary">◈</span> High-volume BTC opportunity detected
              </div>
              <div className="p-3 rounded bg-accent/10 border border-accent/30">
                <span className="text-accent">◈</span> Sentiment spike on SOL predicted
              </div>
              <div className="p-3 rounded bg-secondary/10 border border-secondary/30">
                <span className="text-secondary">◈</span> Clan "Cyber Dragons" recommends ETH
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
