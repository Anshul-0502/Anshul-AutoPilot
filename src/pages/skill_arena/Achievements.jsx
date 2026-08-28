import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Award, Lock, CheckCircle, Flame, Coins, Zap, Trophy } from 'lucide-react';

const achievementList = [
  {
    id: 1,
    title: 'First Step',
    desc: 'Enter the Skill Arena and initialize your learning operating system.',
    conditionText: 'Unlocked by default',
    xpReward: 100,
    coinReward: 20,
    icon: <Zap size={20} />
  },
  {
    id: 2,
    title: 'Specialist Ascendant',
    desc: 'Reach Level 5: Logic Specialist in the Skill Arena.',
    conditionText: 'Reach Level 5',
    xpReward: 200,
    coinReward: 50,
    icon: <Trophy size={20} />
  },
  {
    id: 3,
    title: 'Activity Champion',
    desc: 'Complete 10 total games, quizzes, or coding challenges.',
    conditionText: 'Complete 10 total games',
    xpReward: 150,
    coinReward: 30,
    icon: <Award size={20} />
  },
  {
    id: 4,
    title: 'Perfect Day',
    desc: 'Complete all 4 Daily Challenges in a single day.',
    conditionText: '4 Daily Challenges done',
    xpReward: 250,
    coinReward: 50,
    icon: <CheckCircle size={20} />
  },
  {
    id: 5,
    title: 'Streak Master',
    desc: 'Maintain a 5-day active learning streak.',
    conditionText: '5 Day Streak',
    xpReward: 200,
    coinReward: 40,
    icon: <Flame size={20} />
  },
  {
    id: 6,
    title: 'Journey Begins',
    desc: 'Complete and unlock your first module node in Missions.',
    conditionText: '1 Mission Node completed',
    xpReward: 150,
    coinReward: 25,
    icon: <Award size={20} />
  }
];

const Achievements = ({ xp, level, stats, unlocked = [], claimed = [], onClaimReward, searchQuery }) => {
  
  // Helper to calculate progress for display purposes
  const getAchievementProgress = (id) => {
    switch (id) {
      case 1:
        return { current: 1, target: 1 };
      case 2:
        return { current: level, target: 5 };
      case 3:
        return { current: stats.totalGames, target: 10 };
      case 4:
        return { current: unlocked.includes(4) ? 1 : 0, target: 1 };
      case 5:
        return { current: stats.reactionTime < 300 ? 5 : 3, target: 5 }; // Mock or actual streak logic
      default:
        return { current: unlocked.includes(6) ? 1 : 0, target: 1 };
    }
  };

  const filteredAchievements = achievementList.filter(ach => 
    !searchQuery || 
    ach.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ach.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>
          Badges & Milestones Cabinet
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Unlocked: {unlocked.filter(id => id > 0).length} / {achievementList.length}
        </span>
      </div>

      {/* Grid of badges */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {filteredAchievements.map(ach => {
          const isUnlocked = unlocked.includes(ach.id);
          const isClaimed = claimed.includes(ach.id);
          const progress = getAchievementProgress(ach.id);
          const percent = Math.min(100, Math.round((progress.current / progress.target) * 100));

          return (
            <Card
              key={ach.id}
              hoverable={isUnlocked && !isClaimed}
              style={{
                padding: '16px',
                border: isClaimed 
                  ? '1px solid var(--glass-border)' 
                  : isUnlocked 
                    ? '1px solid var(--color-success)' 
                    : '1px solid var(--glass-border)',
                opacity: isUnlocked ? 1 : 0.75,
                background: isClaimed ? 'var(--glass-btn-bg)' : 'var(--glass-card-bg)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
                
                {/* Header Icon + Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    padding: '8px',
                    borderRadius: '50%',
                    background: isUnlocked ? 'var(--color-primary-glow)' : 'var(--glass-border)',
                    color: isUnlocked ? 'var(--color-primary)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isUnlocked ? ach.icon : <Lock size={16} />}
                  </div>

                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: isClaimed 
                      ? 'var(--text-muted)' 
                      : isUnlocked 
                        ? 'var(--color-success)' 
                        : 'var(--text-secondary)'
                  }}>
                    {isClaimed ? 'Claimed' : isUnlocked ? 'Claimable' : 'Locked'}
                  </span>
                </div>

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{ach.title}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>{ach.desc}</span>
                </div>

                <div style={{ flex: 1 }} />

                {/* Progress bar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                    <span>{ach.conditionText}</span>
                    <span style={{ fontWeight: 700 }}>{progress.current}/{progress.target}</span>
                  </div>
                  <div style={{ height: '4px', background: 'var(--glass-border)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${percent}%`, 
                      height: '100%', 
                      background: isClaimed ? 'var(--text-muted)' : isUnlocked ? 'var(--color-success)' : 'var(--color-primary)' 
                    }} />
                  </div>
                </div>

                {/* Claim action or Rewards display */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  borderTop: '1px solid var(--glass-border)', 
                  paddingTop: '10px',
                  marginTop: '4px' 
                }}>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Zap size={10} style={{ color: 'var(--color-primary)' }} /> +{ach.xpReward} XP
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Coins size={10} style={{ color: '#eab308' }} /> +{ach.coinReward} Coins
                    </span>
                  </div>

                  {isUnlocked && !isClaimed && (
                    <button
                      onClick={() => onClaimReward(ach.id, ach.xpReward, ach.coinReward)}
                      style={{
                        padding: '4px 8px',
                        background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
                      }}
                      className="hover-scale"
                    >
                      Claim
                    </button>
                  )}

                  {isClaimed && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Collected</span>
                  )}
                </div>

              </div>
            </Card>
          );
        })}
      </div>

    </div>
  );
};

export default Achievements;
