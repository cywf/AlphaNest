import { useState, useEffect, useCallback } from 'react'
import { Header } from './components/Header'
import { ArbitrageTable } from './components/ArbitrageTable'
import { ProfitCalculator } from './components/ProfitCalculator'
import { NewCoinDiscoveryPanel } from './modules/newCoins/NewCoinDiscoveryPanel'
import { NaughtyCoinPanel } from './modules/naughtyCoins/NaughtyCoinPanel'
import { WalletLeaderboard } from './modules/walletIntel/WalletLeaderboard'
import { WalletProfile } from './modules/walletIntel/WalletProfile'
import { UserSignup } from './modules/users/UserSignup'
import { UserLogin } from './modules/users/UserLogin'
import { UserProfile } from './modules/users/UserProfile'
import { MarketDirectory } from './modules/market/MarketDirectory'
import { MarketBooth } from './modules/market/MarketBooth'
import { AIChatDock } from './modules/ai/AIChatDock'
import { ClanDirectory } from './modules/clans/ClanDirectory'
import { ClanCreate } from './modules/clans/ClanCreate'
import { ClanPage } from './modules/clans/ClanPage'
import { ClanChat } from './modules/clans/ClanChat'
import { ClanApply } from './modules/clans/ClanApply'
import { ClanWarzMap } from './modules/clanWarz/ClanWarzMap'
import { MarketAnalysisFeed } from './modules/marketAnalysis/MarketAnalysisFeed'
import { Stak3zDashboard } from './modules/stak3z/Stak3zDashboard'
import { StakingPoolDetails } from './modules/stak3z/StakingPoolDetails'
import { Mark3tSimDashboard } from './modules/mark3tSim/Mark3tSimDashboard'
import { Mark3tSimTradePanel } from './modules/mark3tSim/Mark3tSimTradePanel'
import { Mark3tSimPortfolio } from './modules/mark3tSim/Mark3tSimPortfolio'
import { Mark3tSimResults } from './modules/mark3tSim/Mark3tSimResults'
import { Dashboard } from './pages/Dashboard'
import { Settings } from './pages/Settings'
import { HudLayout } from './layouts/HudLayout'
import { Card } from './components/ui/card'
import type { ArbitrageOpportunity, Exchange } from './types/arbitrage'
import { EXCHANGES } from './types/arbitrage'
import { generateArbitrageOpportunities } from './lib/arbitrage'
import { fetchArbitrageOpportunities } from './lib/apiClient'
import { Toaster } from './components/ui/sonner'
import { toast } from 'sonner'
import { authEngine } from './modules/users/authEngine'
import { clanEngine } from './modules/clans/clanEngine'
import { mark3tSimEngine } from './modules/mark3tSim/Mark3tSimEngine'
import type { SimPerformance } from './modules/mark3tSim/mark3tSimTypes'
import type { Clan } from './modules/clans/clanTypes'
import type { BreadcrumbItem } from './components/HUD/Breadcrumbs'

const UPDATE_INTERVAL = 4000

