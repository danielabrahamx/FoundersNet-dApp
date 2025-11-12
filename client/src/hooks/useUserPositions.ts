import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Position } from '@/types'
import { STALE_TIME, REFETCH_INTERVAL } from '@/lib/constants'
import { useWallet } from './useWallet'
import { useProgram } from './useProgram'

/**
 * Hook to fetch user's positions across all markets from the blockchain
 * Requires connected wallet
 * @returns Query result with positions array, loading and error states
 */
export function useUserPositions(): UseQueryResult<Position[], Error> {
  const { publicKey, connected } = useWallet()
  const program = useProgram()

  return useQuery({
    queryKey: ['positions', publicKey?.toString() || ''],
    queryFn: async () => {
      if (!publicKey || !connected || !program) {
        return []
      }

      try {
        const positions = await (program.account as any).userPosition.all([
          {
            memcmp: {
              offset: 8,
              bytes: publicKey.toBase58(),
            },
          },
        ])
        return positions.map((acc: any) => ({
          publicKey: acc.publicKey,
          user: acc.account.user,
          market: acc.account.market,
          yesShares: (acc.account.yesShares as any).toNumber(),
          noShares: (acc.account.noShares as any).toNumber(),
          totalCost: (acc.account.totalCost as any).toNumber(),
          lastTradeAt: (acc.account.lastTradeAt as any).toNumber(),
          claimed: acc.account.claimed || false,
        }))
      } catch (error) {
        console.error('Failed to fetch user positions from blockchain:', error)
        return []
      }
    },
    enabled: !!publicKey && connected && !!program,
    staleTime: STALE_TIME,
    refetchInterval: REFETCH_INTERVAL,
  }) as UseQueryResult<Position[], Error>
}
