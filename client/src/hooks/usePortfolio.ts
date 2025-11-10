import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Position, Market } from '@/types';
import { useUserPositions } from './useUserPositions';
import { useMarkets } from './useMarkets';
import { lamportsToSol } from '@/lib/utils';

/**
 * Extended position interface with market data and calculated metrics
 */
export interface PositionWithMarket {
  // Original position fields
  publicKey: Position['publicKey'];
  user: Position['user'];
  market: Market; // This overrides the original market field
  yesShares: Position['yesShares'];
  noShares: Position['noShares'];
  totalCost: Position['totalCost'];
  lastTradeAt: Position['lastTradeAt'];
  
  // Additional calculated fields
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  costBasis: number;
  shares: number;
  betSide: 'YES' | 'NO' | 'NONE';
  isWinner: boolean;
}

/**
 * Hook to fetch user positions with market data and portfolio metrics
 * @returns Query result with enriched positions and portfolio summary
 */
export function usePortfolio(): UseQueryResult<{
  positions: PositionWithMarket[];
  totalValue: number;
  totalPnL: number;
  winRate: number;
  openPositions: PositionWithMarket[];
  resolvedPositions: PositionWithMarket[];
}, Error> {
  const { data: positions = [] } = useUserPositions();
  const { data: markets = [] } = useMarkets();

  return useQuery({
    queryKey: ['portfolio', positions.map(p => p.publicKey.toString()).join(','), markets.map(m => m.publicKey.toString()).join(',')],
    queryFn: async () => {
      // Enrich positions with market data
      const enrichedPositions: PositionWithMarket[] = positions
        .map(position => {
          // Find the market for this position
          const market = markets.find(m => m.publicKey.equals(position.market));
          if (!market) {
            return null;
          }

          // Calculate position metrics
          const hasYesPosition = position.yesShares > 0;
          const hasNoPosition = position.noShares > 0;
          const betSide = hasYesPosition ? 'YES' as const : hasNoPosition ? 'NO' as const : 'NONE' as const;
          const shares = hasYesPosition ? position.yesShares : position.noShares;
          const costBasis = lamportsToSol(position.totalCost);

          // Calculate current value based on pool ratios
          const totalPool = lamportsToSol(market.yesPool + market.noPool);
          const winningPool = lamportsToSol(hasYesPosition ? market.yesPool : market.noPool);
          const yourShares = lamportsToSol(shares);
          
          // Current value calculation: (your shares / total winning shares) × total pool
          const currentValue = totalPool > 0 && winningPool > 0 && yourShares > 0
            ? (yourShares / winningPool) * totalPool
            : 0;

          const pnl = currentValue - costBasis;
          const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

          // Check if position is a winner (for resolved markets)
          const isWinner = market.status === 'Resolved' && 
            ((market.outcome === 'Yes' && hasYesPosition) || 
             (market.outcome === 'No' && hasNoPosition));

          return {
            publicKey: position.publicKey,
            user: position.user,
            market,
            yesShares: position.yesShares,
            noShares: position.noShares,
            totalCost: position.totalCost,
            lastTradeAt: position.lastTradeAt,
            currentValue,
            pnl,
            pnlPercent,
            costBasis,
            shares,
            betSide,
            isWinner,
          };
        })
        .filter((pos): pos is PositionWithMarket => pos !== null);

      // Calculate portfolio metrics
      const totalValue = enrichedPositions.reduce((sum, pos) => sum + pos.currentValue, 0);
      const totalCost = enrichedPositions.reduce((sum, pos) => sum + pos.costBasis, 0);
      const totalPnL = totalValue - totalCost;

      // Calculate win rate (only for resolved positions)
      const resolvedPositions = enrichedPositions.filter(pos => pos.market.status === 'Resolved');
      const winningPositions = resolvedPositions.filter(pos => pos.isWinner);
      const winRate = resolvedPositions.length > 0 ? (winningPositions.length / resolvedPositions.length) * 100 : 0;

      // Separate open and resolved positions
      const openPositions = enrichedPositions.filter(pos => pos.market.status === 'Open');
      const resolvedPositionsList = enrichedPositions.filter(pos => pos.market.status === 'Resolved');

      return {
        positions: enrichedPositions,
        totalValue,
        totalPnL,
        winRate,
        openPositions,
        resolvedPositions: resolvedPositionsList,
      };
    },
    enabled: positions.length > 0 && markets.length > 0,
    staleTime: 10000, // 10 seconds
    refetchInterval: 30000, // 30 seconds
  }) as UseQueryResult<{
    positions: PositionWithMarket[];
    totalValue: number;
    totalPnL: number;
    winRate: number;
    openPositions: PositionWithMarket[];
    resolvedPositions: PositionWithMarket[];
  }, Error>;
}