import { useParams, Link } from 'react-router-dom'
import { useMarket, useAccountSubscription } from '@/hooks'
import { Button } from '@/components/ui/button'
import { MarketHeader, MarketDescription, MarketStats, PoolChart, MarketDetailSkeleton, TradingWidget } from '@/components/market'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function MarketDetail() {
  const { marketId } = useParams<{ marketId: string }>()
  const { data: market, isLoading, error } = useMarket(marketId)

  // Subscribe to real-time updates for this market
  useAccountSubscription(
    market?.publicKey,
    ['market', marketId!]
  );

  // Show loading state
  if (isLoading) {
    return <MarketDetailSkeleton />
  }

  // Show error state
  if (error || !market) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Markets
            </Link>
          </Button>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Market Not Found</AlertTitle>
          <AlertDescription>
            The market you're looking for doesn't exist or has been removed.
            <Button variant="link" asChild className="p-0 h-auto ml-2">
              <Link to="/">Browse all markets</Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Markets
          </Link>
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-8 space-y-6 lg:space-y-0">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <MarketHeader market={market} />
          <MarketDescription description={market.description} />
          <TradingWidget market={market} />
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          <PoolChart market={market} />
          <MarketStats market={market} />
        </div>
      </div>
    </div>
  )
}