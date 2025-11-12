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
  if (!wallet) {
    console.error('Wallet is not provided')
    return null
  }

  if (!wallet.publicKey) {
    console.error('Wallet does not have a publicKey:', wallet)
    return null
  }

  if (!wallet.signTransaction || !wallet.signAllTransactions) {
    console.error('Wallet does not have signTransaction or signAllTransactions methods')
    return null
  }

  try {
    // Create a wrapper object that matches the Wallet interface expected by AnchorProvider
    const walletInterface = {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction.bind(wallet),
      signAllTransactions: wallet.signAllTransactions.bind(wallet),
    }

    const provider = new AnchorProvider(
      connection,
      walletInterface,
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
