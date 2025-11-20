# Planning Guide

ALPHA-N3ST is a cyberpunk-themed cryptocurrency arbitrage opportunity tracker with comprehensive clan warfare system, user profiles, virtual trading simulator, and a robust HUD navigation interface. The platform combines real-time price analysis across multiple exchanges with multiplayer-style social features, gamified virtual trading through MARK3T-SIM, and more - all wrapped in a visually striking neon-drenched cyberpunk interface.

**Experience Qualities**: 
1. **Electrifying** - The interface pulses with energy through animated neon elements, glowing data streams, holographic HUD overlays, and dynamic updates that make financial data and clan warfare feel alive
2. **Futuristic** - Embrace sci-fi UI conventions with a persistent HUD system, holographic effects, grid overlays, terminal-style typography, and military-grade navigation that transport users to a high-tech command center
3. **Focused** - Despite the visual richness and multiple modules, information hierarchy must be crystal clear through breadcrumb navigation, sidebar organization, and contextual quick actions that guide users to their objectives

**Complexity Level**: Complex Application (advanced functionality with full user system, clans, multiplayer features, NFT marketplace, AI integration, virtual trading simulator, and persistent HUD navigation)
  - Features include live arbitrage scanning, sortable tables, profit calculator, real-time updates, new coin discovery with OSINT simulation, sentiment analysis, social graph mapping, advanced filtering, full user authentication and profiles, multiplayer clan system, clan warfare territory control, clan chat, NFT marketplace with booth rankings and AI recommendations, liquidity pool staking (STAK3Z), gamified virtual trading simulator (MARK3T-SIM) with dual scoring systems (Ranked/Casual), AND comprehensive HUD-based navigation with TopBar, SideBar, QuickActions, Breadcrumbs, and MiniMap components

## Essential Features

### Real-Time Arbitrage Scanner
- **Functionality**: Continuously simulates price data for cryptocurrencies across 5 exchanges (Binance, Coinbase, KuCoin, Kraken, Bybit) and calculates arbitrage opportunities
- **Purpose**: Core value proposition - identifying where users can buy low and sell high across exchanges
- **Trigger**: Automatically starts on page load and updates every 3-5 seconds
- **Progression**: App loads → Initial prices generated → Prices update with subtle animations → Table re-sorts → Highlight best opportunities
- **Success criteria**: Users can immediately identify the best arbitrage opportunity and understand the potential profit percentage

### Interactive Arbitrage Table
- **Functionality**: Displays sortable table with coin name, buy exchange, sell exchange, buy price, sell price, profit percentage, and action button
- **Purpose**: Allows users to scan opportunities quickly and sort by different criteria (profit %, price, coin name)
- **Trigger**: Click on column headers to sort
- **Progression**: User views table → Clicks column header → Table smoothly re-sorts → Top opportunities remain visually prominent
- **Success criteria**: Table sorts correctly, high-profit opportunities are visually distinctive, data is readable

### Profit Calculator
- **Functionality**: Input field where users enter investment amount, automatically calculates potential profit for a selected arbitrage opportunity
- **Purpose**: Translates abstract percentages into concrete dollar amounts users can understand
- **Trigger**: User clicks "Calculate" button on a table row or enters amount in dedicated calculator
- **Progression**: User spots opportunity → Clicks calculate → Calculator panel opens → User enters amount → Real-time profit calculation displayed → Shows breakdown of fees and net profit
- **Success criteria**: Calculations are accurate, updates happen instantly as user types, results are clearly formatted

### Exchange Filter/Selector
- **Functionality**: Toggle controls to enable/disable specific exchanges from the arbitrage scan
- **Purpose**: Users may only have accounts on certain exchanges, so filtering helps them focus
- **Trigger**: Click on exchange badges/toggles at the top
- **Progression**: User clicks exchange badge → Exchange dims/disables → Table updates to exclude that exchange → Opportunities recalculate
- **Success criteria**: Filtering is instant, disabled exchanges are clearly shown, table updates smoothly

