import { useState, useMemo } from 'react';
import { useMarkets } from '@/hooks';
import { MarketList } from '@/components/market/MarketList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MarketStatus, EventType } from '@/types';

type SortOption = 'volume-desc' | 'resolution-asc' | 'created-desc';
type StatusFilter = 'all' | MarketStatus;
type EventTypeFilter = 'all' | EventType;

export function Markets() {
  const { data: markets = [], isLoading } = useMarkets();
  const [sortBy, setSortBy] = useState<SortOption>('volume-desc');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<EventTypeFilter>('all');

  const filteredAndSortedMarkets = useMemo(() => {
    let filtered = [...markets];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(market => market.status === statusFilter);
    }

    // Apply event type filter
    if (eventTypeFilter !== 'all') {
      filtered = filtered.filter(market => market.eventType === eventTypeFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'volume-desc':
          return b.totalVolume - a.totalVolume;
        case 'resolution-asc':
          return a.resolutionDate - b.resolutionDate;
        case 'created-desc':
          return b.createdAt - a.createdAt;
        default:
          return 0;
      }
    });

    return filtered;
  }, [markets, sortBy, statusFilter, eventTypeFilter]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Active Fundraising Bets</h1>
        <p className="text-muted-foreground">
          Browse and trade on startup fundraising events
        </p>
      </div>

      {/* Filter and Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={(value: StatusFilter) => setStatusFilter(value)}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value={MarketStatus.OPEN}>{MarketStatus.OPEN}</SelectItem>
              <SelectItem value={MarketStatus.RESOLVED}>{MarketStatus.RESOLVED}</SelectItem>
            </SelectContent>
          </Select>

          {/* Event Type Filter */}
          <Select value={eventTypeFilter} onValueChange={(value: EventTypeFilter) => setEventTypeFilter(value)}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value={EventType.SERIES_A}>{EventType.SERIES_A}</SelectItem>
              <SelectItem value={EventType.SERIES_B}>{EventType.SERIES_B}</SelectItem>
              <SelectItem value={EventType.ACQUISITION}>{EventType.ACQUISITION}</SelectItem>
              <SelectItem value={EventType.IPO}>{EventType.IPO}</SelectItem>
              <SelectItem value={EventType.OTHER}>{EventType.OTHER}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Dropdown */}
        <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="volume-desc">Volume ↓</SelectItem>
            <SelectItem value="resolution-asc">Resolution Date ↑</SelectItem>
            <SelectItem value="created-desc">Recently Created</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Market List */}
      <MarketList markets={filteredAndSortedMarkets} isLoading={isLoading} />
    </div>
  );
}
