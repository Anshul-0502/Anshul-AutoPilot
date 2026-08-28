import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Droplet, Moon, Activity, Flame, ShieldAlert, Award, ArrowRight, Heart } from 'lucide-react';

const HealthDashboard = ({ data, onTriggerTab, onQuickHydrate }) => {
  const { waterIntake, waterGoal, sleepQuality, sleepTime, wakeTime, habits, workouts } = data;

  const todayStr = new Date().toISOString().split('T')[0];
  const completedHabits = habits.filter(h => !!h.history[todayStr]).length;
  const totalHabits = habits.length;

  // Calculate Today's Wellness Score (out of 100)
  const waterPct = Math.min(100, (waterIntake / waterGoal) * 100);
  const habitsPct = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 75;
  const workoutLogged = workouts.length > 0 ? 100 : 0;
  
  const wellnessScore = Math.min(100, Math.max(10, Math.round(
    (waterPct * 0.25) + 
    (sleepQuality * 0.35) + 
    (habitsPct * 0.25) + 
    (workoutLogged * 0.15)
  ))) || 78;

  const getWellnessTier = (score) => {
    if (score < 40) return { name: 'Rest Mode Required', color: 'var(--color-danger)', desc: 'Hydration and sleep levels are critical. Rest and drink some water!' };
    if (score < 70) return { name: 'Active Recovery', color: 'var(--color-accent)', desc: 'Solid consistency. Drink water and complete daily stretches.' };
    return { name: 'Optimal Energy Balance', color: 'var(--color-success)', desc: 'Excellent physical and mental metrics! Keep it up!' };
  };
  const tier = getWellnessTier(wellnessScore);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
        
        {/* Wellness Score Card */}
        <div style={{ gridColumn: 'span 5' }} className="col-span-desktop-12">
          <Card
            hoverable={false}
            style={{
              padding: '24px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(10, 15, 29, 0.25) 100%)',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Wellness Balance Score
            </span>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="120" height="120">
                <circle cx="60" cy="60" r="50" fill="transparent" stroke="var(--glass-border)" strokeWidth="8" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="transparent"
                  stroke={tier.color}
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={2 * Math.PI * 50 - (wellnessScore / 100) * (2 * Math.PI * 50)}
                  style={{ strokeLinecap: 'round', transform: 'rotate(-90deg)', transformOrigin: '60px 60px', transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{wellnessScore}%</span>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700 }}>Grade</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: tier.color, display: 'block' }}>
                {tier.name}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {tier.desc}
              </span>
            </div>
          </Card>
        </div>

        {/* Quick Stats Grid */}
        <div style={{ gridColumn: 'span 7' }} className="col-span-desktop-12">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            height: '100%'
          }} className="flex-col-mobile">
            
            {/* Water widget */}
            <div style={{
              background: 'var(--glass-card-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--color-secondary)', display: 'flex' }}>
                  <Droplet size={18} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Water Tracker</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {waterIntake} / {waterGoal} Cups
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={onQuickHydrate}
                  disabled={waterIntake >= waterGoal}
                  style={{ height: '26px', fontSize: '0.75rem', padding: '0 8px' }}
                >
                  +1 Cup
                </Button>
                <button 
                  onClick={() => onTriggerTab('water')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '2px', marginLeft: 'auto' }}
                >
                  Details <ArrowRight size={10} />
                </button>
              </div>
            </div>

            {/* Sleep widget */}
            <div style={{
              background: 'var(--glass-card-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', borderRadius: '50%', background: 'var(--color-primary-glow)', color: 'var(--color-primary)', display: 'flex' }}>
                  <Moon size={18} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sleep Tracker</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {sleepTime} - {wakeTime}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Quality: {sleepQuality}%</span>
                <button 
                  onClick={() => onTriggerTab('sleep')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  Log sleep <ArrowRight size={10} />
                </button>
              </div>
            </div>

            {/* Workout widget */}
            <div style={{
              background: 'var(--glass-card-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', display: 'flex' }}>
                  <Activity size={18} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Workout Log</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {workouts.length > 0 ? `${workouts.length} Tracked` : 'No Workouts'}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  {workouts[0] ? `${workouts[0].type} (${workouts[0].duration}m)` : 'Exercise to stay fit'}
                </span>
                <button 
                  onClick={() => onTriggerTab('workouts')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  Add Log <ArrowRight size={10} />
                </button>
              </div>
            </div>

            {/* Habits widget */}
            <div style={{
              background: 'var(--glass-card-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-accent)', display: 'flex' }}>
                  <Flame size={18} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Routine Habits</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {completedHabits} / {totalHabits} Done
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Streak: {habits[1]?.streak || 5} Days</span>
                <button 
                  onClick={() => onTriggerTab('habits')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  Check Habits <ArrowRight size={10} />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Focus & Meditations promo card */}
      <Card style={{ border: '1px solid var(--glass-border)', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(14, 165, 233, 0.05) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }} className="flex-col-mobile">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Heart size={32} style={{ color: 'var(--color-primary)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Pomodoro & mindfulness Session</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Start Pomodoro focus timers or guided breathing meditation to balance academic fatigue.
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="primary" onClick={() => onTriggerTab('focus')} style={{ height: '32px', fontSize: '0.8rem' }}>
              Start Focus
            </Button>
            <Button variant="glass" onClick={() => onTriggerTab('meditation')} style={{ height: '32px', fontSize: '0.8rem' }}>
              Meditate
            </Button>
          </div>
        </div>
      </Card>

    </div>
  );
};

export default HealthDashboard;
