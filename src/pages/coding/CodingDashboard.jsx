import React from 'react';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import { Flame, Clock, CheckCircle, Code, Award, Timer, ChevronRight } from 'lucide-react';

const CodingDashboard = ({ stats, goals, activeSession, onNavigate }) => {
  const solvedCount = stats?.solvedCount || 0;
  const codingHours = stats?.codingHours || 0;
  const currentStreak = stats?.currentStreak || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'var(--color-primary-glow)',
        border: '1px solid var(--glass-border)',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 800 }}>
            Welcome to the Coding Workspace!
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Practice DSA, save helper snippets, review interview questions, and build consistency.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', padding: '6px 12px', borderRadius: '20px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Flame size={12} style={{ color: 'var(--color-accent)', fill: 'var(--color-accent)' }} />
            Streak: {currentStreak} Days
          </span>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        {/* Problems Solved */}
        <Card hoverable={true} onClick={() => onNavigate('dsa')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ 
              background: 'var(--color-primary-glow)', 
              color: 'var(--color-success)', 
              padding: '10px', 
              borderRadius: '8px',
              display: 'flex'
            }}>
              <CheckCircle size={20} />
            </span>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>DSA Solved</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{solvedCount} Problems</span>
            </div>
          </div>
        </Card>

        {/* Coding Hours */}
        <Card hoverable={true} onClick={() => onNavigate('timer')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ 
              background: 'var(--color-primary-glow)', 
              color: 'var(--color-primary)', 
              padding: '10px', 
              borderRadius: '8px',
              display: 'flex'
            }}>
              <Clock size={20} />
            </span>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Coding Time</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{codingHours.toFixed(1)} Hrs</span>
            </div>
          </div>
        </Card>

        {/* Active Session Info */}
        <Card hoverable={true} onClick={() => onNavigate('timer')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ 
              background: 'var(--color-primary-glow)', 
              color: 'var(--color-secondary)', 
              padding: '10px', 
              borderRadius: '8px',
              display: 'flex'
            }}>
              <Timer size={20} />
            </span>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Active Session</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                {activeSession ? `${activeSession.type}` : 'No Active Session'}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Goals & Quick Actions Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', flexWrap: 'wrap' }}>
        {/* Active Coding Goals */}
        <Card
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Active Coding Goals</span>
              <span 
                onClick={() => onNavigate('goals')}
                style={{ fontSize: '0.75rem', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}
              >
                Manage Goals <ChevronRight size={14} />
              </span>
            </div>
          }
          hoverable={false}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '180px' }}>
            {goals.filter(g => !g.completed).slice(0, 3).map((goal) => (
              <div key={goal.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span>{goal.title}</span>
                  <span style={{ fontWeight: 600 }}>{goal.progress}%</span>
                </div>
                <ProgressBar value={goal.progress} color="var(--color-primary)" height="6px" />
              </div>
            ))}
            {goals.filter(g => !g.completed).length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Award size={28} style={{ color: 'var(--color-accent)', marginBottom: '8px' }} />
                <span>All active goals achieved! Create new goals.</span>
              </div>
            )}
          </div>
        </Card>

        {/* Quick prep / links */}
        <Card
          header={<span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Quick Coding Actions</span>}
          hoverable={false}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', justifyContent: 'center' }}>
            {[
              { label: 'Register Solved DSA', tab: 'dsa', icon: <Code size={14} /> },
              { label: 'Saved Code Snippets', tab: 'snippets', icon: <Code size={14} /> },
              { label: 'Interview Checklist', tab: 'interview', icon: <Award size={14} /> }
            ].map((act, index) => (
              <div 
                key={index}
                onClick={() => onNavigate(act.tab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: 'var(--glass-btn-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}
                className="hover-scale"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {act.icon}
                  <span>{act.label}</span>
                </div>
                <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CodingDashboard;
