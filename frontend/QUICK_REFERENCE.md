# ALPHA-N3ST Market Module - Quick Reference

## 🚀 Quick Start

### View Market Directory
1. Navigate to sidebar → Click "Market"
2. Browse all user booths
3. Sort/filter as needed
4. Click "View Booth" on any card

### View Market Booth
1. From Market Directory → Click "View Booth"
2. Or directly: `/market/:username`
3. Browse NFT collection
4. Click any NFT card for details

### Open AI Assistant
1. Click Robot icon in TopBar (top right)
2. Chat dock slides in from right
3. Use quick action buttons to attach context
4. Type message and send

---

## 📍 Key Routes

```
/market              → Market Directory (browse all booths)
/market/:username    → Individual Market Booth
```

---

## 🎨 Component Usage

### Import Market Components
```typescript
import { MarketDirectory, MarketBooth, NFTCard, NFTGrid, NFTDetailModal } from '@/modules/market'
```

### Import AI Components
```typescript
import { AIChatDock, AIRecommendationChip, AIActionPanel } from '@/modules/ai'
```

### Use Market Engine
```typescript
import { marketEngine } from '@/modules/market'

// Get all booths
const booths = marketEngine.getAllBooths()

// Get specific booth
const booth = marketEngine.getBooth(userId)

// Create NFT
const nft = marketEngine.createNFT(userId, username, {
  name: 'My NFT',
  description: 'Description',
  imageUrl: '🎨',
  price: 100,
  rarity: 'rare',
  featured: false,
  metadata: { collection: 'MyCollection' }
})
```

### Use AI Functions
```typescript
import { getNFTRecommendations, analyzeBoothPerformance } from '@/modules/ai'

// Get recommendations (placeholder)
const recs = await getNFTRecommendations(userId)

// Analyze booth (placeholder)
const analysis = await analyzeBoothPerformance(boothId)
```

---

## 🎨 Styling Guide

### Rarity Colors
```typescript
common: 'oklch(0.60 0.10 240)'     // Gray
rare: 'oklch(0.75 0.15 195)'       // Cyan
epic: 'oklch(0.70 0.25 340)'       // Magenta
legendary: 'oklch(0.80 0.15 80)'   // Gold
```

### Market Themes
```typescript
cyan: 'oklch(0.75 0.15 195)'       // Neon Cyan
magenta: 'oklch(0.70 0.25 340)'    // Hot Magenta
gold: 'oklch(0.80 0.15 80)'        // Golden Hour
glitch: 'oklch(0.65 0.25 160)'     // Glitch Matrix
```

---

## 📊 Type Reference

### NFTItem
```typescript
interface NFTItem {
  id: string
  name: string
  description: string
  imageUrl: string              // Emoji or URL
  price: number                 // In dollars
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  creator: string               // Username
  creatorId: string            // User ID
  ownerId: string              // Current owner ID
  featured: boolean            // Highlight item?
  createdAt: number            // Timestamp
  stats: {
    views: number
    favorites: number
    sales: number
  }
  metadata: {
    collection?: string        // Collection name
    edition?: string           // Edition info
    attributes?: Record<string, string>
  }
  transactionHistory: NFTTransaction[]
}
```

### MarketBooth
```typescript
interface MarketBooth {
  userId: string
  username: string
  avatar: string               // Emoji
  bio: string                  // Booth description
  theme: 'cyan' | 'magenta' | 'gold' | 'glitch'
  layout: 'grid' | 'gallery' | 'terminal'
  listings: NFTItem[]          // All NFTs in booth
  stats: {
    popularity: number         // 0-100
    reputation: number         // 0-100
    totalSales: number         // Count
    totalVolume: number        // In dollars
    itemsSold: number          // Count
    activeListings: number     // Count
    totalViews: number         // Count
  }
  createdAt: number
  updatedAt: number
}
```

---

## 🔧 Configuration

