export function parseTransactionError(error: Error): string {
  const message = error.message.toLowerCase();

  // Map common Solana/blockchain error patterns to user-friendly messages
  if (
    message.includes("insufficient funds") ||
    message.includes("insufficient balance") ||
    message.includes("insufficient lamports")
  ) {
    return "You don't have enough SOL for this transaction";
  }

  if (
    message.includes("user rejected") ||
    message.includes("user denied") ||
    message.includes("cancelled")
  ) {
    return "You cancelled the transaction";
  }

  if (
    message.includes("network") ||
    message.includes("failed to connect") ||
    message.includes("enotfound")
  ) {
    return "Connection to Solana network failed. Please try again";
  }

  if (
    message.includes("timeout") ||
    message.includes("timed out") ||
    message.includes("transaction expired")
  ) {
    return "Transaction timed out after 30 seconds";
  }

  if (
    message.includes("market closed") ||
    message.includes("market resolved") ||
    message.includes("trading closed")
  ) {
    return "This market is no longer accepting bets";
  }

  if (message.includes("rate limit")) {
    return "Rate limit reached. Please try again in a few moments";
  }

  if (message.includes("invalid instruction")) {
    return "Invalid transaction. Please check your inputs and try again";
  }

  if (message.includes("account not found")) {
    return "Account not found on blockchain. Please try again";
  }

  // Generic fallback
  return "Transaction failed. Please try again";
}
