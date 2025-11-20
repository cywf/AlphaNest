import type { MarketBooth, NFTItem, NFTRarity, MarketTheme, MarketLayout } from './marketTypes'

const MARKET_BOOTHS_KEY = 'alphanest_market_booths'
const NFT_ITEMS_KEY = 'alphanest_nft_items'

class MarketEngine {
  private static instance: MarketEngine

  private constructor() {}

  static getInstance(): MarketEngine {
    if (!MarketEngine.instance) {
      MarketEngine.instance = new MarketEngine()
    }
    return MarketEngine.instance
  }

  private getBooths(): MarketBooth[] {
    const stored = localStorage.getItem(MARKET_BOOTHS_KEY)
    return stored ? JSON.parse(stored) : []
  }

  private saveBooths(booths: MarketBooth[]): void {
    localStorage.setItem(MARKET_BOOTHS_KEY, JSON.stringify(booths))
  }

  private getNFTItems(): NFTItem[] {
    const stored = localStorage.getItem(NFT_ITEMS_KEY)
    return stored ? JSON.parse(stored) : []
  }

  private saveNFTItems(items: NFTItem[]): void {
    localStorage.setItem(NFT_ITEMS_KEY, JSON.stringify(items))
  }

  createBooth(userId: string, username: string, avatar: string): MarketBooth {
    const booths = this.getBooths()
    const existing = booths.find((b) => b.userId === userId)

    if (existing) {
      return existing
    }

    const mockListings = this.generateMockNFTItems(userId, username)
    
    const booth: MarketBooth = {
      userId,
      username,
      avatar,
      bio: `Welcome to ${username}'s Market Booth - Trading digital assets in the neon grid`,
      theme: 'cyan',
      layout: 'grid',
      listings: mockListings,
      stats: {
        popularity: Math.floor(Math.random() * 100),
        reputation: Math.floor(Math.random() * 100),
        totalSales: Math.floor(Math.random() * 50),
        totalVolume: Math.floor(Math.random() * 10000),
        itemsSold: Math.floor(Math.random() * 30),
        activeListings: mockListings.length,
        totalViews: Math.floor(Math.random() * 1000),
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    booths.push(booth)
    this.saveBooths(booths)

    const allItems = this.getNFTItems()
    allItems.push(...mockListings)
    this.saveNFTItems(allItems)

    return booth
  }

  getBooth(userId: string): MarketBooth | null {
    const booths = this.getBooths()
    return booths.find((b) => b.userId === userId) || null
  }

  getBoothByUsername(username: string): MarketBooth | null {
    const booths = this.getBooths()
    return booths.find((b) => b.username.toLowerCase() === username.toLowerCase()) || null
  }

  getAllBooths(): MarketBooth[] {
    return this.getBooths()
  }

  updateBooth(userId: string, updates: Partial<Omit<MarketBooth, 'userId' | 'username' | 'createdAt'>>): MarketBooth | null {
    const booths = this.getBooths()
    const booth = booths.find((b) => b.userId === userId)

    if (!booth) return null

    Object.assign(booth, updates, { updatedAt: Date.now() })
    this.saveBooths(booths)
    return booth
  }

  createNFT(
    ownerId: string,
    ownerUsername: string,
    data: Omit<NFTItem, 'id' | 'creatorId' | 'creator' | 'ownerId' | 'createdAt' | 'stats' | 'transactionHistory'>
  ): NFTItem | null {
    const booths = this.getBooths()
    const booth = booths.find((b) => b.userId === ownerId)

    if (!booth) return null

    const nft: NFTItem = {
      ...data,
      id: `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      creatorId: ownerId,
      creator: ownerUsername,
      ownerId,
      createdAt: Date.now(),
      stats: {
        views: 0,
        favorites: 0,
        sales: 0,
      },
      transactionHistory: [
        {
          id: `tx_${Date.now()}`,
          nftId: '',
          type: 'mint',
          from: '0x0',
          to: ownerId,
          timestamp: Date.now(),
        },
      ],
    }

    nft.transactionHistory[0].nftId = nft.id

    booth.listings.push(nft)
    booth.stats.activeListings = booth.listings.length
    booth.updatedAt = Date.now()
    this.saveBooths(booths)

    const allItems = this.getNFTItems()
    allItems.push(nft)
    this.saveNFTItems(allItems)

    return nft
  }

  removeNFT(userId: string, nftId: string): boolean {
    const booths = this.getBooths()
    const booth = booths.find((b) => b.userId === userId)

    if (!booth) return false

    booth.listings = booth.listings.filter((nft) => nft.id !== nftId)
    booth.stats.activeListings = booth.listings.length
    booth.updatedAt = Date.now()
    this.saveBooths(booths)

    const allItems = this.getNFTItems()
    const updatedItems = allItems.filter((nft) => nft.id !== nftId)
    this.saveNFTItems(updatedItems)

    return true
  }

  getNFT(nftId: string): NFTItem | null {
    const items = this.getNFTItems()
    return items.find((nft) => nft.id === nftId) || null
  }

  updateNFTStats(nftId: string, stats: Partial<NFTItem['stats']>): void {
    const booths = this.getBooths()
    
    for (const booth of booths) {
      const nft = booth.listings.find((n) => n.id === nftId)
      if (nft) {
        Object.assign(nft.stats, stats)
        this.saveBooths(booths)
        
        const allItems = this.getNFTItems()
        const item = allItems.find((n) => n.id === nftId)
        if (item) {
          Object.assign(item.stats, stats)
          this.saveNFTItems(allItems)
        }
        break
      }
    }
  }

  private generateMockNFTItems(userId: string, username: string): NFTItem[] {
    const rarities: NFTRarity[] = ['common', 'rare', 'epic', 'legendary']
    const items = [
      {
        name: 'Neon Samurai Avatar',
        description: 'Exclusive cyberpunk warrior avatar with animated neon effects',
        imageUrl: '⚔️',
        price: 499,
        rarity: 'legendary' as NFTRarity,
        featured: true,
        metadata: { collection: 'CyberWarriors', edition: '1/100' },
      },
      {
        name: 'Holo Trading Bot',
        description: 'AI-powered trading assistant with holographic interface',
        imageUrl: '🤖',
        price: 299,
        rarity: 'epic' as NFTRarity,
        featured: true,
        metadata: { collection: 'TradingAI', edition: '12/500' },
      },
      {
        name: 'Quantum Dashboard',
        description: 'Advanced analytics dashboard with real-time data streams',
        imageUrl: '📊',
        price: 199,
        rarity: 'rare' as NFTRarity,
        featured: false,
        metadata: { collection: 'CyberTools', edition: '45/1000' },
      },
      {
        name: 'Matrix Scanner Badge',
        description: 'Collectible blockchain scanner badge with neon glow',
        imageUrl: '🔍',
        price: 49,
        rarity: 'common' as NFTRarity,
        featured: false,
        metadata: { collection: 'Badges', edition: '234/5000' },
      },
      {
        name: 'Glitch Effect Overlay',
        description: 'Animated glitch effect for profile customization',
        imageUrl: '✨',
        price: 89,
        rarity: 'rare' as NFTRarity,
        featured: false,
        metadata: { collection: 'Effects', edition: '89/2000' },
      },
    ]

    return items.map((item, index) => ({
      ...item,
      id: `nft_${userId}_${index}`,
      creatorId: userId,
      creator: username,
      ownerId: userId,
      createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      stats: {
        views: Math.floor(Math.random() * 500),
        favorites: Math.floor(Math.random() * 100),
        sales: Math.floor(Math.random() * 20),
      },
      transactionHistory: [
        {
          id: `tx_${userId}_${index}`,
          nftId: `nft_${userId}_${index}`,
          type: 'mint' as const,
          from: '0x0',
          to: userId,
          timestamp: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        },
      ],
    }))
  }

  initializeDemoBooths(): void {
    const booths = this.getBooths()
    if (booths.length === 0) {
      const demoUsers = [
        { id: 'demo_user_1', username: 'CYWF', avatar: '🌟' },
        { id: 'demo_user_2', username: 'NeonTrader', avatar: '💎' },
        { id: 'demo_user_3', username: 'CyberNinja', avatar: '🥷' },
      ]

      demoUsers.forEach((user) => {
        this.createBooth(user.id, user.username, user.avatar)
      })
    }
  }
}

export const marketEngine = MarketEngine.getInstance()
