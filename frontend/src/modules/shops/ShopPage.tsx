import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { shopThemeEngine } from './shopThemeEngine'
import { authEngine } from '../users/authEngine'
import { SHOP_THEME_CONFIGS, SHOP_LAYOUTS } from '../users/shopThemes'
import type { UserShop } from './shopTypes'
import type { User } from '../users/userTypes'
import { Storefront, Star, CurrencyDollar, Sparkle, GridFour, Image as ImageIcon, Terminal } from '@phosphor-icons/react'

interface ShopPageProps {
  username?: string
}

export function ShopPage({ username }: ShopPageProps) {
  const [shop, setShop] = useState<UserShop | null>(null)
  const [owner, setOwner] = useState<User | null>(null)
  const [isOwnShop, setIsOwnShop] = useState(false)

  useEffect(() => {
    const currentUser = authEngine.getCurrentUser()
    let targetUser: User | null = null

    if (username) {
      targetUser = authEngine.getUserByUsername(username)
    } else if (currentUser) {
      targetUser = currentUser
    }

    if (targetUser) {
      setOwner(targetUser)
      setIsOwnShop(currentUser?.id === targetUser.id)

      let userShop = shopThemeEngine.getShop(targetUser.id)
      if (!userShop) {
        userShop = shopThemeEngine.createShop(targetUser.id, targetUser.username)
      }
      setShop(userShop)
    }
  }, [username])

  if (!shop || !owner) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="glow-border bg-card/90 backdrop-blur-sm p-8">
          <p className="text-muted-foreground">Shop not found</p>
        </Card>
      </div>
    )
  }

  const themeConfig = SHOP_THEME_CONFIGS[shop.theme]
  const layoutConfig = SHOP_LAYOUTS.find((l) => l.id === shop.layout)!

  const getLayoutIcon = () => {
    switch (shop.layout) {
      case 'grid':
        return <GridFour size={20} />
      case 'gallery':
        return <ImageIcon size={20} />
      case 'terminal':
        return <Terminal size={20} />
      default:
        return <GridFour size={20} />
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: `${themeConfig.primaryColor}05` }}>
      <div className="max-w-6xl mx-auto space-y-6">
        <Card
          className="glow-border bg-card/90 backdrop-blur-sm p-8"
          style={{
            borderColor: themeConfig.primaryColor,
            boxShadow: `0 0 30px ${themeConfig.glowColor}`,
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="text-5xl">{owner.avatar}</div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold" style={{ color: themeConfig.primaryColor }}>
                    {shop.customTitle}
                  </h1>
                  {owner.clanTag && (
                    <Badge variant="outline" style={{ borderColor: themeConfig.accentColor, color: themeConfig.accentColor }}>
                      [{owner.clanTag}]
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-3">{shop.customDescription}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Storefront size={16} style={{ color: themeConfig.secondaryColor }} />
                    <span>Owner: {owner.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getLayoutIcon()}
                    <span>{layoutConfig.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {shop.layout === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shop.showcaseItems.map((item) => (
              <Card
                key={item.id}
                className="glow-border bg-card/80 backdrop-blur-sm overflow-hidden hover:scale-105 transition-transform duration-200"
                style={{
                  borderColor: item.featured ? themeConfig.accentColor : themeConfig.primaryColor,
                  boxShadow: item.featured ? `0 0 25px ${themeConfig.glowColor}` : `0 0 15px ${themeConfig.glowColor}`,
                }}
              >
                <div className="p-6">
                  {item.featured && (
                    <div className="flex items-center gap-1 mb-2">
                      <Star size={16} style={{ color: themeConfig.accentColor }} weight="fill" />
                      <span className="text-xs font-bold" style={{ color: themeConfig.accentColor }}>
                        FEATURED
                      </span>
                    </div>
                  )}
                  <div className="text-6xl mb-4 text-center">{item.imageUrl}</div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: themeConfig.primaryColor }}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  {item.price && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 font-bold text-lg" style={{ color: themeConfig.secondaryColor }}>
                        <CurrencyDollar size={20} weight="bold" />
                        <span>{item.price}</span>
                      </div>
                      <Button size="sm" style={{ backgroundColor: themeConfig.primaryColor, color: 'white' }}>
                        View
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {shop.layout === 'gallery' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shop.showcaseItems.map((item) => (
              <Card
                key={item.id}
                className="glow-border bg-card/80 backdrop-blur-sm overflow-hidden"
                style={{
                  borderColor: item.featured ? themeConfig.accentColor : themeConfig.primaryColor,
                  boxShadow: `0 0 30px ${themeConfig.glowColor}`,
                }}
              >
                <div className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="text-8xl">{item.imageUrl}</div>
                    <div className="flex-1">
                      {item.featured && (
                        <div className="flex items-center gap-1 mb-2">
                          <Sparkle size={16} style={{ color: themeConfig.accentColor }} weight="fill" />
                          <span className="text-xs font-bold" style={{ color: themeConfig.accentColor }}>
                            FEATURED
                          </span>
                        </div>
                      )}
                      <h3 className="font-bold text-2xl mb-3" style={{ color: themeConfig.primaryColor }}>
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                      {item.price && (
                        <div className="flex items-center gap-2 font-bold text-xl" style={{ color: themeConfig.secondaryColor }}>
                          <CurrencyDollar size={24} weight="bold" />
                          <span>{item.price}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {shop.layout === 'terminal' && (
          <Card
            className="glow-border bg-black/90 backdrop-blur-sm p-6 font-mono"
            style={{
              borderColor: themeConfig.primaryColor,
              boxShadow: `0 0 30px ${themeConfig.glowColor}`,
            }}
          >
            <div className="space-y-1 text-sm" style={{ color: themeConfig.primaryColor }}>
              <div className="opacity-50">$ ls -la /shop/items</div>
              <div className="opacity-50">total {shop.showcaseItems.length}</div>
              <Separator className="my-2" style={{ backgroundColor: themeConfig.primaryColor, opacity: 0.3 }} />
              {shop.showcaseItems.map((item, index) => (
                <div key={item.id} className="py-2">
                  <div className="flex items-start gap-4">
                    <span className="opacity-50">{String(index + 1).padStart(2, '0')}</span>
                    <span className="flex-1">
                      <span style={{ color: item.featured ? themeConfig.accentColor : themeConfig.primaryColor }}>
                        {item.title}
                      </span>
                      {item.featured && <span className="ml-2 text-xs" style={{ color: themeConfig.accentColor }}>★</span>}
                      <div className="text-xs opacity-70 mt-1">{item.description}</div>
                    </span>
                    {item.price && (
                      <span style={{ color: themeConfig.secondaryColor }}>${item.price}</span>
                    )}
                  </div>
                </div>
              ))}
              <Separator className="my-2" style={{ backgroundColor: themeConfig.primaryColor, opacity: 0.3 }} />
              <div className="opacity-50">$ █</div>
            </div>
          </Card>
        )}

        {shop.showcaseItems.length === 0 && (
          <Card className="glow-border bg-card/50 backdrop-blur-sm p-12 text-center">
            <Storefront size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">No Items Yet</h3>
            <p className="text-muted-foreground">
              {isOwnShop ? 'Start adding items to your shop!' : 'This shop is empty'}
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
