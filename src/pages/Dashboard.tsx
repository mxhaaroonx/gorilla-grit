import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { GorillaMascot } from '@/components/GorillaMascot';
import { XPBar } from '@/components/XPBar';
import { StreakCounter } from '@/components/StreakCounter';
import { TaskCard, TaskDifficulty, TaskType } from '@/components/TaskCard';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { Button } from '@/components/ui/button';
import { LogOut, Trophy, Swords } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  xp: number;
  level: number;
  current_streak: number;
  gorilla_mood: 'happy' | 'neutral' | 'sad';
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  difficulty: TaskDifficulty;
  task_type: TaskType;
  deadline: string | null;
  is_active: boolean;
}

interface TaskCompletion {
  task_id: string;
  completed_at: string;
}

const XP_VALUES = { easy: 10, medium: 25, hard: 50 };

export default function Dashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completions, setCompletions] = useState<TaskCompletion[]>([]);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('xp, level, current_streak, gorilla_mood')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData as Profile);
      }

      // Fetch tasks
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (tasksData) {
        setTasks(tasksData as Task[]);
      }

      // Fetch today's completions
      const today = new Date().toISOString().split('T')[0];
      const { data: completionsData } = await supabase
        .from('task_completions')
        .select('task_id, completed_at')
        .eq('user_id', user.id)
        .gte('completed_at', `${today}T00:00:00`)
        .lte('completed_at', `${today}T23:59:59`);

      if (completionsData) {
        setCompletions(completionsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData: {
    title: string;
    description: string;
    difficulty: TaskDifficulty;
    taskType: TaskType;
    deadline?: string;
  }) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        title: taskData.title,
        description: taskData.description || null,
        difficulty: taskData.difficulty,
        task_type: taskData.taskType,
        deadline: taskData.deadline || null,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      });
      return;
    }

    setTasks((prev) => [data as Task, ...prev]);
    toast({
      title: 'Task created!',
      description: 'Your gorilla is ready to work 💪',
    });
  };

  const handleCompleteTask = async (taskId: string) => {
    if (!user || !profile) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const xpEarned = XP_VALUES[task.difficulty];

    // Create completion record
    const { error: completionError } = await supabase
      .from('task_completions')
      .insert({
        task_id: taskId,
        user_id: user.id,
        xp_earned: xpEarned,
      });

    if (completionError) {
      toast({
        title: 'Error',
        description: 'Failed to complete task',
        variant: 'destructive',
      });
      return;
    }

    // Update profile XP
    const newXp = profile.xp + xpEarned;
    const xpForLevel = profile.level * 100;
    const levelUp = newXp >= xpForLevel;
    const newLevel = levelUp ? profile.level + 1 : profile.level;
    const remainingXp = levelUp ? newXp - xpForLevel : newXp;

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        xp: remainingXp,
        level: newLevel,
        gorilla_mood: 'happy',
        last_task_completed_date: new Date().toISOString().split('T')[0],
      })
      .eq('user_id', user.id);

    if (profileError) {
      console.error('Profile update error:', profileError);
    }

    // Update local state
    setCompletions((prev) => [...prev, { task_id: taskId, completed_at: new Date().toISOString() }]);
    setProfile((prev) => prev ? { ...prev, xp: remainingXp, level: newLevel, gorilla_mood: 'happy' } : null);

    // Trigger celebration
    setIsCelebrating(true);
    setTimeout(() => setIsCelebrating(false), 600);

    toast({
      title: levelUp ? '🎉 Level Up!' : '✅ Task Complete!',
      description: `+${xpEarned} XP earned!${levelUp ? ` You're now level ${newLevel}!` : ''}`,
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      });
      return;
    }

    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const isTaskCompleted = (taskId: string) => {
    return completions.some((c) => c.task_id === taskId);
  };

  const dailyTasks = tasks.filter((t) => t.task_type === 'daily');
  const timeframeTasks = tasks.filter((t) => t.task_type === 'timeframe');

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-jungle-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce-gentle mb-4">🦍</div>
          <p className="text-muted-foreground font-display">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jungle-gradient">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
            <span>🦍</span> GorillaDo
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
              <Trophy className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate('/boss')}>
              <Swords className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Gorilla Section */}
        <section className="flex flex-col items-center mb-8">
          <GorillaMascot
            mood={profile?.gorilla_mood || 'neutral'}
            level={profile?.level || 1}
            isCelebrating={isCelebrating}
          />
          <div className="mt-4 w-full max-w-md">
            <XPBar currentXP={profile?.xp || 0} level={profile?.level || 1} />
          </div>
          <div className="mt-4">
            <StreakCounter streak={profile?.current_streak || 0} />
          </div>
        </section>

        {/* Add Task */}
        <section className="flex justify-center mb-8">
          <AddTaskDialog onAddTask={handleAddTask} />
        </section>

        {/* Daily Tasks */}
        <section className="mb-8">
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            📅 Daily Tasks
            <span className="text-sm font-normal text-muted-foreground">
              ({dailyTasks.filter((t) => isTaskCompleted(t.id)).length}/{dailyTasks.length})
            </span>
          </h2>
          <div className="space-y-3">
            {dailyTasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No daily tasks yet. Add one to get started!
              </p>
            ) : (
              dailyTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description || undefined}
                  difficulty={task.difficulty}
                  taskType={task.task_type}
                  isCompleted={isTaskCompleted(task.id)}
                  onComplete={handleCompleteTask}
                  onDelete={handleDeleteTask}
                />
              ))
            )}
          </div>
        </section>

        {/* Time-frame Tasks */}
        {timeframeTasks.length > 0 && (
          <section>
            <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
              🎯 One-time Tasks
            </h2>
            <div className="space-y-3">
              {timeframeTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description || undefined}
                  difficulty={task.difficulty}
                  taskType={task.task_type}
                  deadline={task.deadline || undefined}
                  isCompleted={isTaskCompleted(task.id)}
                  onComplete={handleCompleteTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
