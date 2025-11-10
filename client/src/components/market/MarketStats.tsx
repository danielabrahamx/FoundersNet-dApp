import { Market } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LiveIndicator } from '@/components/LiveIndicator'
import { formatDistanceToNow } from 'date-fns'
import { lamportsToSol, calculateImpliedOdds } from '@/lib/utils'

interface MarketStatsProps {
  market: Market
}

export function MarketStats({ market }: MarketStatsProps) {
  const totalPool = market.yesPool + market.noPool
  const totalPoolSol = lamportsToSol(totalPool)
  const yesPoolSol = lamportsToSol(market.yesPool)
  const noPoolSol = lamportsToSol(market.noPool)
  const yesPercentage = calculateImpliedOdds(market.yesPool, totalPool)
  const noPercentage = calculateImpliedOdds(market.noPool, totalPool)
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Market Statistics</CardTitle>
          <LiveIndicator />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center pb-4 border-b">
          <div className="text-3xl font-bold text-primary">
            ◎{totalPoolSol.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">Total Pool</div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">YES Pool</span>
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
              ◎{yesPoolSol.toFixed(2)} ({yesPercentage.toFixed(0)}%)
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">NO Pool</span>
            <span className="text-sm font-semibold text-red-600 dark:text-red-400">
              ◎{noPoolSol.toFixed(2)} ({noPercentage.toFixed(0)}%)
            </span>
          </div>
        </div>
        
        <div className="space-y-3 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Volume</span>
            <span className="text-sm font-semibold">
              ◎{lamportsToSol(market.totalVolume).toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Participants</span>
            <span className="text-sm font-semibold">
              {Math.floor(Math.random() * 20) + 5} traders
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Created</span>
            <span className="text-sm font-semibold">
              {formatDistanceToNow(new Date(market.createdAt * 1000), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}