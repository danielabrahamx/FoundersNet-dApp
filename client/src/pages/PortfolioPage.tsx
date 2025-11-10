import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { NoPositions } from '@/components/EmptyStates';
import { PortfolioSummary } from '@/components/portfolio/PortfolioSummary';
import { PositionCard } from '@/components/portfolio/PositionCard';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

type FilterType = 'all' | 'open' | 'resolved';

export function PortfolioPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('all');
  const { data: portfolio, isLoading, error } = usePortfolio();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-4">My Fundraising Bets</h1>
          <div className="flex gap-4 mb-6">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        
        {/* Summary Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Position Cards Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-4">My Fundraising Bets</h1>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive mb-4">Failed to load portfolio data</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!portfolio || portfolio.positions.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-4">My Fundraising Bets</h1>
          <p className="text-muted-foreground mb-6">Track your positions and performance across all fundraising events</p>
        </div>
        
        <NoPositions />
      </div>
    );
  }

  // Filter positions based on selected filter
  const filteredPositions = filter === 'all' 
    ? portfolio.positions 
    : filter === 'open' 
    ? portfolio.openPositions 
    : portfolio.resolvedPositions;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">My Fundraising Bets</h1>
        <p className="text-muted-foreground">Track your positions and performance across all fundraising events</p>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter positions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            <SelectItem value="open">Open Events</SelectItem>
            <SelectItem value="resolved">Resolved Events</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{portfolio.positions.length} total positions</span>
          <span>{portfolio.openPositions.length} open</span>
          <span>{portfolio.resolvedPositions.length} resolved</span>
        </div>
      </div>

      {/* Portfolio Summary */}
      <PortfolioSummary
        positions={portfolio.positions}
        totalValue={portfolio.totalValue}
        totalPnL={portfolio.totalPnL}
        winRate={portfolio.winRate}
      />

      {/* Position Cards */}
      {filteredPositions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPositions.map((position) => (
            <PositionCard
              key={position.publicKey.toString()}
              position={position}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              {filter === 'open' ? (
                <Clock className="w-12 h-12 text-muted-foreground" />
              ) : filter === 'resolved' ? (
                <TrendingUp className="w-12 h-12 text-muted-foreground" />
              ) : (
                <TrendingDown className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">No {filter === 'all' ? 'positions' : filter === 'open' ? 'open events' : 'resolved events'}</h3>
            <p className="text-muted-foreground mb-4">
              {filter === 'open' && "You don't have any bets on currently open events."}
              {filter === 'resolved' && "You don't have any bets on resolved events yet."}
              {filter === 'all' && "Start placing bets on fundraising events to see your positions here."}
            </p>
            {filter === 'all' && (
              <Button onClick={() => navigate('/')}>Explore Events</Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
