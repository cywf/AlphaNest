import { ReactNode } from 'react'
import { TopBar } from '@/components/HUD/TopBar'
import { SideBar } from '@/components/HUD/SideBar'
import { QuickActions } from '@/components/HUD/QuickActions'
import { Breadcrumbs, type BreadcrumbItem } from '@/components/HUD/Breadcrumbs'
import { cn } from '@/lib/utils'
import { IS_DEMO_MODE } from '@/config/api'

interface HudLayoutProps {
  children: ReactNode
  currentPage: string
  onNavigate: (page: string) => void
  onLogout: () => void
  breadcrumbs?: BreadcrumbItem[]
  showQuickActions?: boolean
  className?: string
  onOpenAIChat?: () => void
}

export function HudLayout({
  children,
  currentPage,
  onNavigate,
  onLogout,
  breadcrumbs = [],
  showQuickActions = true,
  className,
  onOpenAIChat,
}: HudLayoutProps) {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="relative z-10">
        <TopBar currentPage={currentPage} onNavigate={onNavigate} onLogout={onLogout} onOpenAIChat={onOpenAIChat} />
        
        {IS_DEMO_MODE && (
          <div className="lg:pl-64 pt-[65px] bg-yellow-500/10 border-b border-yellow-500/30 px-4 py-2 text-center text-sm text-yellow-400">
            <span className="font-semibold">DEMO MODE</span> - Using simulated data. No backend connection required.
          </div>
        )}
        
        <SideBar currentPage={currentPage} onNavigate={onNavigate} onLogout={onLogout} />

        <div className={cn("lg:pl-64", IS_DEMO_MODE ? "pt-[105px]" : "pt-[65px]", "min-h-screen")}>
          {breadcrumbs.length > 0 && (
            <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />
          )}

          <main
            className={cn(
              'min-h-[calc(100vh-65px)] transition-all duration-300',
              'animate-in fade-in slide-in-from-bottom-4',
              className
            )}
          >
            {children}
          </main>
        </div>

        {showQuickActions && (
          <QuickActions currentPage={currentPage} onNavigate={onNavigate} />
        )}
      </div>
    </div>
  )
}
