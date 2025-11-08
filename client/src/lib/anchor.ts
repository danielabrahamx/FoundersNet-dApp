import { Program, AnchorProvider, setProvider } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import { connection } from './solana'

/**
 * Placeholder IDL structure for the FoundersNet prediction market program
 * This will be replaced with the actual IDL once the Anchor program is deployed
 */
const IDL_PLACEHOLDER = {
  version: '0.1.0',
  name: 'foundersnet',
  instructions: [
    { name: 'createMarket', accounts: [], args: [] },
    { name: 'placeBet', accounts: [], args: [] },
    { name: 'resolveMarket', accounts: [], args: [] },
  ],
  accounts: [
    {
      name: 'market',
      type: {
        kind: 'struct',
        fields: [
          { name: 'title', type: 'string' },
          { name: 'yesPool', type: 'u64' },
          { name: 'noPool', type: 'u64' },
        ],
      },
    },
  ],
}

/**
 * Gets the Anchor Program instance
 * @param wallet - Wallet adapter object with publicKey and signTransaction methods
 * @returns Program instance or null if wallet not properly initialized
 */
export function getProgram(wallet: any): Program | null {
  if (!wallet || !wallet.publicKey || !wallet.signTransaction) {
    return null
  }

  try {
    const provider = new AnchorProvider(
      connection,
      wallet,
      {
        commitment: 'confirmed',
      }
    )
    setProvider(provider)

    const programId = new PublicKey(
      import.meta.env.VITE_PROGRAM_ID || 'EEZJxm2YmPHxH2VfqPXaS2k3qSmRhvKHEFMxjbzNxNfQ'
    )

    const program = new Program(IDL_PLACEHOLDER as any, programId, provider)
    return program
  } catch (error) {
    console.error('Failed to initialize Anchor program:', error)
    return null
  }
}