### Cryptocurrency Selection
- **Functionality**: Display data for popular cryptocurrencies (BTC, ETH, SOL, BNB, ADA, DOGE, XRP, MATIC, AVAX, DOT)
- **Purpose**: Covers the most liquid and commonly traded cryptocurrencies where arbitrage is feasible
- **Trigger**: Always visible in the table
- **Progression**: N/A - static set of coins displayed
- **Success criteria**: All coins have realistic simulated prices, data updates feel natural

### New Coin Discovery (OSINT Module)
- **Functionality**: Simulates early detection of emerging cryptocurrencies using sentiment analysis, social network mapping, and OSINT-style intelligence gathering
- **Purpose**: Helps users identify promising new coins before they gain mainstream attention
- **Trigger**: Navigate to "New Coins" page
- **Progression**: User views discovery panel → Filters by launch window (24h/7d/30d/all) → Adjusts sentiment threshold → Views coin cards with risk/hype indicators → Expands network analysis → Clicks source links
- **Success criteria**: Sentiment scores update smoothly, network metrics are displayed clearly, filters work instantly, cards show comprehensive coin data

### Social Network Analysis
- **Functionality**: Generates simulated social graphs showing influencers, communities, developers, and investors associated with each new coin
- **Purpose**: Visualizes the network effect and viral potential of emerging cryptocurrencies
- **Trigger**: Click "Show" on network analysis section in coin card
- **Progression**: User expands network section → Sees node counts by type → Views total reach and virality score → Understands social backing
- **Success criteria**: Metrics are believable and correlate with sentiment scores, data is clearly labeled and easy to interpret

### Multi-Page Navigation & HUD System
- **Functionality**: Comprehensive cyberpunk HUD navigation with persistent TopBar, collapsible SideBar, floating QuickActions, hierarchical Breadcrumbs, and MiniMap for clan warfare
- **Purpose**: Provides seamless, intuitive navigation across all platform features while maintaining cyberpunk military command center aesthetics
- **Trigger**: Always active; TopBar and SideBar persist across all authenticated pages
- **Progression**: User logs in → Lands on Dashboard → Navigates via SideBar → Page transitions with fade/slide → Breadcrumbs update → QuickActions adapt to context → MiniMap shows clan territory status
- **Success criteria**: Zero navigation dead-ends, all pages accessible within 2 clicks, HUD never obstructs content, mobile sidebar collapses smoothly, page transitions feel fluid

### TopBar Navigation
- **Functionality**: Fixed header with app branding, quick navigation shortcuts (Home, Back, Dashboard), notification bell with badge, and user avatar dropdown menu
- **Purpose**: Provides instant access to core navigation and user account features from anywhere in the app
- **Trigger**: Always visible at top of viewport on all authenticated pages
- **Progression**: User clicks avatar → Dropdown shows Profile, Shop, Clans, Logout → Selection navigates or logs out
- **Success criteria**: Dropdown menu is accessible, notification badge shows count, neon underline pulse animation is smooth, mobile layout condenses appropriately

### SideBar Navigation  
- **Functionality**: Fixed vertical navigation panel with icons and labels for all major sections (Dashboard, Arbitrage, New Coins, SK3TCHY-C0INS, SCAM-WALL3TS, Market, Clans, Clan Warz, Settings, Logout)
- **Purpose**: Primary navigation hub organizing platform into logical sections with clear visual hierarchy
- **Trigger**: Always visible on desktop (≥1024px), toggle button on mobile/tablet
- **Progression**: Desktop: always visible → User clicks nav item → Active indicator glows and pulses → Page content updates | Mobile: user taps menu button → Sidebar slides in → User selects item → Sidebar closes → Page updates
- **Success criteria**: Active page indicator is unmistakable with neon glow, hover states are responsive, icons are meaningful, mobile overlay darkens background, collapse/expand is smooth

