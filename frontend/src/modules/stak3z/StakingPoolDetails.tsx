import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { stakeEngine } from './stakeEngine'
import { WalletConnectionPanel } from '@/modules/walletIntegration/WalletConnectionPanel'
import { useMetaMask } from '@/modules/walletIntegration/useMetaMask'
import type { Pool, PoolHistoricalData, LiquidityFlow } from './stakeTypes'
import {
  ArrowLeft,
  ChartLine,
  Drop,
  Warning,
  TrendUp,
  Lightning,
  Info,
  Coins,
  Clock,
  Users,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface StakingPoolDetailsProps {
  poolId: string
  onBack: () => void
}

const CHAIN_LABELS: Record<string, string> = {
  ethereum: 'Ethereum',
  polygon: 'Polygon',
  bsc: 'BSC',
  arbitrum: 'Arbitrum',
  optimism: 'Optimism',
  avalanche: 'Avalanche',
}

const RISK_CONFIG = {
  low: { color: 'text-chart-2', bgColor: 'bg-chart-2/10', borderColor: 'border-chart-2/40' },
  medium: { color: 'text-secondary', bgColor: 'bg-secondary/10', borderColor: 'border-secondary/40' },
  high: { color: 'text-accent', bgColor: 'bg-accent/10', borderColor: 'border-accent/40' },
}

export function StakingPoolDetails({ poolId, onBack }: StakingPoolDetailsProps) {
  const [pool, setPool] = useState<Pool | null>(null)
  const [historicalData, setHistoricalData] = useState<PoolHistoricalData[]>([])
  const [liquidityFlow, setLiquidityFlow] = useState<LiquidityFlow[]>([])
  const [stakeAmount, setStakeAmount] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState('')
  const [isStaking, setIsStaking] = useState(false)
  const [isUnstaking, setIsUnstaking] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isApproved, setIsApproved] = useState(false)

  const { isConnected, address } = useMetaMask()

  useEffect(() => {
    const poolData = stakeEngine.getPoolDetails(poolId)
    setPool(poolData || null)

    if (poolData) {
      const historical = stakeEngine.getPoolHistoricalData(poolId, 30)
      setHistoricalData(historical)

      const flow = stakeEngine.getLiquidityFlow(poolId, 24)
      setLiquidityFlow(flow)
    }
  }, [poolId])

  if (!pool) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button
          variant="outline"
          onClick={onBack}
          className="mb-6 bg-background/50 border-primary/30"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card className="glow-border bg-card/50 backdrop-blur-sm p-12 text-center">
          <p className="text-muted-foreground">Pool not found</p>
        </Card>
      </div>
    )
  }

  const riskConfig = RISK_CONFIG[pool.riskTier]

  const formatTVL = (tvl: number) => {
    if (tvl >= 1000000) return `$${(tvl / 1000000).toFixed(2)}M`
    if (tvl >= 1000) return `$${(tvl / 1000).toFixed(0)}K`
    return `$${tvl.toFixed(0)}`
  }

  const handleApprove = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    setIsApproving(true)
    try {
      const txHash = await stakeEngine.approveToken(
        pool.tokens[0].address,
        '0xSTAKE_CONTRACT',
        '999999999999999999'
      )
      toast.success('Token approval successful!', {
        description: `Transaction: ${txHash.slice(0, 10)}...`,
      })
      setIsApproved(true)
    } catch (error) {
      toast.error('Approval failed', {
        description: 'Please try again',
      })
    } finally {
      setIsApproving(false)
    }
  }

  const handleStake = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!isApproved) {
      toast.error('Please approve tokens first')
      return
    }

    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setIsStaking(true)
    try {
      const tx = await stakeEngine.stake(poolId, stakeAmount, address!)
      toast.success('Stake transaction submitted!', {
        description: `Transaction: ${tx.txHash.slice(0, 10)}...`,
      })
      setStakeAmount('')
      
      setTimeout(() => {
        toast.success('Stake confirmed!', {
          description: 'Your tokens are now earning rewards',
        })
      }, 2000)
    } catch (error) {
      toast.error('Stake failed', {
        description: 'Please try again',
      })
    } finally {
      setIsStaking(false)
    }
  }

  const handleUnstake = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setIsUnstaking(true)
    try {
      const tx = await stakeEngine.unstake(poolId, unstakeAmount, address!)
      toast.success('Unstake transaction submitted!', {
        description: `Transaction: ${tx.txHash.slice(0, 10)}...`,
      })
      setUnstakeAmount('')
      
      setTimeout(() => {
        toast.success('Unstake confirmed!', {
          description: 'Your tokens have been returned',
        })
      }, 2000)
    } catch (error) {
      toast.error('Unstake failed', {
        description: 'Please try again',
      })
    } finally {
      setIsUnstaking(false)
    }
  }

  const handleClaimRewards = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    setIsClaiming(true)
    try {
      const tx = await stakeEngine.claimRewards(poolId, address!)
      toast.success('Claim transaction submitted!', {
        description: `Transaction: ${tx.txHash.slice(0, 10)}...`,
      })
      
      setTimeout(() => {
        toast.success('Rewards claimed!', {
          description: 'Tokens sent to your wallet',
        })
      }, 2000)
    } catch (error) {
      toast.error('Claim failed', {
        description: error instanceof Error ? error.message : 'Please try again',
      })
    } finally {
      setIsClaiming(false)
    }
  }

  const maxTVL = Math.max(...historicalData.map(d => d.tvl), pool.tvl)
  const maxAPY = Math.max(...historicalData.map(d => d.apy), pool.apy.total)

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
      <Button
        variant="outline"
        onClick={onBack}
        className="bg-background/50 border-primary/30 hover:bg-primary/10"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Pools
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className={cn('glow-border bg-card/50 backdrop-blur-sm p-6', riskConfig.borderColor)}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{pool.name}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {pool.tokens.map((token, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="text-sm bg-background/50 border-primary/30"
                    >
                      {token.symbol}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Badge className={cn('text-xs', riskConfig.color, riskConfig.bgColor, 'border-current/30')}>
                    {pool.riskTier.toUpperCase()} RISK
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-background/50 border-primary/20">
                    {CHAIN_LABELS[pool.chain]}
                  </Badge>
                  {pool.lockPeriod && (
                    <Badge variant="outline" className="text-xs bg-background/50 border-primary/20">
                      <Clock className="h-3 w-3 mr-1" />
                      {pool.lockPeriod} days lock
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Total APY</span>
                <span className="text-2xl font-bold text-primary">{pool.apy.total.toFixed(2)}%</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-1">TVL</span>
                <span className="text-2xl font-bold">{formatTVL(pool.tvl)}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-1">24h Volume</span>
                <span className="text-2xl font-bold">{formatTVL(pool.volume24h)}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Stakers</span>
                <span className="text-2xl font-bold">{pool.stakerCount.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ChartLine className="h-5 w-5 text-primary" />
              APY Breakdown
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Base APY</span>
                  <span className="text-sm font-bold">{pool.apy.base.toFixed(2)}%</span>
                </div>
                <Progress value={(pool.apy.base / pool.apy.total) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Boosted Rewards</span>
                  <span className="text-sm font-bold text-secondary">{pool.apy.boosted.toFixed(2)}%</span>
                </div>
                <Progress value={(pool.apy.boosted / pool.apy.total) * 100} className="h-2 bg-secondary/20" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Compounding Effect</span>
                  <span className="text-sm font-bold text-accent">{pool.apy.compounding.toFixed(2)}%</span>
                </div>
                <Progress value={(pool.apy.compounding / pool.apy.total) * 100} className="h-2 bg-accent/20" />
              </div>
            </div>
          </Card>

          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Drop className="h-5 w-5 text-primary" />
              Pool Composition
            </h2>
            <div className="space-y-4">
              {pool.composition.map((comp, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-primary" />
                      <span className="font-medium">{comp.token.name}</span>
                      <Badge variant="outline" className="text-xs">{comp.token.symbol}</Badge>
                    </div>
                    <span className="text-sm font-bold">{comp.weight.toFixed(2)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={comp.weight} className="flex-1 h-2" />
                    <span className="text-xs text-muted-foreground font-mono">
                      {parseFloat(comp.balance).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Warning className="h-5 w-5 text-accent" />
              Risk Assessment
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Impermanent Loss Risk</span>
                  <span className="text-sm font-bold text-accent">{pool.impermanentLossRisk.toFixed(1)}%</span>
                </div>
                <Progress value={Math.min(pool.impermanentLossRisk, 100)} className="h-2 bg-accent/20" />
              </div>
              <div className="p-4 bg-background/50 rounded-lg border border-accent/20">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      {pool.riskTier === 'low' && 'Low risk pool with stable assets. Minimal impermanent loss expected.'}
                      {pool.riskTier === 'medium' && 'Medium risk pool. Monitor price ratios to manage impermanent loss.'}
                      {pool.riskTier === 'high' && 'High risk pool with volatile assets. Significant impermanent loss possible.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendUp className="h-5 w-5 text-primary" />
              TVL History (30 Days)
            </h2>
            <div className="h-64 flex items-end gap-1">
              {historicalData.map((data, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-gradient-to-t from-primary/40 to-primary/10 rounded-t hover:from-primary/60 hover:to-primary/20 transition-all relative group"
                  style={{ height: `${(data.tvl / maxTVL) * 100}%` }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 backdrop-blur-sm border border-primary/30 rounded px-2 py-1 text-xs whitespace-nowrap pointer-events-none">
                    <div>{data.date.toLocaleDateString()}</div>
                    <div className="font-bold text-primary">{formatTVL(data.tvl)}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lightning className="h-5 w-5 text-secondary" />
              Liquidity Flow (24h)
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Total Inflow</span>
                  <span className="text-lg font-bold text-chart-2">
                    {formatTVL(liquidityFlow.reduce((sum, f) => sum + f.inflow, 0))}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Total Outflow</span>
                  <span className="text-lg font-bold text-accent">
                    {formatTVL(liquidityFlow.reduce((sum, f) => sum + f.outflow, 0))}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Net Flow</span>
                  <span className="text-lg font-bold text-primary">
                    {formatTVL(liquidityFlow.reduce((sum, f) => sum + f.netFlow, 0))}
                  </span>
                </div>
              </div>
              <div className="h-32 flex items-end justify-center gap-1">
                {liquidityFlow.slice(-24).map((flow, idx) => {
                  const isPositive = flow.netFlow >= 0
                  const maxAbsFlow = Math.max(...liquidityFlow.map(f => Math.abs(f.netFlow)))
                  const height = (Math.abs(flow.netFlow) / maxAbsFlow) * 100
                  
                  return (
                    <div key={idx} className="flex-1 flex flex-col justify-center items-center">
                      <div
                        className={cn(
                          'w-full rounded-t transition-all',
                          isPositive ? 'bg-chart-2/40 hover:bg-chart-2/60' : 'bg-accent/40 hover:bg-accent/60'
                        )}
                        style={{
                          height: `${height}%`,
                          minHeight: '2px',
                        }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <WalletConnectionPanel />

          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Staking Actions
            </h2>

            <Tabs defaultValue="stake" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="stake">Stake</TabsTrigger>
                <TabsTrigger value="unstake">Unstake</TabsTrigger>
              </TabsList>

              <TabsContent value="stake" className="space-y-4">
                <div>
                  <Label htmlFor="stake-amount" className="text-sm text-muted-foreground mb-2 block">
                    Amount to Stake
                  </Label>
                  <Input
                    id="stake-amount"
                    type="number"
                    placeholder="0.00"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="bg-background/50 border-primary/30"
                    disabled={!isConnected}
                  />
                  {pool.minStake && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Min: {pool.minStake} {pool.tokens[0].symbol}
                    </p>
                  )}
                </div>

                {!isApproved ? (
                  <Button
                    onClick={handleApprove}
                    disabled={!isConnected || isApproving}
                    className="w-full bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30"
                  >
                    {isApproving ? 'Approving...' : 'Approve Token'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleStake}
                    disabled={!isConnected || isStaking || !stakeAmount}
                    className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
                  >
                    {isStaking ? 'Staking...' : 'Stake Now'}
                  </Button>
                )}
              </TabsContent>

              <TabsContent value="unstake" className="space-y-4">
                <div>
                  <Label htmlFor="unstake-amount" className="text-sm text-muted-foreground mb-2 block">
                    Amount to Unstake
                  </Label>
                  <Input
                    id="unstake-amount"
                    type="number"
                    placeholder="0.00"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    className="bg-background/50 border-primary/30"
                    disabled={!isConnected}
                  />
                </div>

                <Button
                  onClick={handleUnstake}
                  disabled={!isConnected || isUnstaking || !unstakeAmount}
                  className="w-full bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30"
                >
                  {isUnstaking ? 'Unstaking...' : 'Unstake'}
                </Button>
              </TabsContent>
            </Tabs>
          </Card>

          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4">Rewards</h2>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Pending Rewards</span>
                <span className="text-2xl font-bold block">0.000000 {pool.rewardToken.symbol}</span>
                <span className="text-xs text-muted-foreground">≈ $0.00</span>
              </div>

              <Button
                onClick={handleClaimRewards}
                disabled={!isConnected || isClaiming}
                className="w-full bg-chart-4/20 hover:bg-chart-4/30 text-chart-4 border border-chart-4/30"
              >
                {isClaiming ? 'Claiming...' : 'Claim Rewards'}
              </Button>
            </div>
          </Card>

          <Card className="glow-border-accent bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-accent" />
              Pool Info
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Chain</span>
                <span className="font-medium">{CHAIN_LABELS[pool.chain]}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">24h Fees</span>
                <span className="font-medium">{formatTVL(pool.fees24h)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reward Token</span>
                <Badge variant="outline" className="text-xs">{pool.rewardToken.symbol}</Badge>
              </div>
              {pool.lockPeriod && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Lock Period</span>
                  <span className="font-medium">{pool.lockPeriod} days</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
