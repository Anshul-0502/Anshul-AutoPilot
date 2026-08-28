import React from 'react';
import Card from '../../components/Card';
import { BarChart, ActivityHeatmap } from './Charts';
import { Target, CheckCircle2, AlertTriangle, Calendar, Flame } from 'lucide-react';

const GoalAnalytics = ({ data, filter }) => {
  const { successRate, completedGoals, missedGoals, streak } = data;

  // Goals completions per week
  const goalCompletionsData = [
    { label: 'Week 1', value: 2 },
    { label: 'Week 2', value: 3 },
    { label: 'Week 3', value: 4 },
    { label: 'Week 4', value: completedGoals }
  ];

  // Mock heatmap intensity layout logs
  const heatmapData = {
    '0-1': 2, '0-4': 4, '1-2': 1, '1-5': 3, '2-2': 4, '2-3': 2, '3-1': 3, '3-6': 2,
    '4-0': 1, '4-4': 4, '5-2': 3, '5-5': 2, '6-3': 4, '7-1': 2, '7-5': 1, '8-2': 4,
    '9-0': 3, '9-4': 2, '10-2': 1, '10-5': 4, '11-1': 3, '11-6': 2
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
      
      {/* Metrics Row */}
      <div style={{ gridColumn: 'span 3' }} className="col-span-desktop-6 col-span-mobile-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-primary-glow)', color: 'var(--color-primary)', display: 'flex' }}>
              <Target size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Success Ratio</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{successRate}%</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 3' }} className="col-span-desktop-6 col-span-mobile-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-primary-glow)', color: 'var(--color-secondary)', display: 'flex' }}>
              <CheckCircle2 size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Targets Met</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{completedGoals} Met</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 3' }} className="col-span-desktop-6 col-span-mobile-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', display: 'flex' }}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Missed Targets</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{missedGoals} Missed</span>
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
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Consistency</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{streak} Day streak</span>
            </div>
          </div>
        </Card>
      </div>

      {/* GitHub-style Activity Heatmap Card */}
      <div style={{ gridColumn: 'span 12' }}>
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Consistency Matrix Grid (Last 12 Weeks)</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ padding: '10px 0' }}>
            <ActivityHeatmap data={heatmapData} />
          </div>
        </Card>
      </div>

      {/* Bar Chart (Goals completions progress) */}
      <div style={{ gridColumn: 'span 12' }}>
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={16} style={{ color: 'var(--color-secondary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Monthly Targets Completion Trend</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ padding: '10px 0' }}>
            <BarChart data={goalCompletionsData} height={120} color="var(--color-secondary)" />
          </div>
        </Card>
      </div>

    </div>
  );
};

export default GoalAnalytics;
