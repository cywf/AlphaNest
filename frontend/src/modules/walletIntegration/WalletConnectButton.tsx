import { Button } from '@/components/ui/button'
import { Wallet } from '@phosphor-icons/react'
import { useMetaMask } from './useMetaMask'
import { cn } from '@/lib/utils'

interface WalletConnectButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showIcon?: boolean
}

export function WalletConnectButton({
  variant = 'default',
  size = 'default',
  className,
  showIcon = true,
}: WalletConnectButtonProps) {
  const { isConnected, address, isConnecting, isMetaMaskInstalled, connect, disconnect } = useMetaMask()

  const truncateAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!isMetaMaskInstalled) {
    return (
      <Button
        variant="outline"
        size={size}
        className={cn('gap-2 border-destructive/50 text-destructive hover:bg-destructive/10', className)}
        onClick={() => window.open('https://metamask.io/download/', '_blank')}
      >
        {showIcon && <Wallet size={18} />}
        Install MetaMask
      </Button>
    )
  }

  if (isConnected && address) {
    return (
      <Button
        variant={variant}
        size={size}
        className={cn('gap-2 font-mono border-primary/50 bg-primary/10 hover:bg-primary/20', className)}
        onClick={disconnect}
      >
        {showIcon && <Wallet size={18} weight="fill" className="text-chart-2" />}
        {truncateAddress(address)}
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn('gap-2', className)}
      onClick={connect}
      disabled={isConnecting}
    >
      {showIcon && <Wallet size={18} />}
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  )
}
