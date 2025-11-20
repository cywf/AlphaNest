import { useState } from 'react'
import {
  SquaresFour,
  ChartLine,
  Coins,
  Warning,
  Detective,
  ShoppingCart,
  Shield,
  MapTrifold,
  Gear,
  SignOut,
  List,
  X,
  Pulse,
  Drop,
  Lightning,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SideBarProps {
  currentPage: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  onClick: () => void
}

export function SideBar({ currentPage, onNavigate, onLogout }: SideBarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <SquaresFour className="h-5 w-5" />,
      onClick: () => onNavigate('dashboard'),
    },
    {
      id: 'arbitrage',
      label: 'ArbScan',
      icon: <ChartLine className="h-5 w-5" />,
      onClick: () => onNavigate('arbitrage'),
    },
    {
      id: 'new-coins',
      label: 'Coin-Fisher',
      icon: <Coins className="h-5 w-5" />,
      onClick: () => onNavigate('new-coins'),
    },
    {
      id: 'naughty-coins',
      label: 'SK3TCHY-C0INS',
      icon: <Warning className="h-5 w-5" />,
      onClick: () => onNavigate('naughty-coins'),
    },
    {
      id: 'scam-wallets',
      label: 'SCAM-WALL3TS',
      icon: <Detective className="h-5 w-5" />,
      onClick: () => onNavigate('scam-wallets'),
    },
    {
      id: 'market',
      label: 'Market',
      icon: <ShoppingCart className="h-5 w-5" />,
      onClick: () => onNavigate('market'),
    },
    {
      id: 'market-analysis',
      label: 'Market Analysis',
      icon: <Pulse className="h-5 w-5" />,
      onClick: () => onNavigate('market-analysis'),
    },
    {
      id: 'stak3z',
      label: 'STAK3Z',
      icon: <Drop className="h-5 w-5" />,
      onClick: () => onNavigate('stak3z'),
    },
    {
      id: 'mark3t-sim',
      label: 'MARK3T-SIM',
      icon: <Lightning className="h-5 w-5" />,
      onClick: () => onNavigate('mark3t-sim'),
    },
    {
      id: 'clans',
      label: 'Clans',
      icon: <Shield className="h-5 w-5" />,
      onClick: () => onNavigate('clans'),
    },
    {
      id: 'clan-warz',
      label: 'Clan Warz Map',
      icon: <MapTrifold className="h-5 w-5" />,
      onClick: () => onNavigate('clan-warz'),
    },
  ]

  const bottomNavItems: NavItem[] = [
    {
      id: 'settings',
      label: 'Settings',
      icon: <Gear className="h-5 w-5" />,
      onClick: () => onNavigate('settings'),
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: <SignOut className="h-5 w-5" />,
      onClick: onLogout,
    },
  ]

  const renderNavItem = (item: NavItem) => {
    const isActive = currentPage === item.id || 
      (item.id === 'clans' && (currentPage.startsWith('clan-') || currentPage === 'clans')) ||
      (item.id === 'market' && (currentPage.startsWith('market-') || currentPage === 'market')) ||
      (item.id === 'stak3z' && (currentPage.startsWith('stak3z') || currentPage === 'stak3z')) ||
      (item.id === 'mark3t-sim' && (currentPage.startsWith('mark3t-sim') || currentPage === 'mark3t-sim'))

    return (
      <button
        key={item.id}
        onClick={() => {
          item.onClick()
          setIsOpen(false)
        }}
        className={cn(
          'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
          'hover:bg-primary/10 hover:translate-x-1',
          isActive && 'bg-primary/20 border-l-4 border-primary shadow-[0_0_20px_rgba(99,220,255,0.3)]',
          !isActive && 'border-l-4 border-transparent'
        )}
      >
        <span className={cn('transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')}>
          {item.icon}
        </span>
        <span className={cn('text-sm font-medium transition-colors', isActive ? 'text-primary' : 'text-foreground')}>
          {item.label}
        </span>
        {isActive && (
          <span className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
        )}
      </button>
    )
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-[72px] left-4 z-50 bg-card/95 backdrop-blur-md border border-primary/30 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
      </Button>

      <div
        className={cn(
          'fixed top-[65px] left-0 bottom-0 w-64 bg-card/95 backdrop-blur-md border-r border-primary/30 z-40 transition-transform duration-300',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-full flex flex-col p-4">
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {navItems.map(renderNavItem)}
          </nav>

          <div className="border-t border-primary/20 pt-4 space-y-1">
            {bottomNavItems.map(renderNavItem)}
          </div>
        </div>

        <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-transparent via-primary to-transparent opacity-50" />
      </div>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
