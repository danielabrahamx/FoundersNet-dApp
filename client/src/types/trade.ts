import { PublicKey } from '@solana/web3.js';

/**
 * Trade outcome enum
 */
export enum TradeOutcome {
  YES = 'Yes',
  NO = 'No'
}

/**
 * Trade interface for transaction history
 */
export interface Trade {
  /** The public key of the trade account */
  publicKey: PublicKey;
  /** The public key of the associated market */
  market: PublicKey;
  /** The user's public key who made the trade */
  user: PublicKey;
  /** The trade outcome (YES or NO) */
  outcome: TradeOutcome;
  /** Amount traded in lamports */
  amount: number;
  /** Price per share at time of trade (in lamports) */
  price: number;
  /** Number of shares received */
  shares: number;
  /** Transaction signature */
  signature: string;
  /** Trade timestamp */
  timestamp: number;
}
