import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Market, MarketStatus } from '@/types';
import { useResolveEvent } from '@/hooks/useResolveEvent';
import { useWallet } from '@/hooks/useWallet';
import { isAdmin } from '@/lib/admin';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { formatSol, lamportsToSol, getTimeRemaining } from '@/lib/utils';

interface ResolveEventDialogProps {
  market: Market;
  children: React.ReactNode;
}

export function ResolveEventDialog({ market, children }: ResolveEventDialogProps) {
  const { publicKey } = useWallet();
  const [open, setOpen] = useState(false);
  const [outcome, setOutcome] = useState<'yes' | 'no' | 'invalid'>('yes');
  const { mutate: resolveEvent, isPending } = useResolveEvent();

  // Only show for admin users and unresolved events
  if (!isAdmin(publicKey) || market.status !== MarketStatus.OPEN) {
    return null;
  }

  const isEarlyResolution = market.resolutionDate > Date.now() / 1000;
  const timeRemaining = getTimeRemaining(market.resolutionDate);

  const handleResolve = () => {
    resolveEvent(
      { marketId: market.publicKey.toString(), outcome },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEarlyResolution ? (
              <>
                <Clock className="h-5 w-5 text-amber-500" />
                Resolve Early
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 text-blue-500" />
                Resolve Event
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEarlyResolution ? (
              <>
                This event is still active and resolves in {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m. 
                Early resolution will lock in the outcome immediately.
              </>
            ) : (
              'This event has passed its resolution date and can now be resolved.'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Market Summary */}
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-2">{market.title}</h4>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>YES Pool: {formatSol(lamportsToSol(market.yesPool))}</span>
              <span>NO Pool: {formatSol(lamportsToSol(market.noPool))}</span>
              <span>Total: {formatSol(lamportsToSol(market.yesPool + market.noPool))}</span>
            </div>
          </div>

          {/* Outcome Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Resolution Outcome</Label>
            <RadioGroup value={outcome} onValueChange={(value) => setOutcome(value as 'yes' | 'no' | 'invalid')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes" className="flex items-center gap-2 cursor-pointer">
                  <Badge variant="default" className="bg-green-600">YES</Badge>
                  <span className="text-sm">YES wins - All YES bettors receive the pool</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no" className="flex items-center gap-2 cursor-pointer">
                  <Badge variant="destructive">NO</Badge>
                  <span className="text-sm">NO wins - All NO bettors receive the pool</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="invalid" id="invalid" />
                <Label htmlFor="invalid" className="flex items-center gap-2 cursor-pointer">
                  <Badge variant="secondary">INVALID</Badge>
                  <span className="text-sm">Invalid - All bettors get refunded</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Warning for early resolution */}
          {isEarlyResolution && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-800 dark:text-amber-200">
                <strong>Early Resolution Warning:</strong> This action cannot be undone. 
                All trading will be permanently disabled and winnings will be calculated based on your selection.
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button 
            onClick={handleResolve} 
            disabled={isPending}
            className={isEarlyResolution ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            {isPending ? 'Resolving...' : isEarlyResolution ? 'Resolve Early' : 'Resolve Event'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}