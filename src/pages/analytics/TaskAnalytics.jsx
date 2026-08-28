import React from 'react';
import Card from '../../components/Card';
import { LineChart, DoughnutChart, BarChart } from './Charts';
import { ClipboardList, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const TaskAnalytics = ({ data, filter }) => {
  const { total, completed, pending, overdue, completionRate, avgMinutes, productiveDay } = data;

  // Mock priorities split
  const priorityData = [
    { label: 'Critical', value: 2, color: 'var(--color-danger)' },
    { label: 'High', value: 6, color: 'var(--color-accent)' },
    { label: 'Medium', value: 10, color: 'var(--color-primary)' },
    { label: 'Low', value: 7, color: 'var(--color-success)' }
  ];

  // Productive day completes
  const productiveDayData = [
    { label: 'Mon', value: 3 },
    { label: 'Tue', value: 4 },
    { label: 'Wed', value: 6 }, // Peak Day
    { label: 'Thu', value: 2 },
    { label: 'Fri', value: 3 },
    { label: 'Sat', value: 1 },
    { label: 'Sun', value: 2 }
  ];

  // Daily completes line chart values
  const getTaskCompletesData = () => {
    if (filter === 'Daily') {
      return [
        { label: '8 AM', value: 0 },
        { label: '12 PM', value: 2 },
        { label: '4 PM', value: 1 },
        { label: '8 PM', value: 3 },
        { label: '10 PM', value: 1 }
      ];
    }
    if (filter === 'Monthly') {
      return [
        { label: 'Week 1', value: 5 },
        { label: 'Week 2', value: 4 },
        { label: 'Week 3', value: 7 },
        { label: 'Week 4', value: completed }
      ];
    }
    if (filter === 'Yearly') {
      return [
        { label: 'Q1', value: 38 },
        { label: 'Q2', value: 45 },
        { label: 'Q3', value: 50 },
        { label: 'Q4', value: completed }
      ];
    }
    // Default: Weekly
    return [
      { label: 'Mon', value: 3 },
      { label: 'Tue', value: 4 },
      { label: 'Wed', value: 6 },
      { label: 'Thu', value: 2 },
      { label: 'Fri', value: 3 },
      { label: 'Sat', value: 1 },
      { label: 'Sun', value: 2 }
    ];
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
      
      {/* Metrics Row */}
      <div style={{ gridColumn: 'span 3' }} className="col-span-desktop-6 col-span-mobile-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-primary-glow)', color: 'var(--color-primary)', display: 'flex' }}>
              <ClipboardList size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Tasks</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{total} Tasks</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 3' }} className="col-span-desktop-6 col-span-mobile-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', display: 'flex' }}>
              <CheckCircle2 size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Completed</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{completed} Tasks</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 3' }} className="col-span-desktop-6 col-span-mobile-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-primary-glow)', color: 'var(--color-secondary)', display: 'flex' }}>
              <Clock size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Pending</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{pending} Tasks</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 3' }} className="col-span-desktop-6 col-span-mobile-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', display: 'flex' }}>
              <AlertCircle size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Overdue</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{overdue} Tasks</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Line Chart (Completion Volume) */}
      <div style={{ gridColumn: 'span 8' }} className="col-span-desktop-12">
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Task Completions Volume ({filter})</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ padding: '10px 0' }}>
            <LineChart data={getTaskCompletesData()} height={150} color="var(--color-success)" />
          </div>
        </Card>
      </div>

      {/* Doughnut Chart (Priority Distribution) */}
      <div style={{ gridColumn: 'span 4' }} className="col-span-desktop-12">
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} style={{ color: 'var(--color-accent)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Priority Levels</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ padding: '10px 0' }}>
            <DoughnutChart data={priorityData} size={110} />
          </div>
        </Card>
      </div>

      {/* Productive Day Bar Chart */}
      <div style={{ gridColumn: 'span 12' }}>
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ClipboardList size={16} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Productivity Distribution by Weekday (Target 6 max)</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ padding: '10px 0' }}>
            <BarChart data={productiveDayData} height={130} color="var(--color-primary)" />
          </div>
        </Card>
      </div>

    </div>
  );
};

export default TaskAnalytics;
