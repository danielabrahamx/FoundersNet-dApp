import { useUserPositions } from './useUserPositions';

/**
 * Hook to check if user has already placed a bet on a specific market
 * Enforces one bet per event rule
 * @param marketId - The market public key as string
 * @returns Boolean indicating if user has an active position on this market
 */
export function useHasPosition(marketId: string): boolean {
  const { data: positions = [] } = useUserPositions();

  return positions.some(pos =>
    pos.market.toString() === marketId &&
    (pos.yesShares > 0 || pos.noShares > 0)
  );
}
