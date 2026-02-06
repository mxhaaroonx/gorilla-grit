import { Check, Clock, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type TaskDifficulty = 'easy' | 'medium' | 'hard';
export type TaskType = 'daily' | 'timeframe';

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  difficulty: TaskDifficulty;
  taskType: TaskType;
  deadline?: string;
  isCompleted: boolean;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const difficultyConfig = {
  easy: { label: 'Easy', xp: 10, color: 'bg-primary/20 text-primary' },
  medium: { label: 'Medium', xp: 25, color: 'bg-secondary text-secondary-foreground' },
  hard: { label: 'Hard', xp: 50, color: 'bg-accent text-accent-foreground' },
};

export function TaskCard({
  id,
  title,
  description,
  difficulty,
  taskType,
  deadline,
  isCompleted,
  onComplete,
  onDelete,
}: TaskCardProps) {
  const config = difficultyConfig[difficulty];

  return (
    <Card
      className={cn(
        'transition-all duration-300 hover:shadow-lg',
        isCompleted && 'opacity-60 bg-muted/50'
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Complete button */}
          <Button
            variant={isCompleted ? 'default' : 'outline'}
            size="icon"
            className={cn(
              'shrink-0 rounded-full transition-all',
              isCompleted && 'bg-primary text-primary-foreground'
            )}
            onClick={() => onComplete(id)}
            disabled={isCompleted}
          >
            <Check className="w-5 h-5" />
          </Button>

          {/* Task content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3
                className={cn(
                  'font-display font-semibold text-lg',
                  isCompleted && 'line-through text-muted-foreground'
                )}
              >
                {title}
              </h3>
              <Badge className={config.color}>
                {config.label} (+{config.xp} XP)
              </Badge>
              {taskType === 'daily' && (
                <Badge variant="outline">Daily</Badge>
              )}
            </div>

            {description && (
              <p className="text-sm text-muted-foreground mb-2">{description}</p>
            )}

            {deadline && taskType === 'timeframe' && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Due: {new Date(deadline).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Delete button */}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