### QuickActions (Floating Action Buttons)
- **Functionality**: Context-aware floating buttons in bottom-right corner for Go Back, Go Forward, Open Map, and Open Wallet Dossier
- **Purpose**: Provides rapid navigation shortcuts without requiring sidebar interaction
- **Trigger**: Automatically shown/hidden based on current page context
- **Progression**: User arrives on page → Relevant quick actions fade in with staggered timing → Hover shows tooltip → Click executes action
- **Success criteria**: Only contextually relevant actions appear, tooltips are clear, buttons don't overlap content, mobile size is touch-friendly (44px minimum)

### Breadcrumbs Navigation
- **Functionality**: Hierarchical path display showing current location (e.g., Home > Clans > Neon Samurai > Apply) with clickable parent segments
- **Purpose**: Provides orientation within deep navigation hierarchies and quick backtracking
- **Trigger**: Appears below TopBar when navigating beyond first-level pages
- **Progression**: User navigates to sub-page → Breadcrumbs appear → User clicks parent segment → Navigates back to that level
- **Success criteria**: Current page is highlighted, parent pages are clickable, hierarchy accurately reflects navigation depth

### MiniMap Navigation (Clan Warz Preview)
- **Functionality**: Small holographic map preview showing territory control by top 3 clans with color-coded grid cells
- **Purpose**: Provides at-a-glance clan warfare status and quick access to full map
- **Trigger**: Displayed on Dashboard and clan-related pages
- **Progression**: User views mini-map → Sees territory distribution → Clicks "Open Full Map" → Navigates to Clan Warz page
- **Success criteria**: Clan colors match full map, territory counts are accurate, map is legible at small size, updates reflect clan score changes

### Dashboard (Landing Page)
- **Functionality**: Central hub showing user stats (score, arbitrage volume, rank), clan status with progress bar, system status indicators, and quick access cards to all major features
- **Purpose**: Provides overview of user's status and single-click access to all platform features after login
- **Trigger**: Default landing page after successful login
- **Progression**: User logs in → Dashboard loads with fade-in → Views personal stats → Sees clan progress → Clicks feature card → Navigates to that section
- **Success criteria**: All stats update in real-time, clan section only shows if user is in clan, quick access cards are visually distinct, mobile layout stacks vertically

### SK3TCHY-C0INS LIST (Scam Token Tracker)
- **Functionality**: Real-time detection and tracking of scam tokens including rug pulls, honeypots, pump & dumps, and phishing schemes
- **Purpose**: Protects users by identifying fraudulent tokens before they invest
- **Trigger**: Navigate to "SK3TCHY-C0INS" page
- **Progression**: User views scam list → Filters by risk level → Sorts by scam score → Clicks token card → Views detection details
- **Success criteria**: Scam scores update in real-time, filters work instantly, critical threats are visually distinct with pulsing red glow

### SCAM-WALL3TS Leaderboard
- **Functionality**: Ranked list of fraudulent wallet addresses with comprehensive scoring based on rug pulls, connections, and behavior patterns
- **Purpose**: Identifies bad actors in the crypto ecosystem and helps users avoid scam-linked wallets
- **Trigger**: Navigate to "SCAM-WALL3TS" page
- **Progression**: User views leaderboard → Sorts by metrics → Filters by risk level → Clicks wallet row → Views full dossier
- **Success criteria**: Wallet scores accurately reflect scam activity, leaderboard updates smoothly, cluster detection is visible

### NFT Market Directory
- **Functionality**: Browse user market booths ranked by popularity, reputation, sales volume, and activity with sortable/filterable grid view
- **Purpose**: Discover NFT sellers and collections across the platform's marketplace ecosystem
- **Trigger**: Navigate to "Market" page
- **Progression**: User views booth grid → Sorts by popularity/reputation/volume → Filters by min thresholds → Searches by username → Clicks booth card → Navigates to booth detail
- **Success criteria**: All booths load with stats, filters apply instantly, theme previews are visible, sorting is accurate

### Market Booth (NFT Storefront)
- **Functionality**: Individual user's NFT marketplace with customizable themes, layouts (grid/gallery/terminal), statistics dashboard, and listing management
- **Purpose**: Allows users to showcase and trade NFT items with personalized branding
- **Trigger**: Click "View Booth" from Market Directory or navigate to /market/:username
- **Progression**: User enters booth → Views owner stats (popularity, reputation, volume) → Browses NFT grid → Clicks NFT card → Opens detail modal → Views metadata and transaction history → Placeholder Buy/Sell/Trade actions
- **Success criteria**: Theme colors apply throughout, booth stats are prominent, NFTs display with rarity-based borders and glows, empty state guides new booth owners

