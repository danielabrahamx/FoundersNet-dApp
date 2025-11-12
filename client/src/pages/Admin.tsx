import { useWallet } from '@solana/wallet-adapter-react'
import { Navigate } from 'react-router-dom'
import { Lock, Settings, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { isAdmin } from '@/lib/admin'
import { CreateEventForm } from '@/components/admin/CreateEventForm'
import { ManageEvents } from '@/components/admin/ManageEvents'
import { AdminStats } from '@/components/admin/AdminStats'

export function Admin() {
  const { publicKey, connected } = useWallet()
  const userIsAdmin = isAdmin(publicKey)

  if (!connected) return <Navigate to="/" />

  if (!userIsAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <Lock className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            Only administrators can access this page.
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage fundraising events and resolutions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 rounded-full">
            <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
              Admin Mode
            </p>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <AdminStats />
      
      {/* Tabs */}
      <Tabs defaultValue="manage" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Manage Events
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Event
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="manage">
          <ManageEvents />
        </TabsContent>
        
        <TabsContent value="create">
          <div className="max-w-2xl">
            <CreateEventForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
