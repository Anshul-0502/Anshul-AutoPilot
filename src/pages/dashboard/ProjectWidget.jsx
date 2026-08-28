import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderGit2, ArrowRight } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';

const ProjectWidget = ({ projects = {} }) => {
  const navigate = useNavigate();

  const projectList = projects.list || [];
  const total = projects.total || 0;

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'var(--color-danger)';
      case 'medium':
        return 'var(--color-accent)';
      default:
        return 'var(--color-primary)';
    }
  };

  return (
    <Card
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderGit2 size={18} style={{ color: 'var(--color-primary)' }} />
            <span>Active Projects ({total})</span>
          </div>
          <Button 
            variant="glass" 
            size="sm" 
            onClick={() => navigate('/projects')}
            style={{ padding: '2px 8px', fontSize: '0.8rem', height: '28px' }}
          >
            All Projects
          </Button>
        </div>
      }
      style={{ height: '100%' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
        {/* Project Lists with Progress Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {projectList.length === 0 ? (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '10px 0' }}>
              No active projects found.
            </div>
          ) : (
            projectList.map((proj, index) => (
              <div 
                key={index} 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  background: 'var(--glass-btn-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{proj.name}</span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: getPriorityColor(proj.priority), 
                    fontWeight: 600
                  }}>
                    {proj.status}
                  </span>
                </div>
                <ProgressBar
                  value={proj.progress}
                  color="var(--color-primary)"
                  showLabel={true}
                  height="6px"
                />
              </div>
            ))
          )}
        </div>

        {/* Milestone Alert */}
        <div style={{
          background: 'var(--glass-btn-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '10px 12px',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-secondary)'
        }}>
          <span style={{
            background: 'var(--color-primary-glow)',
            color: 'var(--color-primary)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: 700,
            fontSize: '0.7rem'
          }}>
            MILESTONE
          </span>
          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            Verify project release builds & logs
          </span>
        </div>

        <div style={{ flex: 1 }} />

        <div 
          onClick={() => navigate('/projects')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '6px', 
            fontSize: '0.85rem', 
            color: 'var(--color-primary)', 
            cursor: 'pointer',
            fontWeight: 500,
            padding: '4px 0'
          }}
          className="hover-scale"
        >
          <span>View project workspace</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </Card>
  );
};

export default ProjectWidget;