### NFT Detail Modal
- **Functionality**: Full-screen modal showing NFT artwork, rarity, stats (views/favorites/sales), metadata, transaction history, and action buttons for Buy/Sell/Trade
- **Purpose**: Provides comprehensive NFT information and future transaction interface
- **Trigger**: Click any NFT card in Market Booth or Discovery feeds
- **Progression**: User clicks NFT → Modal opens with animation → Views large artwork and stats → Explores metadata → Reviews transaction history → Clicks action buttons (placeholders) → Sees "Coming Soon" messages
- **Success criteria**: Rarity-based border glows match card styling, all metadata displays correctly, transaction history is chronological, AI recommendation section is visible as placeholder

### AI Chat Dock
- **Functionality**: Slide-out chat interface from right side with AI assistant, context attachment buttons (Market/Arbitrage/Clan/Wallet), and message history
- **Purpose**: Provides AI-powered insights, recommendations, and analysis across all platform features (prepared for backend integration)
- **Trigger**: Click Robot icon in TopBar
- **Progression**: User clicks AI button → Dock slides in from right → Sends message → Receives placeholder response → Attaches context via quick actions → Views contextual AI guidance (placeholder)
- **Success criteria**: Dock doesn't obstruct main content, messages display in conversation format, context buttons are visible and functional (UI only), placeholder responses indicate future functionality

### WALL3T Dossier (Profile View)
- **Functionality**: Comprehensive profile of suspicious wallets with behavior analytics, transaction history, and network mapping
- **Purpose**: Provides deep intelligence on scam operations for advanced users and investigators
- **Trigger**: Click wallet row in leaderboard
- **Progression**: User opens dossier → Views identity summary → Explores behavior metrics → Examines connected wallets → Reviews token involvements
- **Success criteria**: Detail level scales with scam score, critical mode activates at score >90, all metrics are clearly explained

### Market Analysis Feed
- **Functionality**: Real-time intelligence stream combining OSINT alerts, whale movements, NFT surges, arbitrage opportunities, scam alerts, and clan activity updates
- **Purpose**: Provides holistic market intelligence by aggregating signals from all platform modules in one live feed
- **Trigger**: Navigate to "Market Analysis" page or view from Dashboard quick links
- **Progression**: User views feed → Filters by category → Clicks analysis card → Deep-links to relevant module (ArbScan/Market/SK3TCHY-C0INS/SCAM-WALL3TS/Clans)
- **Success criteria**: Feed updates automatically every 8-10 seconds, category filters work instantly, deep links navigate correctly, severity badges are visible

### MetaMask Wallet Integration
- **Functionality**: Connect MetaMask browser extension, display wallet status in TopBar, enable NFT transfers, sign transactions, and execute trades from ArbScan
- **Purpose**: Prepares platform for real blockchain interactions and user-owned asset management
- **Trigger**: Click floating "Connect Wallet" QuickAction button or wallet badge in TopBar
- **Progression**: User clicks connect → MetaMask prompt opens → User approves → Wallet address displays in TopBar → NFT/Trade actions become enabled → User can transfer NFTs or sign placeholder transactions
- **Success criteria**: MetaMask detection works, connection status persists, wallet address shows truncated in UI, all transaction buttons are functional (placeholder logic), disconnection works cleanly

### MARK3T-SIM (Virtual Trading Arena)
- **Functionality**: Full-featured virtual trading simulator with realistic market mirroring, session management, portfolio tracking, and performance analytics using fictional currency
- **Purpose**: Provides risk-free trading practice environment where users earn Casual Score that contributes to clan points, enabling training and experimentation without real capital
- **Trigger**: Navigate to "MARK3T-SIM" from sidebar or Dashboard quick access
- **Progression**: Dashboard → Start New Session → Trade Panel (select assets, configure trades with leverage, simulate gas fees) → Portfolio (monitor open/closed positions) → End Session → Results (comprehensive performance breakdown with grade, Casual Score earned, clan contribution)
- **Success criteria**: Sessions persist across navigation, trades execute instantly with realistic price updates, portfolio calculates P/L accurately, results display grade (S+/S/A/B/C/D), Casual Score awards to user profile, clan receives contribution points

