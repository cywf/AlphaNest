import { useState, useEffect, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Storefront, TrendUp, Star, ShoppingCart, MagnifyingGlass, User } from '@phosphor-icons/react'
import { marketEngine } from './marketEngine'
import { MARKET_THEME_CONFIGS } from './marketThemeConfigs'
import type { MarketBooth, MarketFilters } from './marketTypes'
import { cn } from '@/lib/utils'

interface MarketDirectoryProps {
  onViewBooth: (username: string) => void
}

export function MarketDirectory({ onViewBooth }: MarketDirectoryProps) {
  const [booths, setBooths] = useState<MarketBooth[]>([])
  const [filters, setFilters] = useState<MarketFilters>({
    sortBy: 'popularity',
    minReputation: 0,
    minPopularity: 0,
    searchQuery: '',
  })

  useEffect(() => {
    marketEngine.initializeDemoBooths()
    const allBooths = marketEngine.getAllBooths()
    setBooths(allBooths)
  }, [])

  const filteredBooths = useMemo(() => {
    let result = [...booths]

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      result = result.filter(
        (booth) =>
          booth.username.toLowerCase().includes(query) ||
          booth.bio.toLowerCase().includes(query)
      )
    }

    if (filters.minReputation > 0) {
      result = result.filter((booth) => booth.stats.reputation >= filters.minReputation)
    }

    if (filters.minPopularity > 0) {
      result = result.filter((booth) => booth.stats.popularity >= filters.minPopularity)
    }

    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'popularity':
          return b.stats.popularity - a.stats.popularity
        case 'reputation':
          return b.stats.reputation - a.stats.reputation
        case 'volume':
          return b.stats.totalVolume - a.stats.totalVolume
        case 'recent':
          return b.updatedAt - a.updatedAt
        case 'newest':
          return b.createdAt - a.createdAt
        default:
          return 0
      }
    })

    return result
  }, [booths, filters])

  return (
    <div className="space-y-6">
      <Card className="glow-border bg-card/90 backdrop-blur-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-primary/10">
            <Storefront size={32} className="text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">Market Directory</h1>
            <p className="text-muted-foreground">Explore user market booths and NFT collections</p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-muted-foreground mb-2 block">SEARCH BOOTHS</label>
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search by username or description..."
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground mb-2 block">SORT BY</label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) =>
                setFilters({ ...filters, sortBy: value as MarketFilters['sortBy'] })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="reputation">Reputation</SelectItem>
                <SelectItem value="volume">Volume Sold</SelectItem>
                <SelectItem value="recent">Recently Active</SelectItem>
                <SelectItem value="newest">Newest Booths</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground mb-2 block">MIN. REPUTATION</label>
            <Select
              value={filters.minReputation.toString()}
              onValueChange={(value) => setFilters({ ...filters, minReputation: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any</SelectItem>
                <SelectItem value="25">25+</SelectItem>
                <SelectItem value="50">50+</SelectItem>
                <SelectItem value="75">75+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooths.map((booth) => {
          const themeConfig = MARKET_THEME_CONFIGS[booth.theme]
          return (
            <Card
              key={booth.userId}
              className="glow-border bg-card/80 backdrop-blur-sm overflow-hidden hover:scale-[1.02] transition-all duration-300 group"
              style={{
                borderColor: themeConfig.primaryColor,
                boxShadow: `0 0 20px ${themeConfig.glowColor}`,
              }}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{booth.avatar}</div>
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: themeConfig.primaryColor }}>
                        {booth.username}
                      </h3>
                      <p className="text-xs text-muted-foreground">Market Booth</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{
                      borderColor: themeConfig.accentColor,
                      color: themeConfig.accentColor,
                      backgroundColor: `${themeConfig.accentColor}15`,
                    }}
                  >
                    {themeConfig.name}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{booth.bio}</p>

                <Separator />

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star size={14} />
                      <span>Popularity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${booth.stats.popularity}%`,
                            backgroundColor: themeConfig.primaryColor,
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold font-mono">{booth.stats.popularity}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendUp size={14} />
                      <span>Reputation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${booth.stats.reputation}%`,
                            backgroundColor: themeConfig.secondaryColor,
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold font-mono">{booth.stats.reputation}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-muted/30">
                    <div className="text-lg font-bold font-mono">{booth.stats.itemsSold}</div>
                    <div className="text-xs text-muted-foreground">Sold</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/30">
                    <div className="text-lg font-bold font-mono">{booth.stats.activeListings}</div>
                    <div className="text-xs text-muted-foreground">Listed</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/30">
                    <div className="text-lg font-bold font-mono">${booth.stats.totalVolume}</div>
                    <div className="text-xs text-muted-foreground">Volume</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {Object.values(MARKET_THEME_CONFIGS).map((theme) => (
                    <div
                      key={theme.id}
                      className={cn(
                        'w-6 h-6 rounded border-2 transition-all',
                        booth.theme === theme.id ? 'ring-2 ring-offset-2 ring-primary' : 'opacity-50'
                      )}
                      style={{
                        backgroundColor: theme.primaryColor,
                        borderColor: theme.secondaryColor,
                      }}
                      title={theme.name}
                    />
                  ))}
                </div>

                <Button
                  className="w-full group-hover:translate-y-0 translate-y-1 transition-transform"
                  style={{ backgroundColor: themeConfig.primaryColor, color: 'white' }}
                  onClick={() => onViewBooth(booth.username)}
                >
                  <Storefront className="mr-2" size={18} />
                  View Booth
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredBooths.length === 0 && (
        <Card className="glow-border bg-card/50 backdrop-blur-sm p-12 text-center">
          <Storefront size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-bold mb-2">No Booths Found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search query</p>
        </Card>
      )}
    </div>
  )
}
