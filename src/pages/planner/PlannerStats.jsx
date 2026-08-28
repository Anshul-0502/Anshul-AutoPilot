import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';

const PlannerStats = ({ events }) => {
  // Calculate stats from events
  const totalDuration = events.reduce((sum, evt) => sum + (evt.duration || 0), 0);
  const totalHours = (totalDuration / 60).toFixed(1);

  // Group durations by category
  const categories = {
    study: 0,
    coding: 0,
    project: 0,
    break: 0,
    meeting: 0
  };

  events.forEach(evt => {
    if (categories[evt.category] !== undefined) {
      categories[evt.category] += evt.duration || 0;
    }
  });

  // Data for chart
  const data = [
    { name: 'Study', value: categories.study, color: 'var(--color-primary)' },
    { name: 'Coding', value: categories.coding, color: 'var(--color-success)' },
    { name: 'Project', value: categories.project, color: 'var(--color-secondary)' },
    { name: 'Break', value: categories.break, color: 'var(--color-accent)' },
    { name: 'Meeting', value: categories.meeting, color: 'var(--color-danger)' }
  ].filter(d => d.value > 0);

  return (
    <Card
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Schedule Breakdowns
          </span>
          <span style={{
            background: 'var(--color-primary-glow)',
            color: 'var(--color-primary)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: 600
          }}>
            Total: {totalHours}h
          </span>
        </div>
      }
      style={{ height: '100%' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
        {/* Progress Bars for category allocations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <span>Study Hours Allocation</span>
              <span style={{ fontWeight: 600 }}>{(categories.study / 60).toFixed(1)}h</span>
            </div>
            <ProgressBar value={totalDuration > 0 ? (categories.study / totalDuration) * 100 : 0} showLabel={false} color="var(--color-primary)" height="5px" />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <span>Coding & DSA Sched</span>
              <span style={{ fontWeight: 600 }}>{(categories.coding / 60).toFixed(1)}h</span>
            </div>
            <ProgressBar value={totalDuration > 0 ? (categories.coding / totalDuration) * 100 : 0} showLabel={false} color="var(--color-success)" height="5px" />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <span>Project Work Hours</span>
              <span style={{ fontWeight: 600 }}>{(categories.project / 60).toFixed(1)}h</span>
            </div>
            <ProgressBar value={totalDuration > 0 ? (categories.project / totalDuration) * 100 : 0} showLabel={false} color="var(--color-secondary)" height="5px" />
          </div>
        </div>

        {/* Dynamic breakdown message */}
        <div style={{
          background: 'var(--glass-btn-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '10px 12px',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          fontStyle: 'italic',
          marginTop: '6px'
        }}>
          {totalDuration === 0 
            ? 'No activities scheduled. Add items to calculate metrics.' 
            : `Your schedule is allocated mostly to Study (${((categories.study / totalDuration) * 100).toFixed(0)}%).`}
        </div>
      </div>
    </Card>
  );
};

export default PlannerStats;
