import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { CheckCircle2, Circle, Code, HelpCircle, Shuffle, Gamepad2, ArrowRight } from 'lucide-react';

const DailyChallenges = ({ completed = [], onTriggerTab }) => {
  const challenges = [
    {
      id: 'code',
      title: 'DSA: Reverse a Linked List',
      desc: 'Coding Arena',
      xp: 100,
      coins: 20,
      icon: <Code size={16} />,
      color: 'var(--color-primary)',
      tabId: 'code'
    },
    {
      id: 'quiz',
      title: 'Quiz: OS Thread Concurrency',
      desc: 'Quiz Arena',
      xp: 80,
      coins: 15,
      icon: <HelpCircle size={16} />,
      color: 'var(--color-secondary)',
      tabId: 'quiz'
    },
    {
      id: 'logic',
      title: 'Logic: Card Symbol Match',
      desc: 'Logic Arena',
      xp: 90,
      coins: 15,
      icon: <Shuffle size={16} />,
      color: 'var(--color-accent)',
      tabId: 'logic'
    },
    {
      id: 'brain',
      title: 'Brain: Visual Math Sprint',
      desc: 'Brain Hub',
      xp: 80,
      coins: 15,
      icon: <Gamepad2 size={16} />,
      color: 'var(--color-success)',
      tabId: 'brain'
    }
  ];

  const completedCount = completed.length;
  const progressPercent = Math.round((completedCount / 4) * 100);

  return (
    <Card 
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>🔥 Daily Challenges</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{completedCount}/4 Done</span>
        </div>
      }
      style={{ height: '100%', border: '1px solid var(--glass-border)' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
        
        {/* Progress summary bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            <span>Daily Completion</span>
            <span>{progressPercent}%</span>
          </div>
          <div style={{ height: '6px', background: 'var(--glass-border)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: progressPercent === 100 
                ? 'var(--color-success)' 
                : 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
              transition: 'width 0.3s ease'
            }} />
          </div>
          {progressPercent === 100 && (
            <span style={{ fontSize: '0.7rem', color: 'var(--color-success)', fontWeight: 700, marginTop: '2px', display: 'block' }}>
              🎉 Perfect Day! +100 XP & +50 Coins Perfect Bonus Added!
            </span>
          )}
        </div>

        {/* Challenge stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {challenges.map(chal => {
            const isDone = completed.includes(chal.id);
            return (
              <div
                key={chal.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  background: isDone ? 'rgba(16, 185, 129, 0.03)' : 'var(--glass-btn-bg)',
                  border: isDone ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--glass-border)',
                  borderRadius: '10px',
                  transition: 'all 0.2s ease',
                  opacity: isDone ? 0.85 : 1
                }}
              >
                {/* Checked Icon */}
                <div style={{ display: 'flex', cursor: 'pointer', color: isDone ? 'var(--color-success)' : 'var(--text-muted)' }}>
                  {isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </div>

                {/* Info */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {chal.title}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: chal.color, display: 'flex' }}>{chal.icon}</span>
                    {chal.desc}
                  </span>
                </div>

                {/* Reward / Action */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  {!isDone ? (
                    <button
                      onClick={() => onTriggerTab(chal.tabId)}
                      style={{
                        padding: '4px 8px',
                        background: 'var(--color-primary-glow)',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'var(--color-primary)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                      className="hover-scale"
                    >
                      Play <ArrowRight size={10} />
                    </button>
                  ) : (
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: 'var(--color-success)',
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      +{chal.xp} XP
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </Card>
  );
};

export default DailyChallenges;
