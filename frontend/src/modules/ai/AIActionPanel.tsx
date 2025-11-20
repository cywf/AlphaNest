import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Robot, ChartLine, Storefront, Shield, Detective } from '@phosphor-icons/react'

interface AIActionPanelProps {
  context: 'market' | 'arbitrage' | 'clan' | 'wallet'
  onOpenChat: (context: string) => void
}

export function AIActionPanel({ context, onOpenChat }: AIActionPanelProps) {
  const getContextInfo = () => {
    switch (context) {
      case 'market':
        return {
          icon: <Storefront size={20} />,
          title: 'Market Intelligence',
          description: 'Get AI-powered insights on NFT trends and booth performance',
        }
      case 'arbitrage':
        return {
          icon: <ChartLine size={20} />,
          title: 'Arbitrage Analysis',
          description: 'Discover optimal trading opportunities with AI recommendations',
        }
      case 'clan':
        return {
          icon: <Shield size={20} />,
          title: 'Clan Strategy',
          description: 'AI-assisted clan warfare tactics and territory control',
        }
      case 'wallet':
        return {
          icon: <Detective size={20} />,
          title: 'Wallet Risk Analysis',
          description: 'AI-powered risk assessment and fraud detection',
        }
    }
  }

  const info = getContextInfo()

  return (
    <div className="fixed bottom-20 right-6 z-40 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-card/95 backdrop-blur-md border border-primary/30 rounded-lg p-4 shadow-2xl max-w-xs">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">{info.icon}</div>
          <div className="flex-1">
            <h4 className="font-bold text-sm mb-1">{info.title}</h4>
            <p className="text-xs text-muted-foreground">{info.description}</p>
          </div>
        </div>
        <Button
          size="sm"
          className="w-full"
          onClick={() => onOpenChat(context)}
        >
          <Robot className="mr-2" size={16} />
          Ask AI Assistant
        </Button>
        <div className="mt-2 text-center">
          <Badge variant="outline" className="text-xs">
            Coming Soon
          </Badge>
        </div>
      </div>
    </div>
  )
}
