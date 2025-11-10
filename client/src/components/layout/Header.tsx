import { NavLink } from 'react-router-dom'
import { Coins } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { isAdmin } from '@/lib/admin'
import { DevnetBadge } from './DevnetBadge'
import { ThemeToggle } from './ThemeToggle'
import { WalletButton } from '@/components/wallet/WalletButton'
import { cn } from '@/lib/utils'

export function Header() {
  const { publicKey } = useWallet()
  const userIsAdmin = isAdmin(publicKey)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center space-x-2">
              <Coins className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold">FoundersNet</span>
            </NavLink>
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
              Markets
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

          <div className="flex items-center space-x-3">
            <DevnetBadge />
            <ThemeToggle />
            <WalletButton />
          </div>
        </div>
      </div>
    </header>
  )
}
