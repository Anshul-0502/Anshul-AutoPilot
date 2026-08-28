import React from 'react';
import Card from '../../components/Card';
import { LineChart, DoughnutChart } from './Charts';
import { Gamepad2, Award, Zap, Coins } from 'lucide-react';

const SkillAnalytics = ({ data, filter }) => {
  const { xp, coins, level, challengesDone, quizAccuracy, logicScore, reactionSpeed } = data;

  // Pie chart categorizing challenges completed
  const skillCategoryData = [
    { label: 'Coding Done', value: challengesDone, color: 'var(--color-primary)' },
    { label: 'Quiz Solved', value: 4, color: 'var(--color-secondary)' },
    { label: 'Logic Play', value: 3, color: 'var(--color-accent)' },
    { label: 'Cognitive Test', value: 2, color: 'var(--color-success)' }
  ];

  // XP timeline
  const getXpGrowthData = () => {
    if (filter === 'Daily') {
      return [
        { label: '8 AM', value: Math.round(xp * 0.95) },
        { label: '12 PM', value: Math.round(xp * 0.97) },
        { label: '4 PM', value: Math.round(xp * 0.97) },
        { label: '8 PM', value: Math.round(xp * 0.99) },
        { label: '10 PM', value: xp }
      ];
    }
    if (filter === 'Monthly') {
      return [
        { label: 'Week 1', value: Math.round(xp * 0.6) },
        { label: 'Week 2', value: Math.round(xp * 0.75) },
        { label: 'Week 3', value: Math.round(xp * 0.88) },
        { label: 'Week 4', value: xp }
      ];
    }
    if (filter === 'Yearly') {
      return [
        { label: 'Q1', value: 300 },
        { label: 'Q2', value: 750 },
        { label: 'Q3', value: 1100 },
        { label: 'Q4', value: xp }
      ];
    }
    // Default: Weekly
    return [
      { label: 'Mon', value: Math.round(xp * 0.8) },
      { label: 'Tue', value: Math.round(xp * 0.85) },
      { label: 'Wed', value: Math.round(xp * 0.92) },
      { label: 'Thu', value: Math.round(xp * 0.92) },
      { label: 'Fri', value: Math.round(xp * 0.95) },
      { label: 'Sat', value: Math.round(xp * 0.98) },
      { label: 'Sun', value: xp }
    ];
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
      
      {/* Metrics Row */}
      <div style={{ gridColumn: 'span 3' }} className="col-span-desktop-6 col-span-mobile-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-primary-glow)', color: 'var(--color-primary)', display: 'flex' }}>
              <Zap size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Experience</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{xp} XP</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 3' }} className="col-span-desktop-6 col-span-mobile-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-primary-glow)', color: 'var(--color-secondary)', display: 'flex' }}>
              <Gamepad2 size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Current Rank</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>Level {level}</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 3' }} className="col-span-desktop-6 col-span-mobile-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', display: 'flex' }}>
              <Coins size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Coins Balance</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{coins} Coins</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 3' }} className="col-span-desktop-6 col-span-mobile-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-accent)', display: 'flex' }}>
              <Award size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Reaction Speed</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{reactionSpeed} ms</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Accuracy metrics card */}
      <div style={{ gridColumn: 'span 12' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px'
        }} className="flex-col-mobile">
          <div style={{ background: 'var(--glass-card-bg)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block' }}>Quiz Accuracy</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>{quizAccuracy}%</span>
          </div>
          <div style={{ background: 'var(--glass-card-bg)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block' }}>Logic Puzzle Score</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-secondary)' }}>{logicScore}/100</span>
          </div>
          <div style={{ background: 'var(--glass-card-bg)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block' }}>Arena Challenges Done</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-success)' }}>{challengesDone} Solved</span>
          </div>
        </div>
      </div>

      {/* Line Chart (XP Growth) */}
      <div style={{ gridColumn: 'span 8' }} className="col-span-desktop-12">
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Experience Growth Curve ({filter})</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ padding: '10px 0' }}>
            <LineChart data={getXpGrowthData()} height={150} color="var(--color-primary)" />
          </div>
        </Card>
      </div>

      {/* Doughnut Chart (Categories) */}
      <div style={{ gridColumn: 'span 4' }} className="col-span-desktop-12">
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Gamepad2 size={16} style={{ color: 'var(--color-secondary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Arena Categories</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ padding: '10px 0' }}>
            <DoughnutChart data={skillCategoryData} size={110} />
          </div>
        </Card>
      </div>

    </div>
  );
};

export default SkillAnalytics;
