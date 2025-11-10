import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PublicKey } from '@solana/web3.js';
import { useProgram } from './useProgram';
import { useWallet } from './useWallet';
import { useTransactionToast } from './useTransactionToast';
import { isAdmin } from '@/lib/admin';

export function useResolveEvent() {
  const program = useProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useTransactionToast();
  
  if (!isAdmin(publicKey)) {
    throw new Error('Only admin can resolve events');
  }
  
  return useMutation({
    mutationFn: async ({ marketId, outcome }: {
      marketId: string;
      outcome: 'yes' | 'no' | 'invalid';
    }) => {
      if (!program || !publicKey) throw new Error('Wallet not connected');
      
      const marketPubkey = new PublicKey(marketId);
      let outcomeEnum;
      if (outcome === 'yes') outcomeEnum = { yes: {} };
      else if (outcome === 'no') outcomeEnum = { no: {} };
      else outcomeEnum = { invalid: {} };
      
      const signature = await program.methods
        .resolveMarket(outcomeEnum)
        .accounts({
          market: marketPubkey,
          resolver: publicKey,
        })
        .rpc();
      
      return signature;
    },
    onSuccess: (signature) => {
      showSuccessToast('Event resolved!', signature);
      queryClient.invalidateQueries({ queryKey: ['markets'] });
    },
    onError: (error) => {
      showErrorToast(`Failed to resolve: ${error instanceof Error ? error.message : 'Unknown error'}`);
    },
  });
}