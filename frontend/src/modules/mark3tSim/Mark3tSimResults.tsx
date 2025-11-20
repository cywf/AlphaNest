import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Trophy, 
  TrendUp, 
  TrendDown, 
  Target, 
  Lightning, 
  ChartBar,
  Users,
  Clock,
  Sparkle,
  Medal,
  ArrowRight
} from '@phosphor-icons/react'
import type { SimPerformance } from './mark3tSimTypes'
import { motion } from 'framer-motion'
import { authEngine } from '../users/authEngine'
import { clanEngine } from '../clans/clanEngine'

interface Mark3tSimResultsProps {
  performance: SimPerformance
  onBackToDashboard: () => void
  onStartNewSession: () => void
}

export function Mark3tSimResults({ performance, onBackToDashboard, onStartNewSession }: Mark3tSimResultsProps) {
  const [earnedScores, setEarnedScores] = useState(false)

  useEffect(() => {
    const currentUser = authEngine.getCurrentUser()
    if (currentUser && !earnedScores) {
      authEngine.incrementCasualScore(currentUser.id, performance.casualScoreEarned)
      
      if (currentUser.clanId) {
        clanEngine.updateClanScore(currentUser.clanId, performance.clanContribution)
      }
      
      setEarnedScores(true)
    }
  }, [performance, earnedScores])

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const hours = Math.floor(minutes / 60)
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m`
  }

  const getGradeColor = () => {
    if (performance.profitPercentage > 20) return 'text-primary'
    if (performance.profitPercentage > 10) return 'text-accent'
    if (performance.profitPercentage > 0) return 'text-secondary'
    return 'text-destructive'
  }

  const getGrade = () => {
    if (performance.profitPercentage > 20) return 'S+'
    if (performance.profitPercentage > 15) return 'S'
    if (performance.profitPercentage > 10) return 'A'
    if (performance.profitPercentage > 5) return 'B'
    if (performance.profitPercentage > 0) return 'C'
    return 'D'
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <Card className="glow-border-accent bg-gradient-to-br from-accent/20 to-primary/20 backdrop-blur-sm p-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <Trophy size={120} weight="fill" className={getGradeColor()} />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className={`text-4xl font-bold ${getGradeColor()}`}>
                  {getGrade()}
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold mb-2"
          >
            Session Complete!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg"
          >
            Session #{performance.sessionId.slice(-6).toUpperCase()}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <div className={`text-6xl font-bold font-mono ${performance.totalProfit >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {performance.totalProfit >= 0 ? '+' : ''}${performance.totalProfit.toFixed(2)}
            </div>
            <div className="text-2xl text-muted-foreground mt-2">
              {performance.profitPercentage >= 0 ? '+' : ''}{performance.profitPercentage.toFixed(2)}% ROI
            </div>
          </motion.div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-primary" size={24} />
              <span className="text-sm text-muted-foreground">Win Rate</span>
            </div>
            <div className="text-3xl font-bold font-mono text-primary">
              {performance.winRate.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {performance.winningTrades}W / {performance.losingTrades}L
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <ChartBar className="text-accent" size={24} />
              <span className="text-sm text-muted-foreground">Total Trades</span>
            </div>
            <div className="text-3xl font-bold font-mono text-accent">
              {performance.totalTrades}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              ${performance.volumeTraded.toLocaleString()} volume
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="glow-border-accent bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkle className="text-accent" size={24} weight="fill" />
              <span className="text-sm text-muted-foreground">Casual Score</span>
            </div>
            <div className="text-3xl font-bold font-mono text-accent">
              +{performance.casualScoreEarned}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Score: {performance.sessionScore} pts
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="text-secondary" size={24} />
              <span className="text-sm text-muted-foreground">Clan Points</span>
            </div>
            <div className="text-3xl font-bold font-mono text-secondary">
              +{performance.clanContribution}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Contributed to clan
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendUp className="text-primary" size={24} />
              Best Trade
            </h2>
            {performance.bestTrade ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <div>
                    <div className="font-bold text-lg">{performance.bestTrade.assetSymbol}</div>
                    <div className="text-sm text-muted-foreground">{performance.bestTrade.assetName}</div>
                  </div>
                  <Badge variant="default" className="text-lg px-4 py-2">
                    {performance.bestTrade.type.toUpperCase()}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-muted/20">
                    <div className="text-xs text-muted-foreground mb-1">Entry Price</div>
                    <div className="font-mono font-bold">${performance.bestTrade.entryPrice.toFixed(2)}</div>
                  </div>
                  <div className="p-3 rounded bg-muted/20">
                    <div className="text-xs text-muted-foreground mb-1">Exit Price</div>
                    <div className="font-mono font-bold">${performance.bestTrade.exitPrice?.toFixed(2)}</div>
                  </div>
                  <div className="p-3 rounded bg-muted/20">
                    <div className="text-xs text-muted-foreground mb-1">Leverage</div>
                    <div className="font-mono font-bold">{performance.bestTrade.leverage}x</div>
                  </div>
                  <div className="p-3 rounded bg-primary/20 border border-primary/30">
                    <div className="text-xs text-muted-foreground mb-1">Profit</div>
                    <div className="font-mono font-bold text-primary">
                      +${(performance.bestTrade.realizedPnL || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No completed trades
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendDown className="text-destructive" size={24} />
              Worst Trade
            </h2>
            {performance.worstTrade ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                  <div>
                    <div className="font-bold text-lg">{performance.worstTrade.assetSymbol}</div>
                    <div className="text-sm text-muted-foreground">{performance.worstTrade.assetName}</div>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {performance.worstTrade.type.toUpperCase()}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-muted/20">
                    <div className="text-xs text-muted-foreground mb-1">Entry Price</div>
                    <div className="font-mono font-bold">${performance.worstTrade.entryPrice.toFixed(2)}</div>
                  </div>
                  <div className="p-3 rounded bg-muted/20">
                    <div className="text-xs text-muted-foreground mb-1">Exit Price</div>
                    <div className="font-mono font-bold">${performance.worstTrade.exitPrice?.toFixed(2)}</div>
                  </div>
                  <div className="p-3 rounded bg-muted/20">
                    <div className="text-xs text-muted-foreground mb-1">Leverage</div>
                    <div className="font-mono font-bold">{performance.worstTrade.leverage}x</div>
                  </div>
                  <div className="p-3 rounded bg-destructive/20 border border-destructive/30">
                    <div className="text-xs text-muted-foreground mb-1">Loss</div>
                    <div className="font-mono font-bold text-destructive">
                      ${(performance.worstTrade.realizedPnL || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No completed trades
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Medal className="text-accent" size={24} weight="fill" />
            Advanced Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-muted/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="text-muted-foreground" size={20} />
                <span className="text-sm text-muted-foreground">Avg Hold Time</span>
              </div>
              <div className="font-mono font-bold">
                {formatTime(performance.averageHoldTime)}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendDown className="text-muted-foreground" size={20} />
                <span className="text-sm text-muted-foreground">Max Drawdown</span>
              </div>
              <div className="font-mono font-bold text-destructive">
                ${performance.maxDrawdown.toFixed(2)}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/20">
              <div className="flex items-center gap-2 mb-2">
                <ChartBar className="text-muted-foreground" size={20} />
                <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
              </div>
              <div className="font-mono font-bold">
                {performance.sharpeRatio.toFixed(2)}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/20">
              <div className="flex items-center gap-2 mb-2">
                <Target className="text-muted-foreground" size={20} />
                <span className="text-sm text-muted-foreground">Accuracy</span>
              </div>
              <div className="font-mono font-bold">
                {performance.accuracy.toFixed(1)}%
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="flex gap-4 justify-center"
      >
        <Button size="lg" variant="outline" onClick={onBackToDashboard}>
          Back to Dashboard
        </Button>
        <Button size="lg" className="glow-border-accent" onClick={onStartNewSession}>
          <Lightning size={20} weight="fill" />
          Start New Session
          <ArrowRight size={20} />
        </Button>
      </motion.div>
    </div>
  )
}
