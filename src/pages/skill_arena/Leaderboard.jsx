import React from 'react';
import Card from '../../components/Card';
import { Medal, Trophy, User } from 'lucide-react';

const Leaderboard = ({ userXp, userLevel }) => {
  // Mock competitors + user
  const rawCompetitors = [
    { name: 'Alex Rivera', level: 8, xp: 3200, avatar: 'AR', isUser: false },
    { name: 'Sarah Connor', level: 7, xp: 2450, avatar: 'SC', isUser: false },
    { name: 'Vikram Singh', level: 5, xp: 1850, avatar: 'VS', isUser: false },
    { name: 'Emily Watson', level: 3, xp: 850, avatar: 'EW', isUser: false },
    { name: 'David Kim', level: 2, xp: 450, avatar: 'DK', isUser: false },
    { name: 'Elena Rostova', level: 6, xp: 2100, avatar: 'ER', isUser: false },
    { name: 'Anshul (You)', level: userLevel, xp: userXp, avatar: 'A', isUser: true }
  ];

  // Sort by XP desc and add ranks
  const rankedStudents = [...rawCompetitors]
    .sort((a, b) => b.xp - a.xp)
    .map((student, index) => ({
      ...student,
      rank: index + 1
    }));

  const getRankBadge = (rank) => {
    if (rank === 1) return <Medal size={16} style={{ color: '#eab308' }} />; // Gold
    if (rank === 2) return <Medal size={16} style={{ color: '#94a3b8' }} />; // Silver
    if (rank === 3) return <Medal size={16} style={{ color: '#b45309' }} />; // Bronze
    return <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>#{rank}</span>;
  };

  return (
    <Card 
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={18} style={{ color: '#eab308' }} />
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Leaderboard Ranking</span>
        </div>
      }
      style={{ border: '1px solid var(--glass-border)' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        
        {/* Table Headings */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '50px 50px 1.5fr 1fr 1fr',
          padding: '8px 12px',
          fontSize: '0.7rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          borderBottom: '1px solid var(--glass-border)'
        }}>
          <span>Rank</span>
          <span>Avatar</span>
          <span>Name</span>
          <span>Level</span>
          <span style={{ textAlign: 'right' }}>Total XP</span>
        </div>

        {/* Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {rankedStudents.map((student) => (
            <div
              key={student.name}
              style={{
                display: 'grid',
                gridTemplateColumns: '50px 50px 1.5fr 1fr 1fr',
                alignItems: 'center',
                padding: '10px 12px',
                borderRadius: '8px',
                background: student.isUser ? 'var(--color-primary-glow)' : 'transparent',
                border: student.isUser ? '1px solid var(--glass-border-hover)' : '1px solid transparent',
                fontSize: '0.85rem',
                color: student.isUser ? 'var(--color-primary)' : 'var(--text-secondary)',
                fontWeight: student.isUser ? 700 : 500
              }}
            >
              {/* Rank Badge */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {getRankBadge(student.rank)}
              </div>

              {/* Avatar Bubble */}
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: student.isUser ? 'var(--color-primary)' : 'var(--glass-border)',
                color: student.isUser ? '#fff' : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {student.isUser ? <User size={14} /> : student.avatar}
              </div>

              {/* Name */}
              <span style={{ color: 'var(--text-primary)' }}>
                {student.name}
              </span>

              {/* Level */}
              <span>
                Lvl {student.level}
              </span>

              {/* XP */}
              <span style={{ textAlign: 'right', fontWeight: 700, color: student.isUser ? 'var(--color-primary)' : 'var(--text-primary)', fontFamily: 'var(--mono)' }}>
                {student.xp.toLocaleString()} XP
              </span>

            </div>
          ))}
        </div>

      </div>
    </Card>
  );
};

export default Leaderboard;
