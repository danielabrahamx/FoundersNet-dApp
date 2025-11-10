import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { lamportsToSol, formatSol } from '@/lib/utils';
import { PositionWithMarket } from '@/hooks/usePortfolio';

interface PortfolioSummaryProps {
  positions: PositionWithMarket[];
  totalValue: number;
  totalPnL: number;
  winRate: number;
}

export function PortfolioSummary({ positions, totalValue, totalPnL, winRate }: PortfolioSummaryProps) {
  const totalInvested = positions.reduce((sum, pos) => sum + lamportsToSol(pos.totalCost), 0);
  const isProfitable = totalPnL >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Value */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Portfolio Value</p>
            <p className="text-2xl font-bold">{formatSol(totalValue)}</p>
            <p className="text-xs text-muted-foreground">
              {positions.length} position{positions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Total P&L */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total P&L</p>
            <div className="flex items-center gap-2">
              <p className={`text-2xl font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                {isProfitable ? '+' : ''}{formatSol(totalPnL)}
              </p>
              {totalPnL !== 0 && (
                <Badge variant={isProfitable ? 'default' : 'destructive'} className="text-xs">
                  {((totalPnL / totalInvested) * 100).toFixed(1)}%
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Invested: {formatSol(totalInvested)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Win Rate */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
            <p className="text-2xl font-bold">{winRate.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">
              {positions.filter(pos => lamportsToSol(pos.totalCost) > 0).length} active bets
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}