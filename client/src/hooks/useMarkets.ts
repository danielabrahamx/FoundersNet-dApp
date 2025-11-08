import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { Market, MarketStatus, MarketCategory } from '@/types'
import { solToLamports } from '@/lib/utils'
import { STALE_TIME, REFETCH_INTERVAL } from '@/lib/constants'

/**
 * Mock market data for development
 * TODO: Replace with actual program.account.market.all()
 */
const MOCK_MARKETS: Market[] = [
  {
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
  {
    publicKey: new PublicKey('8GEPVZpJMU2xdC3XvHNvBb7XwVc7R3MqR7tXvJ6CpJvH'),
    title: 'Will the Democrats win the 2024 US Presidential Election?',
    description:
      'This market resolves YES if the Democratic candidate wins the 2024 US Presidential Election. Resolution source: Official election results from the US Election Assistance Commission.',
    category: MarketCategory.POLITICS,
    resolutionDate: Math.floor(Date.now() / 1000) + 86400 * 60,
    creator: new PublicKey('5Gx7k3PmL2nR1q6pJ8vC4xB9yD2eF5gH8iK1lM4nO7q'),
    resolver: new PublicKey('5Gx7k3PmL2nR1q6pJ8vC4xB9yD2eF5gH8iK1lM4nO7q'),
    yesPool: solToLamports(45),
    noPool: solToLamports(55),
    totalVolume: solToLamports(100),
    status: MarketStatus.OPEN,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 10,
  },
  {
    publicKey: new PublicKey('H7mK2pL9nO6vQ1rS2tU3vW4xY5zA6bC7dE8fG9hI0jJ'),
    title: "Will the Kansas City Chiefs win Super Bowl LVIII?",
    description:
      'This market resolves YES if the Kansas City Chiefs win Super Bowl LVIII (2024 season). Resolution source: Official NFL records and Super Bowl results.',
    category: MarketCategory.SPORTS,
    resolutionDate: Math.floor(Date.now() / 1000) + 86400 * 45,
    creator: new PublicKey('2FpA5bK3cD2eF1gH4iJ5kL6mN7oP8qR9sT0uV1wX2y'),
    resolver: new PublicKey('2FpA5bK3cD2eF1gH4iJ5kL6mN7oP8qR9sT0uV1wX2y'),
    yesPool: solToLamports(70),
    noPool: solToLamports(30),
    totalVolume: solToLamports(100),
    status: MarketStatus.OPEN,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 3,
  },
  {
    publicKey: new PublicKey('R4sT5uV6wX7yZ8aB9cD0eF1gH2iJ3kL4mN5oP6qR7s'),
    title: 'Will Taylor Swift win a Grammy Award in 2024?',
    description:
      'This market resolves YES if Taylor Swift wins at least one Grammy Award during the 2024 Grammy Awards ceremony. Resolution source: Official Grammy Awards results.',
    category: MarketCategory.ENTERTAINMENT,
    resolutionDate: Math.floor(Date.now() / 1000) + 86400 * 20,
    creator: new PublicKey('T2uV3wX4yZ5aB6cD7eF8gH9iJ0kL1mN2oP3qR4sT5u'),
    resolver: new PublicKey('T2uV3wX4yZ5aB6cD7eF8gH9iJ0kL1mN2oP3qR4sT5u'),
    yesPool: solToLamports(55),
    noPool: solToLamports(45),
    totalVolume: solToLamports(100),
    status: MarketStatus.OPEN,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 7,
  },
]

/**
 * Hook to fetch all markets
 * TODO: Replace with actual program.account.market.all() once deployed
 * @returns Query result with markets array, loading and error states
 */
export function useMarkets(): UseQueryResult<Market[], Error> {
  return useQuery({
    queryKey: ['markets', 'all'],
    queryFn: async () => {
      // TODO: Replace with actual program.account.market.all()
      // For now, return mock data
      return MOCK_MARKETS
    },
    enabled: true,
    staleTime: STALE_TIME,
    refetchInterval: REFETCH_INTERVAL,
  })
}
