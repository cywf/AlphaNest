import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScamScoreMeter } from './ScamScoreMeter'
import { truncateAddress, formatCompactNumber } from '@/lib/format'
import { Warning, Skull, Clock, Users } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { NaughtyCoin } from './naughtyCoinTypes'

interface NaughtyCoinCardProps {
  coin: NaughtyCoin
  onClick?: () => void
}

export function NaughtyCoinCard({ coin, onClick }: NaughtyCoinCardProps) {
  const scamTypeLabels: Record<string, string> = {
    rug_pull: 'Rug Pull',
    honeypot: 'Honeypot',
    pump_dump: 'Pump & Dump',
    fake_team: 'Fake Team',
    clone_scam: 'Clone Scam',
    phishing: 'Phishing',
    wash_trading: 'Wash Trading',
  }

  const riskBorderColors = {
    low: 'border-green-500/30',
    medium: 'border-yellow-500/30',
    high: 'border-orange-500/30',
    critical: 'border-red-500/50',
  }

  const formatDate = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
    return `${Math.floor(diffDays / 30)}mo ago`
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          'glow-border bg-card/50 backdrop-blur-sm p-5 cursor-pointer transition-all duration-300 border-2',
          riskBorderColors[coin.riskLevel],
          coin.riskLevel === 'critical' && 'animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.4)]'
        )}
        onClick={onClick}
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {coin.riskLevel === 'critical' && (
                  <Skull size={20} weight="fill" className="text-red-500 flex-shrink-0" />
                )}
                {coin.riskLevel === 'high' && (
                  <Warning size={20} weight="fill" className="text-orange-500 flex-shrink-0" />
                )}
                <h3 className="text-lg font-bold font-mono truncate">
                  {coin.tokenName}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-mono font-semibold">{coin.symbol}</span>
                <span className="text-xs">•</span>
                <span className="font-mono text-xs truncate">
                  {truncateAddress(coin.contractAddress, 6, 4)}
                </span>
              </div>
            </div>
            
            <Badge 
              variant={coin.isActive ? "destructive" : "secondary"}
              className="flex-shrink-0"
            >
              {coin.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          <ScamScoreMeter 
            score={coin.scamAlertScore} 
            riskLevel={coin.riskLevel}
            size="md"
          />

          <div className="flex flex-wrap gap-1.5">
            {coin.scamTypes.slice(0, 3).map((type) => (
              <Badge 
                key={type} 
                variant="outline" 
                className="text-xs font-mono border-accent/50 text-accent"
              >
                {scamTypeLabels[type]}
              </Badge>
            ))}
            {coin.scamTypes.length > 3 && (
              <Badge variant="outline" className="text-xs font-mono">
                +{coin.scamTypes.length - 3}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Victims</span>
                <span className="text-sm font-mono font-semibold text-foreground">
                  {formatCompactNumber(coin.victimCount)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Detected</span>
                <span className="text-sm font-mono font-semibold text-foreground">
                  {formatDate(coin.firstDetected)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Sources:</span>
            <div className="flex flex-wrap gap-1">
              {coin.detectionSources.slice(0, 4).map((source) => (
                <span 
                  key={source} 
                  className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono uppercase"
                >
                  {source}
                </span>
              ))}
              {coin.detectionSources.length > 4 && (
                <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                  +{coin.detectionSources.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
