import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Position } from '@/types'
import { STALE_TIME, REFETCH_INTERVAL } from '@/lib/constants'
import { useWallet } from './useWallet'

/**
 * Mock position data for development
 * TODO: Fetch from PDAs derived from wallet + market accounts
 */
const MOCK_POSITIONS: Position[] = []

/**
 * Hook to fetch user's positions across all markets
 * Requires connected wallet
 * TODO: Replace with actual PDA queries from program
 * @returns Query result with positions array, loading and error states
 */
export function useUserPositions(): UseQueryResult<Position[], Error> {
  const { publicKey, connected } = useWallet()

  return useQuery({
    queryKey: ['positions', publicKey?.toString() || ''],
    queryFn: async () => {
      if (!publicKey || !connected) {
        return []
      }

      // TODO: Fetch from PDAs derived from wallet + market accounts
      // For now, return empty array or mock data
      return MOCK_POSITIONS
    },
    enabled: !!publicKey && connected,
    staleTime: STALE_TIME,
    refetchInterval: REFETCH_INTERVAL,
  })
}
