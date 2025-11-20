import { ReactNode } from 'react'
import { TopBar } from '@/components/HUD/TopBar'
import { SideBar } from '@/components/HUD/SideBar'
import { QuickActions } from '@/components/HUD/QuickActions'
import { Breadcrumbs, type BreadcrumbItem } from '@/components/HUD/Breadcrumbs'
import { cn } from '@/lib/utils'

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
        
        <SideBar currentPage={currentPage} onNavigate={onNavigate} onLogout={onLogout} />

        <div className="lg:pl-64 pt-[65px] min-h-screen">
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
