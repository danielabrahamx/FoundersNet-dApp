import { PublicKey } from '@solana/web3.js';

/**
 * Market status enum
 */
export enum MarketStatus {
  OPEN = 'Open',
  RESOLVED = 'Resolved'
}

/**
 * Market outcome enum for resolution
 */
export enum MarketOutcome {
  YES = 'Yes',
  NO = 'No',
  INVALID = 'Invalid'
}

/**
 * Market category enum
 */
export enum MarketCategory {
  SPORTS = 'Sports',
  POLITICS = 'Politics',
  CRYPTO = 'Crypto',
  ENTERTAINMENT = 'Entertainment',
  OTHER = 'Other'
}

/**
 * Market interface representing a prediction market on-chain
 */
export interface Market {
  /** The public key of the market account */
  publicKey: PublicKey;
  /** Market title (10-200 characters) */
  title: string;
  /** Market description (50-1000 characters) */
  description: string;
  /** Market category */
  category: MarketCategory;
  /** Resolution date as Unix timestamp */
  resolutionDate: number;
  /** Market creator's public key */
  creator: PublicKey;
  /** Market resolver's public key (defaults to creator) */
  resolver: PublicKey;
  /** YES pool size in lamports */
  yesPool: number;
  /** NO pool size in lamports */
  noPool: number;
  /** Total trading volume in lamports */
  totalVolume: number;
  /** Current market status */
  status: MarketStatus;
  /** Market outcome (only set when resolved) */
  outcome?: MarketOutcome;
  /** Creation timestamp */
  createdAt: number;
}
