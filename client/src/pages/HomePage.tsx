import { useState, useMemo } from 'react';
import { useMarkets } from '@/hooks';
import { MarketList } from '@/components/market/MarketList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MarketStatus, MarketCategory } from '@/types';

type SortOption = 'volume-desc' | 'resolution-asc' | 'created-desc';
type StatusFilter = 'all' | MarketStatus;
type CategoryFilter = 'all' | MarketCategory;

export function Markets() {
  const { data: markets = [], isLoading } = useMarkets();
  const [sortBy, setSortBy] = useState<SortOption>('volume-desc');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const filteredAndSortedMarkets = useMemo(() => {
    let filtered = [...markets];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(market => market.status === statusFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(market => market.category === categoryFilter);
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
  }, [markets, sortBy, statusFilter, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Active Markets</h1>
        <p className="text-muted-foreground">
          Browse and trade on prediction markets
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

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={(value: CategoryFilter) => setCategoryFilter(value)}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value={MarketCategory.SPORTS}>{MarketCategory.SPORTS}</SelectItem>
              <SelectItem value={MarketCategory.POLITICS}>{MarketCategory.POLITICS}</SelectItem>
              <SelectItem value={MarketCategory.CRYPTO}>{MarketCategory.CRYPTO}</SelectItem>
              <SelectItem value={MarketCategory.ENTERTAINMENT}>{MarketCategory.ENTERTAINMENT}</SelectItem>
              <SelectItem value={MarketCategory.OTHER}>{MarketCategory.OTHER}</SelectItem>
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
