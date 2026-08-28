import React from 'react';
import Card from '../../components/Card';
import { LineChart, BarChart } from './Charts';
import { Heart, Droplet, Clock, Flame, Smile } from 'lucide-react';

const HabitAnalytics = ({ data, filter }) => {
  const { waterIntake, sleepHours, exercise, completionRate, streak } = data;

  // Sleep hours data
  const getSleepData = () => {
    if (filter === 'Daily') {
      return [
        { label: 'Mon', value: 7.0 },
        { label: 'Tue', value: 7.5 },
        { label: 'Wed', value: 6.5 },
        { label: 'Thu', value: 8.0 },
        { label: 'Fri', value: 7.5 }
      ];
    }
    // Default / Weekly
    return [
      { label: 'Mon', value: 7.0 },
      { label: 'Tue', value: 7.5 },
      { label: 'Wed', value: 6.8 },
      { label: 'Thu', value: 8.0 },
      { label: 'Fri', value: 7.2 },
      { label: 'Sat', value: 8.5 },
      { label: 'Sun', value: sleepHours }
    ];
  };

  // Water intake data
  const getWaterData = () => {
    return [
      { label: 'Mon', value: 5 },
      { label: 'Tue', value: 7 },
      { label: 'Wed', value: 8 }, // Target met
      { label: 'Thu', value: 6 },
      { label: 'Fri', value: 5 },
      { label: 'Sat', value: 4 },
      { label: 'Sun', value: waterIntake }
    ];
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
      
      {/* Metrics Row */}
      <div style={{ gridColumn: 'span 3' }} className="col-span-desktop-6 col-span-mobile-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-primary-glow)', color: 'var(--color-secondary)', display: 'flex' }}>
              <Droplet size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Water Intake</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{waterIntake} Glasses</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 3' }} className="col-span-desktop-6 col-span-mobile-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-primary-glow)', color: 'var(--color-primary)', display: 'flex' }}>
              <Clock size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sleep Quality</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{sleepHours} hrs</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 3' }} className="col-span-desktop-6 col-span-mobile-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', display: 'flex' }}>
              <Heart size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Habit Progress</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{completionRate}%</span>
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
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Habits Streak</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{streak} Days</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Sleep line chart */}
      <div style={{ gridColumn: 'span 6' }} className="col-span-desktop-12">
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Weekly Sleep Duration (Target 8 hrs)</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ padding: '10px 0' }}>
            <LineChart data={getSleepData()} height={140} color="var(--color-primary)" />
          </div>
        </Card>
      </div>

      {/* Water consumption bar chart */}
      <div style={{ gridColumn: 'span 6' }} className="col-span-desktop-12">
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Droplet size={16} style={{ color: 'var(--color-secondary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Weekly Water Intake (Glasses)</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ padding: '10px 0' }}>
            <BarChart data={getWaterData()} height={140} color="var(--color-secondary)" />
          </div>
        </Card>
      </div>

    </div>
  );
};

export default HabitAnalytics;
