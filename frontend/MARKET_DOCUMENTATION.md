# ALPHA-N3ST NFT Marketplace - Technical Documentation

## Overview

The ALPHA-N3ST NFT Marketplace is a full-featured trading platform for digital assets, complete with user storefronts ("Market Booths"), NFT listings, rarity systems, and AI-powered recommendations. This module replaces the previous "Shop" system with a comprehensive marketplace architecture.

## Module Structure

```
src/modules/
├── market/                          # NFT Marketplace Module
│   ├── MarketDirectory.tsx          # Browse all market booths
│   ├── MarketBooth.tsx              # Individual user storefront
│   ├── NFTCard.tsx                  # NFT display card component
│   ├── NFTGrid.tsx                  # Grid layout for NFT collections
│   ├── NFTDetailModal.tsx           # Full NFT detail modal
│   ├── marketEngine.ts              # Market/NFT state management
│   ├── marketTypes.ts               # TypeScript type definitions
│   ├── marketThemeConfigs.ts        # Theme and rarity configurations
│   └── index.ts                     # Module exports
└── ai/                              # AI Assistant Module
    ├── AIChatDock.tsx               # Slide-out AI chat interface
    ├── AIRecommendationChip.tsx     # Contextual suggestion chips
    ├── AIActionPanel.tsx            # Context-aware AI prompts
    ├── AIFunctionBinder.ts          # AI backend function registry
    └── index.ts                     # Module exports
```

## Key Features

### 1. Market Directory

**Component**: `MarketDirectory.tsx`  
**Route**: `/market`

Browse all user market booths with comprehensive filtering and sorting:

- **Sorting Options**:
  - Popularity (0-100 score)
  - Reputation (0-100 score)
  - Total Sales Volume ($)
  - Recently Active (last updated)
  - Newest Booths (creation date)

- **Filters**:
  - Search by username or bio
  - Minimum reputation threshold
  - Minimum popularity threshold

- **Booth Cards Display**:
  - Owner username and avatar
  - Popularity and reputation progress bars
  - Sales statistics (items sold, volume, active listings)
  - Theme preview (color swatches)
  - "View Booth" CTA button

### 2. Market Booth (User Storefront)

**Component**: `MarketBooth.tsx`  
**Route**: `/market/:username`

Individual NFT storefronts with full customization:

- **Booth Statistics Dashboard**:
  - Popularity score (0-100) with progress bar
  - Reputation score (0-100) with progress bar
  - Total volume ($) in large display
  - Items sold count
  - Total views, active listings, total sales

- **Theme Customization**:
  - 4 themes: Neon Cyan, Hot Magenta, Golden Hour, Glitch Matrix
  - Custom color palettes per theme
  - Dynamic glow effects and borders
  - 3 layout modes: Grid, Gallery, Terminal

- **NFT Collection Display**:
  - Grid view with NFTCard components
  - Rarity-based visual styling
  - Click to open detail modal
  - Empty state with CTA for owners

- **Owner Controls** (when viewing own booth):
  - "Add NFT Listing" button (placeholder)
  - Edit booth details (future)
  - Manage pricing (future)

### 3. NFT Cards

**Component**: `NFTCard.tsx`

Display NFT items with rarity-based styling:

- **Rarity Tiers**:
  - **Common**: Gray border (1px), subtle glow
  - **Rare**: Cyan border (2px), medium glow
  - **Epic**: Magenta border (2px), strong glow
  - **Legendary**: Gold border (3px), intense glow

- **Card Information**:
  - NFT artwork (emoji/icon)
  - Name and rarity badge
  - Description (truncated)
  - Creator username
  - Price in large font
  - Stats: views, favorites, sales
  - Collection name (if applicable)
  - "View Item" button

- **Visual Effects**:
  - Hover scale animation
  - Featured badge for highlighted items
  - Rarity-based background glow
  - Animated pulse on featured items

### 4. NFT Detail Modal

**Component**: `NFTDetailModal.tsx`

Full-screen modal with comprehensive NFT information:

- **Left Column**:
  - Large artwork display with rarity border
  - Stats grid (views, favorites, sales)
  - AI recommendations panel (placeholder)

