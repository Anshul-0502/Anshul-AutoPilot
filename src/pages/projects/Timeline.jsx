import React from 'react';
import Card from '../../components/Card';
import { Calendar, Target, CheckCircle2 } from 'lucide-react';

const Timeline = ({ project }) => {
  const milestones = project.milestones || [];

  // Sort milestones chronologically by date
  const sortedMilestones = [...milestones].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Overview Card */}
      <Card hoverable={false} style={{ padding: '16px' }}>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Chronological Development Roadmap
        </h4>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Track delivery sequences, sprint milestones, and date boundaries relative to project deadlines.
        </p>
      </Card>

      {/* Visual Timeline Path */}
      {sortedMilestones.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          border: '1px dashed var(--glass-border)',
          borderRadius: '8px'
        }}>
          No milestones defined. Go to the Milestones tab to set project stages.
        </div>
      ) : (
        <Card hoverable={false} style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', paddingLeft: '32px' }}>
            
            {/* The vertical tracking line */}
            <div style={{
              position: 'absolute',
              top: '8px',
              bottom: '8px',
              left: '9px',
              width: '2px',
              background: 'var(--glass-border)'
            }} />

            {sortedMilestones.map((milestone, idx) => {
              const isCompleted = milestone.status === 'completed';
              
              return (
                <div 
                  key={milestone.id}
                  style={{
                    position: 'relative',
                    marginBottom: idx === sortedMilestones.length - 1 ? 0 : '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  
                  {/* Timeline indicator node */}
                  <div style={{
                    position: 'absolute',
                    left: '-32px',
                    top: '2px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: isCompleted ? 'var(--color-success)' : milestone.progress > 0 ? 'var(--color-primary)' : 'var(--bg-secondary)',
                    border: isCompleted 
                      ? '4px solid var(--bg-secondary)' 
                      : milestone.progress > 0 
                        ? '4px solid var(--bg-secondary)' 
                        : '2px solid var(--glass-border)',
                    boxShadow: isCompleted 
                      ? '0 0 10px 0 rgba(16, 185, 129, 0.4)' 
                      : milestone.progress > 0 
                        ? '0 0 10px 0 var(--color-primary-glow)' 
                        : 'none',
                    zIndex: 2,
                    boxSizing: 'border-box'
                  }} />

                  {/* Header info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                      {milestone.title}
                    </span>

                    <span style={{ 
                      fontSize: '0.68rem', 
                      color: isCompleted ? 'var(--color-success)' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: 600
                    }}>
                      <Calendar size={12} /> Target: {milestone.dueDate}
                    </span>
                  </div>

                  {/* Body box detail */}
                  <div style={{
                    background: 'var(--glass-btn-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem'
                  }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Progress Level
                    </span>
                    <span style={{ fontWeight: 700, color: isCompleted ? 'var(--color-success)' : 'var(--color-primary)' }}>
                      {milestone.progress}% completed
                    </span>
                  </div>

                </div>
              );
            })}

          </div>
        </Card>
      )}

    </div>
  );
};

export default Timeline;
