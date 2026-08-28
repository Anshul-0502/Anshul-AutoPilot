import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, ArrowRight, Trophy, Zap, Target, CheckCircle2 } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const getLevelInfo = (xp) => {
  if (xp < 200) return { level: 1, name: 'Novice' };
  if (xp < 500) return { level: 2, name: 'Code Initiate' };
  if (xp < 1000) return { level: 3, name: 'Algorithm Student' };
  if (xp < 2000) return { level: 4, name: 'Code Apprentice' };
  if (xp < 4000) return { level: 5, name: 'Logic Specialist' };
  return { level: 6, name: 'Master Developer' };
};

const SkillArenaWidget = () => {
  const navigate = useNavigate();

  // Load live skill state from localStorage
  const [skillData, setSkillData] = React.useState(() => {
    const saved = localStorage.getItem('anshul_autopilot_skill_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return { xp: 1240, level: 4, completedChallenges: [] };
  });

  // Re-read local storage on focus/mount
  React.useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('anshul_autopilot_skill_data');
      if (saved) {
        try {
          setSkillData(JSON.parse(saved));
        } catch (e) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    // Trigger read initially
    handleStorageChange();
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const levelInfo = getLevelInfo(skillData.xp);

  // Dynamic game/skill challenges
  const challenges = [
    { type: 'code', title: 'DSA: Reverse a Linked List', xp: '+100 XP', icon: <Zap size={14} />, color: 'var(--color-primary)' },
    { type: 'quiz', title: 'Quiz: OS Thread Concurrency', xp: '+80 XP', icon: <Target size={14} />, color: 'var(--color-secondary)' },
  ];

  return (
    <Card
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Gamepad2 size={18} style={{ color: 'var(--color-accent)' }} />
            <span>Skill Arena Dashboard</span>
          </div>
          <Button 
            variant="glass" 
            size="sm" 
            onClick={() => navigate('/games')}
            style={{ padding: '2px 8px', fontSize: '0.8rem', height: '28px' }}
          >
            Enter Arena
          </Button>
        </div>
      }
      style={{ height: '100%', border: '1px solid var(--glass-border)' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', textAlign: 'left' }}>
        {/* Banner with Rank/XP info */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(10, 15, 29, 0.2) 100%)',
          border: '1px solid var(--glass-border)',
          borderRadius: '10px',
          padding: '12px 14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Trophy size={20} style={{ color: 'var(--color-accent)' }} />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Current Level</span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Lvl {levelInfo.level}: {levelInfo.name}
              </span>
            </div>
          </div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {skillData.xp.toLocaleString()} XP
          </span>
        </div>

        {/* Challenge list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Today's Challenges status
          </span>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {challenges.map((chal, index) => {
              const isDone = (skillData.completedChallenges || []).includes(chal.type);
              return (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: isDone ? 'rgba(16, 185, 129, 0.03)' : 'var(--glass-btn-bg)',
                    border: isDone ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '0.85rem',
                    opacity: isDone ? 0.8 : 1
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: chal.color, background: 'var(--glass-border)', padding: '4px', borderRadius: '4px', display: 'flex' }}>
                      {chal.icon}
                    </span>
                    <span style={{ 
                      color: isDone ? 'var(--text-muted)' : 'var(--text-primary)', 
                      fontWeight: 500,
                      textDecoration: isDone ? 'line-through' : 'none'
                    }}>
                      {chal.title}
                    </span>
                  </div>
                  {isDone ? (
                    <span style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                      <CheckCircle2 size={14} /> Solved
                    </span>
                  ) : (
                    <span style={{ color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.75rem' }}>{chal.xp}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div 
          onClick={() => navigate('/games')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '6px', 
            fontSize: '0.85rem', 
            color: 'var(--color-accent)', 
            cursor: 'pointer',
            fontWeight: 500,
            padding: '4px 0'
          }}
          className="hover-scale"
        >
          <span>Go to learning games</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </Card>
  );
};

export default SkillArenaWidget;
