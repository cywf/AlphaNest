import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkle, TrendUp, Warning, Lightbulb } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface AIRecommendationChipProps {
  type: 'suggestion' | 'insight' | 'warning' | 'opportunity'
  title: string
  description: string
  onView?: () => void
  className?: string
}

export function AIRecommendationChip({
  type,
  title,
  description,
  onView,
  className,
}: AIRecommendationChipProps) {
  const getIcon = () => {
    switch (type) {
      case 'suggestion':
        return <Lightbulb size={18} />
      case 'insight':
        return <Sparkle size={18} />
      case 'warning':
        return <Warning size={18} />
      case 'opportunity':
        return <TrendUp size={18} />
    }
  }

  const getColors = () => {
    switch (type) {
      case 'suggestion':
        return {
          bg: 'bg-primary/10',
          border: 'border-primary/30',
          text: 'text-primary',
          glow: 'oklch(0.75 0.15 195 / 0.3)',
        }
      case 'insight':
        return {
          bg: 'bg-accent/10',
          border: 'border-accent/30',
          text: 'text-accent',
          glow: 'oklch(0.70 0.25 340 / 0.3)',
        }
      case 'warning':
        return {
          bg: 'bg-destructive/10',
          border: 'border-destructive/30',
          text: 'text-destructive',
          glow: 'oklch(0.55 0.25 20 / 0.3)',
        }
      case 'opportunity':
        return {
          bg: 'bg-secondary/10',
          border: 'border-secondary/30',
          text: 'text-secondary',
          glow: 'oklch(0.55 0.22 330 / 0.3)',
        }
    }
  }

  const colors = getColors()

  return (
    <Card
      className={cn(
        'p-4 border backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4',
        colors.bg,
        colors.border,
        className
      )}
      style={{
        boxShadow: `0 0 20px ${colors.glow}`,
      }}
    >
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-lg shrink-0', colors.bg, colors.text)}>{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <h4 className={cn('font-bold text-sm mb-1', colors.text)}>{title}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
          {onView && (
            <Button variant="ghost" size="sm" className={cn('mt-2 h-7 text-xs', colors.text)} onClick={onView}>
              View Details →
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