#### MARK3T-SIM Dashboard
- **Functionality**: Overview of virtual wallet balance, daily/total profit, win rate, session count, Casual Score, top movers, high volatility assets, AI hints, and quick action buttons
- **Purpose**: Central hub for MARK3T-SIM showing performance stats and market conditions
- **Trigger**: Navigate to MARK3T-SIM main page
- **Progression**: User views stats cards → Browses top movers/volatile assets → Clicks asset to navigate to trade → Or starts new/continues session
- **Success criteria**: Stats update in real-time, asset cards show sentiment and volatility badges, AI hints provide context-aware recommendations

#### MARK3T-SIM Trade Panel
- **Functionality**: Asset selector with source filtering (ArbScan/Coin-Fisher/Market/STAK3Z/Market Analysis), buy/sell toggle, amount input, leverage slider (1-20x), gas fee simulation toggle, risk assessment card, P/L projection, AI recommendations, and trade confirmation modal
- **Purpose**: Execution interface for placing virtual trades with comprehensive risk analysis
- **Trigger**: From Dashboard "Trade" action or asset click
- **Progression**: User selects asset → Chooses buy/sell → Enters amount → Adjusts leverage → Reviews risk level → Sees projected P/L → Clicks Execute → Confirms in modal → Trade opens in portfolio
- **Success criteria**: All assets from platform modules are available, risk level calculates dynamically based on leverage and volatility, liquidation price displays, confirmation modal shows complete trade summary, AI chips provide contextual guidance

#### MARK3T-SIM Portfolio
- **Functionality**: Real-time portfolio value, open trades table (entry/current/P/L/risk/close button), closed trades history, session summary, AI portfolio analysis, quick stats
- **Purpose**: Active position management and performance monitoring during session
- **Trigger**: Navigate to Portfolio from MARK3T-SIM Dashboard or during active session
- **Progression**: User views open positions → Monitors unrealized P/L updates → Closes trades manually → Reviews closed trades → Checks AI analysis recommendations
- **Success criteria**: Portfolio recalculates every 2 seconds with live price updates, close trade updates balance immediately, tables sort correctly, AI analysis cards provide health/diversification/risk feedback

#### MARK3T-SIM Results
- **Functionality**: Session completion screen with holographic trophy, grade (S+ to D), total profit/loss, win rate, trade count, volume, Casual Score earned, clan contribution, best/worst trade breakdowns, advanced metrics (avg hold time, max drawdown, Sharpe ratio), and session badge
- **Purpose**: Gamified performance summary that rewards success and encourages replay
- **Trigger**: User ends active session from Portfolio or Dashboard
- **Progression**: Session ends → All open trades auto-close → Results animate in → Grade displays with trophy → Casual Score adds to user profile → Clan points update → User views best/worst trades → Reviews advanced metrics → Starts new session or returns to dashboard
- **Success criteria**: Grade algorithm considers profit %, win rate, and trade count; Casual Score increments user profile; clan receives 1.5x multiplier on casual points; animations feel celebratory; results are shareable visually

#### Dual Score System (Ranked vs Casual)
- **Functionality**: Two separate scoring systems - Ranked Score (real on-chain trades, personal reputation, no clan contribution) and Casual Score (MARK3T-SIM trades, contributes to clan points for friendly competition)
- **Purpose**: Separates serious trading reputation from practice/training activities while still rewarding virtual trading through clan system
- **Trigger**: Scores display on Profile, Dashboard, Clan pages, and results screens
- **Progression**: User earns Ranked Score through real arbitrage trades → Earns Casual Score through MARK3T-SIM sessions → Both contribute to total score → Casual Score feeds into clan competition
- **Success criteria**: Scores display separately with color coding (cyan for Ranked, purple for Casual), both visible on Profile page with 4 stat cards (Total/Ranked/Casual/Arbitrage Volume), clan leaderboards prioritize Casual Score contributions, Profile clearly distinguishes score types

