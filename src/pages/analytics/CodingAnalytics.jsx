import React from 'react';
import Card from '../../components/Card';
import { LineChart, DoughnutChart, BarChart } from './Charts';
import { Code, Trophy, Target, Flame, Cpu } from 'lucide-react';

const CodingAnalytics = ({ data, filter }) => {
  const { totalHours, problemsSolved, streak, accuracy, languages = {}, difficulty = {} } = data;

  // Prepare Doughnut Chart Data from languages
  const colors = ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-accent)'];
  const languageData = Object.entries(languages).map(([lang, val], idx) => ({
    label: lang,
    value: val,
    color: colors[idx % colors.length]
  }));

  // Prepare Bar Chart Data from difficulties
  const difficultyData = Object.entries(difficulty).map(([diff, val]) => ({
    label: diff,
    value: val
  }));

  // Prepare Line Chart Data (Coding Hours)
  const getCodingTimeData = () => {
    if (filter === 'Daily') {
      return [
        { label: '8 AM', value: 0 },
        { label: '12 PM', value: 0.5 },
        { label: '4 PM', value: 0 },
        { label: '8 PM', value: 1.5 },
        { label: '10 PM', value: 1.0 }
      ];
    }
    if (filter === 'Monthly') {
      return [
        { label: 'Week 1', value: 4 },
        { label: 'Week 2', value: 5 },
        { label: 'Week 3', value: 3 },
        { label: 'Week 4', value: totalHours }
      ];
    }
    if (filter === 'Yearly') {
      return [
        { label: 'Q1', value: 30 },
        { label: 'Q2', value: 45 },
        { label: 'Q3', value: 25 },
        { label: 'Q4', value: totalHours }
      ];
    }
    // Default: Weekly
    return [
      { label: 'Mon', value: 1.5 },
      { label: 'Tue', value: 2.0 },
      { label: 'Wed', value: 3.5 },
      { label: 'Thu', value: 0.8 },
      { label: 'Fri', value: 2.5 },
      { label: 'Sat', value: 1.0 },
      { label: 'Sun', value: Math.round((totalHours * 0.25) * 10) / 10 || 2.0 }
    ];
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
      
      {/* Metrics Row */}
      <div style={{ gridColumn: 'span 3' }} className="col-span-desktop-6 col-span-mobile-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-primary-glow)', color: 'var(--color-primary)', display: 'flex' }}>
              <Code size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Coding Hours</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{totalHours} hrs</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 3' }} className="col-span-desktop-6 col-span-mobile-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-primary-glow)', color: 'var(--color-secondary)', display: 'flex' }}>
              <Cpu size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Solved Count</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{problemsSolved} Tasks</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 3' }} className="col-span-desktop-6 col-span-mobile-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', display: 'flex' }}>
              <Target size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Accuracy Rate</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{accuracy}%</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 3' }} className="col-span-desktop-6 col-span-mobile-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-accent)', display: 'flex' }}>
              <Flame size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Coding Streak</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{streak} Days</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Line Chart (Hours Study) */}
      <div style={{ gridColumn: 'span 8' }} className="col-span-desktop-12">
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code size={16} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Coding Focus Time ({filter})</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ padding: '10px 0' }}>
            <LineChart data={getCodingTimeData()} height={150} color="var(--color-primary)" />
          </div>
        </Card>
      </div>

      {/* Doughnut Chart (Languages) */}
      <div style={{ gridColumn: 'span 4' }} className="col-span-desktop-12">
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={16} style={{ color: 'var(--color-secondary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Stack Percentage</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ padding: '10px 0' }}>
            <DoughnutChart data={languageData} size={110} />
          </div>
        </Card>
      </div>

      {/* Difficulty Bar Chart */}
      <div style={{ gridColumn: 'span 12' }}>
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={16} style={{ color: 'var(--color-accent)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Solved Difficulties</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ padding: '10px 0' }}>
            <BarChart data={difficultyData} height={130} color="var(--color-accent)" />
          </div>
        </Card>
      </div>

    </div>
  );
};

export default CodingAnalytics;
