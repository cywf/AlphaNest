export function formatNumber(value: number, decimals: number = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatCompactNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInMs = date.getTime() - now.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Tomorrow'
  if (diffInDays < 7) return `${diffInDays} days`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks`
  return date.toLocaleDateString()
}

export function formatCurrency(value: number): string {
  if (value < 1) {
    return value.toFixed(4)
  } else if (value < 100) {
    return value.toFixed(2)
  } else {
    return value.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })
  }
}

export function formatPercentage(value: number): string {
  return value.toFixed(2)
}

export function truncateAddress(address: string, start: number = 6, end: number = 4): string {
  if (address.length <= start + end) return address
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
