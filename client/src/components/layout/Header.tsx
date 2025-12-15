import { NavLink } from 'react-router-dom'
import { Coins, Shield } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { isAdmin } from '@/lib/admin'
import { DevnetBadge } from './DevnetBadge'
import { ThemeToggle } from './ThemeToggle'
import { WalletButton } from '@/components/wallet/WalletButton'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function Header() {
  const { publicKey } = useWallet()
  const userIsAdmin = isAdmin(publicKey)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 sm:gap-3">
            <NavLink to="/" className="flex items-center space-x-2">
              <Coins className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              <span className="text-lg sm:text-xl font-bold">FoundersNet</span>
            </NavLink>
            {userIsAdmin && (
              <Badge variant="secondary" className="gap-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 hidden sm:flex">
                <Shield className="h-3 w-3" />
                Admin
              </Badge>
            )}
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive && 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 rounded-none'
                )
              }
            >
              Events
            </NavLink>
            <NavLink
              to="/portfolio"
              className={({ isActive }) =>
                cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive && 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 rounded-none'
                )
              }
            >
              Portfolio
            </NavLink>
            {userIsAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    isActive && 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 rounded-none'
                  )
                }
              >
                Admin
              </NavLink>
            )}
          </nav>

          <div className="flex items-center space-x-1.5 sm:space-x-3">
            <div className="hidden sm:block">
              <DevnetBadge />
            </div>
            <ThemeToggle />
            <WalletButton />
          </div>
        </div>
      </div>
    </header>
  )
}
