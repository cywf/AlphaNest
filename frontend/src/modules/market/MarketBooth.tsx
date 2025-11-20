import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Storefront, Star, TrendUp, Eye, Package, CurrencyDollar, Plus } from '@phosphor-icons/react'
import { marketEngine } from './marketEngine'
import { authEngine } from '../users/authEngine'
import { MARKET_THEME_CONFIGS } from './marketThemeConfigs'
import { NFTGrid } from './NFTGrid'
import { NFTDetailModal } from './NFTDetailModal'
import type { MarketBooth as MarketBoothType, NFTItem } from './marketTypes'
import { toast } from 'sonner'

interface MarketBoothProps {
  username?: string
}

export function MarketBooth({ username }: MarketBoothProps) {
  const [booth, setBooth] = useState<MarketBoothType | null>(null)
  const [isOwnBooth, setIsOwnBooth] = useState(false)
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  useEffect(() => {
    const currentUser = authEngine.getCurrentUser()
    
    let targetUser
    if (username) {
      targetUser = authEngine.getUserByUsername(username)
    } else if (currentUser) {
      targetUser = currentUser
    }

    if (targetUser) {
      setIsOwnBooth(currentUser?.id === targetUser.id)

      let userBooth = marketEngine.getBooth(targetUser.id)
      if (!userBooth) {
        userBooth = marketEngine.createBooth(targetUser.id, targetUser.username, targetUser.avatar)
      }
      setBooth(userBooth)
    }
  }, [username])

  const handleSelectNFT = (nft: NFTItem) => {
    setSelectedNFT(nft)
    setIsDetailModalOpen(true)
    
    marketEngine.updateNFTStats(nft.id, {
      views: nft.stats.views + 1,
    })
  }

  const handleBuyNFT = (nft: NFTItem) => {
    toast.info('NFT Purchase', {
      description: 'Wallet integration coming soon!',
    })
  }

  const handleSellNFT = (nft: NFTItem) => {
    toast.info('NFT Sale', {
      description: 'Listing feature coming soon!',
    })
  }

  const handleTradeNFT = (nft: NFTItem) => {
    toast.info('NFT Trade', {
      description: 'Trading feature coming soon!',
    })
  }

  const handleCreateNFT = () => {
    toast.info('Create NFT', {
      description: 'NFT minting feature coming soon!',
    })
  }

  if (!booth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="glow-border bg-card/90 backdrop-blur-sm p-8">
          <p className="text-muted-foreground">Market booth not found</p>
        </Card>
      </div>
    )
  }

  const themeConfig = MARKET_THEME_CONFIGS[booth.theme]

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: `${themeConfig.primaryColor}05` }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <Card
          className="glow-border bg-card/90 backdrop-blur-sm overflow-hidden"
          style={{
            borderColor: themeConfig.primaryColor,
            boxShadow: `0 0 40px ${themeConfig.glowColor}`,
          }}
        >
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="text-6xl">{booth.avatar}</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-bold" style={{ color: themeConfig.primaryColor }}>
                      {booth.username}'s Market Booth
                    </h1>
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: themeConfig.accentColor,
                        color: themeConfig.accentColor,
                        backgroundColor: `${themeConfig.accentColor}15`,
                      }}
                    >
                      {themeConfig.name}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground max-w-2xl">{booth.bio}</p>
                </div>
              </div>

              {isOwnBooth && (
                <Button
                  size="lg"
                  onClick={handleCreateNFT}
                  style={{ backgroundColor: themeConfig.primaryColor, color: 'white' }}
                >
                  <Plus className="mr-2" size={20} />
                  Add NFT Listing
                </Button>
              )}
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star size={18} />
                  <span>Popularity</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-mono" style={{ color: themeConfig.primaryColor }}>
                      {booth.stats.popularity}
                    </span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                  <Progress
                    value={booth.stats.popularity}
                    className="h-2"
                    style={{
                      backgroundColor: `${themeConfig.primaryColor}20`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendUp size={18} />
                  <span>Reputation</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-mono" style={{ color: themeConfig.secondaryColor }}>
                      {booth.stats.reputation}
                    </span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                  <Progress
                    value={booth.stats.reputation}
                    className="h-2"
                    style={{
                      backgroundColor: `${themeConfig.secondaryColor}20`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CurrencyDollar size={18} />
                  <span>Total Volume</span>
                </div>
                <div className="text-3xl font-bold font-mono" style={{ color: themeConfig.accentColor }}>
                  ${booth.stats.totalVolume.toLocaleString()}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package size={18} />
                  <span>Items Sold</span>
                </div>
                <div className="text-3xl font-bold font-mono" style={{ color: themeConfig.accentColor }}>
                  {booth.stats.itemsSold}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/20">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Eye size={16} />
                </div>
                <div className="text-xl font-bold">{booth.stats.totalViews}</div>
                <div className="text-xs text-muted-foreground">Total Views</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Package size={16} />
                </div>
                <div className="text-xl font-bold">{booth.stats.activeListings}</div>
                <div className="text-xs text-muted-foreground">Active Listings</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Storefront size={16} />
                </div>
                <div className="text-xl font-bold">{booth.stats.totalSales}</div>
                <div className="text-xs text-muted-foreground">Total Sales</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="glow-border bg-card/90 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: themeConfig.primaryColor }}>
              NFT Collection
            </h2>
            <Badge variant="outline">{booth.listings.length} items</Badge>
          </div>

          {booth.listings.length > 0 ? (
            <NFTGrid nfts={booth.listings} onSelectNFT={handleSelectNFT} />
          ) : (
            <div className="text-center py-12">
              <Storefront size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-bold mb-2">No NFTs Listed</h3>
              <p className="text-muted-foreground mb-4">
                {isOwnBooth ? 'Start adding NFTs to your booth!' : 'This booth has no listings yet'}
              </p>
              {isOwnBooth && (
                <Button onClick={handleCreateNFT} style={{ backgroundColor: themeConfig.primaryColor, color: 'white' }}>
                  <Plus className="mr-2" size={18} />
                  Add First NFT
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>

      <NFTDetailModal
        nft={selectedNFT}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onBuy={handleBuyNFT}
        onSell={isOwnBooth ? handleSellNFT : undefined}
        onTrade={handleTradeNFT}
      />
    </div>
  )
}
