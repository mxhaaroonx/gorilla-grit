import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { XPBar } from '@/components/XPBar';
import { StreakCounter } from '@/components/StreakCounter';
import { ArrowLeft, Trophy, Flame, Target, Medal } from 'lucide-react';

interface Profile {
  display_name: string | null;
  xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
}

interface UserBadge {
  earned_at: string;
  badges: {
    name: string;
    description: string;
    icon: string;
  };
}

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [stats, setStats] = useState({ tasksCompleted: 0, totalXpEarned: 0 });
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
        .select('display_name, xp, level, current_streak, longest_streak')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch badges
      const { data: badgesData } = await supabase
        .from('user_badges')
        .select('earned_at, badges(name, description, icon)')
        .eq('user_id', user.id);

      if (badgesData) {
        setBadges(badgesData as unknown as UserBadge[]);
      }

      // Fetch stats
      const { data: completionsData } = await supabase
        .from('task_completions')
        .select('xp_earned')
        .eq('user_id', user.id);

      if (completionsData) {
        setStats({
          tasksCompleted: completionsData.length,
          totalXpEarned: completionsData.reduce((sum, c) => sum + c.xp_earned, 0),
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-jungle-gradient flex items-center justify-center">
        <div className="text-6xl animate-bounce-gentle">🦍</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jungle-gradient">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-secondary" /> Profile
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">🦍</div>
          <h2 className="font-display text-2xl font-bold">
            {profile?.display_name || user?.email?.split('@')[0]}
          </h2>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>

        {/* XP & Level */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <span className="font-display text-4xl font-bold text-primary">
                Level {profile?.level || 1}
              </span>
            </div>
            <XPBar currentXP={profile?.xp || 0} level={profile?.level || 1} />
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Flame className="w-8 h-8 mx-auto mb-2 text-accent" />
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className="font-display text-2xl font-bold">{profile?.current_streak || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Medal className="w-8 h-8 mx-auto mb-2 text-secondary" />
              <p className="text-sm text-muted-foreground">Best Streak</p>
              <p className="font-display text-2xl font-bold">{profile?.longest_streak || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Tasks Done</p>
              <p className="font-display text-2xl font-bold">{stats.tasksCompleted}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-xp" />
              <p className="text-sm text-muted-foreground">Total XP</p>
              <p className="font-display text-2xl font-bold">{stats.totalXpEarned}</p>
            </CardContent>
          </Card>
        </div>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              🏆 Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            {badges.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No badges yet. Defeat a boss to earn your first badge!
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center p-4 rounded-lg bg-muted"
                  >
                    <span className="text-4xl mb-2">{badge.badges.icon}</span>
                    <span className="font-display font-semibold">{badge.badges.name}</span>
                    <span className="text-xs text-muted-foreground">{badge.badges.description}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
