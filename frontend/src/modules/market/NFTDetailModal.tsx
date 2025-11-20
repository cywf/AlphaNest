import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Eye, Heart, ShoppingCart, User, Calendar, TrendUp, Wallet, ArrowsLeftRight, PaperPlaneTilt } from '@phosphor-icons/react'
import type { NFTItem } from './marketTypes'
import { RARITY_CONFIGS } from './marketThemeConfigs'
import { useMetaMask } from '@/modules/walletIntegration/useMetaMask'
import { WalletConnectButton } from '@/modules/walletIntegration/WalletConnectButton'
import { toast } from 'sonner'

interface NFTDetailModalProps {
  nft: NFTItem | null
  isOpen: boolean
  onClose: () => void
  onBuy?: (nft: NFTItem) => void
  onSell?: (nft: NFTItem) => void
  onTrade?: (nft: NFTItem) => void
}

export function NFTDetailModal({ nft, isOpen, onClose, onBuy, onSell, onTrade }: NFTDetailModalProps) {
  const { isConnected, address } = useMetaMask()
  
  if (!nft) return null

  const rarityConfig = RARITY_CONFIGS[nft.rarity]

  const handleTransferNFT = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }
    toast.info('Transfer via MetaMask (Placeholder)', {
      description: 'This will open MetaMask to transfer the NFT',
    })
  }

  const handleSignTransaction = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }
    toast.info('Signing transaction via MetaMask (Placeholder)', {
      description: 'MetaMask will prompt you to sign',
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden glow-border bg-card/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <span style={{ color: rarityConfig.color }}>{nft.name}</span>
            <Badge
              variant="outline"
              className="text-sm"
              style={{
                borderColor: rarityConfig.color,
                color: rarityConfig.color,
                backgroundColor: `${rarityConfig.color}15`,
              }}
            >
              {rarityConfig.label}
            </Badge>
          </DialogTitle>
          <DialogDescription>Created by {nft.creator}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <div className="space-y-4">
              <div
                className="w-full aspect-square flex items-center justify-center text-9xl rounded-lg"
                style={{
                  background: `radial-gradient(circle, ${rarityConfig.glowColor} 0%, transparent 70%)`,
                  border: `${rarityConfig.borderWidth} solid ${rarityConfig.color}`,
                }}
              >
                {nft.imageUrl}
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-center gap-1 text-primary mb-1">
                    <Eye size={18} />
                  </div>
                  <div className="text-lg font-bold">{nft.stats.views}</div>
                  <div className="text-xs text-muted-foreground">Views</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-center gap-1 text-accent mb-1">
                    <Heart size={18} />
                  </div>
                  <div className="text-lg font-bold">{nft.stats.favorites}</div>
                  <div className="text-xs text-muted-foreground">Favorites</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-center gap-1 text-secondary mb-1">
                    <ShoppingCart size={18} />
                  </div>
                  <div className="text-lg font-bold">{nft.stats.sales}</div>
                  <div className="text-xs text-muted-foreground">Sales</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/20 space-y-3">
                <h4 className="font-bold text-sm text-primary">AI RECOMMENDATIONS</h4>
                <p className="text-xs text-muted-foreground italic">
                  AI-powered market analysis and trading suggestions will appear here
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    Trending ↑
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    High Demand
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-muted-foreground mb-2">DESCRIPTION</h3>
                <p className="text-sm">{nft.description}</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-bold text-muted-foreground mb-3">METADATA</h3>
                <div className="space-y-2 text-sm">
                  {nft.metadata.collection && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Collection:</span>
                      <span className="font-mono">{nft.metadata.collection}</span>
                    </div>
                  )}
                  {nft.metadata.edition && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Edition:</span>
                      <span className="font-mono">{nft.metadata.edition}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Token ID:</span>
                    <span className="font-mono text-xs">{nft.id.slice(0, 16)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-mono text-xs">
                      {new Date(nft.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-bold text-muted-foreground mb-3">CURRENT PRICE</h3>
                <div className="text-4xl font-bold font-mono mb-4" style={{ color: rarityConfig.color }}>
                  ${nft.price}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  size="lg"
                  className="w-full"
                  style={{ backgroundColor: rarityConfig.color, color: 'white' }}
                  onClick={() => onBuy?.(nft)}
                  disabled={!onBuy || !isConnected}
                >
                  <ShoppingCart className="mr-2" size={18} />
                  Buy
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={() => onSell?.(nft)}
                  disabled={!onSell || !isConnected}
                >
                  <TrendUp className="mr-2" size={18} />
                  Sell
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={() => onTrade?.(nft)}
                  disabled={!onTrade || !isConnected}
                >
                  <ArrowsLeftRight className="mr-2" size={18} />
                  Trade
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleTransferNFT}
                  disabled={!isConnected}
                >
                  <PaperPlaneTilt size={16} />
                  Transfer via MetaMask
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleSignTransaction}
                  disabled={!isConnected}
                >
                  <Wallet size={16} />
                  Sign Transaction
                </Button>
              </div>

              {!isConnected ? (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                  <div className="flex items-center gap-2 text-sm text-primary mb-2">
                    <Wallet size={16} />
                    <span className="font-bold">Connect Your Wallet</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Connect MetaMask to buy, sell, trade, or transfer this NFT
                  </p>
                  <WalletConnectButton size="sm" className="w-full" />
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-chart-2/10 border border-chart-2/30">
                  <div className="flex items-center gap-2 text-sm text-chart-2 mb-1">
                    <Wallet size={16} />
                    <span className="font-bold">Wallet Connected</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    {address}
                  </p>
                </div>
              )}

              <Separator />

              <div>
                <h3 className="text-sm font-bold text-muted-foreground mb-3">TRANSACTION HISTORY</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {nft.transactionHistory.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3 rounded-lg bg-muted/20 text-xs font-mono flex items-start justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {tx.type.toUpperCase()}
                          </Badge>
                          {tx.price && <span className="text-primary">${tx.price}</span>}
                        </div>
                        <div className="text-muted-foreground">
                          {new Date(tx.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
