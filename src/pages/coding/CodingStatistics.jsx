import React from 'react';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import { Flame, Clock, Award, CheckCircle2 } from 'lucide-react';

const CodingStatistics = ({ stats, languages, problems, timerLogs }) => {
  const solvedCount = stats?.solvedCount || 0;
  const codingHours = stats?.codingHours || 0;
  const currentStreak = stats?.currentStreak || 0;

  // Filter problems by difficulty
  const easyCount = problems.filter(p => p.difficulty?.toLowerCase() === 'easy').length;
  const mediumCount = problems.filter(p => p.difficulty?.toLowerCase() === 'medium').length;
  const hardCount = problems.filter(p => p.difficulty?.toLowerCase() === 'hard').length;
  const totalDsa = problems.length;

  const easyPercent = totalDsa > 0 ? Math.round((easyCount / totalDsa) * 100) : 0;
  const mediumPercent = totalDsa > 0 ? Math.round((mediumCount / totalDsa) * 100) : 0;
  const hardPercent = totalDsa > 0 ? Math.round((hardCount / totalDsa) * 100) : 0;

  // Calculate SVGs attributes
  // Dasharrays for difficulty ring
  const ringRadius = 50;
  const ringCircumference = 2 * Math.PI * ringRadius;
  
  // Accumulated angles / stroke offsets for stacked ring
  const easyOffset = ringCircumference;
  const mediumOffset = ringCircumference - (ringCircumference * (easyPercent / 100));
  const hardOffset = ringCircumference - (ringCircumference * ((easyPercent + mediumPercent) / 100));

  // Get active timer sessions logged
  const logs = timerLogs || [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="stats-responsive-grid">
      
      {/* Left Column: Analytics Summary & Activity */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Core Stats Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px'
        }}>
          <Card hoverable={false} style={{ padding: '14px', textAlign: 'center' }}>
            <Flame size={20} style={{ color: 'var(--color-accent)', margin: '0 auto 6px auto' }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Active Streak</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{currentStreak} Days</span>
          </Card>
          
          <Card hoverable={false} style={{ padding: '14px', textAlign: 'center' }}>
            <Clock size={20} style={{ color: 'var(--color-primary)', margin: '0 auto 6px auto' }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Coding Hours</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{codingHours.toFixed(1)} Hrs</span>
          </Card>
          
          <Card hoverable={false} style={{ padding: '14px', textAlign: 'center' }}>
            <Award size={20} style={{ color: 'var(--color-success)', margin: '0 auto 6px auto' }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>DSA Problems</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{solvedCount} Solved</span>
          </Card>
        </div>

        {/* Activity Logs Card */}
        <Card
          header={<span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Focus Session Log History</span>}
          hoverable={false}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
            {logs.slice().reverse().map((log) => (
              <div 
                key={log.id} 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: 'var(--glass-btn-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '6px',
                  fontSize: '0.8rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    background: log.type?.includes('DSA') ? 'var(--color-success)' : 'var(--color-primary)' 
                  }} />
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.type}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)' }}>
                  <span>⏱ {log.durationMinutes} mins</span>
                  <span>📅 {log.date}</span>
                </div>
              </div>
            ))}

            {logs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                No focus sessions logged. Complete a session on the Timer tab to view logs.
              </div>
            )}
          </div>
        </Card>

      </div>

      {/* Right Column: DSA Difficulty distribution Chart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <Card
          header={<span style={{ fontSize: '0.9rem', fontWeight: 700 }}>DSA Problem Distributions</span>}
          hoverable={false}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '10px 0' }}>
            
            {/* Custom SVG Ring chart representing distributions */}
            <div style={{ width: '120px', height: '120px', position: 'relative' }}>
              <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                {/* Background Ring */}
                <circle 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  stroke="var(--glass-border)" 
                  strokeWidth="8" 
                  fill="transparent" 
                />
                
                {/* Easy Ring segment */}
                {easyCount > 0 && (
                  <circle 
                    cx="60" 
                    cy="60" 
                    r="50" 
                    stroke="var(--color-success)" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringCircumference - (ringCircumference * (easyPercent / 100))}
                  />
                )}

                {/* Medium Segment */}
                {mediumCount > 0 && (
                  <circle 
                    cx="60" 
                    cy="60" 
                    r="50" 
                    stroke="var(--color-accent)" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringCircumference - (ringCircumference * (mediumPercent / 100))}
                    style={{ transform: `rotate(${360 * (easyPercent / 100)}deg)`, transformOrigin: '60px 60px' }}
                  />
                )}

                {/* Hard Segment */}
                {hardCount > 0 && (
                  <circle 
                    cx="60" 
                    cy="60" 
                    r="50" 
                    stroke="var(--color-danger)" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringCircumference - (ringCircumference * (hardPercent / 100))}
                    style={{ transform: `rotate(${360 * ((easyPercent + mediumPercent) / 100)}deg)`, transformOrigin: '60px 60px' }}
                  />
                )}
              </svg>
              
              {/* Central text reading total */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalDsa}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total</span>
              </div>
            </div>

            {/* Labels breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)' }} />
                  Easy
                </span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{easyCount} ({easyPercent}%)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent)' }} />
                  Medium
                </span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{mediumCount} ({mediumPercent}%)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-danger)' }} />
                  Hard
                </span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{hardCount} ({hardPercent}%)</span>
              </div>
            </div>

          </div>
        </Card>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CodingStatistics;
