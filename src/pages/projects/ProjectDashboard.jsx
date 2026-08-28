import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProjectCard from './ProjectCard';
import { Plus, Folder, CheckCircle, Clock, AlertTriangle, Calendar } from 'lucide-react';

const ProjectDashboard = ({ projects, onSelectProject, onCreateTrigger }) => {
  // Calculate counters
  const total = projects.length;
  const active = projects.filter(p => p.status === 'In Progress').length;
  const completed = projects.filter(p => p.status === 'Completed').length;
  const planning = projects.filter(p => p.status === 'Planning' || p.status === 'Testing').length;

  // Gather upcoming deadlines
  const upcomingDeadlines = projects
    .filter(p => p.status !== 'Completed')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Banner info */}
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
            Welcome to Anshul's Project Hub!
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Plan software projects, track milestones, squash bugs, and trace deployments from one place.
          </p>
        </div>
        
        <Button 
          variant="primary" 
          onClick={onCreateTrigger}
          iconLeft={<Plus size={16} />}
        >
          Create Project
        </Button>
      </div>

      {/* Counters Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px'
      }}>
        <Card hoverable={false} style={{ padding: '14px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
          <span style={{ background: 'var(--color-primary-glow)', color: 'var(--color-primary)', padding: '8px', borderRadius: '8px', display: 'flex' }}>
            <Folder size={18} />
          </span>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Active Projects</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{active} Projects</span>
          </div>
        </Card>

        <Card hoverable={false} style={{ padding: '14px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
          <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', padding: '8px', borderRadius: '8px', display: 'flex' }}>
            <CheckCircle size={18} />
          </span>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Completed</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{completed} Projects</span>
          </div>
        </Card>

        <Card hoverable={false} style={{ padding: '14px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
          <span style={{ background: 'var(--glass-btn-bg-hover)', color: 'var(--text-secondary)', padding: '8px', borderRadius: '8px', display: 'flex' }}>
            <Clock size={18} />
          </span>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Planning & Test</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{planning} Projects</span>
          </div>
        </Card>
      </div>

      {/* Main split: Project Cards Grid vs Sidebar widget */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }} className="project-dashboard-layout">
        
        {/* Project cards library */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            All Software Projects ({total})
          </h4>

          {projects.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 0',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              border: '1px dashed var(--glass-border)',
              borderRadius: '8px'
            }}>
              No projects created yet. Click 'Create Project' to log your first development board.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '16px'
            }}>
              {projects.map((proj) => (
                <ProjectCard 
                  key={proj.id}
                  project={proj}
                  onClick={() => onSelectProject(proj)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar deadlines & reports summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Upcoming deadlines */}
          <Card 
            header={<span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Upcoming Project Deadlines</span>}
            hoverable={false}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {upcomingDeadlines.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)',
                    background: 'var(--glass-btn-bg)',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                  className="hover-opacity"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Status: {p.status}</span>
                  </div>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    color: 'var(--color-danger)', 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Calendar size={12} /> {p.deadline}
                  </span>
                </div>
              ))}

              {upcomingDeadlines.length === 0 && (
                <div style={{ textAlign: 'center', padding: '16px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  All projects completed or no deadlines set.
                </div>
              )}
            </div>
          </Card>

        </div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .project-dashboard-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
};

export default ProjectDashboard;
