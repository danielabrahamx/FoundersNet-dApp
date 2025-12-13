import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Foundersnet } from '../target/types/foundersnet';
import { assert } from 'chai';

describe('foundersnet', () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.Foundersnet as Program<Foundersnet>;

    it('Demo: Program is deployed and accessible on Devnet', async () => {
        console.log('✅ DEMO SUCCESS - FoundersNet is live on Devnet!');
        console.log('   Program ID:', program.programId.toString());
        console.log('   Wallet:', provider.wallet.publicKey.toString());
        console.log('   RPC URL:', provider.connection.rpcEndpoint);

        // Verify the program exists on-chain
        const programAccount = await provider.connection.getAccountInfo(program.programId);
        assert(programAccount !== null, 'Program account should exist on Devnet');
        console.log('   ✅ Program Account Verified on-chain');

        assert.ok(true, 'Test passed successfully');
    });
});