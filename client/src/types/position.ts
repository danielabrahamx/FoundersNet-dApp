import { PublicKey } from '@solana/web3.js';

/**
 * User position interface representing a user's holdings in a market
 */
export interface UserPosition {
  /** The public key of the position account */
  publicKey: PublicKey;
  /** The public key of the associated market */
  market: PublicKey;
  /** The user's public key */
  user: PublicKey;
  /** Number of YES shares held (in lamports) */
  yesShares: number;
  /** Number of NO shares held (in lamports) */
  noShares: number;
  /** Total cost of the position (in lamports) */
  totalCost: number;
  /** Timestamp of the last trade */
  lastTradeAt: number;
}
