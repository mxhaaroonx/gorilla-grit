import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Swords, Shield, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  level: number;
  current_streak: number;
}

interface BossFight {
  id: string;
  boss_name: string;
  boss_max_hp: number;
  boss_current_hp: number;
  started_at: string;
  ends_at: string;
  is_active: boolean;
  is_won: boolean | null;
}

export default function BossArena() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeFight, setActiveFight] = useState<BossFight | null>(null);
  const [loading, setLoading] = useState(true);

  const canUnlockBoss = profile && profile.level >= 5 && profile.current_streak >= 5;

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
      const { data: profileData } = await supabase
        .from('profiles')
        .select('level, current_streak')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      const { data: fightData } = await supabase
        .from('boss_fights')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (fightData) {
        setActiveFight(fightData as BossFight);
      }
    } catch (error) {
      console.error('Error fetching boss data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartFight = async () => {
    if (!user || !canUnlockBoss) return;

    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + 5);

    const { data, error } = await supabase
      .from('boss_fights')
      .insert({
        user_id: user.id,
        boss_name: 'The Shadow of Sloth',
        boss_max_hp: 100,
        boss_current_hp: 100,
        ends_at: endsAt.toISOString(),
      })
      .select()
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to start boss fight',
        variant: 'destructive',
      });
      return;
    }

    setActiveFight(data as BossFight);
    toast({
      title: '⚔️ Challenge Accepted!',
      description: 'The Shadow of Sloth awaits. Complete your daily tasks to deal damage!',
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-jungle-gradient flex items-center justify-center">
        <div className="text-6xl animate-bounce-gentle">⚔️</div>
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
            <Swords className="w-6 h-6 text-destructive" /> Boss Arena
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeFight ? (
          /* Active Boss Fight */
          <Card className="max-w-lg mx-auto border-2 border-destructive/50">
            <CardHeader className="text-center">
              <div className="text-6xl mb-2">👹</div>
              <CardTitle className="font-display text-2xl text-destructive">
                {activeFight.boss_name}
              </CardTitle>
              <p className="text-muted-foreground">
                Complete all daily tasks to deal damage!
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* HP Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Boss HP</span>
                  <span className="text-sm font-bold text-destructive">
                    {activeFight.boss_current_hp} / {activeFight.boss_max_hp}
                  </span>
                </div>
                <div className="h-6 bg-muted rounded-full overflow-hidden border-2 border-destructive/30">
                  <div
                    className="h-full bg-boss-gradient transition-all duration-500"
                    style={{ width: `${(activeFight.boss_current_hp / activeFight.boss_max_hp) * 100}%` }}
                  />
                </div>
              </div>

              {/* Fight Info */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-muted rounded-lg p-4">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Your Level</p>
                  <p className="font-display text-xl font-bold">{profile?.level}</p>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <Zap className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <p className="text-sm text-muted-foreground">Days Left</p>
                  <p className="font-display text-xl font-bold">
                    {Math.max(0, Math.ceil((new Date(activeFight.ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}
                  </p>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>Complete ALL daily tasks today to deal 20 damage.</p>
                <p>Miss any task and the boss regenerates 15 HP!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Boss Unlock Screen */
          <div className="max-w-lg mx-auto text-center">
            <div className="text-8xl mb-6">👹</div>
            <h2 className="font-display text-3xl font-bold mb-2">
              The Shadow of Sloth
            </h2>
            <p className="text-muted-foreground mb-8">
              Your first challenge awaits. Prove your consistency to unlock this boss fight.
            </p>

            {/* Requirements */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Unlock Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Level 5 or higher</span>
                  <Badge variant={profile && profile.level >= 5 ? 'default' : 'secondary'}>
                    {profile?.level || 1} / 5
                  </Badge>
                </div>
                <Progress value={Math.min(((profile?.level || 1) / 5) * 100, 100)} />
                
                <div className="flex items-center justify-between">
                  <span>5-day streak</span>
                  <Badge variant={profile && profile.current_streak >= 5 ? 'default' : 'secondary'}>
                    {profile?.current_streak || 0} / 5
                  </Badge>
                </div>
                <Progress value={Math.min(((profile?.current_streak || 0) / 5) * 100, 100)} />
              </CardContent>
            </Card>

            <Button
              size="lg"
              className="font-display text-lg"
              disabled={!canUnlockBoss}
              onClick={handleStartFight}
            >
              {canUnlockBoss ? '⚔️ Challenge Boss' : '🔒 Requirements Not Met'}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
