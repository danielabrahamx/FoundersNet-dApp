import { Market, MarketStatus, MarketCategory } from '@/types'
import { Badge } from '@/components/ui/badge'
import { getTimeRemaining } from '@/lib/utils'

interface MarketHeaderProps {
  market: Market
}

export function MarketHeader({ market }: MarketHeaderProps) {
  const { isPast, days, hours, minutes } = getTimeRemaining(market.resolutionDate)
  
  const getCategoryColor = (category: MarketCategory) => {
    switch (category) {
      case MarketCategory.SPORTS:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case MarketCategory.POLITICS:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case MarketCategory.CRYPTO:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case MarketCategory.ENTERTAINMENT:
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusColor = (status: MarketStatus) => {
    return status === MarketStatus.OPEN 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }

  const formatResolutionDate = () => {
    if (isPast && market.status === MarketStatus.OPEN) {
      return 'Resolution pending'
    }
    
    const date = new Date(market.resolutionDate * 1000)
    return `Resolves on ${date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })}, ${date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })}`
  }

  const formatTimeRemaining = () => {
    if (isPast) return null
    
    const parts = []
    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`)
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`)
    if (minutes > 0 && days === 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`)
    
    return parts.length > 0 ? `(${parts.join(', ')})` : ''
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Badge className={getCategoryColor(market.category)}>
          {market.category}
        </Badge>
        <Badge className={getStatusColor(market.status)}>
          {market.status}
        </Badge>
      </div>
      
      <h1 className="text-3xl font-bold leading-tight">
        {market.title}
      </h1>
      
      <div className="text-muted-foreground">
        <p>
          {formatResolutionDate()}
          {formatTimeRemaining()}
        </p>
      </div>
    </div>
  )
}