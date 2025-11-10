import { Program, AnchorProvider, setProvider } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import { connection } from './solana'
import { IDL } from '@/idl/foundersnet'

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

    const program = new Program(IDL as any, programId, provider)
    return program
  } catch (error) {
    console.error('Failed to initialize Anchor program:', error)
    return null
  }
}
