import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useWallet } from '@solana/wallet-adapter-react'
import { useNavigate } from 'react-router-dom'
import { Keypair, SystemProgram } from '@solana/web3.js'
import BN from 'bn.js'
import { useProgram } from './useProgram'
import { useTransactionToast } from './useTransactionToast'
import { EventFormData, generateEventTitle } from '@/lib/validations/eventSchema'
import { solToLamports } from '@/lib/utils'

export function useCreateEvent() {
  const program = useProgram()
  const { publicKey } = useWallet()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { showSuccessToast, showErrorToast } = useTransactionToast()

  return useMutation({
    mutationFn: async (data: EventFormData) => {
      if (!program || !publicKey) throw new Error('Wallet not connected')

      const title = generateEventTitle(data)
      const marketKeypair = Keypair.generate()
      const resolutionTimestamp = new BN(Math.floor(data.resolutionDate.getTime() / 1000))
      const liquidityLamports = new BN(solToLamports(data.initialLiquidity))

      const signature = await program.methods
        .createMarket(
          title,
          data.description,
          data.eventType,
          data.startupName,
          resolutionTimestamp,
          liquidityLamports
        )
        .accounts({
          market: marketKeypair.publicKey,
          creator: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([marketKeypair])
        .rpc()

      return { signature, marketId: marketKeypair.publicKey.toString() }
    },
    onSuccess: ({ signature, marketId }) => {
      showSuccessToast('Event created!', signature)
      queryClient.invalidateQueries({ queryKey: ['markets'] })
      navigate(`/market/${marketId}`)
    },
    onError: (error) => {
      showErrorToast(error instanceof Error ? error.message : 'Failed to create event')
    },
  })
}