## Edge Case Handling
- **No Profitable Opportunities**: Display "No arbitrage opportunities found" state with cyberpunk styling, suggest checking back soon
- **Negative or Zero Profit**: Filter out or dim these opportunities, only highlight profitable ones (>0.5% margin)
- **Network Simulation Pause**: Provide pause/play control so users can freeze data to examine opportunities
- **Very Small Amounts in Calculator**: Show warning if amount is below minimum trading thresholds (~$10)
- **Very Large Percentages**: Cap displayed profit percentages at reasonable bounds (0-20%) to maintain realism
- **No New Coins Match Filters**: Show empty state with suggestion to adjust filters
- **No Scam Tokens Match Filters**: Show friendly empty state suggesting filter adjustment
- **Critical Threat Overload**: Apply special pulsing red border and glitch effect to wallets/tokens with score >90
- **Loading States**: Display animated skeleton loaders with neon pulse effect during initial data generation
- **Mobile Table View**: Convert table to card layout on mobile with all key information accessible
- **High Sentiment Viral Coins**: Apply special pulsing accent glow animation to coins with viral hype level
- **Wallet Cluster Detection**: Show coordinated network badges when wallets are part of scam rings
- **Score-Based Progressive Disclosure**: Automatically show/hide dossier sections based on scam score thresholds
- **Navigation Dead Ends**: All pages must have Back button, Home button via TopBar, and breadcrumb navigation
- **Mobile Sidebar Overlap**: Sidebar slides over content with backdrop blur/darken, tap outside to close
- **QuickActions Overlap**: Position adapts to avoid overlap with page content, hides on pages where not contextually relevant
- **Unauthenticated Access**: Redirect to login page, only show minimal branding (no HUD)
- **User Not in Clan**: Hide clan-specific sections in Dashboard and navigation, show "Join a Clan" CTA
- **Empty Clan Chat**: Show welcome message with instructions for first message
- **Pending Clan Application**: Show status badge and prevent duplicate applications
- **Clan Full**: Disable join button, show "Clan is at capacity" message

## Design Direction
The design should evoke a military-grade command center HUD from a cyberpunk dystopia - think Blade Runner meets Bloomberg Terminal meets Ghost in the Shell with persistent holographic navigation overlays, aggressive neon highlights (cyan, magenta, electric purple), dark backgrounds, glowing borders, and subtle scanline/grid effects that suggest holographic projections. The interface features a persistent HUD (TopBar + SideBar) that frames all content like a heads-up display, with floating context menus and quick action buttons that feel like augmented reality overlays; information should be dense yet organized through strong color coding, clear spatial hierarchy, and smooth page transitions that maintain the illusion of a unified holographic interface.

## Color Selection
Complementary (cyan/magenta opposition with purple bridge) - these high-contrast neons will create visual hierarchy and represent the "buy low/sell high" opposition inherent in arbitrage trading.

- **Primary Color**: Electric Cyan (oklch(0.75 0.15 195)) - represents "buy" actions, data input, and active states; communicates digital precision and cold calculation
- **Secondary Colors**: 
  - Deep Magenta (oklch(0.55 0.22 330)) for "sell" actions and high-profit opportunities, creates urgency
  - Dark Purple (oklch(0.35 0.15 285)) for medium-profit opportunities, bridges cyan and magenta
