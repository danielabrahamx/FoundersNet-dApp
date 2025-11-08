import { useParams } from 'react-router-dom'

export function MarketDetail() {
  const { marketId } = useParams<{ marketId: string }>()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Market Detail</h1>
      <p className="text-muted-foreground">
        Market details for {marketId} will appear here
      </p>
      <div className="min-h-[400px]" />
    </div>
  )
}