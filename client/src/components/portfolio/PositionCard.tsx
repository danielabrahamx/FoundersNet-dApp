import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CountdownTimer } from '@/components/CountdownTimer';
import { MarketStatus } from '@/types';
import { PositionWithMarket } from '@/hooks/usePortfolio';
import { formatSol } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';

interface PositionCardProps {
  position: PositionWithMarket;
}

export function PositionCard({ position }: PositionCardProps) {
  const navigate = useNavigate();
  const { market } = position; // Market is now part of the enriched position
  
  // Use pre-calculated values from enriched position
  const { betSide, costBasis, currentValue, pnl, pnlPercent } = position;

  const isResolved = market.status === MarketStatus.RESOLVED;
  const isWinner = position.isWinner;

  const handleCardClick = () => {
    navigate(`/market/${market.publicKey.toString()}`);
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleCardClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1 line-clamp-2">{market.title}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {market.eventType && (
                <Badge variant="secondary" className="text-xs">
                  {market.eventType}
                </Badge>
              )}
              <Badge 
                variant={betSide === 'YES' ? 'default' : betSide === 'NO' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {betSide}
              </Badge>
              <Badge 
                variant={isResolved ? 'secondary' : 'outline'}
                className="text-xs"
              >
                {isResolved ? 'Resolved' : 'Open'}
              </Badge>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-muted-foreground ml-2 flex-shrink-0" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Timer or Resolution Date */}
        <div className="flex items-center justify-between">
          {!isResolved ? (
            <CountdownTimer resolutionDate={market.resolutionDate} />
          ) : (
            <span className="text-sm text-muted-foreground">
              Resolved: {market.outcome}
            </span>
          )}
        </div>

        {/* Position Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Bet Amount</p>
            <p className="font-medium">{formatSol(costBasis)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Current Value</p>
            <p className="font-medium">{formatSol(currentValue)}</p>
          </div>
        </div>

        {/* P&L */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {pnl >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className="text-sm font-medium">P&L</span>
            </div>
            <div className="text-right">
              <p className={`font-bold ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {pnl >= 0 ? '+' : ''}{formatSol(pnl)}
              </p>
              <p className={`text-xs ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ({pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(1)}%)
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {isResolved && isWinner && (
          <Button 
            className="w-full" 
            onClick={(e) => {
              e.stopPropagation();
              // Placeholder for claim winnings functionality
              console.log('Claim winnings for position:', position.publicKey.toString());
            }}
          >
            Claim Winnings
          </Button>
        )}
      </CardContent>
    </Card>
  );
}