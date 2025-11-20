import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { WalletRiskLevel } from './walletIntelTypes'

interface WalletBadgeProps {
  riskLevel: WalletRiskLevel
  score: number
  size?: 'sm' | 'md' | 'lg'
  showGlitch?: boolean
}

export function WalletBadge({ riskLevel, score, size = 'md', showGlitch = false }: WalletBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }

  const riskColors = {
    low: 'bg-green-500/20 text-green-400 border-green-500/50',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    critical: 'bg-red-500/30 text-red-400 border-red-500/70',
  }

  const glitchAnimation = showGlitch && (riskLevel === 'critical' || riskLevel === 'high')

  return (
    <motion.div
      animate={glitchAnimation ? {
        x: [0, -1, 1, -1, 0],
        y: [0, 1, -1, 1, 0],
      } : {}}
      transition={{
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 3,
      }}
    >
      <Badge
        variant="outline"
        className={cn(
          'font-mono font-semibold uppercase tracking-wider border',
          sizeClasses[size],
          riskColors[riskLevel],
          riskLevel === 'critical' && 'animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.6)]'
        )}
      >
        {riskLevel === 'critical' && '⚠ '}
        {score.toFixed(0)}
        {riskLevel === 'critical' && ' ⚠'}
      </Badge>
    </motion.div>
  )
}
