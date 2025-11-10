import { useWallet } from '@solana/wallet-adapter-react'
import { Navigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { isAdmin } from '@/lib/admin'
import { CreateEventForm } from '@/components/admin/CreateEventForm'
import { ManageEvents } from '@/components/admin/ManageEvents'

export function Admin() {
  const { publicKey, connected } = useWallet()
  const userIsAdmin = isAdmin(publicKey)

  if (!connected) return <Navigate to="/" />

  if (!userIsAdmin) {
    return (
      <div className="py-12 text-center">
        <Lock className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-6">Only admins can access this page.</p>
        <Button onClick={() => (window.location.href = '/')}>Go to Markets</Button>
      </div>
    )
  }

  return (
    <div className="py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage fundraising events and view statistics</p>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList>
          <TabsTrigger value="create">Create Event</TabsTrigger>
          <TabsTrigger value="manage">Manage Events</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-6">
          <div className="max-w-2xl">
            <CreateEventForm />
          </div>
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <ManageEvents />
        </TabsContent>
      </Tabs>
    </div>
  )
}