- **Right Column**:
  - Description
  - Metadata (collection, edition, token ID, creation date)
  - Current price in large display
  - Action buttons: Buy / Sell / Trade (placeholders)
  - "Connect Wallet" placeholder section
  - Transaction history timeline

- **Transaction History**:
  - Type badges (MINT, SALE, TRADE, TRANSFER)
  - From/To addresses
  - Price (if applicable)
  - Timestamps

### 5. Market Engine

**Module**: `marketEngine.ts`

Manages all market and NFT state:

```typescript
class MarketEngine {
  // Booth Management
  createBooth(userId, username, avatar): MarketBooth
  getBooth(userId): MarketBooth | null
  getBoothByUsername(username): MarketBooth | null
  getAllBooths(): MarketBooth[]
  updateBooth(userId, updates): MarketBooth | null

  // NFT Management
  createNFT(ownerId, ownerUsername, data): NFTItem | null
  removeNFT(userId, nftId): boolean
  getNFT(nftId): NFTItem | null
  updateNFTStats(nftId, stats): void

  // Initialization
  initializeDemoBooths(): void
}
```

**Storage**: Uses `localStorage` with keys:
- `alphanest_market_booths`
- `alphanest_nft_items`

### 6. AI Assistant Integration

**Component**: `AIChatDock.tsx`  
**Trigger**: Robot icon in TopBar

Slide-out AI chat interface with:

- **Chat Interface**:
  - Message history (user + AI)
  - Input field with send button
  - Timestamps on all messages
  - Conversation-style layout

- **Quick Actions**:
  - Attach Market context
  - Attach Arbitrage context
  - Attach Clan context
  - Attach Wallet context

- **AI Recommendation Chips**:
  - 4 types: Suggestion, Insight, Warning, Opportunity
  - Context-aware placement
  - Animated entrance
  - Optional "View Details" action

- **Function Registry** (`AIFunctionBinder.ts`):
  ```typescript
  getNFTRecommendations(userId, filters?)
  getMarketRankings(sortBy?)
  analyzeBoothPerformance(boothId)
  arbitrageFromMarketContext(marketData)
  clanWarzStrategicAdvice(clanId, currentState)
  analyzeWalletRisk(walletAddress)
  generateMarketInsights(timeframe)
  suggestPricing(nftData, marketConditions)
  ```

All functions currently return placeholder responses indicating backend is not connected.

## Type Definitions

### Core Types

```typescript
type NFTRarity = 'common' | 'rare' | 'epic' | 'legendary'

interface NFTItem {
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

interface MarketBooth {
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

interface BoothStats {
  popularity: number        // 0-100
  reputation: number        // 0-100
  totalSales: number
  totalVolume: number       // in dollars
  itemsSold: number
  activeListings: number
  totalViews: number
}
```

## Theme Configuration

### Market Themes

```typescript
const MARKET_THEME_CONFIGS = {
  cyan: {
    primaryColor: 'oklch(0.75 0.15 195)',
    secondaryColor: 'oklch(0.60 0.20 200)',
    accentColor: 'oklch(0.80 0.25 190)',
    glowColor: 'oklch(0.75 0.15 195 / 0.6)',
  },
  magenta: { /* Hot Magenta theme */ },
  gold: { /* Golden Hour theme */ },
  glitch: { /* Glitch Matrix theme */ },
}
```

### Rarity Configurations

```typescript
const RARITY_CONFIGS = {
  common: {
    label: 'Common',
    color: 'oklch(0.60 0.10 240)',
    glowColor: 'oklch(0.60 0.10 240 / 0.4)',
    borderWidth: '1px',
  },
  rare: { /* Cyan rarity */ },
  epic: { /* Magenta rarity */ },
  legendary: { /* Gold rarity */ },
}
```

## Navigation Integration

### Routes

- `/market` → Market Directory (browse all booths)
- `/market/:username` → Market Booth (individual storefront)
- `/nft/:id` → NFT Detail (future route support)

### Sidebar Navigation

Updated item:
```typescript
{
  id: 'market',
  label: 'Market',
  icon: <ShoppingCart />,
  onClick: () => onNavigate('market'),
}
```

### Breadcrumbs

