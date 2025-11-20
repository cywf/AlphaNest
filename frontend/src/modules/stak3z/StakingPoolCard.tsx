import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { TrendUp, Drop, Warning, Lightning } from '@phosphor-icons/react'
import type { Pool } from './stakeTypes'
import { cn } from '@/lib/utils'

interface StakingPoolCardProps {
  pool: Pool
  onClick: () => void
}

const CHAIN_LABELS: Record<string, string> = {
  ethereum: 'ETH',
  polygon: 'MATIC',
  bsc: 'BSC',
  arbitrum: 'ARB',
  optimism: 'OP',
  avalanche: 'AVAX',
}

const RISK_CONFIG = {
  low: {
    color: 'text-chart-2',
    bgColor: 'bg-chart-2/10',
    borderColor: 'border-chart-2/40',
    label: 'Low Risk',
    glowColor: 'shadow-[0_0_20px_rgba(99,220,255,0.3)]',
  },
  medium: {
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    borderColor: 'border-secondary/40',
    label: 'Medium Risk',
    glowColor: 'shadow-[0_0_20px_rgba(216,107,224,0.3)]',
  },
  high: {
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/40',
    label: 'High Risk',
    glowColor: 'shadow-[0_0_20px_rgba(255,107,162,0.3)]',
  },
}

const STATUS_CONFIG = {
  hot: { icon: <Lightning className="h-3 w-3" />, label: 'HOT', color: 'text-chart-4' },
  stable: { icon: <Drop className="h-3 w-3" />, label: 'STABLE', color: 'text-chart-2' },
  'high-risk': { icon: <Warning className="h-3 w-3" />, label: 'HIGH RISK', color: 'text-destructive' },
  trending: { icon: <TrendUp className="h-3 w-3" />, label: 'TRENDING', color: 'text-primary' },
}

export function StakingPoolCard({ pool, onClick }: StakingPoolCardProps) {
  const riskConfig = RISK_CONFIG[pool.riskTier]
  const statusConfig = STATUS_CONFIG[pool.status]
  
  const formatTVL = (tvl: number) => {
    if (tvl >= 1000000) return `$${(tvl / 1000000).toFixed(2)}M`
    if (tvl >= 1000) return `$${(tvl / 1000).toFixed(0)}K`
    return `$${tvl.toFixed(0)}`
  }

  return (
    <Card
      onClick={onClick}
      className={cn(
        'group cursor-pointer transition-all duration-300',
        'bg-card/50 backdrop-blur-sm border-2',
        'hover:scale-[1.02] hover:bg-card/70',
        riskConfig.borderColor,
        'hover:' + riskConfig.glowColor,
        'relative overflow-hidden'
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl -z-10" />
      
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
              {pool.name}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {pool.tokens.map((token, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-xs bg-background/50 border-primary/30"
                >
                  {token.symbol}
                </Badge>
              ))}
            </div>
          </div>
          
          <Badge className={cn('flex items-center gap-1', statusConfig.color, 'bg-background/50 border-current/30')}>
            {statusConfig.icon}
            {statusConfig.label}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-muted-foreground block mb-1">APY</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">
                {pool.apy.total.toFixed(2)}%
              </span>
            </div>
            <div className="mt-1 h-1.5 bg-background/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-500 group-hover:animate-pulse"
                style={{ width: `${Math.min(pool.apy.total, 100)}%` }}
              />
            </div>
          </div>

          <div>
            <span className="text-xs text-muted-foreground block mb-1">TVL</span>
            <span className="text-2xl font-bold block">
              {formatTVL(pool.tvl)}
            </span>
            <span className="text-xs text-muted-foreground">
              {pool.stakerCount.toLocaleString()} stakers
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <div className="flex items-center gap-2">
            <Badge className={cn('text-xs', riskConfig.color, riskConfig.bgColor, 'border-current/30')}>
              {riskConfig.label}
            </Badge>
            <Badge variant="outline" className="text-xs bg-background/50 border-primary/20">
              {CHAIN_LABELS[pool.chain]}
            </Badge>
          </div>

          <Button
            size="sm"
            className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 group-hover:shadow-[0_0_15px_rgba(99,220,255,0.4)]"
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
          >
            Stake Now
          </Button>
        </div>
      </div>

      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r transition-opacity',
          'from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100'
        )}
      />
    </Card>
  )
}
