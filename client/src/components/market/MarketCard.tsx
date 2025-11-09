import { useNavigate } from 'react-router-dom';
import { Market } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { lamportsToSol, formatSol, getTimeRemaining } from '@/lib/utils';

interface MarketCardProps {
  market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
  const navigate = useNavigate();
  
  const totalPool = market.yesPool + market.noPool;
  const yesPercentage = totalPool > 0 ? (market.yesPool / totalPool) * 100 : 0;
  const noPercentage = totalPool > 0 ? (market.noPool / totalPool) * 100 : 0;
  
  const timeRemaining = getTimeRemaining(market.resolutionDate);
  const resolutionText = timeRemaining.isPast 
    ? "Resolved" 
    : timeRemaining.days > 0 
      ? `Resolves in ${timeRemaining.days} day${timeRemaining.days > 1 ? 's' : ''}`
      : timeRemaining.hours > 0
        ? `Resolves in ${timeRemaining.hours} hour${timeRemaining.hours > 1 ? 's' : ''}`
        : `Resolves in ${timeRemaining.minutes} minute${timeRemaining.minutes > 1 ? 's' : ''}`;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Sports':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Politics':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Crypto':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Entertainment':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Resolved':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleClick = () => {
    navigate(`/market/${market.publicKey.toString()}`);
  };

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Title and Status */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold line-clamp-2 leading-tight">
              {market.title}
            </h3>
            <div className="flex items-center gap-2">
              <Badge className={getCategoryColor(market.category)}>
                {market.category}
              </Badge>
              <Badge className={getStatusColor(market.status)} variant="secondary">
                {market.status}
              </Badge>
            </div>
          </div>

          {/* Resolution Date */}
          <div className="text-sm text-muted-foreground">
            {resolutionText}
          </div>

          {/* Pool Information */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                YES Pool
              </span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {formatSol(lamportsToSol(market.yesPool))} ({yesPercentage.toFixed(0)}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                NO Pool
              </span>
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                {formatSol(lamportsToSol(market.noPool))} ({noPercentage.toFixed(0)}%)
              </span>
            </div>
          </div>

          {/* Total Volume */}
          <div className="pt-2 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Pool</span>
              <span className="font-semibold">
                {formatSol(lamportsToSol(totalPool))}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
