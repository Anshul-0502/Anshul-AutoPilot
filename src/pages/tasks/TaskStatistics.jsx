import React from 'react';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';

const TaskStatistics = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Counts by priority
  const critical = tasks.filter(t => !t.completed && t.priority.toLowerCase() === 'critical').length;
  const high = tasks.filter(t => !t.completed && t.priority.toLowerCase() === 'high').length;
  const medium = tasks.filter(t => !t.completed && t.priority.toLowerCase() === 'medium').length;

  return (
    <Card
      header={
        <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Task Progress Overview
        </span>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Core Progress Bar */}
        <ProgressBar
          value={completionPct}
          color="var(--color-primary)"
          label={`${completed} of ${total} tasks completed`}
          height="8px"
        />

        {/* Breakdown Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '10px',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'var(--glass-btn-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '8px',
            padding: '8px'
          }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-danger)', fontFamily: 'var(--mono)' }}>
              {critical}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Critical</span>
          </div>

          <div style={{
            background: 'var(--glass-btn-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '8px',
            padding: '8px'
          }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-warning)', fontFamily: 'var(--mono)' }}>
              {high}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>High</span>
          </div>

          <div style={{
            background: 'var(--glass-btn-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '8px',
            padding: '8px'
          }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-info)', fontFamily: 'var(--mono)' }}>
              {medium}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Medium</span>
          </div>
        </div>

        {/* Dynamic task status helper */}
        <div style={{
          background: 'var(--glass-btn-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '10px 12px',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          textAlign: 'center'
        }}>
          {pending === 0 
            ? '🎉 All caught up! No pending tasks remaining.' 
            : `You have ${pending} tasks pending. Keep pushing!`}
        </div>
      </div>
    </Card>
  );
};

export default TaskStatistics;