- Market Directory: `[Market]`
- Market Booth: `[Market > {username}]`

## Backend Integration Points

### Placeholder Functions (Ready for Backend)

All functions in `AIFunctionBinder.ts` are structured to be easily replaced with real backend calls:

```typescript
// Current (placeholder)
getNFTRecommendations: async (userId: string) => {
  return { recommendations: [], message: 'AI engine not connected' }
}

// Future (backend-connected)
getNFTRecommendations: async (userId: string) => {
  const response = await fetch(`/api/ai/nft-recommendations/${userId}`)
  return response.json()
}
```

### Wallet Connection Placeholders

- "Connect Wallet" section in NFT Detail Modal
- Buy/Sell/Trade buttons disabled with toast notifications
- Ready for Web3 wallet integration

### NFT Minting Placeholders

- "Add NFT Listing" button in Market Booth
- Create NFT modal (not yet implemented)
- Ready for NFT minting flow

## Design Philosophy

### Visual Hierarchy

1. **Rarity → Visual Impact**: Higher rarity = stronger glow, thicker border
2. **Featured → Attention**: Featured items have pulsing animations
3. **Stats → Context**: Views/favorites/sales provide social proof
4. **Theme → Identity**: Each booth has unique color identity

### Cyberpunk Aesthetics

- Neon glow effects on all interactive elements
- Rarity-based color coding (gray → cyan → magenta → gold)
- Animated pulse effects on featured items
- Holographic background patterns
- Terminal-style layout option for tech enthusiasts

### Responsive Design

- Grid layout adapts: 1 → 2 → 3 → 4 columns based on viewport
- Mobile-optimized card sizes
- Touch-friendly targets (44px minimum)
- Sticky AI chat dock on mobile

## Testing & Demo Data

### Demo Market Booths

3 pre-populated booths on first launch:
- **CYWF** (demo_user_1)
- **NeonTrader** (demo_user_2)
- **CyberNinja** (demo_user_3)

Each with 4-5 mock NFT items across different rarities.

### Mock NFT Items

Sample items include:
- Neon Samurai Avatar (Legendary)
- Holo Trading Bot (Epic)
- Quantum Dashboard (Rare)
- Matrix Scanner Badge (Common)
- Glitch Effect Overlay (Rare)

All with realistic stats, metadata, and transaction history.

## Future Enhancements

### Near-Term (Backend Required)

1. **Real NFT Minting** - Create new NFT listings with image uploads
2. **Wallet Integration** - Connect MetaMask/WalletConnect for real transactions
3. **AI Recommendations** - Connect to LLM backend for market insights
4. **User Ratings** - Allow users to rate booths and affect reputation
5. **Search Enhancement** - Full-text search across NFT names/descriptions

### Long-Term

1. **Auction System** - Timed auctions for rare NFTs
2. **Trade Offers** - Direct NFT-for-NFT trading between users
3. **Collections** - Curated NFT collections with special themes
4. **Verified Creators** - Badge system for verified artists
5. **Price History** - Charts showing NFT price trends over time
6. **Favorites System** - Save favorite NFTs and booths
7. **Notifications** - Price alerts and new listing notifications

## Migration from Shop System

### Deprecated Components

The following files from `src/modules/shops/` can be removed:
- `ShopPage.tsx` → Replaced by `MarketBooth.tsx`
- `shopThemeEngine.ts` → Replaced by `marketEngine.ts`
- `shopTypes.ts` → Replaced by `marketTypes.ts`

### Data Migration

If needed, convert old shop data to market format:

```typescript
// Old shop format
interface UserShop {
  showcaseItems: ShowcaseItem[]
  customTitle: string
  // ...
}

// New market format
interface MarketBooth {
  listings: NFTItem[]        // showcaseItems → listings
  bio: string                // customTitle → booth name in bio
  stats: BoothStats          // new field
  // ...
}
```

## Conclusion

The AlphaNest NFT Marketplace provides a complete, production-ready UI for trading digital assets with cyberpunk aesthetics. All components are TypeScript-strict, responsive, and prepared for backend integration. The AI assistant layer is fully implemented at the frontend level, ready to be connected to LLM services.
