import { Market, MarketStatus, MarketCategory, MarketOutcome } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getTimeRemaining } from '@/lib/utils'
import { ResolveEventDialog } from '@/components/admin/ResolveEventDialog'
import { useWallet } from '@/hooks/useWallet'
import { isAdmin } from '@/lib/admin'
import { CheckCircle, Settings } from 'lucide-react'

interface MarketHeaderProps {
  market: Market
}

export function MarketHeader({ market }: MarketHeaderProps) {
  const { publicKey } = useWallet()
  const { isPast, days, hours, minutes } = getTimeRemaining(market.resolutionDate)
  
  const isAdminUser = isAdmin(publicKey)
  const canResolve = isAdminUser && market.status === MarketStatus.OPEN
  
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

  const getOutcomeColor = (outcome: MarketOutcome) => {
    switch (outcome) {
      case MarketOutcome.YES:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case MarketOutcome.NO:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case MarketOutcome.INVALID:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
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
        
        {/* Show outcome badge if resolved */}
        {market.status === MarketStatus.RESOLVED && market.outcome && (
          <Badge className={getOutcomeColor(market.outcome)}>
            <CheckCircle className="w-3 h-3 mr-1" />
            {market.outcome}
          </Badge>
        )}
        
        {/* Admin resolve button */}
        {canResolve && (
          <ResolveEventDialog market={market}>
            <Button variant="outline" size="sm">
              <Settings className="w-3 h-3 mr-1" />
              {isPast ? 'Resolve Event' : 'Resolve Early'}
            </Button>
          </ResolveEventDialog>
        )}
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