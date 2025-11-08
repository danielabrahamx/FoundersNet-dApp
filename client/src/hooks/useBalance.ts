import { useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { connection } from '@/lib/solana'
import { lamportsToSol } from '@/lib/utils'
import { REFETCH_INTERVAL } from '@/lib/constants'

export function useBalance(publicKey: PublicKey | null) {
  return useQuery({
    queryKey: ['balance', publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey) return 0

      const balance = await connection.getBalance(publicKey)
      return lamportsToSol(balance)
    },
    enabled: !!publicKey,
    staleTime: 10_000,
    refetchInterval: REFETCH_INTERVAL,
  })
}
