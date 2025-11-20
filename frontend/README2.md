# 🌐 ALPHA-N3ST

A cyberpunk-themed cryptocurrency intelligence platform for discovering arbitrage opportunities and analyzing emerging coins using simulated OSINT and sentiment analysis.

![Cyberpunk Theme](https://img.shields.io/badge/theme-cyberpunk-blueviolet)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![React](https://img.shields.io/badge/React-19.0-61dafb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8)

## ✨ Features

### 🔄 Arbitrage Scanner
- **Real-time price analysis** across 5 major exchanges (Binance, Coinbase, KuCoin, Kraken, Bybit)
- **Live profit calculations** with automatic updates every 4 seconds
- **Interactive filtering** by exchange with visual feedback
- **Profit calculator** with fee estimation
- **Responsive table/card views** for mobile and desktop
- **Animated neon effects** for high-profit opportunities

### 🆕 New Coin Discovery (OSINT Module)
- **Sentiment scoring** for upcoming coin launches
- **Social network analysis** with influence metrics
- **Launch window filtering** (24h, 7d, 30d, all)
- **Risk assessment** (low, medium, high, extreme)
- **Hype level tracking** (quiet, growing, trending, viral)
- **Source link aggregation** (Twitter, Telegram, Discord, GitHub, websites)
- **Live updates** with animated sentiment changes

### 💎 Design Features
- Cyberpunk neon aesthetic with glowing borders
- Animated scanline and grid backgrounds
- Responsive mobile-first design
- Smooth framer-motion animations
- Custom cyberpunk color palette
- Phosphor icon library integration

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

## 📁 Project Structure

```
src/
├── components/
│   ├── common/               # Shared UI components
│   │   └── ArbitrageTableSkeleton.tsx
│   ├── ui/                   # shadcn components (40+)
│   ├── ArbitrageTable.tsx    # Main arbitrage table with sorting
│   ├── CyberpunkNav.tsx      # Sidebar navigation
│   ├── ExchangeBadge.tsx     # Exchange display component
│   ├── Header.tsx            # App header with filters
│   └── ProfitCalculator.tsx  # Profit calculation widget
├── modules/
│   └── newCoins/            # New coin discovery module
│       ├── types.ts         # Type definitions
│       ├── sentiment.ts     # Sentiment generation engine
│       ├── linkAnalysis.ts  # Social graph simulation
│       ├── useNewCoinDiscovery.ts  # Main hook
│       └── NewCoinDiscoveryPanel.tsx  # UI component
├── lib/
│   ├── arbitrage.ts         # Arbitrage logic & utilities
│   ├── format.ts            # Formatting utilities
│   └── utils.ts             # General utilities
├── types/
│   └── arbitrage.ts         # Type definitions
├── hooks/
│   └── use-mobile.ts        # Mobile detection hook
├── App.tsx                  # Main application with routing
├── index.css                # Custom styles & theme
└── main.tsx                 # Entry point
```

## 🎨 Component Architecture

### Arbitrage Module
- **ArbitrageTable**: Sortable table with mobile card view
- **ProfitCalculator**: Investment calculator with fee estimation
- **Header**: Exchange filters and pause/resume controls
- **ExchangeBadge**: Color-coded exchange indicators

### New Coin Discovery Module
- **NewCoinDiscoveryPanel**: Main dashboard
- **CoinCard**: Individual coin display with network analysis
- **useNewCoinDiscovery**: State management hook
- **sentiment.ts**: Mock sentiment scoring
- **linkAnalysis.ts**: Social graph generation

## 🎯 Key Features Explained

### Sorting & Filtering
The arbitrage table supports sorting by:
- Coin name (alphabetical)
- Profit percentage (default: descending)
- Buy price
- Sell price

Click column headers to toggle sort direction.

### Mobile Responsive Design
- **Desktop**: Full table view with all columns
- **Mobile**: Card-based layout with touch-optimized targets
- Adaptive navigation and sticky components

### Sentiment Analysis Simulation
The OSINT module simulates:
- Social media monitoring (Twitter, Telegram, Discord)
- Influencer network mapping
- Community size and engagement metrics
- Developer activity tracking
- VC/investor interest

### Data Persistence
All data is simulated and updates in real-time:
- Arbitrage opportunities refresh every 4s
- New coin sentiment updates every 5s
- No external API dependencies

## 🛠️ Technologies

- **React 19** - UI framework
- **TypeScript 5.7** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui v4** - Component library
- **Framer Motion** - Animations
- **Phosphor Icons** - Icon set
- **Vite** - Build tool

## 🎨 Customization

### Theme Colors
Edit `src/index.css` to customize the cyberpunk color palette:

```css
:root {
  --background: oklch(0.15 0.02 285);
  --foreground: oklch(0.85 0.15 195);
  --primary: oklch(0.75 0.15 195);
  --secondary: oklch(0.55 0.22 330);
  --accent: oklch(0.70 0.25 340);
  /* ... more colors */
}
```

### Add New Exchanges
Edit `src/types/arbitrage.ts`:

```typescript
export type Exchange = 'Binance' | 'Coinbase' | 'YourExchange'
export const EXCHANGES: Exchange[] = [..., 'YourExchange']
```

### Add New Coins
Edit `src/lib/arbitrage.ts`:

```typescript
export const CRYPTOCURRENCIES: Cryptocurrency[] = [
  { symbol: 'YOUR', name: 'YourCoin', icon: '◉' },
  // ...
]
```

## 📦 Building for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

## 🚢 Deployment

This app is designed to deploy via GitHub Spark:
1. Build completes successfully with no external API dependencies
2. All data is simulated client-side
3. No environment variables required
4. Works as a static site

## ⚠️ Disclaimer

This is a **demonstration application** with simulated data. It is:
- NOT connected to real cryptocurrency exchanges
- NOT providing financial advice
- NOT suitable for real trading decisions
- For educational and demonstration purposes only

Real arbitrage trading involves:
- Exchange fees (0.1% - 0.5%)
- Network transfer fees
- Slippage
- Transfer time delays
- Market volatility risks
- Regulatory considerations

## 📝 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

## 🙏 Acknowledgments

- Built with [GitHub Spark](https://githubnext.com/projects/spark)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Phosphor Icons](https://phosphoricons.com/)
- Cyberpunk design inspiration from the genre's visual aesthetics

---

**Built with ⚡ GitHub Spark**
