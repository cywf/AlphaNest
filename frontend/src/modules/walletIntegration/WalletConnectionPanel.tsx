import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useMetaMask } from './useMetaMask'
import { MetaMaskStatus } from './MetaMaskStatus'
import { 
  Wallet, 
  CheckCircle, 
  XCircle, 
  Copy, 
  ArrowSquareOut,
  Warning 
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface WalletConnectionPanelProps {
  onClose?: () => void
  className?: string
}

export function WalletConnectionPanel({ onClose, className }: WalletConnectionPanelProps) {
  const {
    isConnected,
    address,
    isConnecting,
    isMetaMaskInstalled,
    chainId,
    error,
    connect,
    disconnect,
  } = useMetaMask()

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success('Address copied to clipboard')
    }
  }

  const handleViewOnExplorer = () => {
    if (address) {
      window.open(`https://etherscan.io/address/${address}`, '_blank')
    }
  }

  const getChainName = (id: string | null): string => {
    if (!id) return 'Unknown'
    switch (id) {
      case '0x1':
        return 'Ethereum Mainnet'
      case '0x5':
        return 'Goerli Testnet'
      case '0x89':
        return 'Polygon'
      case '0xa':
        return 'Optimism'
      case '0xa4b1':
        return 'Arbitrum'
      default:
        return `Chain ${id}`
    }
  }

  return (
    <Card className={cn('glow-border bg-card/95 backdrop-blur-md p-6 space-y-6', className)}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Wallet size={24} className="text-primary" />
            Wallet Connection
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Connect your MetaMask to trade, transfer NFTs, and execute transactions
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3">
          <Warning size={20} className="text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-destructive">Connection Error</p>
            <p className="text-xs text-destructive/80 mt-1">{error}</p>
          </div>
        </div>
      )}

      {!isMetaMaskInstalled ? (
        <div className="space-y-4">
          <div className="p-6 rounded-lg bg-muted/30 border border-border text-center space-y-3">
            <XCircle size={48} className="text-destructive mx-auto" />
            <div>
              <p className="font-semibold">MetaMask Not Detected</p>
              <p className="text-sm text-muted-foreground mt-1">
                Install the MetaMask browser extension to continue
              </p>
            </div>
          </div>
          <Button
            className="w-full gap-2"
            onClick={() => window.open('https://metamask.io/download/', '_blank')}
          >
            <ArrowSquareOut size={18} />
            Install MetaMask
          </Button>
        </div>
      ) : !isConnected ? (
        <div className="space-y-4">
          <div className="p-6 rounded-lg bg-muted/30 border border-border text-center space-y-3">
            <Wallet size={48} className="text-primary mx-auto" />
            <div>
              <p className="font-semibold">Ready to Connect</p>
              <p className="text-sm text-muted-foreground mt-1">
                Click below to connect your MetaMask wallet
              </p>
            </div>
          </div>
          <Button
            className="w-full gap-2"
            onClick={connect}
            disabled={isConnecting}
          >
            <Wallet size={18} />
            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-6 rounded-lg bg-primary/5 border border-primary/30 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle size={32} weight="fill" className="text-chart-2" />
              <p className="font-semibold text-lg">Connected</p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Wallet Address</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 rounded bg-background/50 border border-border text-xs font-mono break-all">
                    {address}
                  </code>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCopyAddress}
                    className="flex-shrink-0"
                  >
                    <Copy size={16} />
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Network</p>
                <Badge variant="outline" className="font-mono">
                  {getChainName(chainId)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleViewOnExplorer}
            >
              <ArrowSquareOut size={16} />
              Explorer
            </Button>
            <Button
              variant="outline"
              className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={disconnect}
            >
              <XCircle size={16} />
              Disconnect
            </Button>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground text-center">
          Your wallet connection is secure and encrypted. ALPHA-N3ST never stores your private keys.
        </p>
      </div>
    </Card>
  )
}
