import { useWallet } from '@solana/wallet-adapter-react'
import { Navigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { isAdmin } from '@/lib/admin'
import { CreateEventForm } from '@/components/admin/CreateEventForm'

export function CreateMarketPage() {
  const { publicKey, connected } = useWallet()
  const userIsAdmin = isAdmin(publicKey)

  // Redirect to home if not connected
  if (!connected) {
    return <Navigate to="/" />
  }

  // Show access denied for non-admin users
  if (!userIsAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <Lock className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            Only administrators can create events.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Go to Events
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Create New Event</h1>
        <p className="text-muted-foreground">
          Create a new fundraising prediction event for users to bet on
        </p>
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 dark:text-blue-400">ℹ️</div>
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Event Creation Guidelines</p>
            <ul className="text-sm text-blue-800 dark:text-blue-200 mt-1 list-disc list-inside space-y-1">
              <li>Events will be visible to all users once created</li>
              <li>Initial liquidity is split equally between YES and NO pools</li>
              <li>Only admins can resolve events after the resolution date</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Form */}
      <div className="max-w-2xl">
        <CreateEventForm />
      </div>
    </div>
  )
}
