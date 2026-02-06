import { cn } from '@/lib/utils';

type GorillaMood = 'happy' | 'neutral' | 'sad';

interface GorillaMascotProps {
  mood: GorillaMood;
  level: number;
  isCelebrating?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function GorillaMascot({ mood, level, isCelebrating = false, size = 'lg' }: GorillaMascotProps) {
  const sizeClasses = {
    sm: 'w-24 h-24 text-4xl',
    md: 'w-36 h-36 text-6xl',
    lg: 'w-48 h-48 text-8xl',
  };

  const moodEmojis = {
    happy: '🦍',
    neutral: '🦍',
    sad: '🦍',
  };

  const moodAnimations = {
    happy: 'animate-bounce-gentle',
    neutral: 'animate-float',
    sad: 'animate-slouch',
  };

  const moodColors = {
    happy: 'bg-gorilla-happy/20 border-gorilla-happy',
    neutral: 'bg-gorilla-neutral/20 border-gorilla-neutral',
    sad: 'bg-gorilla-sad/20 border-gorilla-sad',
  };

  const moodExpressions = {
    happy: '💪',
    neutral: '😌',
    sad: '😔',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          'relative rounded-full flex items-center justify-center border-4 transition-all duration-500',
          sizeClasses[size],
          moodColors[mood],
          isCelebrating ? 'animate-celebrate' : moodAnimations[mood]
        )}
      >
        {/* Gorilla emoji */}
        <span className="select-none" role="img" aria-label="gorilla">
          {moodEmojis[mood]}
        </span>
        
        {/* Mood indicator */}
        <span className="absolute -bottom-1 -right-1 text-2xl">
          {moodExpressions[mood]}
        </span>
        
        {/* Level badge */}
        <div className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground rounded-full w-10 h-10 flex items-center justify-center font-display font-bold text-lg border-2 border-background shadow-lg">
          {level}
        </div>
      </div>
      
      {/* Mood label */}
      <div className={cn(
        'px-3 py-1 rounded-full text-sm font-medium capitalize',
        mood === 'happy' && 'bg-gorilla-happy/20 text-gorilla-happy',
        mood === 'neutral' && 'bg-gorilla-neutral/20 text-gorilla-neutral',
        mood === 'sad' && 'bg-gorilla-sad/20 text-gorilla-sad',
      )}>
        {mood === 'happy' ? 'Feeling Strong!' : mood === 'neutral' ? 'Ready to Work' : 'Needs Motivation'}
      </div>
    </div>
  );
}
