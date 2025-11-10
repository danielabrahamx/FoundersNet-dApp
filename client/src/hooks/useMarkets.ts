import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Market } from '@/types'
import { STALE_TIME, REFETCH_INTERVAL } from '@/lib/constants'
import { useProgram } from './useProgram'

/**
 * Hook to fetch all markets from the blockchain
 * @returns Query result with markets array, loading and error states
 */
export function useMarkets(): UseQueryResult<Market[], Error> {
  const program = useProgram()

  return useQuery({
    queryKey: ['markets', 'all'],
    queryFn: async () => {
      if (!program) {
        return []
      }

      try {
        const accounts = await (program.account as any).market.all()
        return accounts.map((acc: any) => ({
          publicKey: acc.publicKey,
          title: acc.account.title as string,
          description: acc.account.description as string,
          category: acc.account.category,
          eventType: acc.account.eventType,
          startupName: acc.account.startupName as string,
          resolutionDate: (acc.account.resolutionDate as any).toNumber(),
          creator: acc.account.creator,
          resolver: acc.account.resolver,
          yesPool: (acc.account.yesPool as any).toNumber(),
          noPool: (acc.account.noPool as any).toNumber(),
          totalVolume: (acc.account.totalVolume as any).toNumber(),
          status: acc.account.status,
          outcome: acc.account.outcome,
          createdAt: (acc.account.createdAt as any).toNumber(),
        })) as Market[]
      } catch (error) {
        console.error('Failed to fetch markets from blockchain:', error)
        return []
      }
    },
    enabled: !!program,
    staleTime: STALE_TIME,
    refetchInterval: REFETCH_INTERVAL,
  }) as UseQueryResult<Market[], Error>
}
