import { useWallet as useWalletAdapter } from '@solana/wallet-adapter-react'
import { connection } from '@/lib/solana'

export function useWallet() {
  const {
    publicKey,
    connected,
    connecting,
    disconnect,
    connect,
    wallet,
  } = useWalletAdapter()

  const getBalance = async (): Promise<number> => {
    if (!publicKey) {
      return 0
    }
    try {
      const balance = await connection.getBalance(publicKey)
      return balance
    } catch (error) {
      console.error('Failed to get balance:', error)
      return 0
    }
  }

  return {
    publicKey,
    connected,
    connecting,
    disconnect,
    connect,
    wallet,
    getBalance,
  }
}
