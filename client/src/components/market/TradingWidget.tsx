import { useState, useMemo } from 'react';
import { Market, MarketStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWallet } from '@/hooks/useWallet';
import { useBalance } from '@/hooks/useBalance';
import { useUserPositions } from '@/hooks/useUserPositions';
import { useToast } from '@/hooks/use-toast';
import { calculateNewPoolRatio, calculatePotentialPayout } from '@/lib/calculations';
import {
  formatSol,
  lamportsToSol,
  calculateImpliedOdds,
  getTimeRemaining,
} from '@/lib/utils';
import { MIN_TRADE_AMOUNT, TRANSACTION_FEE, TRANSACTION_FEE_BUFFER } from '@/lib/constants';
import { AlertCircle } from 'lucide-react';

interface TradingWidgetProps {
  market: Market;
}

export function TradingWidget({ market }: TradingWidgetProps) {
  const { publicKey, connected } = useWallet();
  const { data: walletBalance = 0 } = useBalance(publicKey);
  const { data: positions = [] } = useUserPositions();
  const { toast } = useToast();

  const [selectedOutcome, setSelectedOutcome] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const yesPoolSOL = useMemo(() => lamportsToSol(market.yesPool), [market.yesPool]);
  const noPoolSOL = useMemo(() => lamportsToSol(market.noPool), [market.noPool]);

  const yesPercent = useMemo(() => calculateImpliedOdds(market.yesPool, market.yesPool + market.noPool), [market.yesPool, market.noPool]);
  const noPercent = useMemo(() => 100 - yesPercent, [yesPercent]);

  const currentPosition = useMemo(() => {
    const pos = positions.find((p) => p.market.toString() === market.publicKey.toString());
    if (!pos) return null;

    const selectedShares = selectedOutcome === 'yes' ? pos.yesShares : pos.noShares;
    if (selectedShares === 0) return null;

    return {
      shares: lamportsToSol(selectedShares),
      cost: lamportsToSol(pos.totalCost),
    };
  }, [positions, market.publicKey, selectedOutcome]);

  const amountNum = useMemo(() => {
    try {
      return parseFloat(amount) || 0;
    } catch {
      return 0;
    }
  }, [amount]);

  // Validate amount
  useMemo(() => {
    if (!connected) {
      setValidationError(null);
      return;
    }

    if (!amount) {
      setValidationError(null);
      return;
    }

    try {
      const val = parseFloat(amount);
      
      if (!Number.isFinite(val)) {
        setValidationError('Amount must be a valid number');
        return;
      }

      if (val < MIN_TRADE_AMOUNT) {
        setValidationError(`Minimum amount is ${formatSol(MIN_TRADE_AMOUNT)}`);
        return;
      }

      if (val > walletBalance - TRANSACTION_FEE_BUFFER) {
        setValidationError(`Insufficient balance. Max: ${formatSol(Math.max(0, walletBalance - TRANSACTION_FEE_BUFFER))}`);
        return;
      }

      setValidationError(null);
    } catch {
      setValidationError('Invalid amount');
    }
  }, [amount, walletBalance, connected]);

  const { yesPercent: newYesPercent, noPercent: newNoPercent } = useMemo(() => {
    if (amountNum <= 0) return { yesPercent, noPercent };
    return calculateNewPoolRatio(yesPoolSOL, noPoolSOL, amountNum, selectedOutcome);
  }, [amountNum, yesPoolSOL, noPoolSOL, selectedOutcome, yesPercent, noPercent]);

  const payout = useMemo(() => {
    if (amountNum <= 0) return { payout: 0, profit: 0, profitPercent: 0 };
    return calculatePotentialPayout(amountNum, selectedOutcome, yesPoolSOL, noPoolSOL);
  }, [amountNum, selectedOutcome, yesPoolSOL, noPoolSOL]);

  const isMarketResolved = market.status === MarketStatus.RESOLVED;
  const isMarketPastResolution = getTimeRemaining(market.resolutionDate).isPast;
  const isMarketClosed = isMarketResolved || isMarketPastResolution;
  const isAmountValid = !validationError && amountNum >= MIN_TRADE_AMOUNT && amountNum <= walletBalance - TRANSACTION_FEE_BUFFER;

  const handleMaxClick = () => {
    const maxAmount = Math.max(0, walletBalance - TRANSACTION_FEE_BUFFER);
    setAmount(maxAmount.toFixed(2));
  };

  const handlePlaceBet = () => {
    if (!connected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to place a bet.',
      });
      return;
    }

    if (!isAmountValid) {
      toast({
        title: 'Invalid Amount',
        description: validationError || 'Please enter a valid amount.',
        variant: 'destructive',
      });
      return;
    }

    if (isMarketClosed) {
      toast({
        title: 'Market Closed',
        description: 'This market is no longer accepting trades.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Coming Soon!',
      description: 'Blockchain integration coming next!',
    });
  };

  let buttonText = 'Place Bet';
  let buttonDisabled = false;

  if (!connected) {
    buttonText = 'Connect Wallet';
    buttonDisabled = false;
  } else if (isMarketClosed) {
    buttonText = isMarketResolved ? 'Market Resolved' : 'Trading Closed';
    buttonDisabled = true;
  } else if (!amount) {
    buttonText = 'Enter Amount';
    buttonDisabled = true;
  } else if (validationError) {
    buttonText = 'Invalid Amount';
    buttonDisabled = true;
  } else {
    buttonText = `Place Bet on ${selectedOutcome.toUpperCase()}`;
    buttonDisabled = false;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Place Bet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User's Current Position */}
        {currentPosition && (
          <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-900 dark:text-blue-300">
              You currently hold: {currentPosition.shares.toFixed(2)} {selectedOutcome.toUpperCase()} shares (cost: {formatSol(currentPosition.cost)})
            </AlertDescription>
          </Alert>
        )}

        {/* Outcome Selector */}
        <div>
          <Tabs value={selectedOutcome} onValueChange={(val) => setSelectedOutcome(val as 'yes' | 'no')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="yes"
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-600 dark:data-[state=active]:bg-green-950 dark:data-[state=active]:text-green-400"
              >
                YES
              </TabsTrigger>
              <TabsTrigger
                value="no"
                className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600 dark:data-[state=active]:bg-red-950 dark:data-[state=active]:text-red-400"
              >
                NO
              </TabsTrigger>
            </TabsList>
            <TabsContent value="yes" className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              YES Pool: {formatSol(yesPoolSOL)} ({yesPercent.toFixed(1)}%)
            </TabsContent>
            <TabsContent value="no" className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              NO Pool: {formatSol(noPoolSOL)} ({noPercent.toFixed(1)}%)
            </TabsContent>
          </Tabs>
        </div>

        {/* Amount Input */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-2">
            Amount (SOL)
          </label>
          <div className="flex gap-2">
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!connected}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleMaxClick}
              disabled={!connected}
              className="px-3"
            >
              Max
            </Button>
          </div>
          {validationError && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {validationError}
            </p>
          )}
          {!connected && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Connect wallet to trade</p>
          )}
        </div>

        {/* Trade Summary */}
        {isAmountValid && (
          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 space-y-2 border border-blue-200 dark:border-blue-800">
            <div className="text-sm">
              <span className="font-medium">You're betting:</span> {formatSol(amountNum)} on{' '}
              <span className={selectedOutcome === 'yes' ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-red-600 dark:text-red-400 font-semibold'}>
                {selectedOutcome.toUpperCase()}
              </span>
            </div>

            <div className="text-sm">
              <span className="font-medium">Current pool ratio:</span> {yesPercent.toFixed(1)}% / {noPercent.toFixed(1)}%
            </div>

            <div className="text-sm">
              <span className="font-medium">After your bet:</span> {newYesPercent.toFixed(1)}% / {newNoPercent.toFixed(1)}%
            </div>

            <div className="border-t border-blue-200 dark:border-blue-700 pt-2 mt-2">
              {payout.profitPercent > 0 ? (
                <div className="text-sm">
                  <span className="font-medium text-green-600 dark:text-green-400">
                    If {selectedOutcome.toUpperCase()} wins:
                  </span>{' '}
                  {formatSol(payout.payout)} (
                  <span className="text-green-600 dark:text-green-400 font-semibold">+{payout.profitPercent.toFixed(1)}% profit</span>)
                </div>
              ) : (
                <div className="text-sm">
                  <span className="font-medium text-red-600 dark:text-red-400">
                    If {selectedOutcome.toUpperCase()} loses:
                  </span>{' '}
                  <span className="text-red-600 dark:text-red-400 font-semibold">◎0 (100% loss)</span>
                </div>
              )}
            </div>

            <div className="text-xs text-gray-600 dark:text-gray-400 pt-1">
              Estimated fee: {formatSol(TRANSACTION_FEE)}
            </div>
          </div>
        )}

        {/* Error States */}
        {isMarketClosed && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {isMarketResolved ? 'This market has been resolved.' : 'Trading has closed for this market.'}
            </AlertDescription>
          </Alert>
        )}

        {connected && !isAmountValid && amount && !isMarketClosed && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{validationError || 'Please enter a valid amount'}</AlertDescription>
          </Alert>
        )}

        {/* Action Button */}
        <Button
          onClick={handlePlaceBet}
          disabled={buttonDisabled}
          className={`w-full ${
            selectedOutcome === 'yes'
              ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800'
              : 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
          } ${buttonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
