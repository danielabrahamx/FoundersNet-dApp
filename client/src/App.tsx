import { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TrustWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import '@solana/wallet-adapter-react-ui/styles.css'
import { Toaster } from '@/components/ui/toaster'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: true,
    },
  },
})

function App() {
  const endpoint = import.meta.env.VITE_SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com'

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TrustWalletAdapter(),
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <div className="min-h-screen bg-background text-foreground">
                <header className="border-b">
                  <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold">FoundersNet</h1>
                    <p className="text-sm text-muted-foreground">Solana Devnet Prediction Market</p>
                  </div>
                </header>
                <main className="container mx-auto px-4 py-8">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold mb-4">Welcome to FoundersNet</h2>
                    <p className="text-muted-foreground mb-6">
                      A decentralized prediction market platform on Solana Devnet
                    </p>
                    <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-md inline-block">
                      DEVNET MODE
                    </div>
                  </div>
                </main>
                <Toaster />
              </div>
            </BrowserRouter>
          </QueryClientProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App