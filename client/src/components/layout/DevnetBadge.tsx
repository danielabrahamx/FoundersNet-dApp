import { Badge } from '@/components/ui/badge'

export function DevnetBadge() {
  return (
    <Badge
      variant="outline"
      className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700"
      title="This app uses Solana Devnet. No real funds at risk."
    >
      ⚠️ DEVNET MODE
    </Badge>
  )
}
