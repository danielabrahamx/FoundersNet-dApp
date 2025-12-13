import { PublicKey } from '@solana/web3.js';

// Validate that VITE_ADMIN_WALLET is defined
if (!import.meta.env.VITE_ADMIN_WALLET) {
  throw new Error('VITE_ADMIN_WALLET environment variable is not defined. Please check your .env file.');
}

const ADMIN_WALLET = new PublicKey(import.meta.env.VITE_ADMIN_WALLET);

/**
 * Check if a wallet is the admin wallet
 * @param walletPublicKey - The wallet public key to check
 * @returns true if the wallet is the admin wallet, false otherwise
 */
export function isAdmin(walletPublicKey: PublicKey | null | undefined): boolean {
  if (!walletPublicKey) return false;
  return walletPublicKey.equals(ADMIN_WALLET);
}

/**
 * Get the admin wallet public key
 * @returns The admin wallet public key
 */
export function getAdminWallet(): PublicKey {
  return ADMIN_WALLET;
}