### Rarity Configs
```typescript
import { RARITY_CONFIGS } from '@/modules/market'

const rarityConfig = RARITY_CONFIGS[nft.rarity]
// Access: color, glowColor, borderWidth, label
```

### Theme Configs
```typescript
import { MARKET_THEME_CONFIGS } from '@/modules/market'

const themeConfig = MARKET_THEME_CONFIGS[booth.theme]
// Access: primaryColor, secondaryColor, accentColor, glowColor
```

---

## 🎯 Common Patterns

### Display NFT with Rarity Styling
{% raw %}
```tsx
const rarityConfig = RARITY_CONFIGS[nft.rarity]

<div
  style={{
    borderColor: rarityConfig.color,
    borderWidth: rarityConfig.borderWidth,
    boxShadow: `0 0 20px ${rarityConfig.glowColor}`,
  }}
>
  {/* NFT content */}
</div>
```
{% endraw %}

### Apply Booth Theme
{% raw %}
```tsx
const themeConfig = MARKET_THEME_CONFIGS[booth.theme]

<div style={{ backgroundColor: `${themeConfig.primaryColor}05` }}>
  <h1 style={{ color: themeConfig.primaryColor }}>
    {booth.username}'s Market Booth
  </h1>
</div>
```
{% endraw %}

### Show Stats with Progress
```tsx
<div>
  <span>Popularity: {booth.stats.popularity}/100</span>
  <Progress value={booth.stats.popularity} />
</div>
```

---

## 🧪 Testing & Demo

### Demo Booths
- **CYWF** (demo_user_1)
- **NeonTrader** (demo_user_2)
- **CyberNinja** (demo_user_3)

### Initialize Demo Data
```typescript
import { marketEngine } from '@/modules/market'

// Call once on app init
marketEngine.initializeDemoBooths()
```

### Test AI Functions
```typescript
import { getNFTRecommendations } from '@/modules/ai'

const result = await getNFTRecommendations('user_123')
console.log(result.message) // "AI engine not connected"
```

---

## 🐛 Troubleshooting

### Market doesn't show booths
```typescript
// Manually initialize
marketEngine.initializeDemoBooths()
```

### AI chat doesn't open
```typescript
// Check TopBar has onOpenAIChat prop
<TopBar onOpenAIChat={() => setIsAIChatOpen(true)} />
```

### NFT stats not updating
```typescript
// Manually update
marketEngine.updateNFTStats(nftId, { views: nft.stats.views + 1 })
```

### Rarity colors not showing
```typescript
// Check rarity config import
import { RARITY_CONFIGS } from '@/modules/market'
const config = RARITY_CONFIGS[nft.rarity]
```

---

## 📱 Mobile Considerations

- AI chat dock overlays content on mobile
- Grid adapts: 1 column on mobile, 4 on desktop
- Touch targets minimum 44px
- Sidebar collapses on mobile (<1024px)

---

## 🔗 Related Files

```
src/modules/market/        → Market components
src/modules/ai/            → AI components
src/components/HUD/        → Navigation components
src/layouts/HudLayout.tsx  → Main layout
src/App.tsx                → Routing & state
```

---

## 📚 Documentation

- **Technical**: `MARKET_DOCUMENTATION.md`
- **Delivery**: `DELIVERY_SUMMARY.md`
- **Rebrand**: `REBRAND_SUMMARY.md`
- **Features**: `PRD.md`
- **Setup**: `README.md`

---

## 🎉 Quick Wins

### Add New Booth Theme
1. Edit `marketThemeConfigs.ts`
2. Add theme to `MARKET_THEME_CONFIGS`
3. Update `MarketTheme` type

### Add New Rarity Tier
1. Edit `marketTypes.ts` → `NFTRarity` type
2. Edit `marketThemeConfigs.ts` → `RARITY_CONFIGS`
3. Visual effects auto-apply

### Add AI Function
1. Edit `AIFunctionBinder.ts`
2. Add function to registry
3. Export helper function

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Production Ready
