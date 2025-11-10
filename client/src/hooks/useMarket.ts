import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { Market } from '@/types'
import { STALE_TIME, REFETCH_INTERVAL } from '@/lib/constants'
import { useProgram } from './useProgram'

/**
 * Hook to fetch a single market by ID from the blockchain
 * @param marketId - The market account public key (string)
 * @returns Query result with market data, loading and error states
 */
export function useMarket(marketId: string | undefined): UseQueryResult<Market | null, Error> {
  const program = useProgram()

  return useQuery({
    queryKey: ['market', marketId],
    queryFn: async () => {
      if (!marketId || !program) {
        return null
      }

      try {
        const publicKey = new PublicKey(marketId)
        const account = await (program.account as any).market.fetch(publicKey)
        return {
          publicKey,
          title: account.title as string,
          description: account.description as string,
          category: account.category,
          eventType: account.eventType,
          startupName: account.startupName as string,
          resolutionDate: (account.resolutionDate as any).toNumber(),
          creator: account.creator,
          resolver: account.resolver,
          yesPool: (account.yesPool as any).toNumber(),
          noPool: (account.noPool as any).toNumber(),
          totalVolume: (account.totalVolume as any).toNumber(),
          status: account.status,
          outcome: account.outcome,
          createdAt: (account.createdAt as any).toNumber(),
        } as Market
      } catch (error) {
        console.error('Failed to fetch market from blockchain:', error)
        return null
      }
    },
    enabled: !!marketId && !!program,
    staleTime: STALE_TIME,
    refetchInterval: REFETCH_INTERVAL,
  }) as UseQueryResult<Market | null, Error>
}
