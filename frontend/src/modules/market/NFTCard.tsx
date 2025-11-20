import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Heart, ShoppingCart } from '@phosphor-icons/react'
import type { NFTItem } from './marketTypes'
import { RARITY_CONFIGS } from './marketThemeConfigs'
import { cn } from '@/lib/utils'

interface NFTCardProps {
  nft: NFTItem
  onSelect: (nft: NFTItem) => void
  compact?: boolean
}

export function NFTCard({ nft, onSelect, compact = false }: NFTCardProps) {
  const rarityConfig = RARITY_CONFIGS[nft.rarity]

  return (
    <Card
      className={cn(
        'glow-border bg-card/80 backdrop-blur-sm overflow-hidden transition-all duration-300 cursor-pointer group',
        'hover:scale-105 hover:shadow-2xl relative'
      )}
      style={{
        borderColor: rarityConfig.color,
        borderWidth: rarityConfig.borderWidth,
        boxShadow: nft.featured
          ? `0 0 30px ${rarityConfig.glowColor}, inset 0 0 20px ${rarityConfig.glowColor}`
          : `0 0 15px ${rarityConfig.glowColor}`,
      }}
      onClick={() => onSelect(nft)}
    >
      {nft.featured && (
        <div
          className="absolute top-0 left-0 right-0 h-1 animate-pulse"
          style={{
            background: `linear-gradient(90deg, transparent, ${rarityConfig.color}, transparent)`,
          }}
        />
      )}

      <div className={cn('p-4', compact ? 'space-y-2' : 'space-y-3')}>
        <div className="relative">
          <div
            className={cn(
              'flex items-center justify-center rounded-lg mb-3',
              compact ? 'text-5xl py-4' : 'text-7xl py-6'
            )}
            style={{
              background: `radial-gradient(circle, ${rarityConfig.glowColor} 0%, transparent 70%)`,
            }}
          >
            {nft.imageUrl}
          </div>

          {nft.featured && (
            <div className="absolute top-2 right-2">
              <Badge
                variant="outline"
                className="text-xs font-bold animate-pulse"
                style={{
                  borderColor: rarityConfig.color,
                  color: rarityConfig.color,
                  backgroundColor: `${rarityConfig.color}15`,
                }}
              >
                FEATURED
              </Badge>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn('font-bold', compact ? 'text-sm' : 'text-lg')}
              style={{ color: rarityConfig.color }}
            >
              {nft.name}
            </h3>
            <Badge
              variant="outline"
              className="text-xs shrink-0"
              style={{
                borderColor: rarityConfig.color,
                color: rarityConfig.color,
                backgroundColor: `${rarityConfig.color}10`,
              }}
            >
              {rarityConfig.label}
            </Badge>
          </div>

          {!compact && (
            <p className="text-xs text-muted-foreground line-clamp-2">{nft.description}</p>
          )}

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>{nft.stats.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart size={14} />
              <span>{nft.stats.favorites}</span>
            </div>
            <div className="flex items-center gap-1">
              <ShoppingCart size={14} />
              <span>{nft.stats.sales}</span>
            </div>
          </div>

          {nft.metadata.collection && (
            <p className="text-xs text-muted-foreground">
              <span className="opacity-70">Collection:</span> {nft.metadata.collection}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Price</span>
            <span className="font-bold text-lg font-mono" style={{ color: rarityConfig.color }}>
              ${nft.price}
            </span>
          </div>
          <Button
            size="sm"
            className="group-hover:translate-x-1 transition-transform"
            style={{
              backgroundColor: rarityConfig.color,
              color: 'white',
            }}
          >
            View Item
          </Button>
        </div>
      </div>
    </Card>
  )
}