- **Accent Color**: Hot Pink/Neon Magenta (oklch(0.70 0.25 340)) for CTAs, profit percentages >5%, and urgent attention-grabbing elements
- **Foreground/Background Pairings**:
  - Background (Deep Black oklch(0.15 0.02 285)): Cyan text (oklch(0.85 0.15 195)) - Ratio 9.2:1 ✓
  - Card (Dark Blue-Purple oklch(0.20 0.04 285)): Cyan text (oklch(0.85 0.15 195)) - Ratio 7.8:1 ✓
  - Primary (Electric Cyan oklch(0.75 0.15 195)): Black text (oklch(0.15 0.02 285)) - Ratio 8.5:1 ✓
  - Secondary (Deep Magenta oklch(0.55 0.22 330)): White text (oklch(0.95 0 0)) - Ratio 5.2:1 ✓
  - Accent (Hot Pink oklch(0.70 0.25 340)): Black text (oklch(0.15 0.02 285)) - Ratio 7.1:1 ✓
  - Muted (Dark Gray oklch(0.30 0.02 285)): Light Cyan (oklch(0.75 0.10 195)) - Ratio 4.6:1 ✓

## Font Selection
Typography should feel technical yet readable - a monospace font for numeric data (prices, percentages) to ensure alignment and convey precision, paired with a clean geometric sans-serif for labels and UI elements that suggests futuristic tech interfaces.

- **Typographic Hierarchy**: 
  - H1 (Main Title): Orbitron Bold / 32px / wide letter spacing (0.1em) - cyberpunk display font
  - H2 (Section Headers): Orbitron SemiBold / 20px / normal spacing
  - Data/Numbers (Prices, %): JetBrains Mono Medium / 16px / tabular numbers
  - Body (Labels, UI): Inter Medium / 14px / tight leading
  - Small (Captions): Inter Regular / 12px / muted color

## Animations
Animations should feel like data streaming through a network - constant subtle motion (pulsing glows, flowing gradients) with sharp, snappy transitions for user interactions; balance the ambient "aliveness" of auto-updating data with immediate, responsive feedback for clicks and hovers.

- **Purposeful Meaning**: Glowing effects and pulse animations communicate "live data", price changes flash briefly to draw attention, profit percentages above certain thresholds get special highlight animations
- **Hierarchy of Movement**: 
  - High priority: Price updates (brief flash), new arbitrage opportunities appearing (slide in from side)
  - Medium priority: Table sorting (smooth reorder), hover states (glow intensifies)
  - Low priority: Background grid animation, border glows (constant subtle pulse)

## Component Selection
- **Components**: 
  - HudLayout wrapper with TopBar, SideBar, Breadcrumbs, and QuickActions
  - TopBar with avatar dropdown, notification bell badge, quick nav buttons
  - SideBar with icon navigation items, active state indicators, mobile toggle
  - QuickActions floating action buttons (bottom-right) with tooltips
  - Breadcrumbs with clickable parent segments and current page highlight
  - MiniMap component showing clan territory grid
  - Dashboard with stat cards, quick access tiles, system status list
  - Table with sticky header for arbitrage opportunities (custom styled with neon borders)
  - Card components for calculator, exchange filters, coin discovery, clan profiles (with glowing borders)
  - Badge components for exchange names, profit percentages, risk levels, hype indicators, clan tags (pill-shaped with background glow)
  - Input for profit calculator, sentiment filters, chat messages (custom styled with cyan focus glow)
  - Button for actions (neon outlined style with hover glow effect)
  - Switch/Toggle for pause/play simulation and settings (custom cyberpunk style)
  - Progress bar showing time until next update, sentiment scores, clan progress (thin neon line)
  - Tabs for launch window filtering, chat channels (24h, 7d, 30d, all / general, strategy, alerts)
  - Slider for sentiment threshold control
  - Collapsible sections for network analysis data
  - Avatar component for user profiles with preset emoji or custom images
  - Dialog/Modal for clan applications and confirmations
  - Form components for signup, login, clan creation, profile editing
  - Chat message list with auto-scroll and timestamp formatting

