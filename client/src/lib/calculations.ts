/**
 * Calculation utilities for trading widget
 */

/**
 * Calculates new pool ratio after a bet
 * @param currentYesPool - Current YES pool size in SOL
 * @param currentNoPool - Current NO pool size in SOL
 * @param betAmount - Amount being bet in SOL
 * @param betOutcome - The outcome being bet on ('yes' or 'no')
 * @returns Object with new YES and NO percentages
 */
export function calculateNewPoolRatio(
  currentYesPool: number,
  currentNoPool: number,
  betAmount: number,
  betOutcome: 'yes' | 'no'
): { yesPercent: number; noPercent: number } {
  const newYesPool = betOutcome === 'yes' ? currentYesPool + betAmount : currentYesPool;
  const newNoPool = betOutcome === 'no' ? currentNoPool + betAmount : currentNoPool;
  const totalPool = newYesPool + newNoPool;

  if (totalPool === 0) {
    return { yesPercent: 50, noPercent: 50 };
  }

  return {
    yesPercent: (newYesPool / totalPool) * 100,
    noPercent: (newNoPool / totalPool) * 100,
  };
}

/**
 * Calculates potential payout from a bet
 * @param betAmount - Amount being bet in SOL
 * @param betOutcome - The outcome being bet on ('yes' or 'no')
 * @param currentYesPool - Current YES pool size in SOL
 * @param currentNoPool - Current NO pool size in SOL
 * @returns Object with payout, profit, and profit percentage
 */
export function calculatePotentialPayout(
  betAmount: number,
  betOutcome: 'yes' | 'no',
  currentYesPool: number,
  currentNoPool: number
): { payout: number; profit: number; profitPercent: number } {
  const currentTotalPool = currentYesPool + currentNoPool;
  
  // Your shares = amount (1 SOL = 1 share)
  const yourShares = betAmount;
  
  // Total pool including your bet
  const totalPoolAfterBet = currentTotalPool + betAmount;
  
  if (betOutcome === 'yes') {
    // If you win: total winning pool = YES pool + your bet
    const totalWinningPool = currentYesPool + betAmount;
    
    if (totalWinningPool === 0) {
      return { payout: 0, profit: 0, profitPercent: 0 };
    }
    
    // Your payout = (your shares / total winning pool) × total pool
    const payout = (yourShares / totalWinningPool) * totalPoolAfterBet;
    const profit = payout - betAmount;
    const profitPercent = profit > 0 ? (profit / betAmount) * 100 : 0;
    
    return {
      payout: Math.max(0, payout),
      profit: Math.max(0, profit),
      profitPercent: Math.max(0, profitPercent),
    };
  } else {
    // If you win on NO: total winning pool = NO pool + your bet
    const totalWinningPool = currentNoPool + betAmount;
    
    if (totalWinningPool === 0) {
      return { payout: 0, profit: 0, profitPercent: 0 };
    }
    
    // Your payout = (your shares / total winning pool) × total pool
    const payout = (yourShares / totalWinningPool) * totalPoolAfterBet;
    const profit = payout - betAmount;
    const profitPercent = profit > 0 ? (profit / betAmount) * 100 : 0;
    
    return {
      payout: Math.max(0, payout),
      profit: Math.max(0, profit),
      profitPercent: Math.max(0, profitPercent),
    };
  }
}
