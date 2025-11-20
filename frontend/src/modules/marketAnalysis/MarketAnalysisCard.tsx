import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendUp, 
  Detective, 
  CurrencyCircleDollar, 
  Image as ImageIcon,
  ChartLine,
  Warning,
  Users,
  ArrowRight,
  Clock,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import type { MarketAnalysisItem } from './marketAnalysisTypes'

interface MarketAnalysisCardProps {
  item: MarketAnalysisItem
  onDeepLinkClick?: (type: string, id: string) => void
  index?: number
}

const categoryIcons = {
  'market-trend': <TrendUp size={20} />,
  'osint-alert': <Detective size={20} />,
  'whale-movement': <CurrencyCircleDollar size={20} />,
  'nft-surge': <ImageIcon size={20} />,
  'arbitrage': <ChartLine size={20} />,
  'scam-alert': <Warning size={20} />,
  'clan-activity': <Users size={20} />,
}

const categoryColors = {
  'market-trend': 'text-chart-2 border-chart-2/30 bg-chart-2/10',
  'osint-alert': 'text-chart-1 border-chart-1/30 bg-chart-1/10',
  'whale-movement': 'text-chart-4 border-chart-4/30 bg-chart-4/10',
  'nft-surge': 'text-chart-3 border-chart-3/30 bg-chart-3/10',
  'arbitrage': 'text-primary border-primary/30 bg-primary/10',
  'scam-alert': 'text-destructive border-destructive/30 bg-destructive/10',
  'clan-activity': 'text-secondary border-secondary/30 bg-secondary/10',
}

const severityColors = {
  low: 'border-chart-2/30 text-chart-2',
  medium: 'border-chart-4/30 text-chart-4',
  high: 'border-chart-1/30 text-chart-1',
  critical: 'border-destructive/30 text-destructive',
}

export function MarketAnalysisCard({ item, onDeepLinkClick, index = 0 }: MarketAnalysisCardProps) {
  const formatTimestamp = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className={cn(
          'p-4 bg-card/50 backdrop-blur-sm border-2 transition-all duration-300',
          'hover:scale-[1.02] hover:shadow-lg cursor-pointer',
          'glow-border'
        )}
        onClick={() => {
          if (item.deepLink && onDeepLinkClick) {
            onDeepLinkClick(item.deepLink.type, item.deepLink.id)
          }
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'p-2 rounded-lg flex-shrink-0 border',
              categoryColors[item.category]
            )}
          >
            {categoryIcons[item.category]}
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-sm leading-tight">
                {item.title}
              </h4>
              {item.severity && (
                <Badge
                  variant="outline"
                  className={cn('text-xs uppercase', severityColors[item.severity])}
                >
                  {item.severity}
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2">
              {item.summary}
            </p>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                {item.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs border-border/50"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock size={12} />
                {formatTimestamp(item.timestamp)}
              </div>
            </div>

            {item.deepLink && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1.5 text-primary hover:text-primary hover:bg-primary/10"
                onClick={(e) => {
                  e.stopPropagation()
                  if (onDeepLinkClick) {
                    onDeepLinkClick(item.deepLink!.type, item.deepLink!.id)
                  }
                }}
              >
                {item.deepLink.label}
                <ArrowRight size={12} />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
