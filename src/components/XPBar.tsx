import { cn } from '@/lib/utils';

interface XPBarProps {
  currentXP: number;
  level: number;
  className?: string;
}

// XP required for each level (increases progressively)
export function getXPForLevel(level: number): number {
  return level * 100;
}

export function XPBar({ currentXP, level, className }: XPBarProps) {
  const xpForCurrentLevel = getXPForLevel(level);
  const progress = Math.min((currentXP / xpForCurrentLevel) * 100, 100);

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-muted-foreground">Level {level}</span>
        <span className="text-sm font-bold text-xp">
          {currentXP} / {xpForCurrentLevel} XP
        </span>
      </div>
      <div className="h-4 bg-muted rounded-full overflow-hidden border border-border">
        <div
          className="h-full bg-xp-gradient rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
