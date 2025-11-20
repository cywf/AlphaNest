import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ExchangeBadge } from './ExchangeBadge'
import { EXCHANGES } from '@/types/arbitrage'
import type { Exchange } from '@/types/arbitrage'
import { Play, Pause } from '@phosphor-icons/react'

interface HeaderProps {
  enabledExchanges: Exchange[]
  onToggleExchange: (exchange: Exchange) => void
  isPaused: boolean
  onTogglePause: () => void
  timeUntilUpdate: number
  updateInterval: number
}

export function Header({
  enabledExchanges,
  onToggleExchange,
  isPaused,
  onTogglePause,
  timeUntilUpdate,
  updateInterval,
}: HeaderProps) {
  const progressPercentage = ((updateInterval - timeUntilUpdate) / updateInterval) * 100

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-wider text-primary drop-shadow-[0_0_20px_rgba(99,220,255,0.5)]">
          ALPHA-N3ST Scanner
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Real-time price analysis across major exchanges
        </p>
      </div>

      <Card className="p-6 glow-border bg-card/50 backdrop-blur-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Exchange Filters
            </h2>
            <p className="text-xs text-muted-foreground">
              {enabledExchanges.length} of {EXCHANGES.length} enabled
            </p>
          </div>

          <Button
            variant={isPaused ? 'default' : 'outline'}
            size="sm"
            onClick={onTogglePause}
            className="gap-2 font-medium"
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

        <div className="flex flex-wrap gap-2">
          {EXCHANGES.map((exchange) => (
            <ExchangeBadge
              key={exchange}
              exchange={exchange}
              active={enabledExchanges.includes(exchange)}
              onClick={() => onToggleExchange(exchange)}
            />
          ))}
        </div>

        {!isPaused && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Next update in {Math.ceil(timeUntilUpdate / 1000)}s</span>
              <span>Auto-refresh enabled</span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-1 bg-muted/30"
            />
          </div>
        )}
      </Card>
    </div>
  )
}
