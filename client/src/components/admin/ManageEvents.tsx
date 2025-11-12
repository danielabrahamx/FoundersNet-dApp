import { useState } from 'react';
import { useMarkets } from '@/hooks/useMarkets';
import { useWallet } from '@/hooks/useWallet';
import { isAdmin } from '@/lib/admin';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CountdownTimer } from '@/components/CountdownTimer';
import { ResolveEventDialog } from './ResolveEventDialog';
import { MarketStatus, MarketOutcome, Market } from '@/types/market';
import { formatSol, lamportsToSol } from '@/lib/utils';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ManageEvents() {
  const { publicKey } = useWallet();
  const { data: markets = [], isLoading } = useMarkets();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Security check - this component should only render for admin
  if (!isAdmin(publicKey)) {
    return null;
  }
  
  // Filter events
  const pendingEvents = markets.filter(m => m.status === MarketStatus.OPEN);
  const resolvedEvents = markets
    .filter(m => m.status === MarketStatus.RESOLVED)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 10); // Show last 10 resolved
  
  // Further categorize pending events
  const readyToResolve = pendingEvents.filter(m => Date.now() / 1000 > m.resolutionDate);
  const stillOpen = pendingEvents.filter(m => Date.now() / 1000 <= m.resolutionDate);
  
  // Apply search filter
  const filterBySearch = (events: Market[]) => {
    if (!searchQuery.trim()) return events;
    const query = searchQuery.toLowerCase();
    return events.filter(m =>
      m.title.toLowerCase().includes(query) ||
      (m.startupName && m.startupName.toLowerCase().includes(query))
    );
  };
  
  const filteredPendingEvents = filterBySearch(readyToResolve);
  const filteredOpenEvents = filterBySearch(stillOpen);
  
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{readyToResolve.length}</p>
              <p className="text-sm text-muted-foreground">Need Resolution</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stillOpen.length}</p>
              <p className="text-sm text-muted-foreground">Still Open</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{resolvedEvents.length}</p>
              <p className="text-sm text-muted-foreground">Recently Resolved</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Search Bar */}
      <div className="flex gap-4">
        <Input
          placeholder="Search events by title or startup..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">
            Pending Resolution ({readyToResolve.length})
          </TabsTrigger>
          <TabsTrigger value="open">
            Open Events ({stillOpen.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4 mt-6">
          {filteredPendingEvents.length > 0 ? (
            <>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ These events have passed their resolution deadline. Please resolve them as soon as possible.
                </p>
              </div>
              
              {filteredPendingEvents.map(market => (
                <EventCard 
                  key={market.publicKey.toString()} 
                  market={market}
                  showResolveButton={true}
                  isPastDeadline={true}
                  onNavigate={() => navigate(`/event/${market.publicKey.toString()}`)}
                />
              ))}
            </>
          ) : (
            <Card className="p-8 text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No matching events found' : 'All events are either still open or have been resolved. Great job!'}
              </p>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="open" className="space-y-4 mt-6">
          {filteredOpenEvents.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                These events are still accepting bets. You can resolve them early if the outcome is confirmed.
              </p>
              
              {filteredOpenEvents.map(market => (
                <EventCard 
                  key={market.publicKey.toString()} 
                  market={market}
                  showResolveButton={true}
                  isPastDeadline={false}
                  onNavigate={() => navigate(`/event/${market.publicKey.toString()}`)}
                />
              ))}
            </>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                {searchQuery ? 'No matching events found' : 'No open events'}
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Recently Resolved */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Recently Resolved
        </h3>
        
        {resolvedEvents.length > 0 ? (
          <div className="space-y-3">
            {resolvedEvents.map(market => (
              <div 
                key={market.publicKey.toString()} 
                className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => navigate(`/event/${market.publicKey.toString()}`)}
              >
                <div className="flex-1">
                  <p className="font-medium line-clamp-1">{market.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Resolved {new Date(market.createdAt * 1000).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <OutcomeBadge outcome={market.outcome} />
                  <Badge variant="secondary">
                    {formatSol(lamportsToSol(market.yesPool + market.noPool))} Pool
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No resolved events yet
          </p>
        )}
      </Card>
    </div>
  );
}

// Helper Components

interface EventCardProps {
  market: Market;
  showResolveButton: boolean;
  isPastDeadline: boolean;
  onNavigate: () => void;
}

function EventCard({ market, showResolveButton, isPastDeadline, onNavigate }: EventCardProps) {
  const totalPool = lamportsToSol(market.yesPool + market.noPool);
  const yesPercent = totalPool > 0 ? ((lamportsToSol(market.yesPool) / totalPool) * 100).toFixed(1) : '0.0';
  const noPercent = totalPool > 0 ? ((lamportsToSol(market.noPool) / totalPool) * 100).toFixed(1) : '0.0';
  
  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Event Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h3 
                className="font-semibold line-clamp-2 hover:underline cursor-pointer"
                onClick={onNavigate}
              >
                {market.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {market.eventType && <Badge variant="outline">{market.eventType}</Badge>}
                {market.startupName && <Badge variant="outline">{market.startupName}</Badge>}
              </div>
            </div>
          </div>
          
          {/* Timer or Status */}
          <div className="mt-3">
            {isPastDeadline ? (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Betting closed - awaiting resolution</span>
              </div>
            ) : (
              <CountdownTimer resolutionDate={market.resolutionDate} />
            )}
          </div>
          
          {/* Pool Stats */}
          <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
            <div>
              <p className="text-muted-foreground">YES Pool</p>
              <p className="font-semibold text-green-600">
                {formatSol(lamportsToSol(market.yesPool))} ({yesPercent}%)
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">NO Pool</p>
              <p className="font-semibold text-red-600">
                {formatSol(lamportsToSol(market.noPool))} ({noPercent}%)
              </p>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col gap-2 min-w-[140px]">
          {showResolveButton && (
            <ResolveEventDialog market={market}>
              <Button variant="default" size="sm" className="w-full">
                {isPastDeadline ? 'Resolve Event' : 'Resolve Early'}
              </Button>
            </ResolveEventDialog>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={onNavigate}
          >
            View Event
          </Button>
        </div>
      </div>
    </Card>
  );
}

function OutcomeBadge({ outcome }: { outcome?: MarketOutcome }) {
  if (!outcome) return null;
  
  const config = {
    [MarketOutcome.YES]: { label: 'YES Won', className: 'bg-green-600 text-white' },
    [MarketOutcome.NO]: { label: 'NO Won', className: 'bg-red-600 text-white' },
    [MarketOutcome.INVALID]: { label: 'Invalid', className: 'bg-gray-600 text-white' },
  };
  
  const { label, className } = config[outcome];
  
  return <Badge className={className}>{label}</Badge>;
}
