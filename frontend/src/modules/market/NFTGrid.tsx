import { cn } from '@/lib/utils'
import { NFTCard } from './NFTCard'
import type { NFTItem } from './marketTypes'

interface NFTGridProps {
  nfts: NFTItem[]
  onSelectNFT: (nft: NFTItem) => void
  compact?: boolean
  className?: string
}

export function NFTGrid({ nfts, onSelectNFT, compact = false, className }: NFTGridProps) {
  if (nfts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4 opacity-50">🎨</div>
        <h3 className="text-lg font-bold mb-2">No NFTs Available</h3>
        <p className="text-sm text-muted-foreground">Check back later for new listings</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid gap-6',
        compact
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {nfts.map((nft) => (
        <NFTCard key={nft.id} nft={nft} onSelect={onSelectNFT} compact={compact} />
      ))}
    </div>
  )
}
