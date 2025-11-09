import { useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet } from "@/hooks/useWallet";
import { useTransactionToast } from "@/hooks/useTransactionToast";
import { useQueryClient } from "@tanstack/react-query";
import { connection } from "@/lib/solana";
import { parseTransactionError } from "@/lib/errors";
import { AIRDROP_AMOUNT } from "@/lib/constants";
import { retryWithBackoff } from "@/lib/retry";

export function useAirdrop() {
  const [isAirdropping, setIsAirdropping] = useState(false);
  const { publicKey } = useWallet();
  const { showPendingToast, showSuccessToast, showErrorToast } =
    useTransactionToast();
  const queryClient = useQueryClient();

  const airdrop = async () => {
    if (!publicKey) {
      showErrorToast("Wallet not connected");
      return;
    }

    setIsAirdropping(true);

    try {
      // Show pending toast
      showPendingToast("airdrop_" + Date.now());

      // Request airdrop with retry logic
      const signature = await retryWithBackoff(async () => {
        return await connection.requestAirdrop(
          publicKey,
          AIRDROP_AMOUNT * LAMPORTS_PER_SOL
        );
      });

      // Wait for confirmation with retry
      await retryWithBackoff(async () => {
        const confirmation = await connection.confirmTransaction(
          signature,
          "confirmed"
        );
        if (confirmation.value.err) {
          throw new Error("Airdrop transaction failed");
        }
      });

      // Show success toast
      showSuccessToast(`${AIRDROP_AMOUNT} SOL airdropped successfully!`);

      // Invalidate balance query to refetch
      await queryClient.invalidateQueries({ queryKey: ["balance"] });
    } catch (error) {
      const message =
        error instanceof Error
          ? parseTransactionError(error)
          : "Airdrop failed";

      // Check for rate limit specifically
      if (
        error instanceof Error &&
        (error.message.includes("429") ||
          error.message.includes("rate limit"))
      ) {
        showErrorToast("Airdrop rate limited. Try again in a few minutes");
      } else {
        showErrorToast(message);
      }
    } finally {
      setIsAirdropping(false);
    }
  };

  return { airdrop, isAirdropping };
}
