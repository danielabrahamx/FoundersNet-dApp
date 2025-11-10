import { useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { connection } from '@/lib/solana';
import { useQueryClient } from '@tanstack/react-query';

export function useAccountSubscription(
  accountPubkey: PublicKey | null | undefined,
  queryKey: string[]
) {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    if (!accountPubkey) return;
    
    console.log('📡 Subscribing:', accountPubkey.toString());
    
    const subscriptionId = connection.onAccountChange(
      accountPubkey,
      () => {
        console.log('🔄 Account changed, refetching...');
        queryClient.invalidateQueries({ queryKey });
      },
      'confirmed'
    );
    
    return () => {
      connection.removeAccountChangeListener(subscriptionId);
      console.log('📴 Unsubscribed:', accountPubkey.toString());
    };
  }, [accountPubkey?.toString(), queryClient]);
}