import { useState } from 'react'
import { Bell, House, ArrowLeft, SquaresFour, User as UserIcon, Robot } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { authEngine } from '@/modules/users/authEngine'
import { MetaMaskStatus } from '@/modules/walletIntegration/MetaMaskStatus'
import { useMetaMask } from '@/modules/walletIntegration/useMetaMask'

interface TopBarProps {
  onNavigate: (page: string) => void
  onLogout: () => void
  currentPage?: string
  onOpenAIChat?: () => void
}

export function TopBar({ onNavigate, onLogout, currentPage, onOpenAIChat }: TopBarProps) {
  const [notificationCount] = useState(3)
  const currentUser = authEngine.getCurrentUser()
  const { isConnected, address } = useMetaMask()

  const canGoBack = currentPage && currentPage !== 'dashboard'

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-primary/30">
      <div className="h-16 px-4 flex items-center justify-between max-w-[2000px] mx-auto">
        <div className="flex items-center gap-4">
          <h1 className="text-xl md:text-2xl font-black tracking-wider text-primary drop-shadow-[0_0_20px_rgba(99,220,255,0.5)]">
            ALPHA-N3ST
          </h1>
          
          <div className="hidden md:flex items-center gap-2">
            {canGoBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="text-primary hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('dashboard')}
              className="text-primary hover:bg-primary/10"
            >
              <House className="h-4 w-4 mr-1" />
              Home
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('dashboard')}
              className="text-primary hover:bg-primary/10"
            >
              <SquaresFour className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MetaMaskStatus isConnected={isConnected} address={address} className="hidden md:flex" />
          
          {onOpenAIChat && (
            <Button
              variant="ghost"
              size="icon"
              className="text-primary hover:bg-primary/10"
              onClick={onOpenAIChat}
              title="AI Assistant"
            >
              <Robot className="h-5 w-5" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="relative text-primary hover:bg-primary/10"
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground text-xs">
                {notificationCount}
              </Badge>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/10">
                <Avatar className="h-8 w-8 border-2 border-primary/50">
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {currentUser?.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm font-medium">{currentUser?.username}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-md border-primary/30">
              <DropdownMenuLabel className="text-primary">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-primary/20" />
              <DropdownMenuItem onClick={() => onNavigate('profile')} className="cursor-pointer">
                <UserIcon className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate('market')} className="cursor-pointer">
                <span className="mr-2">🛒</span>
                Market
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate('clans')} className="cursor-pointer">
                <span className="mr-2">⚔️</span>
                Clans
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-primary/20" />
              <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-destructive">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-70">
        <div className="h-full bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
      </div>
    </div>
  )
}
