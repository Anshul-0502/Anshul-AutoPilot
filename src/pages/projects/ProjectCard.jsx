import React from 'react';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import { Target, AlertCircle, Calendar, ShieldAlert } from 'lucide-react';

const ProjectCard = ({ project, onClick }) => {
  const getPriorityColor = (pri) => {
    switch (pri?.toLowerCase()) {
      case 'high': return 'var(--color-danger)';
      case 'medium': return 'var(--color-accent)';
      case 'low':
      default:
        return 'var(--color-primary)';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'var(--color-success)';
      case 'testing': return 'var(--color-info)';
      case 'in progress': return 'var(--color-primary)';
      case 'planning':
      default:
        return 'var(--text-muted)';
    }
  };

  // Calculate task progress percent
  const totalTasks = project.tasks?.length || 0;
  const doneTasks = project.tasks?.filter(t => t.status === 'done').length || 0;
  const taskProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Calculate milestones progress percent
  const totalMilestones = project.milestones?.length || 0;
  const doneMilestones = project.milestones?.filter(m => m.status === 'completed').length || 0;
  const milestoneProgress = totalMilestones > 0 ? Math.round((doneMilestones / totalMilestones) * 100) : 0;

  const totalProgress = Math.round((taskProgress + milestoneProgress) / 2);

  return (
    <Card 
      hoverable={true} 
      onClick={onClick}
      style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}
    >
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ 
          fontSize: '0.65rem', 
          background: 'var(--glass-btn-bg)', 
          border: '1px solid var(--glass-border)',
          color: 'var(--text-secondary)',
          padding: '2px 8px',
          borderRadius: '4px',
          fontWeight: 700
        }}>
          {project.category}
        </span>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ 
            fontSize: '0.65rem', 
            color: getPriorityColor(project.priority), 
            fontWeight: 700,
            background: 'var(--glass-btn-bg)',
            border: `1px solid ${getPriorityColor(project.priority)}`,
            padding: '1px 6px',
            borderRadius: '4px'
          }}>
            {project.priority} Priority
          </span>
          <span style={{ 
            fontSize: '0.65rem', 
            color: getStatusColor(project.status), 
            fontWeight: 700,
            background: 'var(--glass-btn-bg)',
            border: `1px solid ${getStatusColor(project.status)}`,
            padding: '1px 6px',
            borderRadius: '4px'
          }}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Project details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
          {project.name}
        </span>
        <p style={{
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: 1.4
        }}>
          {project.description}
        </p>
      </div>

      {/* Tech stack badges */}
      {project.techStack && project.techStack.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
          {project.techStack.slice(0, 4).map((tech, idx) => (
            <span key={idx} style={{ 
              fontSize: '0.6rem', 
              background: 'var(--glass-btn-bg-hover)', 
              color: 'var(--text-secondary)', 
              padding: '1px 6px', 
              borderRadius: '4px',
              fontWeight: 600
            }}>
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>+{project.techStack.length - 4} more</span>
          )}
        </div>
      )}

      {/* Progress slider */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px', borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Target size={12} /> Completion
          </span>
          <span style={{ fontWeight: 600 }}>{totalProgress}%</span>
        </div>
        <ProgressBar value={totalProgress} color={totalProgress === 100 ? 'var(--color-success)' : 'var(--color-primary)'} height="5px" />
      </div>

      {/* Deadlines footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <Calendar size={10} /> By: {project.deadline}
        </span>
        <span>Version: {project.version}</span>
      </div>

    </Card>
  );
};

export default ProjectCard;
