import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PublicKey } from '@solana/web3.js';
import { useProgram } from './useProgram';
import { useWallet } from './useWallet';
import { useTransactionToast } from './useTransactionToast';

export function useClaimWinnings() {
  const program = useProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useTransactionToast();
  
  return useMutation({
    mutationFn: async ({ marketId }: { marketId: string }) => {
      if (!program || !publicKey) throw new Error('Wallet not connected');
      
      const marketPubkey = new PublicKey(marketId);
      const [userPositionPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('user_position'),
          publicKey.toBuffer(),
          marketPubkey.toBuffer(),
        ],
        program.programId
      );
      
      const signature = await program.methods
        .claimWinnings()
        .accounts({
          market: marketPubkey,
          userPosition: userPositionPDA,
          user: publicKey,
        })
        .rpc();
      
      return signature;
    },
    onSuccess: (signature) => {
      showSuccessToast('Winnings claimed!', signature);
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
    onError: (error) => {
      showErrorToast(`Failed to claim: ${error instanceof Error ? error.message : 'Unknown error'}`);
    },
  });
}