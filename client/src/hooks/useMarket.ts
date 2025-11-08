import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { Market, MarketStatus, MarketCategory } from '@/types'
import { solToLamports } from '@/lib/utils'
import { STALE_TIME, REFETCH_INTERVAL } from '@/lib/constants'

/**
 * Mock market data for single market queries
 * TODO: Replace with actual program.account.market.fetch(marketId)
 */
const MOCK_MARKETS: Record<string, Market> = {
  '3PNzkkjuUfHUzwQz5eEuiKfmQg7z5VQqnZkjTk8BgMyZ': {
    publicKey: new PublicKey('3PNzkkjuUfHUzwQz5eEuiKfmQg7z5VQqnZkjTk8BgMyZ'),
    title: 'Will Bitcoin reach $100k by Dec 31, 2025?',
    description:
      'This market resolves YES if the price of Bitcoin reaches $100,000 USD at any point on or before December 31, 2025, 11:59 PM UTC. Resolution source: CoinGecko or CoinMarketCap official Bitcoin USD price.',
    category: MarketCategory.CRYPTO,
    resolutionDate: Math.floor(Date.now() / 1000) + 86400 * 30,
    creator: new PublicKey('FfVMkN5x7cAkG2B8CQQSW7VtAKfJ8kUJzFMyJf5kxKx1'),
    resolver: new PublicKey('FfVMkN5x7cAkG2B8CQQSW7VtAKfJ8kUJzFMyJf5kxKx1'),
    yesPool: solToLamports(60),
    noPool: solToLamports(40),
    totalVolume: solToLamports(100),
    status: MarketStatus.OPEN,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 5,
  },
}

/**
 * Hook to fetch a single market by ID
 * TODO: Replace with actual program.account.market.fetch(marketId)
 * @param marketId - The market account public key (string)
 * @returns Query result with market data, loading and error states
 */
export function useMarket(marketId: string | undefined): UseQueryResult<Market | null, Error> {
  return useQuery({
    queryKey: ['market', marketId],
    queryFn: async () => {
      if (!marketId) {
        return null
      }

      // TODO: Replace with actual program.account.market.fetch(new PublicKey(marketId))
      // For now, return mock data if available
      return MOCK_MARKETS[marketId] || null
    },
    enabled: !!marketId,
    staleTime: STALE_TIME,
    refetchInterval: REFETCH_INTERVAL,
  })
}
