import type { UserShop, ShopSettings } from './shopTypes'
import type { ShowcaseItem, ShopTheme, ShopLayout } from '../users/shopThemes'

const SHOPS_KEY = 'crypto_arbitrage_shops'

export class ShopThemeEngine {
  private static instance: ShopThemeEngine

  private constructor() {}

  static getInstance(): ShopThemeEngine {
    if (!ShopThemeEngine.instance) {
      ShopThemeEngine.instance = new ShopThemeEngine()
    }
    return ShopThemeEngine.instance
  }

  private getShops(): UserShop[] {
    const stored = localStorage.getItem(SHOPS_KEY)
    return stored ? JSON.parse(stored) : []
  }

  private saveShops(shops: UserShop[]): void {
    localStorage.setItem(SHOPS_KEY, JSON.stringify(shops))
  }

  createShop(userId: string, username: string): UserShop {
    const shops = this.getShops()
    const existing = shops.find((s) => s.userId === userId)
    
    if (existing) {
      return existing
    }

    const shop: UserShop = {
      userId,
      username,
      theme: 'cyan',
      layout: 'grid',
      showcaseItems: this.generateMockShowcaseItems(),
      customTitle: `${username}'s Cyber Shop`,
      customDescription: 'Welcome to my digital marketplace in the neon grid',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    shops.push(shop)
    this.saveShops(shops)
    return shop
  }

  getShop(userId: string): UserShop | null {
    const shops = this.getShops()
    return shops.find((s) => s.userId === userId) || null
  }

  getShopByUsername(username: string): UserShop | null {
    const shops = this.getShops()
    return shops.find((s) => s.username.toLowerCase() === username.toLowerCase()) || null
  }

  updateShopSettings(userId: string, settings: Partial<ShopSettings>): UserShop | null {
    const shops = this.getShops()
    const shop = shops.find((s) => s.userId === userId)
    
    if (!shop) return null

    Object.assign(shop, settings, { updatedAt: Date.now() })
    this.saveShops(shops)
    return shop
  }

  addShowcaseItem(userId: string, item: Omit<ShowcaseItem, 'id'>): UserShop | null {
    const shops = this.getShops()
    const shop = shops.find((s) => s.userId === userId)
    
    if (!shop) return null

    const newItem: ShowcaseItem = {
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }

    shop.showcaseItems.push(newItem)
    shop.updatedAt = Date.now()
    this.saveShops(shops)
    return shop
  }

  removeShowcaseItem(userId: string, itemId: string): UserShop | null {
    const shops = this.getShops()
    const shop = shops.find((s) => s.userId === userId)
    
    if (!shop) return null

    shop.showcaseItems = shop.showcaseItems.filter((item) => item.id !== itemId)
    shop.updatedAt = Date.now()
    this.saveShops(shops)
    return shop
  }

  toggleItemFeatured(userId: string, itemId: string): UserShop | null {
    const shops = this.getShops()
    const shop = shops.find((s) => s.userId === userId)
    
    if (!shop) return null

    const item = shop.showcaseItems.find((i) => i.id === itemId)
    if (item) {
      item.featured = !item.featured
      shop.updatedAt = Date.now()
      this.saveShops(shops)
    }
    
    return shop
  }

  private generateMockShowcaseItems(): ShowcaseItem[] {
    const items = [
      {
        title: 'Neon Trading Bot',
        description: 'Automated arbitrage scanner with ML algorithms',
        imageUrl: '🤖',
        price: 299,
        featured: true,
      },
      {
        title: 'Cyberpunk Dashboard',
        description: 'Real-time crypto analytics with neon aesthetics',
        imageUrl: '📊',
        price: 149,
        featured: false,
      },
      {
        title: 'Quantum Signals',
        description: 'AI-powered trading signals from the future',
        imageUrl: '⚡',
        price: 399,
        featured: true,
      },
      {
        title: 'Matrix Scanner',
        description: 'Deep blockchain analysis and pattern recognition',
        imageUrl: '🔍',
        price: 199,
        featured: false,
      },
    ]

    return items.map((item, index) => ({
      ...item,
      id: `mock_item_${index}`,
    }))
  }
}

export const shopThemeEngine = ShopThemeEngine.getInstance()
