import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TrendUp, TrendDown, Lightning, Warning, CheckCircle, Sparkle } from '@phosphor-icons/react'
import { mark3tSimEngine } from './Mark3tSimEngine'
import { generateSimAssets } from './mockMark3tSimFeed'
import type { SimAsset, VirtualTrade } from './mark3tSimTypes'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface Mark3tSimTradePanelProps {
  sessionId: string
  onTradeComplete: () => void
}

export function Mark3tSimTradePanel({ sessionId, onTradeComplete }: Mark3tSimTradePanelProps) {
  const [assets, setAssets] = useState<SimAsset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<SimAsset | null>(null)
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState<string>('1000')
  const [leverage, setLeverage] = useState<number>(1)
  const [simulateGas, setSimulateGas] = useState<boolean>(true)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingTrade, setPendingTrade] = useState<any>(null)
  const [filterSource, setFilterSource] = useState<string>('all')

  useEffect(() => {
    const allAssets = generateSimAssets()
    setAssets(allAssets)
    if (allAssets.length > 0 && !selectedAsset) {
      setSelectedAsset(allAssets[0])
    }

    const interval = setInterval(() => {
      const updated = generateSimAssets()
      setAssets(updated)
      if (selectedAsset) {
        const updatedSelected = updated.find(a => a.id === selectedAsset.id)
        if (updatedSelected) {
          setSelectedAsset(updatedSelected)
        }
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const filteredAssets = filterSource === 'all'
    ? assets
    : assets.filter(a => a.source === filterSource)

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'extreme':
        return 'text-destructive'
      case 'high':
        return 'text-accent'
      case 'medium':
        return 'text-secondary'
      default:
        return 'text-primary'
    }
  }

  const getRiskLevel = () => {
    if (!selectedAsset) return 'low'
    if (leverage >= 10 || selectedAsset.volatility === 'extreme') return 'extreme'
    if (leverage >= 5 || selectedAsset.volatility === 'high') return 'high'
    if (leverage >= 2 || selectedAsset.volatility === 'medium') return 'medium'
    return 'low'
  }

  const calculateProjectedPnL = () => {
    if (!selectedAsset) return 0
    const amountNum = parseFloat(amount) || 0
    const priceChange = selectedAsset.change24h / 100
    const direction = tradeType === 'buy' ? 1 : -1
    return amountNum * priceChange * direction * leverage
  }

  const handleTradeClick = () => {
    if (!selectedAsset) return
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Invalid amount')
      return
    }

    const volatilityMultiplier =
      selectedAsset.volatility === 'extreme' ? 0.15 :
      selectedAsset.volatility === 'high' ? 0.10 :
      selectedAsset.volatility === 'medium' ? 0.05 : 0.03

    const liquidationPrice = tradeType === 'buy'
      ? selectedAsset.currentPrice * (1 - volatilityMultiplier * leverage)
      : selectedAsset.currentPrice * (1 + volatilityMultiplier * leverage)

    setPendingTrade({
      asset: selectedAsset,
      type: tradeType,
      amount: amountNum,
      leverage,
      simulateGas,
      entryPrice: selectedAsset.currentPrice,
      liquidationPrice,
      riskLevel: getRiskLevel(),
      projectedPnL: calculateProjectedPnL(),
    })
    setShowConfirmDialog(true)
  }

  const handleConfirmTrade = () => {
    if (!pendingTrade) return

    const trade = mark3tSimEngine.simulateTrade(
      sessionId,
      pendingTrade.asset.id,
      pendingTrade.type,
      pendingTrade.amount,
      pendingTrade.leverage,
      pendingTrade.simulateGas
    )

    if (trade) {
      toast.success('Trade executed!', {
        description: `${pendingTrade.type.toUpperCase()} ${pendingTrade.asset.symbol} @ $${pendingTrade.entryPrice.toFixed(2)}`,
      })
      onTradeComplete()
    } else {
      toast.error('Trade failed', {
        description: 'Insufficient balance or invalid parameters',
      })
    }

    setShowConfirmDialog(false)
    setPendingTrade(null)
  }

  if (!selectedAsset) return <div>Loading...</div>

  const riskLevel = getRiskLevel()
  const projectedPnL = calculateProjectedPnL()

  return (
    <div className="space-y-6">
      <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Lightning className="text-accent" size={24} weight="fill" />
            Trade Panel
          </h2>
          <Badge className="glow-border-accent">
            <Sparkle size={16} weight="fill" className="mr-1" />
            AI Assist Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>Asset Source</Label>
              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="arbscan">ArbScan</SelectItem>
                  <SelectItem value="coin-fisher">Coin-Fisher</SelectItem>
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="stak3z">STAK3Z</SelectItem>
                  <SelectItem value="market-analysis">Market Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Select Asset</Label>
              <Select
                value={selectedAsset.id}
                onValueChange={(id) => {
                  const asset = assets.find(a => a.id === id)
                  if (asset) setSelectedAsset(asset)
                }}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filteredAssets.map(asset => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.symbol} - ${asset.currentPrice.toFixed(2)} ({asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Card className="p-4 bg-muted/20 border-border/30">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Price</span>
                  <span className="font-mono font-bold">${selectedAsset.currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">24h Change</span>
                  <span className={`font-mono flex items-center gap-1 ${selectedAsset.change24h >= 0 ? 'text-primary' : 'text-destructive'}`}>
                    {selectedAsset.change24h >= 0 ? <TrendUp size={16} /> : <TrendDown size={16} />}
                    {selectedAsset.change24h >= 0 ? '+' : ''}{selectedAsset.change24h.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Volatility</span>
                  <Badge className={
                    selectedAsset.volatility === 'extreme' ? 'bg-destructive text-destructive-foreground' :
                    selectedAsset.volatility === 'high' ? 'bg-accent text-accent-foreground' :
                    selectedAsset.volatility === 'medium' ? 'bg-secondary text-secondary-foreground' :
                    'bg-muted text-muted-foreground'
                  }>
                    {selectedAsset.volatility}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sentiment</span>
                  <Badge variant="outline" className={
                    selectedAsset.sentiment === 'bullish' ? 'border-primary text-primary' :
                    selectedAsset.sentiment === 'bearish' ? 'border-destructive text-destructive' :
                    'border-muted-foreground text-muted-foreground'
                  }>
                    {selectedAsset.sentiment}
                  </Badge>
                </div>
              </div>
            </Card>

            <div>
              <Label>Trade Type</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={tradeType === 'buy' ? 'default' : 'outline'}
                  onClick={() => setTradeType('buy')}
                  className={tradeType === 'buy' ? 'glow-border' : ''}
                >
                  <TrendUp size={20} />
                  Buy / Long
                </Button>
                <Button
                  variant={tradeType === 'sell' ? 'default' : 'outline'}
                  onClick={() => setTradeType('sell')}
                  className={tradeType === 'sell' ? 'glow-border' : ''}
                >
                  <TrendDown size={20} />
                  Sell / Short
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-2 font-mono"
                placeholder="1000"
              />
            </div>

            <div>
              <Label>Leverage: {leverage}x</Label>
              <Slider
                value={[leverage]}
                onValueChange={([value]) => setLeverage(value)}
                min={1}
                max={20}
                step={1}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1x</span>
                <span>5x</span>
                <span>10x</span>
                <span>20x</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="gas">Simulate Gas Fee</Label>
              <Switch
                id="gas"
                checked={simulateGas}
                onCheckedChange={setSimulateGas}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Card className={`p-6 border-2 ${
              riskLevel === 'extreme' ? 'border-destructive bg-destructive/10' :
              riskLevel === 'high' ? 'border-accent bg-accent/10' :
              riskLevel === 'medium' ? 'border-secondary bg-secondary/10' :
              'border-primary bg-primary/10'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <Warning size={24} className={getRiskColor(riskLevel)} weight="fill" />
                <h3 className="font-bold text-lg">Risk Assessment</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Risk Level</span>
                  <div className={`text-2xl font-bold ${getRiskColor(riskLevel)}`}>
                    {riskLevel.toUpperCase()}
                  </div>
                </div>
                <div className="pt-3 border-t border-border/30">
                  <div className="text-sm text-muted-foreground mb-2">Risk Factors:</div>
                  <ul className="text-sm space-y-1">
                    <li>• Leverage: {leverage}x multiplier</li>
                    <li>• Volatility: {selectedAsset.volatility}</li>
                    <li>• Market sentiment: {selectedAsset.sentiment}</li>
                    {leverage > 10 && <li className="text-destructive">• Extreme leverage warning!</li>}
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-muted/20 border-border/30">
              <h3 className="font-bold mb-4">Projected P/L</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Entry Price</span>
                  <span className="font-mono">${selectedAsset.currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Position Size</span>
                  <span className="font-mono">${parseFloat(amount || '0').toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Leverage</span>
                  <span className="font-mono">{leverage}x</span>
                </div>
                {simulateGas && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Gas Fee (est.)</span>
                    <span className="font-mono text-destructive">-$2.50</span>
                  </div>
                )}
                <div className="pt-2 mt-2 border-t border-border/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">24h Projection</span>
                    <span className={`font-mono font-bold text-lg ${projectedPnL >= 0 ? 'text-primary' : 'text-destructive'}`}>
                      {projectedPnL >= 0 ? '+' : ''}${projectedPnL.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Button
              size="lg"
              className="w-full glow-border-accent"
              onClick={handleTradeClick}
            >
              <Lightning size={20} weight="fill" />
              Execute Trade
            </Button>

            <Card className="p-4 bg-primary/10 border-primary/30">
              <div className="flex items-center gap-2 text-sm">
                <Sparkle size={16} weight="fill" className="text-primary" />
                <span className="text-primary">AI Recommendation: {selectedAsset.sentiment === 'bullish' ? 'Consider long position' : selectedAsset.sentiment === 'bearish' ? 'Consider short position' : 'Wait for clearer signal'}</span>
              </div>
            </Card>
          </div>
        </div>
      </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="glow-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightning className="text-accent" size={24} weight="fill" />
              Confirm Trade
            </DialogTitle>
            <DialogDescription>
              Review your trade details before execution
            </DialogDescription>
          </DialogHeader>
          {pendingTrade && (
            <div className="space-y-4">
              <Card className="p-4 bg-muted/20">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Asset</span>
                    <span className="font-bold">{pendingTrade.asset.symbol}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <Badge variant={pendingTrade.type === 'buy' ? 'default' : 'secondary'}>
                      {pendingTrade.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Entry Price</span>
                    <span className="font-mono">${pendingTrade.entryPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="font-mono">${pendingTrade.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Leverage</span>
                    <span className="font-mono">{pendingTrade.leverage}x</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Liquidation Price</span>
                    <span className="font-mono text-destructive">${pendingTrade.liquidationPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <span className="text-sm text-muted-foreground">Risk Level</span>
                    <Badge className={
                      pendingTrade.riskLevel === 'extreme' ? 'bg-destructive text-destructive-foreground' :
                      pendingTrade.riskLevel === 'high' ? 'bg-accent text-accent-foreground' :
                      pendingTrade.riskLevel === 'medium' ? 'bg-secondary text-secondary-foreground' :
                      'bg-primary text-primary-foreground'
                    }>
                      {pendingTrade.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button className="glow-border-accent" onClick={handleConfirmTrade}>
              <CheckCircle size={20} weight="fill" />
              Confirm Trade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
