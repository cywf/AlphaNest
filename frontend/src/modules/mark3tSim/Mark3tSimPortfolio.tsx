import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TrendUp, TrendDown, X, Wallet, ChartBar, Target, Sparkle } from '@phosphor-icons/react'
import { mark3tSimEngine } from './Mark3tSimEngine'
import type { VirtualPortfolio, VirtualTrade } from './mark3tSimTypes'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface Mark3tSimPortfolioProps {
  sessionId: string
  onRefresh: () => void
}

export function Mark3tSimPortfolio({ sessionId, onRefresh }: Mark3tSimPortfolioProps) {
  const [portfolio, setPortfolio] = useState<VirtualPortfolio | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const loadPortfolio = () => {
      const data = mark3tSimEngine.calculatePortfolio(sessionId)
      if (data) {
        setPortfolio(data)
      }
    }

    loadPortfolio()
    const interval = setInterval(loadPortfolio, 2000)

    return () => clearInterval(interval)
  }, [sessionId, refreshKey])

  const handleCloseTrade = (tradeId: string) => {
    const closedTrade = mark3tSimEngine.closeTrade(sessionId, tradeId)
    if (closedTrade) {
      const pnl = closedTrade.realizedPnL || 0
      toast.success('Trade closed!', {
        description: `Realized P/L: ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`,
      })
      setRefreshKey(prev => prev + 1)
      onRefresh()
    } else {
      toast.error('Failed to close trade')
    }
  }

  if (!portfolio) {
    return <div>Loading portfolio...</div>
  }

  const getTradeStatusColor = (status: VirtualTrade['status']) => {
    switch (status) {
      case 'open':
        return 'bg-primary text-primary-foreground'
      case 'closed':
        return 'bg-secondary text-secondary-foreground'
      case 'liquidated':
        return 'bg-destructive text-destructive-foreground'
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'extreme':
        return 'bg-destructive/20 text-destructive'
      case 'high':
        return 'bg-accent/20 text-accent'
      case 'medium':
        return 'bg-secondary/20 text-secondary'
      default:
        return 'bg-primary/20 text-primary'
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="text-primary" size={24} />
              <span className="text-sm text-muted-foreground">Available Balance</span>
            </div>
            <div className="text-2xl font-bold font-mono text-primary">
              ${portfolio.balance.toLocaleString()}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <ChartBar className="text-accent" size={24} />
              <span className="text-sm text-muted-foreground">Total Value</span>
            </div>
            <div className="text-2xl font-bold font-mono text-accent">
              ${portfolio.totalValue.toLocaleString()}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-secondary" size={24} />
              <span className="text-sm text-muted-foreground">Total P/L</span>
            </div>
            <div className={`text-2xl font-bold font-mono ${portfolio.totalPnL >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {portfolio.totalPnL >= 0 ? '+' : ''}${portfolio.totalPnL.toFixed(2)}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendUp className="text-primary" size={24} />
              <span className="text-sm text-muted-foreground">Win Rate</span>
            </div>
            <div className="text-2xl font-bold font-mono text-primary">
              {portfolio.winRate.toFixed(1)}%
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendUp className="text-primary" size={24} />
                Open Positions
              </span>
              <Badge variant="outline">{portfolio.openTrades.length} active</Badge>
            </h2>

            {portfolio.openTrades.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No open positions. Start trading to see positions here.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Entry</TableHead>
                      <TableHead>Current</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Leverage</TableHead>
                      <TableHead>P/L</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portfolio.openTrades.map((trade, index) => (
                      <motion.tr
                        key={trade.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group hover:bg-muted/20"
                      >
                        <TableCell>
                          <div>
                            <div className="font-bold">{trade.assetSymbol}</div>
                            <div className="text-xs text-muted-foreground">{trade.assetName}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'}>
                            {trade.type === 'buy' ? <TrendUp size={14} /> : <TrendDown size={14} />}
                            {trade.type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">${trade.entryPrice.toFixed(2)}</TableCell>
                        <TableCell className="font-mono">${trade.currentPrice.toFixed(2)}</TableCell>
                        <TableCell className="font-mono">${trade.amount.toFixed(2)}</TableCell>
                        <TableCell className="font-mono">{trade.leverage}x</TableCell>
                        <TableCell>
                          <div className={`font-mono font-bold ${trade.unrealizedPnL >= 0 ? 'text-primary' : 'text-destructive'}`}>
                            {trade.unrealizedPnL >= 0 ? '+' : ''}${trade.unrealizedPnL.toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRiskColor(trade.riskLevel)}>
                            {trade.riskLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCloseTrade(trade.id)}
                          >
                            <X size={16} />
                            Close
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>

          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ChartBar className="text-secondary" size={24} />
                Closed Positions
              </span>
              <Badge variant="outline">{portfolio.closedTrades.length} total</Badge>
            </h2>

            {portfolio.closedTrades.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No closed positions yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Entry</TableHead>
                      <TableHead>Exit</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Realized P/L</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portfolio.closedTrades.slice(-10).reverse().map((trade, index) => (
                      <motion.tr
                        key={trade.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group hover:bg-muted/20"
                      >
                        <TableCell>
                          <div>
                            <div className="font-bold">{trade.assetSymbol}</div>
                            <div className="text-xs text-muted-foreground">{trade.assetName}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'}>
                            {trade.type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">${trade.entryPrice.toFixed(2)}</TableCell>
                        <TableCell className="font-mono">${trade.exitPrice?.toFixed(2)}</TableCell>
                        <TableCell className="font-mono">${trade.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className={`font-mono font-bold ${(trade.realizedPnL || 0) >= 0 ? 'text-primary' : 'text-destructive'}`}>
                            {(trade.realizedPnL || 0) >= 0 ? '+' : ''}${(trade.realizedPnL || 0).toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTradeStatusColor(trade.status)}>
                            {trade.status}
                          </Badge>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <h3 className="text-lg font-bold mb-4">Session Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded bg-muted/20">
                <span className="text-sm text-muted-foreground">Initial Balance</span>
                <span className="font-mono font-bold">${portfolio.initialBalance.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-muted/20">
                <span className="text-sm text-muted-foreground">Total Trades</span>
                <span className="font-mono font-bold">{portfolio.tradeCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-muted/20">
                <span className="text-sm text-muted-foreground">Unrealized P/L</span>
                <span className={`font-mono font-bold ${portfolio.unrealizedPnL >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {portfolio.unrealizedPnL >= 0 ? '+' : ''}${portfolio.unrealizedPnL.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-muted/20">
                <span className="text-sm text-muted-foreground">Realized P/L</span>
                <span className={`font-mono font-bold ${portfolio.realizedPnL >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {portfolio.realizedPnL >= 0 ? '+' : ''}${portfolio.realizedPnL.toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          <Card className="glow-border-accent bg-card/50 backdrop-blur-sm p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Sparkle size={20} weight="fill" className="text-accent" />
              AI Portfolio Analysis
            </h3>
            <div className="space-y-2 text-sm">
              <div className="p-3 rounded bg-primary/10 border border-primary/30">
                <div className="font-bold text-primary mb-1">Portfolio Health</div>
                <div className="text-muted-foreground">
                  {portfolio.winRate > 60 ? 'Excellent performance!' : portfolio.winRate > 40 ? 'Good balance maintained' : 'Consider risk adjustment'}
                </div>
              </div>
              <div className="p-3 rounded bg-accent/10 border border-accent/30">
                <div className="font-bold text-accent mb-1">Diversification</div>
                <div className="text-muted-foreground">
                  {portfolio.openTrades.length > 3 ? 'Well diversified' : 'Consider spreading positions'}
                </div>
              </div>
              <div className="p-3 rounded bg-secondary/10 border border-secondary/30">
                <div className="font-bold text-secondary mb-1">Risk Management</div>
                <div className="text-muted-foreground">
                  Monitor high-leverage positions closely
                </div>
              </div>
            </div>
          </Card>

          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Profit %</span>
                <span className={`font-mono font-bold ${portfolio.totalPnL >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {portfolio.totalPnL >= 0 ? '+' : ''}{((portfolio.totalPnL / portfolio.initialBalance) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Winning Trades</span>
                <span className="font-mono">{portfolio.closedTrades.filter(t => (t.realizedPnL || 0) > 0).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Losing Trades</span>
                <span className="font-mono">{portfolio.closedTrades.filter(t => (t.realizedPnL || 0) <= 0).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Open Positions</span>
                <span className="font-mono">{portfolio.openTrades.length}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
