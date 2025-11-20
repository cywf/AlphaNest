import { MapTrifold } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { clanEngine } from '@/modules/clans/clanEngine'

interface MiniMapNavProps {
  onOpenFullMap: () => void
}

const CLAN_COLORS = ['#63dcff', '#ff2e97', '#00ff9f', '#ffd60a', '#9d4edd']

export function MiniMapNav({ onOpenFullMap }: MiniMapNavProps) {
  const clans = clanEngine.getAllClans()

  const topClans = clans
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((clan, index) => ({
      ...clan,
      color: CLAN_COLORS[index % CLAN_COLORS.length],
      territories: Math.floor(clan.score / 1000),
    }))

  return (
    <Card className="glow-border bg-card/50 backdrop-blur-sm p-4 w-64">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-primary flex items-center gap-2">
          <MapTrifold className="h-4 w-4" />
          Territory Control
        </h3>
      </div>

      <div className="relative h-32 mb-3 bg-background/50 rounded-lg border border-primary/20 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-px">
          {Array.from({ length: 48 }).map((_, i) => {
            const clanIndex = Math.floor(Math.random() * topClans.length)
            const clan = topClans[clanIndex]
            const isEmpty = Math.random() > 0.7

            return (
              <div
                key={i}
                className="transition-colors duration-300"
                style={{
                  backgroundColor: isEmpty
                    ? 'transparent'
                    : clan
                    ? `${clan.color}40`
                    : 'transparent',
                }}
              />
            )
          })}
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      </div>

      <div className="space-y-2 mb-3">
        {topClans.map((clan) => (
          <div key={clan.id} className="flex items-center gap-2 text-xs">
            <div
              className="w-3 h-3 rounded-sm border border-primary/30"
              style={{ backgroundColor: clan.color }}
            />
            <span className="flex-1 truncate">{clan.name}</span>
            <span className="text-muted-foreground">{clan.territories}</span>
          </div>
        ))}
      </div>

      <Button
        size="sm"
        onClick={onOpenFullMap}
        className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
      >
        <MapTrifold className="h-4 w-4 mr-2" />
        Open Full Map
      </Button>
    </Card>
  )
}
