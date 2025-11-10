import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BN } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { useProgram } from './useProgram';
import { useWallet } from './useWallet';
import { useTransactionToast } from './useTransactionToast';
import { solToLamports } from '@/lib/utils';

interface PlaceBetParams {
  marketId: string;
  amount: number;
  outcome: 'yes' | 'no';
}

/**
 * Hook to place a bet on a market
 * Enforces one bet per event - prevents double betting
 * @returns Mutation object with placeBet function and loading state
 */
export function usePlaceBet() {
  const program = useProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useTransactionToast();

  return useMutation({
    mutationFn: async ({ marketId, amount, outcome }: PlaceBetParams) => {
      if (!program || !publicKey) throw new Error('Wallet not connected');

      const marketPubkey = new PublicKey(marketId);
      const amountLamports = new BN(solToLamports(amount));

      // Derive user position PDA
      const [userPositionPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('user_position'),
          publicKey.toBuffer(),
          marketPubkey.toBuffer(),
        ],
        program.programId
      );

      // Check if already bet (one bet per event enforcement)
      try {
        const existingPosition = await (program.account as any).userPosition.fetch(userPositionPDA);
        const yesShares = (existingPosition.yesShares as any).toNumber?.() ?? 0;
        const noShares = (existingPosition.noShares as any).toNumber?.() ?? 0;
        if (yesShares > 0 || noShares > 0) {
          throw new Error('You have already placed a bet on this event');
        }
      } catch (err: any) {
        if (!err.message?.includes('Account does not exist')) {
          throw err;
        }
      }

      // Place bet
      const signature = await program.methods
        .placeBet(
          amountLamports,
          outcome === 'yes' ? { yes: {} } : { no: {} }
        )
        .accounts({
          market: marketPubkey,
          userPosition: userPositionPDA,
          user: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return signature;
    },
    onSuccess: (signature) => {
      showSuccessToast('Bet placed successfully!', signature);
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
    onError: (error: any) => {
      if (error.message?.includes('already placed a bet')) {
        showErrorToast('You have already bet on this event');
      } else {
        showErrorToast('Failed to place bet');
      }
    },
  });
}
