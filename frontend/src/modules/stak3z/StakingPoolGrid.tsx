import { StakingPoolCard } from './StakingPoolCard'
import type { Pool } from './stakeTypes'

interface StakingPoolGridProps {
  pools: Pool[]
  onPoolClick: (poolId: string) => void
  isLoading?: boolean
}

export function StakingPoolGrid({ pools, onPoolClick, isLoading = false }: StakingPoolGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-lg bg-card/30 backdrop-blur-sm border border-primary/20 animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (pools.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No pools match your filters</p>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your search criteria</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pools.map((pool) => (
        <StakingPoolCard
          key={pool.id}
          pool={pool}
          onClick={() => onPoolClick(pool.id)}
        />
      ))}
    </div>
  )
}
