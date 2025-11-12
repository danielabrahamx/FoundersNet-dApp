import { useMarkets } from '@/hooks/useMarkets';
import { Card } from '@/components/ui/card';
import { MarketStatus } from '@/types/market';
import { formatSol, lamportsToSol } from '@/lib/utils';
import { TrendingUp, DollarSign, Users } from 'lucide-react';

export function AdminStats() {
  const { data: markets = [] } = useMarkets();
  
  const openEvents = markets.filter(m => m.status === MarketStatus.OPEN).length;
  const totalVolume = markets.reduce((sum, m) => 
    sum + lamportsToSol(m.totalVolume), 0
  );
  const totalEvents = markets.length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Events</p>
            <p className="text-2xl font-bold">{totalEvents}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Volume</p>
            <p className="text-2xl font-bold">{formatSol(totalVolume)}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Open Events</p>
            <p className="text-2xl font-bold">{openEvents}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
