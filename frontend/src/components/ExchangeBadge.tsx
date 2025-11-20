import { Badge } from '@/components/ui/badge'
import type { Exchange } from '@/types/arbitrage'
import { getExchangeColor } from '@/lib/arbitrage'
import { cn } from '@/lib/utils'

interface ExchangeBadgeProps {
  exchange: Exchange
  active?: boolean
  onClick?: () => void
  className?: string
}

export function ExchangeBadge({ exchange, active = true, onClick, className }: ExchangeBadgeProps) {
  const color = getExchangeColor(exchange)
  
  return (
    <Badge
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 font-medium cursor-pointer transition-all duration-300',
        'border border-current select-none',
        active
          ? 'opacity-100'
          : 'opacity-40 grayscale',
        onClick && 'hover:scale-105',
        className
      )}
      style={{
        color: active ? color : 'oklch(0.5 0.05 285)',
        boxShadow: active
          ? `0 0 10px ${color}40, 0 0 5px ${color}60`
          : 'none',
      }}
      variant="outline"
    >
      {exchange}
    </Badge>
  )
}
