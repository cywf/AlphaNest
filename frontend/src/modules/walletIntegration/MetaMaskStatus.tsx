import { Badge } from '@/components/ui/badge'
import { Wallet, CheckCircle, WarningCircle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface MetaMaskStatusProps {
  isConnected: boolean
  address: string | null
  className?: string
  showFullAddress?: boolean
}

export function MetaMaskStatus({
  isConnected,
  address,
  className,
  showFullAddress = false,
}: MetaMaskStatusProps) {
  const truncateAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!isConnected || !address) {
    return (
      <Badge
        variant="outline"
        className={cn(
          'gap-1.5 border-muted-foreground/30 text-muted-foreground',
          className
        )}
      >
        <WarningCircle size={14} weight="fill" />
        Not Connected
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1.5 border-primary/50 text-primary bg-primary/10 font-mono',
        className
      )}
    >
      <CheckCircle size={14} weight="fill" className="text-chart-2" />
      <Wallet size={14} weight="fill" />
      {showFullAddress ? address : truncateAddress(address)}
    </Badge>
  )
}
