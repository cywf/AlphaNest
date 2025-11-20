import { ArrowLeft, ArrowRight, MapTrifold, Detective, Wallet } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'
import { WalletConnectionPanel } from '@/modules/walletIntegration/WalletConnectionPanel'
import { cn } from '@/lib/utils'

interface QuickActionsProps {
  onNavigate: (page: string) => void
  currentPage: string
}

export function QuickActions({ onNavigate, currentPage }: QuickActionsProps) {
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false)
  const canGoBack = currentPage !== 'dashboard'

  const actions = [
    {
      id: 'back',
      icon: <ArrowLeft className="h-5 w-5" />,
      label: 'Go Back',
      onClick: () => window.history.back(),
      show: canGoBack,
    },
    {
      id: 'forward',
      icon: <ArrowRight className="h-5 w-5" />,
      label: 'Go Forward',
      onClick: () => window.history.forward(),
      show: canGoBack,
    },
    {
      id: 'wallet',
      icon: <Wallet className="h-5 w-5" />,
      label: 'Connect Wallet',
      onClick: () => setIsWalletDialogOpen(true),
      show: true,
      className: 'bg-chart-2/90 hover:bg-chart-2 border-chart-2-foreground/20 hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]',
    },
    {
      id: 'map',
      icon: <MapTrifold className="h-5 w-5" />,
      label: 'Open Clan Warz Map',
      onClick: () => onNavigate('clan-warz'),
      show: !currentPage.includes('clan-warz'),
    },
    {
      id: 'wallets',
      icon: <Detective className="h-5 w-5" />,
      label: 'SCAM-WALL3TS Dossier',
      onClick: () => onNavigate('scam-wallets'),
      show: currentPage !== 'scam-wallets',
    },
  ]

  const visibleActions = actions.filter((action) => action.show)

  if (visibleActions.length === 0) return null

  return (
    <>
      <TooltipProvider>
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 flex flex-col gap-2">
          {visibleActions.map((action, index) => (
            <Tooltip key={action.id}>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  onClick={action.onClick}
                  className={cn(
                    'h-10 w-10 md:h-12 md:w-12 rounded-full shadow-lg transition-all duration-300',
                    'bg-primary/90 hover:bg-primary hover:scale-110',
                    'border-2 border-primary-foreground/20',
                    'hover:shadow-[0_0_30px_rgba(99,220,255,0.6)]',
                    'animate-in fade-in slide-in-from-right-5',
                    action.className
                  )}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {action.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-card/95 backdrop-blur-md border-primary/30 hidden md:block">
                <p>{action.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      <Dialog open={isWalletDialogOpen} onOpenChange={setIsWalletDialogOpen}>
        <DialogContent className="max-w-md bg-background/95 backdrop-blur-xl border-primary/30">
          <DialogHeader>
            <DialogTitle className="sr-only">Connect Wallet</DialogTitle>
          </DialogHeader>
          <WalletConnectionPanel onClose={() => setIsWalletDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
