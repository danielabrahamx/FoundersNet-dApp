import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS class merger utility for Shadcn UI components
 * @param inputs - Class names to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts lamports to SOL
 * @param lamports - Amount in lamports
 * @returns Amount in SOL
 */
export function lamportsToSol(lamports: number): number {
  return lamports / 1_000_000_000;
}

/**
 * Converts SOL to lamports
 * @param sol - Amount in SOL
 * @returns Amount in lamports
 */
export function solToLamports(sol: number): number {
  return Math.floor(sol * 1_000_000_000);
}

/**
 * Formats a SOL amount with the SOL symbol
 * @param amount - Amount in SOL
 * @returns Formatted string with SOL symbol
 */
export function formatSol(amount: number): string {
  return `◎${amount.toFixed(2)}`;
}

/**
 * Truncates a Solana address for display
 * @param address - Full Solana address
 * @returns Truncated address in format "5Gx7...k3Pm"
 */
export function truncateAddress(address: string): string {
  if (!address || address.length < 8) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

/**
 * Calculates implied odds from pool sizes
 * @param poolSize - Size of the specific outcome pool
 * @param totalPool - Total pool size (both outcomes combined)
 * @returns Implied probability as percentage (0-100)
 */
export function calculateImpliedOdds(poolSize: number, totalPool: number): number {
  if (totalPool === 0) return 0;
  return (poolSize / totalPool) * 100;
}

/**
 * Calculates potential payout for winning shares
 * @param shares - Number of shares held
 * @param totalWinningShares - Total shares for the winning outcome
 * @param totalPool - Total pool size to be distributed
 * @returns Potential payout in lamports
 */
export function calculatePotentialPayout(shares: number, totalWinningShares: number, totalPool: number): number {
  if (totalWinningShares === 0) return 0;
  return Math.floor((shares / totalWinningShares) * totalPool);
}

/**
 * Formats a timestamp into a human-readable date
 * @param timestamp - Unix timestamp
 * @returns Formatted date string
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formats a timestamp into a relative time string (e.g., "2 hours ago")
 * @param timestamp - Unix timestamp
 * @returns Relative time string
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  
  const seconds = diff;
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

/**
 * Validates if a string is a valid Solana address
 * @param address - Address string to validate
 * @returns True if valid, false otherwise
 */
export function isValidSolanaAddress(address: string): boolean {
  // Basic validation - Solana addresses are typically 44 characters long and base58 encoded
  return /^[1-9A-HJ-NP-Za-km-z]{44}$/.test(address);
}

/**
 * Calculates time remaining until a specific timestamp
 * @param targetTimestamp - Target Unix timestamp
 * @returns Object with days, hours, minutes remaining
 */
export function getTimeRemaining(targetTimestamp: number): {
  days: number;
  hours: number;
  minutes: number;
  isPast: boolean;
} {
  const now = Math.floor(Date.now() / 1000);
  const diff = targetTimestamp - now;
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, isPast: true };
  }
  
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  
  return { days, hours, minutes, isPast: false };
}
