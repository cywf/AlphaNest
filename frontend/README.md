# 🌐 ALPHA-N3ST

A cyberpunk-themed cryptocurrency intelligence platform for discovering arbitrage opportunities, analyzing emerging coins using simulated OSINT and sentiment analysis, tracking scam tokens with wallet intelligence, and engaging in global clan warfare.

![Cyberpunk Theme](https://img.shields.io/badge/theme-cyberpunk-blueviolet)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![React](https://img.shields.io/badge/React-19.0-61dafb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8)

## ✨ Features

### 🔄 Arbitrage Scanner
- **Real-time price analysis** across 5 major exchanges (Binance, Coinbase, KuCoin, Kraken, Bybit)
- **Live profit calculations** with automatic updates every 4 seconds
- **Interactive filtering** by exchange with visual feedback
- **Sortable table** with persistent sort state (coin name, profit %, buy/sell price)
- **Profit calculator** with fee estimation and investment tracking
- **Responsive design** - table view on desktop, card view on mobile
- **Animated neon effects** for high-profit opportunities with pulsing glow

### 🆕 New Coin Discovery (OSINT Module)
- **Sentiment scoring** for upcoming coin launches (0-100 scale)
- **Social network analysis** with influence metrics and reach calculations
- **Launch window filtering** (24h, 7d, 30d, all)
- **Risk assessment** (low, medium, high, extreme) with color-coded indicators
- **Hype level tracking** (quiet, growing, trending, viral) with special animations
- **Source link aggregation** (Twitter, Telegram, Discord, GitHub, websites)
- **Live sentiment updates** every 5 seconds with smooth animations
- **Network metrics** including influencer count, community size, developer activity, and VC interest

### ⚠️ SK3TCHY-C0INS LIST (Scam Token Tracker)
- **Scam detection system** tracking rug pulls, honeypots, pump & dumps, and phishing schemes
- **Real-time scam alert scoring** (0-100) with dynamic risk level classification
- **Multi-source detection** from Reddit, Twitter, Telegram, Discord, darknet, and blockchain analysis
- **Victim tracking** with loss estimation and impact metrics
- **Suspicious wallet identification** with transaction pattern analysis
- **Detection event timeline** showing confidence scores and evidence
- **Risk-based filtering** by level (low, medium, high, critical)
- **Critical threat mode** with pulsing red neon effects for high-risk tokens
- **Active/inactive status** tracking with automatic updates

### 🛡️ SCAM-WALL3TS Leaderboard
- **Wallet intelligence scoring** based on rug pull history, connections, and behavior patterns
- **Fraudulent cluster detection** with coordination score analysis
- **Risk tag classification** (Confirmed Scammer, Rug Pull Operator, Mixer User, etc.)
- **Real-time leaderboard** ranking wallets by scam score
- **Connection mapping** showing direct, indirect, and cluster relationships
- **Sortable metrics** including rug pulls, flagged connections, total value, and last activity
- **Interactive wallet profiles** with click-to-view WALL3T dossier functionality

### 📊 WALL3T Dossier System
- **Comprehensive identity summary** with anonymized entity labels
- **Behavior analytics** tracking burst activity, laundering patterns, timing correlation, and mixer usage
- **Token involvement history** showing deployer, holder, and dumper roles
- **Connected wallet visualization** with relationship strength indicators
- **Transaction pattern analysis** detecting coordinated dumps, siphoning, and wash trading
- **Cluster membership** showing coordinated scam networks
- **Dynamic detail expansion** - more information unlocked as scam score increases:
  - **Score < 20**: Light metrics and minimal info
  - **Score 20-60**: Moderate analytics with OSINT links
  - **Score 60-90**: Expanded dossier with full link-analysis clusters
  - **Score > 90**: Critical Threat Mode with deep OSINT traces and extended graph views
- **Timeline visualization** showing first detection and last activity
- **Suspicious transaction feed** with severity ratings and flag reasons

### 👥 User Account System
- **Complete signup/login system** with mock authentication
- **User profiles** with customizable avatars, bios, and regions
- **12 preset cyberpunk avatars** (Cyber Samurai, Neon Ninja, Digital Ghost, etc.)
- **Profile customization** including avatar, bio, region, and shop theme
- **User scoring system** - earn points from arbitrage trades
- **Account statistics** tracking total score and arbitrage volume
- **Session management** with persistent login (7 days)
- **Demo accounts** for quick testing (CyberSamurai, NeonPhantom, QuantumHacker)

### 🏪 NFT Marketplace
- **Market Directory** - Browse all user market booths ranked by popularity, reputation, and sales volume
- **User Market Booths** - Individual NFT storefronts with customizable themes (Neon Cyan, Hot Magenta, Golden Hour, Glitch Matrix)
- **3 layout modes**: Neon Grid, Holographic Gallery, Terminal Matrix
- **NFT Collections** with rarity tiers (Common, Rare, Epic, Legendary) and dynamic border effects
- **Booth Rankings** - Sort by popularity, reputation, volume, recent activity, or newest
- **Advanced Filtering** - Search by username, minimum reputation, and popularity thresholds
- **NFT Detail Views** - Full metadata, transaction history, stats (views, favorites, sales)
- **Booth Statistics** - Track popularity (0-100), reputation (0-100), total volume, items sold
- **Themed Customization** - Each booth has unique color palette and visual identity
- **Mock NFT Listings** - Cyberpunk digital assets, trading bots, avatars, and collectibles
- **Placeholder Trading** - UI-ready Buy/Sell/Trade buttons prepared for backend integration
- **Theme customization** with real-time preview
- **Dynamic theming** based on user preferences
- **Featured item highlighting** with special glow effects

### 👑 Clan System
- **Clan creation** with name, tag, emblem, motto, and HQ region
- **Auto-generated neon emblems** (16 unique icons)
- **Clan directory** with search and filtering by region, size, ranking, activity
- **Clan pages** showing emblem, roster, stats, and pending applications
- **Application system** for joining clans
- **Member roles**: Founder, Leader, Officer, Member
- **Clan statistics**: Total score, arbitrage volume, member count, activity level
- **Clan rankings** based on global performance
- **Activity tracking**: Very Active, Active, Moderate, Low

### 💬 Clan Chat System
- **3 channels**: General, Strategy, Alerts
- **Real-time messaging** with auto-refresh every 3 seconds
- **Neon message bubbles** with sender identification
- **Channel switching** with message count badges
- **Persistent chat history** stored locally
- **Emoji avatar display** for each user
- **Timestamp tracking** for all messages

### 🌍 Clan Warz (Global Territorial Control)
- **Interactive world map** showing 8 global regions
- **Real-time clan territorial dominance** visualization
- **User pins** on map showing clan member locations
- **Glow intensity** based on player score contribution
- **Hot zones** indicating high-activity regions with pulse animations
- **Clan influence radius** visualization
- **Territory color coding**:
  - Default: Active zone (cyan)
  - Contested: Multiple clans battling (magenta)
  - Dominated: Single clan control (gold)
- **Global leaderboard** ranking all clans by power rating
- **Regional leaderboards** for each geographic zone
- **Power rating calculation** based on score, members, and region spread
- **Clickable regions** showing detailed clan presence breakdown
- **Hoverable user pins** displaying player info
- **Auto-scoring system** - every arbitrage trade contributes to clan score
- **Live updates** every 8 seconds

### 🎖️ Multiplayer Scoring Mechanics
- **Individual scoring** from arbitrage trades (10-60 points per trade)
- **Clan score aggregation** from all member contributions
- **Regional dominance** based on combined clan member scores in each region
- **Global rankings** updated in real-time
- **Power rating system** factoring in:
  - Total clan score (60% weight)
  - Member count (30% weight)
  - Regional presence (10% weight)
- **Activity levels** calculated from recent member engagement

### 🤖 AI Assistant Integration (UI Ready)
- **AI Chat Dock** - Slide-out chat interface accessible from TopBar
- **Context Attachment** - Quick action buttons to attach Market, Arbitrage, Clan, or Wallet context
- **Message History** - Conversation-style chat interface with timestamps
- **AI Recommendation Chips** - Contextual suggestion cards throughout the app
- **Placeholder Functions** - Frontend-ready AI function registry including:
  - NFT recommendations and pricing suggestions
  - Market ranking analysis
  - Booth performance insights

### 📈 Market Analysis Feed
- **Real-time intelligence stream** aggregating signals from all platform modules
- **Multi-category analysis**:
  - Market trend summaries with volume and price changes
  - OSINT-based risk alerts and honeypot warnings
  - Whale wallet movements with transfer tracking
  - NFT volume surges and floor price alerts
  - Arbitrage opportunity notifications
  - SCAM-WALL3TS cluster alerts
  - Clan activity and territory updates
- **Auto-refresh system** - new analysis items every 8-10 seconds
- **Category filtering** - focus on specific intelligence types
- **Severity indicators** (low, medium, high, critical) with color coding
- **Deep-link navigation** - click cards to jump to relevant modules
- **Tag-based organization** for quick scanning
- **Live feed status badge** showing real-time updates

### 🦊 MetaMask Wallet Integration (UI Ready)
- **Browser extension detection** - checks for MetaMask availability
- **Wallet connection flow** - secure authentication via MetaMask
- **TopBar status badge** - shows connected wallet address (truncated)
- **Floating QuickAction button** - quick access to wallet panel
- **Connection panel** with:
  - Installation detection and download link
  - Network/chain ID display
  - Address copy and explorer link
  - Disconnect functionality
- **NFT Market integration**:
  - "Transfer via MetaMask" button on NFT detail modals
  - "Sign Transaction" placeholder for purchases
  - Buy/Sell/Trade actions require wallet connection
  - Connected wallet badge in Market Booths
- **ArbScan integration**:
  - "Trade via MetaMask" button in Profit Calculator
  - Wallet balance display (placeholder)
  - Transaction signing for trades (placeholder)
- **SK3TCHY-C0INS integration**:
  - Wallet risk scoring display (placeholder)
  - Scam token interaction warnings
- **Placeholder transaction functions**:
  - signTransaction() - prepared for real trade execution
  - getNFTs() - fetch user's NFT collection
  - sendNFT() - transfer NFTs between wallets
  - tradeOnArbScan() - execute arbitrage trades
  - marketPurchaseNFT() - buy NFTs from market
  - Arbitrage opportunity analysis
  - Clan warfare strategic advice
  - Wallet risk assessment
  - Market trend predictions
- **Backend-Ready Architecture** - All AI components prepared for future integration

### 💎 Design Features
- Cyberpunk neon aesthetic with glowing borders and neon color palette
- NFT rarity-based visual effects (Common → Rare → Epic → Legendary)
- Animated scanline and grid backgrounds for immersive experience
- Glitch effects on high-risk wallet badges and critical threat indicators
- Responsive mobile-first design with touch-optimized controls
- Smooth framer-motion animations and transitions
- Custom cyberpunk color palette using OKLCH color space
- Phosphor icon library integration with consistent weight and sizing
- Accessible navigation with ARIA labels and keyboard support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies (if needed)
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Demo Login

Use any of these demo accounts to access ALPHA-N3ST:
- **Username:** CyberSamurai / **Password:** demo123
- **Username:** NeonPhantom / **Password:** demo123
- **Username:** QuantumHacker / **Password:** demo123

Or create your own account with the signup form!

## 📁 Project Structure

```
src/
├── components/
│   ├── common/               # Shared UI components
│   │   └── ArbitrageTableSkeleton.tsx
│   ├── ui/                   # shadcn components (40+)
│   ├── ArbitrageTable.tsx    # Main arbitrage table with sorting
│   ├── CyberpunkNav.tsx      # Sidebar navigation with animations
│   ├── ExchangeBadge.tsx     # Exchange display component
│   ├── Header.tsx            # App header with filters
│   └── ProfitCalculator.tsx  # Profit calculation widget
├── modules/
│   ├── newCoins/            # New coin discovery module
│   │   ├── types.ts         # Type definitions
│   │   ├── sentiment.ts     # Sentiment generation engine
│   │   ├── linkAnalysis.ts  # Social graph simulation
│   │   ├── useNewCoinDiscovery.ts  # Main hook with filters
│   │   └── NewCoinDiscoveryPanel.tsx  # UI component
│   ├── naughtyCoins/        # Scam token tracking module
│   │   ├── naughtyCoinTypes.ts      # Scam token type definitions
│   │   ├── naughtyCoinEngine.ts     # Scam detection & scoring logic
│   │   ├── naughtyCoinFeed.ts       # Real-time feed management
│   │   ├── ScamScoreMeter.tsx       # Visual score meter component
│   │   ├── NaughtyCoinCard.tsx      # Scam token card UI
│   │   └── NaughtyCoinPanel.tsx     # Main scam tracker panel
│   ├── walletIntel/         # Wallet intelligence module
│   │   ├── walletIntelTypes.ts      # Wallet type definitions
│   │   ├── walletIntelEngine.ts     # Wallet scoring & analysis
│   │   ├── WalletBadge.tsx          # Risk badge component
│   │   ├── WalletLeaderboard.tsx    # Scam wallet rankings
│   │   └── WalletProfile.tsx        # Comprehensive wallet dossier
│   ├── users/               # User account system
│   │   ├── userTypes.ts     # User type definitions
│   │   ├── authEngine.ts    # Authentication & user management
│   │   ├── avatarPresets.ts # Cyberpunk avatar collection
│   │   ├── shopThemes.ts    # Shop theme configurations
│   │   ├── UserSignup.tsx   # Account creation form
│   │   ├── UserLogin.tsx    # Login form with demo accounts
│   │   ├── UserProfile.tsx  # User profile editor
│   │   └── UserMenu.tsx     # Dropdown user menu
│   ├── shops/               # User shop system
│   │   ├── shopTypes.ts     # Shop type definitions
│   │   ├── shopThemeEngine.ts  # Theme management
│   │   └── ShopPage.tsx     # User shop display
│   ├── clans/               # Clan system
│   │   ├── clanTypes.ts     # Clan type definitions
│   │   ├── clanEngine.ts    # Clan management & scoring
│   │   ├── ClanDirectory.tsx  # Clan browsing & search
│   │   ├── ClanCreate.tsx   # Clan creation form
│   │   ├── ClanPage.tsx     # Clan profile & roster
│   │   ├── ClanChat.tsx     # Multi-channel chat system
│   │   └── ClanApply.tsx    # Clan application form
│   └── clanWarz/            # Global clan warfare visualization
│       ├── clanWarzTypes.ts     # Clan Warz type definitions
│       ├── clanWarzEngine.ts    # Territory calculation & scoring
│       └── ClanWarzMap.tsx      # Interactive world map
├── lib/
│   ├── arbitrage.ts         # Arbitrage logic & utilities
│   ├── format.ts            # Formatting utilities
│   └── utils.ts             # General utilities (cn helper)
├── types/
│   └── arbitrage.ts         # Type definitions
├── hooks/
│   └── use-mobile.ts        # Mobile detection hook
├── App.tsx                  # Main application with routing
├── index.css                # Custom styles & cyberpunk theme
└── main.tsx                 # Entry point
```

## 🎨 Component Architecture

### Arbitrage Module
- **ArbitrageTable**: Sortable table with mobile card view, loading skeletons, and empty states
- **ProfitCalculator**: Investment calculator with gross/net profit and fee estimation
- **Header**: Exchange filters, pause/resume controls, and auto-update timer
- **ExchangeBadge**: Color-coded exchange indicators with glow effects

### New Coin Discovery Module
- **NewCoinDiscoveryPanel**: Main dashboard with filtering and refresh
- **CoinCard**: Individual coin display with expandable network analysis
- **useNewCoinDiscovery**: State management hook with filtering logic
- **sentiment.ts**: Mock sentiment scoring with proper 0-100 clamping
- **linkAnalysis.ts**: Social graph generation with typed network metrics

### Naughty-Coin List Module
- **NaughtyCoinPanel**: Main scam tracker dashboard with real-time updates
- **NaughtyCoinCard**: Interactive scam token cards with risk indicators
- **ScamScoreMeter**: Animated neon meter with critical threat pulsing
- **naughtyCoinEngine**: Scam detection logic with multi-factor scoring
- **naughtyCoinFeed**: Observable feed pattern with auto-updates every 6 seconds

### Wallet Intelligence Module
- **WalletLeaderboard**: Ranked table of fraudulent wallets with live updates
- **WalletProfile**: Dynamic dossier with expandable sections based on score
- **WalletBadge**: Glitching risk badges for high-threat wallets
- **walletIntelEngine**: Complex scoring model based on rug pulls, connections, patterns, and OSINT

### User Account Module
- **authEngine**: Mock authentication with localStorage persistence
- **UserSignup/UserLogin**: Full authentication flow with validation
- **UserProfile**: Editable profile with avatar, bio, region, and theme selection
- **UserMenu**: Dropdown menu with quick access to profile, clans, shop
- **12 avatar presets**: Cyber-themed emoji avatars with gradient backgrounds

### User Shop Module
- **shopThemeEngine**: Theme configuration and showcase item management
- **ShopPage**: Dynamic shop display with theme-based styling
- **3 layout modes**:
  - **Grid**: Card-based product grid
  - **Gallery**: Large showcase tiles
  - **Terminal**: Command-line style display
- **4 themes**: Each with unique color palettes and glow effects

### Clan System Module
- **clanEngine**: Complete clan management, scoring, and ranking system
- **ClanDirectory**: Searchable clan browser with filters
- **ClanCreate**: Clan founding with emblem auto-generation
- **ClanPage**: Clan profile with roster, stats, and applications
- **ClanChat**: Multi-channel messaging system
- **ClanApply**: Application submission with message

### Clan Warz Module
- **clanWarzEngine**: Real-time calculation of territorial dominance
- **ClanWarzMap**: SVG-based interactive world map
- **Region dominance calculation**: Based on clan member scores in each region
- **User pin visualization**: Location-based player markers
- **Hot zone detection**: High-activity region highlighting
- **Global & regional leaderboards**: Live ranking updates

## 🔬 Scoring Models

### Scam Alert Score (0-100)
Calculated using:
- **Scam type diversity** (12 points per type)
- **Detection source count** (8 points per source)
- **Victim count** (up to 30 points)
- **Total financial loss** (up to 20 points)
- **Bonus modifiers**: Blockchain analysis (+10), Darknet mentions (+15), Rug pull type (+10)

### Wallet Scam Score (0-100)
Calculated using:
- **Rug pull history** (15 points each, up to 40 points)
- **Flagged connections** (2 points each, up to 25 points)
- **Transaction volume** (up to 15 points)
- **Detection patterns** (5 points per pattern)
- **Mixer usage** (+10), **Coordinated timing** (+8)

### Behavior Analytics
Four independent metrics (0-100):
- **Burst Activity Score**: Rapid trading pattern detection
- **Laundering Likelihood**: Mixing and layering analysis
- **Timing Correlation**: Coordination with known scam events
- **Mixer Usage Score**: Privacy protocol interaction frequency

### Clan Power Rating
Calculated using:
- **Total clan score** (60% weight)
- **Member count** (100 points per member, 30% weight)
- **Regional presence** (500 points per region, 10% weight)

Formula: `powerRating = (score × 0.6) + (members × 100 × 0.3) + (regions × 500 × 0.1)`

### Individual User Scoring
- **Arbitrage trades**: 10-60 points per trade (random)
- **Score accumulation**: Continuous during active trading
- **Contribution to clan**: 100% of user score added to clan total
- **Regional impact**: User score counts toward region dominance

### Regional Dominance
- **Clan presence**: Sum of all member scores in region
- **Dominance percentage**: Clan score / Total region score × 100
- **Classification**:
  - **Dominated** (>60%): Single clan controls region
  - **Contested** (30-60%): Multiple clans competing
  - **Active** (<30%): Balanced presence

## 🎮 Multiplayer Mechanics

### Trade → Clan Contribution Flow
1. User completes arbitrage trade
2. System awards 10-60 points to user
3. Points automatically added to user's clan
4. Clan total score updated
5. Regional dominance recalculated
6. Global rankings updated
7. Clan Warz map reflects new state

### Clan Warfare System
- **Territory control**: Based on cumulative member scores in each region
- **Real-time updates**: Map refreshes every 8 seconds
- **Visual feedback**: Territory colors change based on dominance level
- **Competitive rankings**: Global and regional leaderboards
- **Activity tracking**: Clan activity level based on recent engagement

### User Progression
1. **Create account** - Choose avatar, bio, region
2. **Customize shop** - Select theme and layout
3. **Join/create clan** - Apply to existing or found new
4. **Earn points** - Trade on arbitrage scanner
5. **Contribute to clan** - Points auto-add to clan score
6. **Territorial expansion** - Clan gains regional influence
7. **Climb rankings** - Compete globally and regionally

### Clan Management
- **Founder**: Creates clan, permanent leadership
- **Leaders**: Can accept/reject applications
- **Officers**: Moderator-level access
- **Members**: Standard participation
- **Applications**: Review system for new members
- **Chat system**: 3 channels for coordination

## 🎯 Key Features Explained

### Sorting & Filtering
The arbitrage table supports sorting by:
- Coin name (alphabetical)
- Profit percentage (default: descending)
- Buy price
- Sell price

**Sort persistence**: Sort order is maintained across data refresh intervals. Click column headers to toggle sort direction with animated sort indicators.

### Mobile Responsive Design
- **Desktop**: Full table view with all columns and hover effects
- **Mobile**: Card-based layout with touch-optimized targets (44px minimum)
- **Tablet**: Adaptive grid layouts for coin discovery
- Sticky navigation and components for better UX

### Sentiment Analysis Simulation
The OSINT module simulates:
- Social media monitoring (Twitter, Telegram, Discord)
- Influencer network mapping with reach and influence scores
- Community size and engagement metrics
- Developer activity tracking
- VC/investor interest levels

**Color-coded sentiment**:
- 0-40: Red (negative/risky)
- 40-70: Yellow (neutral/moderate)
- 70-100: Green (positive/bullish)

### Data Updates & Performance
- Arbitrage opportunities refresh every 4 seconds
- New coin sentiment updates every 5 seconds
- Naughty-coin list updates every 6 seconds
- Wallet leaderboard updates every 7 seconds
- Pause/resume functionality for examining data
- Proper cleanup of intervals on component unmount
- No external API dependencies - all data generated locally
- Observable pattern for efficient state updates

### OSINT + Scam Detection Integration
The naughty-coin and wallet intelligence modules integrate with existing OSINT architecture:
- **Shared link analysis**: Uses same social graph structure from new coins module
- **Sentiment correlation**: Scam tokens show negative sentiment patterns
- **Network cluster detection**: Identifies coordinated wallet groups using graph analysis
- **Multi-source verification**: Combines blockchain analysis with social signals
- **Pattern recognition**: Detects coordinated timing, burst activity, and siphoning

### Dynamic Detail Expansion
Wallet dossier sections unlock progressively based on scam score:
- **Score 0-19**: Basic identity, limited transaction history
- **Score 20-59**: + Behavior analytics, moderate OSINT traces
- **Score 60-89**: + Token involvement, full connection map, extended transactions
- **Score 90-100**: **Critical Threat Mode** - Deep OSINT, cluster analysis, glowing red border

## 🛠️ Technologies

- **React 19** - UI framework with latest features
- **TypeScript 5.7** - Full type safety throughout
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui v4** - Accessible component library
- **Framer Motion** - Smooth animations and transitions
- **Phosphor Icons** - Consistent icon set
- **Vite 6** - Fast build tool and dev server

## 🎨 Customization

### Theme Colors
Edit `src/index.css` to customize the cyberpunk color palette:

```css
:root {
  --background: oklch(0.15 0.02 285);      /* Deep black-blue */
  --foreground: oklch(0.85 0.15 195);      /* Cyan text */
  --primary: oklch(0.75 0.15 195);         /* Electric cyan */
  --secondary: oklch(0.55 0.22 330);       /* Deep magenta */
  --accent: oklch(0.70 0.25 340);          /* Hot pink */
  /* ... more colors */
}
```

### Add New Exchanges
Edit `src/types/arbitrage.ts`:

```typescript
export type Exchange = 'Binance' | 'Coinbase' | 'YourExchange'
export const EXCHANGES: Exchange[] = [..., 'YourExchange']
```

Then add color mapping in `src/lib/arbitrage.ts`:

```typescript
export function getExchangeColor(exchange: Exchange): string {
  const colors: Record<Exchange, string> = {
    // ... existing exchanges
    YourExchange: 'oklch(0.65 0.20 180)',
  }
  return colors[exchange]
}
```

### Add New Coins
Edit `src/lib/arbitrage.ts`:

```typescript
const BASE_PRICES: Record<string, number> = {
  // ... existing coins
  YOUR: 123.45,
}

export const CRYPTOCURRENCIES: Cryptocurrency[] = [
  // ... existing coins
  { symbol: 'YOUR', name: 'YourCoin', icon: '◉' },
]
```

## 📦 Building for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist/` directory.

## 🚢 Deployment

AlphaNest is designed to deploy via GitHub Spark:

1. **No external dependencies** - All data is simulated client-side
2. **No environment variables required** - Works as a static site
3. **Build completes successfully** with zero TypeScript errors
4. **Optimized bundle** with code splitting and tree shaking

### Deploy Steps
1. Push code to GitHub repository
2. Use Spark Publish feature
3. App deploys automatically as static site

## 🔍 Development

### Type Checking
```bash
# Run TypeScript compiler
npx tsc --noEmit
```

### Code Quality
- All components use explicit TypeScript types
- No `any` types allowed
- Proper cleanup of effects and intervals
- Accessibility features included (ARIA labels, keyboard navigation)

### Performance Optimizations
- Memoized calculations where appropriate
- Proper React keys on dynamic lists
- Debounced user inputs
- Lazy loading of heavy components (via dynamic imports if needed)

## ⚠️ Disclaimer

This is a **demonstration application** with simulated data for ALPHA-N3ST. It is:
- ❌ NOT connected to real cryptocurrency exchanges
- ❌ NOT providing financial advice
- ❌ NOT suitable for real trading decisions
- ✅ For educational and demonstration purposes only

Real arbitrage trading involves:
- Exchange fees (0.1% - 0.5% per trade)
- Network transfer fees (variable)
- Slippage (price changes during execution)
- Transfer time delays (minutes to hours)
- Market volatility risks
- Regulatory considerations
- Liquidity constraints

## 📝 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

## 🙏 Acknowledgments

- Built with [GitHub Spark](https://githubnext.com/projects/spark)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Phosphor Icons](https://phosphoricons.com/)
- Cyberpunk design inspiration from the genre's visual aesthetics
- Color palette designed using OKLCH color space for perceptual uniformity

---

**Built with ⚡ GitHub Spark**