type AppPage =
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'arbitrage'
  | 'new-coins'
  | 'naughty-coins'
  | 'scam-wallets'
  | 'wallet-dossier'
  | 'calculator'
  | 'profile'
  | 'market'
  | 'market-booth'
  | 'market-analysis'
  | 'clans'
  | 'clan-create'
  | 'clan-page'
  | 'clan-chat'
  | 'clan-apply'
  | 'clan-warz'
  | 'stak3z'
  | 'stak3z-pool'
  | 'mark3t-sim'
  | 'mark3t-sim-trade'
  | 'mark3t-sim-portfolio'
  | 'mark3t-sim-results'
  | 'settings'

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('login')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [enabledExchanges, setEnabledExchanges] = useState<Exchange[]>(EXCHANGES)
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([])
  const [selectedOpportunity, setSelectedOpportunity] = useState<ArbitrageOpportunity | null>(null)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [timeUntilUpdate, setTimeUntilUpdate] = useState<number>(UPDATE_INTERVAL)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedClanId, setSelectedClanId] = useState<string | null>(null)
  const [clanToApply, setClanToApply] = useState<Clan | null>(null)
  const [isAIChatOpen, setIsAIChatOpen] = useState(false)
  const [selectedBoothUsername, setSelectedBoothUsername] = useState<string | null>(null)
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null)
  const [currentSimSessionId, setCurrentSimSessionId] = useState<string | null>(null)
  const [simPerformance, setSimPerformance] = useState<SimPerformance | null>(null)
  const [selectedWalletAddress, setSelectedWalletAddress] = useState<string | null>(null)

  useEffect(() => {
    authEngine.initializeDemoUsers()
    clanEngine.initializeDemoClans()
    
    const session = authEngine.getSession()
    if (session) {
      setIsLoggedIn(true)
      setCurrentPage('dashboard')
    }
  }, [])

  const syncSelectedOpportunity = useCallback(
    (nextOpportunities: ArbitrageOpportunity[]) => {
      if (nextOpportunities.length === 0) {
        setSelectedOpportunity(null)
        return
      }

      if (selectedOpportunity) {
        const updated = nextOpportunities.find(
          (opp) => opp.coin.symbol === selectedOpportunity.coin.symbol,
        )
        if (updated) {
          setSelectedOpportunity(updated)
          return
        }
      }

      setSelectedOpportunity(nextOpportunities[0])
    },
    [selectedOpportunity],
  )

  const loadOpportunities = useCallback(
    async (options: { keepSelection?: boolean } = {}) => {
      const { keepSelection = false } = options
      setIsLoading(true)

      let nextOpportunities: ArbitrageOpportunity[] = []
      try {
        nextOpportunities = await fetchArbitrageOpportunities(enabledExchanges)
      } catch (error) {
        console.warn('[API] Falling back to mock arbitrage data', error)
        nextOpportunities = generateArbitrageOpportunities(enabledExchanges)
      }

      setOpportunities(nextOpportunities)
      setIsLoading(false)

      if (!keepSelection) {
        syncSelectedOpportunity(nextOpportunities)
      } else if (selectedOpportunity) {
        syncSelectedOpportunity(nextOpportunities)
      }
    },
    [enabledExchanges, selectedOpportunity, syncSelectedOpportunity],
  )

  useEffect(() => {
    loadOpportunities()
  }, [loadOpportunities])

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      loadOpportunities({ keepSelection: true })

      const currentUser = authEngine.getCurrentUser()
      if (currentUser && currentUser.clanId) {
        const pointsEarned = Math.floor(Math.random() * 50) + 10
        authEngine.incrementUserScore(currentUser.id, pointsEarned)
        clanEngine.updateClanScore(currentUser.clanId, pointsEarned)
      }
    }, UPDATE_INTERVAL)

    return () => clearInterval(interval)
  }, [enabledExchanges, isPaused, loadOpportunities])

  useEffect(() => {
    if (isPaused) {
      setTimeUntilUpdate(UPDATE_INTERVAL)
      return
    }

    setTimeUntilUpdate(UPDATE_INTERVAL)
    
    const interval = setInterval(() => {
      setTimeUntilUpdate((prev) => {
        if (prev <= 100) return UPDATE_INTERVAL
        return prev - 100
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPaused, opportunities])

  const handleToggleExchange = useCallback((exchange: Exchange) => {
    if (enabledExchanges.length === 1 && enabledExchanges.includes(exchange)) {
      toast.error('At least one exchange must be enabled')
      return
    }

    setEnabledExchanges((prev) =>
      prev.includes(exchange)
        ? prev.filter((e) => e !== exchange)
        : [...prev, exchange]
    )
  }, [enabledExchanges])

  const handleSelectOpportunity = useCallback((opportunity: ArbitrageOpportunity) => {
    setSelectedOpportunity(opportunity)
    toast.success(`Selected ${opportunity.coin.name} arbitrage`, {
      description: `${opportunity.profitPercentage.toFixed(2)}% potential profit`,
    })
  }, [])

  const handleNavigate = useCallback((page: string) => {
    setCurrentPage(page as AppPage)
  }, [])

  const handleTogglePause = useCallback(() => {
    setIsPaused(prev => !prev)
  }, [])

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
    setCurrentPage('dashboard')
  }

  const handleSignupSuccess = () => {
    setCurrentPage('login')
  }

  const handleLogout = () => {
    authEngine.logout()
    setIsLoggedIn(false)
    setCurrentPage('login')
    toast.success('Logged out successfully')
  }

  const handleViewClan = (clanId: string) => {
    setSelectedClanId(clanId)
    setCurrentPage('clan-page')
  }

  const handleApplyToClan = (clanId: string) => {
    const clan = clanEngine.getClan(clanId)
    if (clan) {
      setClanToApply(clan)
      setCurrentPage('clan-apply')
    }
  }

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const currentUser = authEngine.getCurrentUser()
    const userClan = currentUser?.clanId ? clanEngine.getClan(currentUser.clanId) : null

    switch (currentPage) {
      case 'profile':
        return [{ label: 'Profile' }]
      case 'market':
        return [{ label: 'Market' }]
      case 'market-booth':
        return [
          { label: 'Market', page: 'market' },
          { label: selectedBoothUsername || 'Booth' },
        ]
      case 'clans':
        return [{ label: 'Clans' }]
      case 'clan-create':
        return [
          { label: 'Clans', page: 'clans' },
          { label: 'Create Clan' },
        ]
      case 'clan-page':
        return [
          { label: 'Clans', page: 'clans' },
          { label: userClan?.name || 'Clan' },
        ]
      case 'clan-chat':
        return [
          { label: 'Clans', page: 'clans' },
          { label: userClan?.name || 'Clan', page: 'clan-page' },
          { label: 'Chat' },
        ]
      case 'clan-apply':
        return [
          { label: 'Clans', page: 'clans' },
          { label: clanToApply?.name || 'Clan' },
          { label: 'Apply' },
        ]
      case 'clan-warz':
        return [{ label: 'Clan Warz Map' }]
      case 'arbitrage':
        return [{ label: 'ArbScan' }]
      case 'new-coins':
        return [{ label: 'Coin-Fisher' }]
      case 'naughty-coins':
        return [{ label: 'SK3TCHY-C0INS' }]
      case 'scam-wallets':
        return [{ label: 'SCAM-WALL3TS' }]
      case 'wallet-dossier':
        return [
          { label: 'SCAM-WALL3TS', page: 'scam-wallets' },
          { label: 'Wallet Dossier' },
        ]
      case 'market-analysis':
        return [{ label: 'Market Analysis Feed' }]
      case 'stak3z':
        return [{ label: 'STAK3Z' }]
      case 'stak3z-pool':
        return [
          { label: 'STAK3Z', page: 'stak3z' },
          { label: 'Pool Details' },
        ]
      case 'mark3t-sim':
        return [{ label: 'MARK3T-SIM' }]
      case 'mark3t-sim-trade':
        return [
          { label: 'MARK3T-SIM', page: 'mark3t-sim' },
          { label: 'Trade' },
        ]
      case 'mark3t-sim-portfolio':
        return [
          { label: 'MARK3T-SIM', page: 'mark3t-sim' },
          { label: 'Portfolio' },
        ]
      case 'mark3t-sim-results':
        return [
          { label: 'MARK3T-SIM', page: 'mark3t-sim' },
          { label: 'Results' },
        ]
      case 'settings':
        return [{ label: 'Settings' }]
      default:
        return []
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen scanline grid-bg">
        {currentPage === 'login' ? (
          <UserLogin
            onSuccess={handleLoginSuccess}
            onSwitchToSignup={() => setCurrentPage('signup')}
          />
        ) : (
          <UserSignup
            onSuccess={handleSignupSuccess}
            onSwitchToLogin={() => setCurrentPage('login')}
          />
        )}
        <Toaster position="bottom-right" />
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />

      case 'arbitrage':
        return (
          <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
            <Header
              enabledExchanges={enabledExchanges}
              onToggleExchange={handleToggleExchange}
              isPaused={isPaused}
              onTogglePause={handleTogglePause}
              timeUntilUpdate={timeUntilUpdate}
              updateInterval={UPDATE_INTERVAL}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="glow-border bg-card/50 backdrop-blur-sm overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <span className="text-accent">◈</span>
                      ArbScan Opportunities
                      <span className="ml-auto text-sm font-normal text-muted-foreground">
                        {opportunities.length} found
                      </span>
                    </h2>
                  </div>
                  <ArbitrageTable
                    opportunities={opportunities}
                    onSelectOpportunity={handleSelectOpportunity}
                    selectedOpportunity={selectedOpportunity}
                    isLoading={isLoading}
                  />
                </Card>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <ProfitCalculator opportunity={selectedOpportunity} />
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-muted-foreground py-4 border-t border-border/30">
              <p>
                ⚠ This is a demonstration with simulated data. Not financial advice.
              </p>
              <p className="mt-1">
                Real arbitrage involves risks including fees, slippage, and transfer times.
              </p>
            </div>
          </div>
        )

      case 'new-coins':
        return (
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <NewCoinDiscoveryPanel />
          </div>
        )

      case 'naughty-coins':
        return (
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <NaughtyCoinPanel />
          </div>
        )

      case 'scam-wallets':
        return (
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <WalletLeaderboard 
              onViewWallet={(address) => {
                setSelectedWalletAddress(address)
                setCurrentPage('wallet-dossier')
              }}
            />
          </div>
        )

      case 'wallet-dossier':
        return selectedWalletAddress ? (
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <WalletProfile 
              walletAddress={selectedWalletAddress}
              onBack={() => setCurrentPage('scam-wallets')}
            />
          </div>
        ) : null

      case 'profile':
        return (
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <UserProfile
              onNavigateToShop={() => {
                const user = authEngine.getCurrentUser()
                if (user) {
                  setSelectedBoothUsername(user.username)
                  setCurrentPage('market-booth')
                }
              }}
              onNavigateToClan={() => {
                const user = authEngine.getCurrentUser()
                if (user?.clanId) {
                  handleViewClan(user.clanId)
                }
              }}
            />
          </div>
        )

      case 'market':
        return (
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <MarketDirectory
              onViewBooth={(username) => {
                setSelectedBoothUsername(username)
                setCurrentPage('market-booth')
              }}
            />
          </div>
        )

      case 'market-booth':
        return (
          <MarketBooth username={selectedBoothUsername || undefined} />
        )

      case 'market-analysis':
        return (
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <MarketAnalysisFeed onNavigate={(page) => handleNavigate(page)} />
          </div>
        )

      case 'clans':
        return (
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <ClanDirectory
              onCreateClan={() => setCurrentPage('clan-create')}
              onViewClan={handleViewClan}
              onApplyToClan={handleApplyToClan}
            />
          </div>
        )

      case 'clan-create':
        return (
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <ClanCreate
              onSuccess={(clanId) => {
                setSelectedClanId(clanId)
                setCurrentPage('clan-page')
              }}
              onCancel={() => setCurrentPage('clans')}
            />
          </div>
        )

      case 'clan-page':
        return selectedClanId ? (
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <ClanPage
              clanId={selectedClanId}
              onBack={() => setCurrentPage('clans')}
              onViewChat={(clanId) => {
                setSelectedClanId(clanId)
                setCurrentPage('clan-chat')
              }}
            />
          </div>
        ) : null

      case 'clan-chat':
        return selectedClanId ? (
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <ClanChat
              clanId={selectedClanId}
              onBack={() => setCurrentPage('clan-page')}
            />
          </div>
        ) : null

      case 'clan-apply':
        return clanToApply ? (
          <div className="container mx-auto px-4 py-8 max-w-2xl">
            <ClanApply
              clan={clanToApply}
              onSuccess={() => {
                toast.success('Application submitted!')
                setCurrentPage('clans')
              }}
              onCancel={() => setCurrentPage('clans')}
            />
          </div>
        ) : null

      case 'clan-warz':
        return (
          <div className="container mx-auto px-4 py-8 max-w-full">
            <ClanWarzMap />
          </div>
        )

      case 'stak3z':
        return (
          <Stak3zDashboard
            onPoolClick={(poolId) => {
              setSelectedPoolId(poolId)
              setCurrentPage('stak3z-pool')
            }}
          />
        )

      case 'stak3z-pool':
        return selectedPoolId ? (
          <StakingPoolDetails
            poolId={selectedPoolId}
            onBack={() => setCurrentPage('stak3z')}
          />
        ) : null

      case 'mark3t-sim':
        return (
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <Mark3tSimDashboard
              onStartSession={() => {
                const currentUser = authEngine.getCurrentUser()
                if (currentUser) {
                  const session = mark3tSimEngine.startSession(currentUser.id)
                  setCurrentSimSessionId(session.id)
                  setCurrentPage('mark3t-sim-trade')
                  toast.success('New session started!')
                }
              }}
              onContinueSession={(sessionId) => {
                setCurrentSimSessionId(sessionId)
                setCurrentPage('mark3t-sim-trade')
              }}
              onViewPortfolio={() => {
                const currentUser = authEngine.getCurrentUser()
                if (currentUser) {
                  const sessions = mark3tSimEngine.getActiveSessions(currentUser.id)
                  if (sessions.length > 0) {
                    setCurrentSimSessionId(sessions[0].id)
                    setCurrentPage('mark3t-sim-portfolio')
                  } else {
                    toast.error('No active session found')
                  }
                }
              }}
              onNavigateToTrade={() => {
                const currentUser = authEngine.getCurrentUser()
                if (currentUser) {
                  const sessions = mark3tSimEngine.getActiveSessions(currentUser.id)
                  if (sessions.length > 0) {
                    setCurrentSimSessionId(sessions[0].id)
                    setCurrentPage('mark3t-sim-trade')
                  } else {
                    const session = mark3tSimEngine.startSession(currentUser.id)
                    setCurrentSimSessionId(session.id)
                    setCurrentPage('mark3t-sim-trade')
                  }
                }
              }}
            />
          </div>
        )

      case 'mark3t-sim-trade':
        return currentSimSessionId ? (
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <Mark3tSimTradePanel
              sessionId={currentSimSessionId}
              onTradeComplete={() => {
                toast.success('Trade recorded!')
              }}
            />
          </div>
        ) : null

      case 'mark3t-sim-portfolio':
        return currentSimSessionId ? (
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <Mark3tSimPortfolio
              sessionId={currentSimSessionId}
              onRefresh={() => {
                const currentUser = authEngine.getCurrentUser()
                if (currentUser) {
                  const sessions = mark3tSimEngine.getActiveSessions(currentUser.id)
                  if (sessions.length > 0) {
                    setCurrentSimSessionId(sessions[0].id)
                  }
                }
              }}
            />
          </div>
        ) : null

      case 'mark3t-sim-results':
        return simPerformance ? (
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <Mark3tSimResults
              performance={simPerformance}
              onBackToDashboard={() => {
                setCurrentPage('mark3t-sim')
                setSimPerformance(null)
              }}
              onStartNewSession={() => {
                const currentUser = authEngine.getCurrentUser()
                if (currentUser) {
                  const session = mark3tSimEngine.startSession(currentUser.id)
                  setCurrentSimSessionId(session.id)
                  setCurrentPage('mark3t-sim-trade')
                  toast.success('New session started!')
                }
              }}
            />
          </div>
        ) : null

      case 'settings':
        return <Settings />

      default:
        return <Dashboard onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="scanline grid-bg">
      <HudLayout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        breadcrumbs={getBreadcrumbs()}
        onOpenAIChat={() => setIsAIChatOpen(true)}
      >
        {renderPage()}
      </HudLayout>
      <AIChatDock
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />
      <Toaster position="bottom-right" />
    </div>
  )
}

export default App
