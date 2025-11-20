import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

interface ScamScoreMeterProps {
  score: number
  riskLevel: RiskLevel
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animated?: boolean
}

export function ScamScoreMeter({ 
  score, 
  riskLevel, 
  size = 'md', 
  showLabel = true,
  animated = true 
}: ScamScoreMeterProps) {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }

  const riskColors = {
    low: 'from-green-500 to-green-400',
    medium: 'from-yellow-500 to-yellow-400',
    high: 'from-orange-500 to-red-500',
    critical: 'from-red-600 to-pink-600',
  }

  const glowColors = {
    low: 'shadow-[0_0_10px_rgba(34,197,94,0.5)]',
    medium: 'shadow-[0_0_10px_rgba(234,179,8,0.5)]',
    high: 'shadow-[0_0_10px_rgba(239,68,68,0.5)]',
    critical: 'shadow-[0_0_20px_rgba(239,68,68,0.8)]',
  }

  const textColors = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-orange-400',
    critical: 'text-red-400',
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {showLabel && (
          <span className={cn('text-xs font-mono font-semibold uppercase tracking-wider', textColors[riskLevel])}>
            {riskLevel === 'critical' ? (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-flex items-center gap-1"
              >
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full" />
                Critical Threat
              </motion.span>
            ) : (
              `${riskLevel} Risk`
            )}
          </span>
        )}
        <span className={cn('text-sm font-mono font-bold', textColors[riskLevel])}>
          {score.toFixed(0)}
        </span>
      </div>
      
      <div className="relative w-full bg-card border border-border rounded-full overflow-hidden">
        {animated ? (
          <motion.div
            className={cn(
              'h-full bg-gradient-to-r rounded-full',
              riskColors[riskLevel],
              glowColors[riskLevel],
              sizeClasses[size],
              riskLevel === 'critical' && 'animate-pulse'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        ) : (
          <div
            className={cn(
              'h-full bg-gradient-to-r rounded-full transition-all duration-500',
              riskColors[riskLevel],
              glowColors[riskLevel],
              sizeClasses[size],
              riskLevel === 'critical' && 'animate-pulse'
            )}
            style={{ width: `${score}%` }}
          />
        )}
        
        {riskLevel === 'critical' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </div>
    </div>
  )
}
