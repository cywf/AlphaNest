export type NFTRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface NFTItem {
  id: string
  name: string
  description: string
  imageUrl: string
  price: number
  rarity: NFTRarity
  creator: string
  creatorId: string
  ownerId: string
  featured: boolean
  createdAt: number
  stats: {
    views: number
    favorites: number
    sales: number
  }
  metadata: {
    collection?: string
    edition?: string
    attributes?: Record<string, string>
  }
  transactionHistory: NFTTransaction[]
}

export interface NFTTransaction {
  id: string
  nftId: string
  type: 'mint' | 'sale' | 'trade' | 'transfer'
  from: string
  to: string
  price?: number
  timestamp: number
}

export interface MarketBooth {
  userId: string
  username: string
  avatar: string
  bio: string
  theme: MarketTheme
  layout: MarketLayout
  listings: NFTItem[]
  stats: BoothStats
  createdAt: number
  updatedAt: number
}

export interface BoothStats {
  popularity: number
  reputation: number
  totalSales: number
  totalVolume: number
  itemsSold: number
  activeListings: number
  totalViews: number
}

export type MarketTheme = 'cyan' | 'magenta' | 'gold' | 'glitch'

export type MarketLayout = 'grid' | 'gallery' | 'terminal'

export interface MarketThemeConfig {
  id: MarketTheme
  name: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  glowColor: string
  borderStyle: string
  backgroundPattern: string
}

export interface MarketLayoutConfig {
  id: MarketLayout
  name: string
  description: string
  icon: string
}

export interface MarketFilters {
  sortBy: 'popularity' | 'reputation' | 'volume' | 'recent' | 'newest'
  minReputation: number
  minPopularity: number
  searchQuery: string
}

export interface NFTFilters {
  rarity: NFTRarity[]
  priceRange: [number, number]
  sortBy: 'price-asc' | 'price-desc' | 'recent' | 'popular'
  searchQuery: string
}
