import { CaretRight, House } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  page?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  onNavigate: (page: string) => void
}

export function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
  if (items.length === 0) return null

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-card/50 backdrop-blur-sm border-b border-primary/20">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate('dashboard')}
        className="h-7 px-2 text-muted-foreground hover:text-primary"
      >
        <House className="h-4 w-4" />
      </Button>

      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={index} className="flex items-center gap-2">
            <CaretRight className="h-4 w-4 text-muted-foreground" />
            
            {item.page && !isLast ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate(item.page!)}
                className={cn(
                  'h-7 px-3 text-sm font-medium transition-colors',
                  'text-muted-foreground hover:text-primary'
                )}
              >
                {item.label}
              </Button>
            ) : (
              <span
                className={cn(
                  'text-sm font-medium px-3 py-1',
                  isLast ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
