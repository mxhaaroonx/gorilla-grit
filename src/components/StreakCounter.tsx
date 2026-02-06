import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  streak: number;
  className?: string;
}

export function StreakCounter({ streak, className }: StreakCounterProps) {
  const isHot = streak >= 3;
  const isOnFire = streak >= 7;

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-xl font-display font-bold text-lg transition-all',
        streak === 0 && 'bg-muted text-muted-foreground',
        streak > 0 && streak < 3 && 'bg-secondary/50 text-secondary-foreground',
        isHot && !isOnFire && 'bg-accent/20 text-accent',
        isOnFire && 'bg-accent text-accent-foreground animate-pulse-glow',
        className
      )}
    >
      <Flame
        className={cn(
          'w-6 h-6',
          streak === 0 && 'text-muted-foreground',
          streak > 0 && 'text-accent',
          isOnFire && 'animate-bounce-gentle'
        )}
      />
      <span>{streak}</span>
      <span className="text-sm font-normal">
        {streak === 1 ? 'day' : 'days'}
      </span>
    </div>
  );
}
