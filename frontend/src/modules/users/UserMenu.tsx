import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { authEngine } from './authEngine'
import type { User } from './userTypes'
import { UserCircle, SignOut, Users, Storefront, ChartLineUp } from '@phosphor-icons/react'

interface UserMenuProps {
  onNavigateToProfile: () => void
  onNavigateToClans: () => void
  onNavigateToShop: () => void
  onLogout: () => void
}

export function UserMenu({ onNavigateToProfile, onNavigateToClans, onNavigateToShop, onLogout }: UserMenuProps) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = authEngine.getCurrentUser()
    setUser(currentUser)

    const interval = setInterval(() => {
      const updated = authEngine.getCurrentUser()
      setUser(updated)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (!user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 glow-border px-3">
          <span className="text-xl">{user.avatar}</span>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-bold leading-none">{user.username}</span>
            {user.clanTag && (
              <span className="text-xs text-muted-foreground leading-none mt-0.5">
                [{user.clanTag}]
              </span>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 glow-border bg-card/95 backdrop-blur-sm">
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{user.avatar}</span>
            <div className="flex-1">
              <div className="font-bold">{user.username}</div>
              <div className="text-xs text-muted-foreground font-normal">
                {user.email}
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onNavigateToProfile} className="cursor-pointer">
          <UserCircle size={16} className="mr-2" />
          Profile
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onNavigateToShop} className="cursor-pointer">
          <Storefront size={16} className="mr-2" />
          My Shop
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onNavigateToClans} className="cursor-pointer">
          <Users size={16} className="mr-2" />
          Clans
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <div className="px-2 py-1.5 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-muted-foreground">Score</span>
            <span className="font-bold text-primary font-mono">
              {user.score.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Volume</span>
            <span className="font-bold text-secondary font-mono">
              ${(user.arbitrageVolume / 1000).toFixed(1)}K
            </span>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-destructive">
          <SignOut size={16} className="mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
