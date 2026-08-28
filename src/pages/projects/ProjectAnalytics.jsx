import React from 'react';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import { Target, BarChart2, ShieldAlert, CheckCircle2 } from 'lucide-react';

const ProjectAnalytics = ({ project }) => {
  const tasks = project.tasks || [];
  const milestones = project.milestones || [];
  const bugs = project.bugs || [];

  // Tasks math
  const totalTasks = tasks.length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const testingTasks = tasks.filter(t => t.status === 'testing').length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;

  const taskProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Milestones math
  const totalMilestones = milestones.length;
  const doneMilestones = milestones.filter(m => m.status === 'completed').length;
  const milestoneProgress = totalMilestones > 0 ? Math.round((doneMilestones / totalMilestones) * 100) : 0;

  // Overall combined progress
  const totalProgress = Math.round((taskProgress + milestoneProgress) / 2);

  // Bug stats
  const totalBugs = bugs.length;
  const openBugs = bugs.filter(b => b.status === 'Open').length;
  const resolvedBugs = bugs.filter(b => b.status === 'Resolved' || b.status === 'Closed').length;

  // SVG ring properties
  const ringRadius = 50;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const strokeOffset = ringCircumference - (ringCircumference * (totalProgress / 100));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="analytics-responsive-grid">
      
      {/* Left panel: project checklist & charts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Progress Card */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px'
        }}>
          <Card hoverable={false} style={{ padding: '14px', textAlign: 'center' }}>
            <Target size={20} style={{ color: 'var(--color-primary)', margin: '0 auto 6px auto' }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Sprint Completion</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalProgress}%</span>
          </Card>

          <Card hoverable={false} style={{ padding: '14px', textAlign: 'center' }}>
            <CheckCircle2 size={20} style={{ color: 'var(--color-success)', margin: '0 auto 6px auto' }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Tasks Completed</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{doneTasks} / {totalTasks}</span>
          </Card>

          <Card hoverable={false} style={{ padding: '14px', textAlign: 'center' }}>
            <ShieldAlert size={20} style={{ color: 'var(--color-danger)', margin: '0 auto 6px auto' }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Open Bugs</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{openBugs} Logs</span>
          </Card>
        </div>

        {/* Task completion columns card */}
        <Card
          header={<span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Scrum Tasks Distribution</span>}
          hoverable={false}
        >
          {totalTasks === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              No tasks allocated yet to compile statistics.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'To Do', count: todoTasks, color: 'var(--text-muted)' },
                { label: 'In Progress', count: inProgressTasks, color: 'var(--color-primary)' },
                { label: 'Testing', count: testingTasks, color: 'var(--color-info)' },
                { label: 'Completed', count: doneTasks, color: 'var(--color-success)' }
              ].map((item, idx) => {
                const percent = Math.round((item.count / totalTasks) * 100);
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      <span>{item.label} Tasks ({item.count})</span>
                      <span style={{ fontWeight: 600 }}>{percent}%</span>
                    </div>
                    <ProgressBar value={percent} color={item.color} height="6px" />
                  </div>
                );
              })}
            </div>
          )}
        </Card>

      </div>

      {/* Right panel: visual metrics ring */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <Card
          header={<span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Project Velocity Index</span>}
          hoverable={false}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '16px 0' }}>
            
            {/* SVG circular dial */}
            <div style={{ width: '120px', height: '120px', position: 'relative' }}>
              <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  stroke="var(--color-primary-glow)" 
                  strokeWidth="8" 
                  fill="transparent" 
                />
                <circle 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  stroke="var(--color-primary)" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={strokeOffset}
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>

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
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {totalProgress}%
                </span>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Completion
                </span>
              </div>
            </div>

            {/* Simple metrics summary checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Milestones Completed</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{doneMilestones} / {totalMilestones}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Resolved Issue Tickets</span>
                <span style={{ fontWeight: 700, color: 'var(--color-success)' }}>{resolvedBugs} / {totalBugs}</span>
              </div>
            </div>

          </div>
        </Card>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .analytics-responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectAnalytics;
