import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Wallet, Copy, ExternalLink, LogOut, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useBalance } from '@/hooks/useBalance'
import { useAirdrop } from '@/hooks/useAirdrop'
import { formatSol, truncateAddress } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export function WalletButton() {
  const { publicKey, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const { data: balance } = useBalance(publicKey)
  const { toast } = useToast()
  const { airdrop, isAirdropping } = useAirdrop()

  const handleCopyAddress = async () => {
    if (!publicKey) return

    try {
      await navigator.clipboard.writeText(publicKey.toString())
      toast({
        title: 'Address copied',
        description: 'Wallet address copied to clipboard',
      })
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy address to clipboard',
        variant: 'destructive',
      })
    }
  }

  const handleAirdrop = () => {
    airdrop()
  }

  const handleViewOnSolscan = () => {
    if (!publicKey) return
    window.open(`https://devnet.solscan.io/account/${publicKey.toString()}`, '_blank', 'noopener,noreferrer')
  }

  if (!publicKey) {
    return (
      <Button
        onClick={() => setVisible(true)}
        className="bg-purple-600 hover:bg-purple-700"
      >
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="font-mono">
          {truncateAddress(publicKey.toString())} | {formatSol(balance || 0)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem onClick={handleCopyAddress}>
          <Copy className="mr-2 h-4 w-4" />
          <span className="font-mono text-xs truncate">{publicKey.toString()}</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <span className="font-semibold">{formatSol(balance || 0)} SOL</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleAirdrop}
          disabled={isAirdropping}
          className="cursor-pointer"
        >
          {isAirdropping ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Airdropping...
            </>
          ) : (
            'Airdrop 1 SOL'
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleViewOnSolscan}>
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Solscan
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnect} className="text-red-600 dark:text-red-400">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
