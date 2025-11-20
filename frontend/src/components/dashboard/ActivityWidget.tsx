import { ReactNode, useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ActivityWidgetProps {
  title: string
  value: string | number
  icon: ReactNode
  color: string
  trend?: string
  delay?: number
}

export function ActivityWidget({ title, value, icon, color, trend, delay = 0 }: ActivityWidgetProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <Card
      className={cn(
        'glow-border bg-card/50 backdrop-blur-sm p-6 transition-all duration-700',
        'hover:bg-card/70 hover:scale-105 hover:shadow-lg',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{title}</span>
        <div className={cn('transition-transform hover:scale-110', color)}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-bold font-mono">{value}</span>
        {trend && (
          <span className={cn(
            'text-xs font-medium px-2 py-1 rounded-full',
            'bg-chart-2/20 text-chart-2 border border-chart-2/30',
            'animate-pulse'
          )}>
            {trend}
          </span>
        )}
      </div>
    </Card>
  )
}
