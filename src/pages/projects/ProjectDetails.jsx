import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Target, ShieldAlert, Award, Calendar, Terminal } from 'lucide-react';

const ProjectDetails = ({ project, onUpdateProject }) => {
  const [status, setStatus] = useState(project.status);
  const [priority, setPriority] = useState(project.priority);
  const [version, setVersion] = useState(project.version);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    onUpdateProject({
      ...project,
      status: newStatus
    });
  };

  const handlePriorityChange = (newPriority) => {
    setPriority(newPriority);
    onUpdateProject({
      ...project,
      priority: newPriority
    });
  };

  const handleVersionChange = (e) => {
    const newVersion = e.target.value;
    setVersion(newVersion);
    onUpdateProject({
      ...project,
      version: newVersion
    });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px' }} className="details-responsive-grid">
      
      {/* Left panel: summary, objectives, features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Description card */}
        <Card hoverable={false}>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Project Vision & Overview
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {project.description}
          </p>
        </Card>

        {/* Core Objectives */}
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Target size={15} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Core Deliverables & Objectives</span>
            </div>
          }
          hoverable={false}
        >
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>Build a scalable foundation utilizing clean modular layout rules.</li>
            <li>Maintain zero external API integrations inside version {project.version}.</li>
            <li>Deliver responsive designs adapted for desktop and mobile displays.</li>
            <li>Reflect analytical logs dynamically in the analytics console.</li>
          </ul>
        </Card>

        {/* Tech Stack Card */}
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Terminal size={15} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Technology Stack Stack Tools</span>
            </div>
          }
          hoverable={false}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {project.techStack?.map((tech, idx) => (
              <span 
                key={idx} 
                style={{ 
                  fontSize: '0.75rem', 
                  background: 'var(--color-primary-glow)', 
                  color: 'var(--color-primary)', 
                  border: '1px solid var(--glass-border)',
                  padding: '4px 12px', 
                  borderRadius: '20px',
                  fontWeight: 600
                }}
              >
                {tech}
              </span>
            ))}

            {(!project.techStack || project.techStack.length === 0) && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No tools logged yet.</span>
            )}
          </div>
        </Card>

      </div>

      {/* Right panel: controls state & dates */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* State details */}
        <Card
          header={<span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Sprint Attributes & Controls</span>}
          hoverable={false}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Status switcher */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Status</label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                style={{
                  padding: '8px',
                  background: 'var(--glass-input-bg)',
                  border: '1px solid var(--glass-input-border)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              >
                {['Planning', 'In Progress', 'Testing', 'Completed'].map(s => (
                  <option key={s} value={s} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{s}</option>
                ))}
              </select>
            </div>

            {/* Priority selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Priority Label</label>
              <select
                value={priority}
                onChange={(e) => handlePriorityChange(e.target.value)}
                style={{
                  padding: '8px',
                  background: 'var(--glass-input-bg)',
                  border: '1px solid var(--glass-input-border)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              >
                {['Low', 'Medium', 'High'].map(p => (
                  <option key={p} value={p} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{p}</option>
                ))}
              </select>
            </div>

            {/* Version control input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Release Version</label>
              <input
                type="text"
                value={version}
                onChange={handleVersionChange}
                style={{
                  padding: '8px 12px',
                  background: 'var(--glass-input-bg)',
                  border: '1px solid var(--glass-input-border)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

          </div>
        </Card>

        {/* Timeline block */}
        <Card
          header={<span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Dates Overview</span>}
          hoverable={false}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Start Date:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{project.startDate}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Target Deadline:</span>
              <strong style={{ color: 'var(--color-danger)' }}>{project.deadline}</strong>
            </div>
          </div>
        </Card>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .details-responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
};

export default ProjectDetails;
