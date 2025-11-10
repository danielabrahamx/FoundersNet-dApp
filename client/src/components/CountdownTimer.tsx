import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Clock } from 'lucide-react';

export function CountdownTimer({ resolutionDate }: { resolutionDate: number }) {
  const [timeLeft, setTimeLeft] = useState('');
  
  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const target = resolutionDate * 1000;
      
      if (now >= target) {
        setTimeLeft('Betting closed');
      } else {
        setTimeLeft(formatDistanceToNow(target, { addSuffix: true }));
      }
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [resolutionDate]);
  
  return (
    <div className="flex items-center gap-2 text-sm">
      <Clock className="w-4 h-4" />
      <span>{timeLeft}</span>
    </div>
  );
}