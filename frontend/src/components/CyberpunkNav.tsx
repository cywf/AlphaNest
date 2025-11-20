import { Button } from '@/components/ui/button'
import { ArrowsLeftRight, Sparkle, Calculator, Warning, ShieldWarning, Users, Globe } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export type NavigationPage = 'arbitrage' | 'new-coins' | 'calculator' | 'naughty-coins' | 'scam-wallets' | 'clans' | 'clan-warz'

interface CyberpunkNavProps {
  currentPage: NavigationPage
  onNavigate: (page: NavigationPage) => void
}

interface NavItem {
  id: NavigationPage
  label: string
  icon: React.ComponentType<{ size?: number; weight?: 'regular' | 'fill' | 'duotone' }>
  ariaLabel: string
}

export function CyberpunkNav({ currentPage, onNavigate }: CyberpunkNavProps) {
  const navItems: NavItem[] = [
    { 
      id: 'arbitrage', 
      label: 'Arbitrage', 
      icon: ArrowsLeftRight,
      ariaLabel: 'Navigate to Arbitrage Scanner'
    },
    { 
      id: 'new-coins', 
      label: 'New Coins', 
      icon: Sparkle,
      ariaLabel: 'Navigate to New Coin Discovery'
    },
    { 
      id: 'calculator', 
      label: 'Calculator', 
      icon: Calculator,
      ariaLabel: 'Navigate to Profit Calculator'
    },
    { 
      id: 'naughty-coins', 
      label: 'Naughty-Coins', 
      icon: Warning,
      ariaLabel: 'Navigate to Naughty-Coin List'
    },
    { 
      id: 'scam-wallets', 
      label: 'Scam Wallets', 
      icon: ShieldWarning,
      ariaLabel: 'Navigate to Scam Wallet Leaderboard'
    },
    { 
      id: 'clans', 
      label: 'Clans', 
      icon: Users,
      ariaLabel: 'Navigate to Clans Directory'
    },
    { 
      id: 'clan-warz', 
      label: 'Clan Warz', 
      icon: Globe,
      ariaLabel: 'Navigate to Clan Warz Map'
    },
  ]

  const handleKeyDown = (e: React.KeyboardEvent, page: NavigationPage) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onNavigate(page)
    }
  }

  return (
    <nav role="navigation" aria-label="Main navigation" className="space-y-2">
      {navItems.map((item, index) => {
        const Icon = item.icon
        const isActive = currentPage === item.id

        return (
          <Button
            key={item.id}
            variant={isActive ? 'default' : 'ghost'}
            className={cn(
              'w-full justify-start gap-3 transition-all duration-300 relative group',
              isActive
                ? 'bg-primary/20 text-primary border border-primary/50 shadow-[0_0_10px_rgba(99,220,255,0.3)]'
                : 'text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent'
            )}
            onClick={() => onNavigate(item.id)}
            onKeyDown={(e) => handleKeyDown(e, item.id)}
            aria-label={item.ariaLabel}
            aria-current={isActive ? 'page' : undefined}
            tabIndex={0}
          >
            {isActive && (
              <motion.div
                layoutId="active-indicator"
                className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full shadow-[0_0_8px_rgba(99,220,255,0.8)]"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
            <span className="font-medium">{item.label}</span>
          </Button>
        )
      })}
    </nav>
  )
}
