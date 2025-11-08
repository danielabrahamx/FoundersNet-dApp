import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '@/hooks/useWallet'
import { useToast } from '@/hooks/use-toast'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { connected } = useWallet()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (!connected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to access this page",
        variant: "destructive",
      })
      navigate('/')
    }
  }, [connected, navigate, toast])

  if (!connected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Wallet Required</h2>
          <p className="text-muted-foreground">Please connect your wallet to continue</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}