- **Customizations**: 
  - Custom HUD frame styling with persistent TopBar (h-16) and SideBar (w-64 on desktop)
  - Glowing neon underline on TopBar with pulse animation
  - SideBar active indicator with glow-pulse animation and border-left accent
  - QuickActions with staggered fade-in animation and hover scale effects
  - Breadcrumb separator chevrons with muted styling
  - MiniMap territory grid with clan-colored cells and holographic gradient overlay
  - Dashboard stat cards with trend badges and hover lift effect
  - Table styling with alternating row tints and neon borders
  - Glowing border effects using box-shadow and pseudo-elements (glow-border, glow-border-accent classes)
  - Custom scrollbar styled to match cyberpunk theme
  - Scanline overlay effect using CSS pseudo-elements
  - Grid background pattern using CSS gradients
  - Page transition animations (fade-in, slide-in-from-bottom)
  - Mobile sidebar slide-in with backdrop blur and darken

- **States**: 
  - Buttons: Default (neon outline), Hover (filled with glow), Active (pressed with reduced glow), Disabled (dim gray)
  - SideBar nav items: Default (muted), Hover (primary + translate-x), Active (primary bg + glow + border-left + pulse dot)
  - TopBar notification: No notifications (bell icon), Has notifications (bell + badge with count)
  - QuickActions: Hidden (contextually irrelevant), Visible (fade-in with stagger), Hover (scale-110 + intense glow)
  - Table rows: Default, Hover (background lightens + border glows), High profit (permanent magenta glow)
  - Inputs: Default (cyan border), Focus (intense cyan glow + thicker border), Error (red glow), Filled (border stays lit)
  - Exchange badges: Active (full color + glow), Disabled (grayscale + reduced opacity)
  - Dashboard tiles: Default (subtle border), Hover (scale-105 + shadow-lg + border intensifies)

- **Icon Selection**: 
  - Phosphor Icons library throughout
  - SquaresFour (Dashboard)
  - ChartLine (Arbitrage Scanner)
  - Coins (New Coins)
  - Warning (Naughty Coins)
  - Detective (Scam Wallets)
  - ShoppingCart (Shop)
  - Shield (Clans)
  - MapTrifold (Clan Warz Map)
  - Gear (Settings)
  - SignOut (Logout)
  - Bell (Notifications)
  - House (Home)
  - ArrowLeft/ArrowRight (Navigation)
  - User (Profile)
  - CaretRight (Breadcrumb separator)
  - List/X (Mobile menu toggle)
  - Lightning bolt (for high-profit opportunities)
  - Sparkle/Star (for new coin discovery and viral indicators)
  - Fire (for viral hype level)
  - Play/Pause for simulation control
  - Trophy (for leaderboard ranks)
  - Crown (for clan founders)
  - Users (for members)
  - Social icons (Twitter, Telegram, Discord, GitHub, Globe)
  - Network/Share (for social graph analysis)
  - Refresh/sync for updates and data reloading
  - Currency symbols for crypto icons

- **Spacing**: 
  - Generous padding on cards (24px) to let neon borders breathe
  - Tight table cell padding (12px vertical, 16px horizontal) for density
  - Large gaps between major sections (48px) to separate functional areas
  - Consistent 16px gaps within component groups

- **Mobile**: 
  - TopBar remains fixed at top, condenses to essential elements (avatar, notifications)
  - SideBar collapses completely, accessed via hamburger menu button (top-left below TopBar)
  - Mobile sidebar slides in from left with backdrop blur/darken overlay, tap outside to close
  - QuickActions buttons reduce to 40px (from 48px) and reposition to bottom-4 right-4
  - Breadcrumbs remain visible but may wrap on very narrow screens
  - Dashboard stat cards stack vertically, quick access tiles use 2-column grid on mobile
  - Arbitrage table converts to card-based layout showing one opportunity per card
  - New coin cards and clan cards stack vertically with full information
  - Exchange filters become dropdown/sheet selector instead of inline badges
  - Calculator becomes bottom sheet or expands inline
  - Reduce glow effects intensity on mobile for performance
  - Sticky TopBar on scroll with key controls always accessible
  - Network analysis expands inline instead of side-by-side
  - Chat interface adapts with full-width message bubbles
  - Touch targets minimum 44px for all interactive elements (buttons, nav items, cards)
  - MiniMap maintains readable size at 256px width on tablet, hidden on phone screens
  - Page transitions maintain smooth animations but with reduced distance (10px vs 20px slide)
