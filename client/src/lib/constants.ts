/**
 * Trading constants
 */
export const MIN_TRADE_AMOUNT = 0.01; // SOL
export const MIN_LIQUIDITY_AMOUNT = 0.5; // SOL
export const TRANSACTION_FEE_BUFFER = 0.01; // SOL

/**
 * Market validation constants
 */
export const MIN_TITLE_LENGTH = 10;
export const MAX_TITLE_LENGTH = 200;
export const MIN_DESCRIPTION_LENGTH = 50;
export const MAX_DESCRIPTION_LENGTH = 1000;

/**
 * Solana network constants
 */
export const SOLSCAN_BASE_URL = 'https://solscan.io';
export const DEVNET_RPC = 'https://api.devnet.solana.com';
export const SOLANA_NETWORK = 'devnet';
export const PROGRAM_ID = 'placeholder_program_id';

/**
 * Time constants for data fetching
 */
export const STALE_TIME = 10000; // 10 seconds
export const REFETCH_INTERVAL = 30000; // 30 seconds

/**
 * UI constants
 */
export const AIRDROP_AMOUNT = 1; // SOL
export const TRANSACTION_FEE = 0.00025; // SOL (network fee)
