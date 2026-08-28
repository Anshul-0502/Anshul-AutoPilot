import React from 'react';
import Card from '../../components/Card';
import { LineChart, BarChart, DoughnutChart } from '../analytics/Charts';
import { Heart, Droplet, Moon, Award } from 'lucide-react';

const HealthAnalytics = ({ data }) => {
  const { waterIntake, waterGoal, sleepQuality, sleepHistory = [], habits = [], workouts = [] } = data;

  // Convert sleep history to Line chart
  const sleepChartData = sleepHistory.map(h => ({
    label: h.day,
    value: h.hours
  }));

  // Mock weekly water intake data
  const waterChartData = [
    { label: 'Mon', value: 6 },
    { label: 'Tue', value: 8 },
    { label: 'Wed', value: 7 },
    { label: 'Thu', value: 8 },
    { label: 'Fri', value: 5 },
    { label: 'Sat', value: 6 },
    { label: 'Sun', value: waterIntake }
  ];

  // Calculate habit completions splits
  const todayStr = new Date().toISOString().split('T')[0];
  const completedCount = habits.filter(h => !!h.history[todayStr]).length;
  const pendingCount = habits.length - completedCount;

  const habitData = [
    { label: 'Completed', value: completedCount, color: 'var(--color-success)' },
    { label: 'Pending', value: pendingCount, color: 'var(--glass-border-hover)' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
      
      {/* Upper Metrics Grid */}
      <div style={{ gridColumn: 'span 12' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px'
        }} className="flex-col-mobile">
          <div style={{ background: 'var(--glass-card-bg)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>Sleep Quality index</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)' }}>{sleepQuality}%</span>
          </div>
          <div style={{ background: 'var(--glass-card-bg)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>Weekly Water Avg</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-secondary)' }}>6.5 Cups</span>
          </div>
          <div style={{ background: 'var(--glass-card-bg)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>Weekly Workouts</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-success)' }}>{workouts.length} Times</span>
          </div>
        </div>
      </div>

      {/* Sleep line chart */}
      <div style={{ gridColumn: 'span 8' }} className="col-span-desktop-12">
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Moon size={16} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Sleep Recovery Duration (Hours)</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ padding: '10px 0' }}>
            <LineChart data={sleepChartData} height={150} color="var(--color-primary)" />
          </div>
        </Card>
      </div>

      {/* Habits progress circle */}
      <div style={{ gridColumn: 'span 4' }} className="col-span-desktop-12">
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={16} style={{ color: 'var(--color-success)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Today's Habits Ratio</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ padding: '10px 0' }}>
            <DoughnutChart data={habitData} size={110} />
          </div>
        </Card>
      </div>

      {/* Hydration Bar chart */}
      <div style={{ gridColumn: 'span 12' }}>
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Droplet size={16} style={{ color: 'var(--color-secondary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Hydration Level (Glasses logged weekly)</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ padding: '10px 0' }}>
            <BarChart data={waterChartData} height={130} color="var(--color-secondary)" />
          </div>
        </Card>
      </div>

    </div>
  );
};

export default HealthAnalytics;
