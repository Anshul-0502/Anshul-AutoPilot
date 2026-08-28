import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { X } from 'lucide-react';

const CreateProject = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [techStack, setTechStack] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [version, setVersion] = useState('v1.0.0');

  const categories = ['Web Development', 'AI', 'Mobile', 'Java', 'Python', 'College', 'Personal', 'Research'];
  const priorities = ['Low', 'Medium', 'High'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      id: Date.now(),
      name: name.trim(),
      description: description.trim(),
      category,
      techStack: techStack.split(',').map(t => t.trim()).filter(Boolean),
      startDate,
      deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days default
      priority,
      status: 'Planning',
      version: version.trim() || 'v1.0.0',
      tasks: [],
      milestones: [
        { id: 1, title: 'Planning & Requirements', dueDate: startDate, status: 'completed', progress: 100 },
        { id: 2, title: 'UI Design & Blueprinting', dueDate: startDate, status: 'pending', progress: 0 },
        { id: 3, title: 'Core Implementation', dueDate: deadline, status: 'pending', progress: 0 },
        { id: 4, title: 'System Testing', dueDate: deadline, status: 'pending', progress: 0 },
        { id: 5, title: 'Deployment release', dueDate: deadline, status: 'pending', progress: 0 }
      ],
      docs: [
        { id: 1, type: 'README', content: `# ${name}\n\n${description}` },
        { id: 2, type: 'Playbook', content: `## Master playbook details\n\nPhase 1 details here.` },
        { id: 3, type: 'Requirements', content: `## Requirements checklist\n\n1. Initial blueprint design` }
      ],
      resources: [],
      bugs: [],
      deployments: [],
      releases: [
        { id: 1, version: 'v1.0.0', date: startDate, releaseNotes: 'Project setup initialized.' }
      ]
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(6, 11, 24, 0.65)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '580px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }} className="animate-slide-up">
        
        <Card
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
                ➕ Create Software Project
              </span>
              <button 
                onClick={onCancel}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                className="hover-scale"
              >
                <X size={16} />
              </button>
            </div>
          }
          hoverable={false}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Project Name</label>
              <input
                type="text"
                placeholder="e.g. Anshul AutoPilot OS, DSA Game Suite"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  padding: '8px 12px',
                  background: 'var(--glass-input-bg)',
                  border: '1px solid var(--glass-input-border)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
                required
              />
            </div>

            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Project Description</label>
              <textarea
                placeholder="Brief summary of the goals, target audience, and modules..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                style={{
                  padding: '8px 12px',
                  background: 'var(--glass-input-bg)',
                  border: '1px solid var(--glass-input-border)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  resize: 'vertical'
                }}
                required
              />
            </div>

            {/* Category / Stack */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    padding: '8px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  {categories.map(c => (
                    <option key={c} value={c} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{c}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React, Node, SQL, Java"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
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

            {/* Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Deadline Date</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                  required
                />
              </div>
            </div>

            {/* Priority / Version */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{
                    padding: '8px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  {priorities.map(p => (
                    <option key={p} value={p} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{p}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Initial Version</label>
                <input
                  type="text"
                  placeholder="v1.0.0"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
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

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '6px' }}>
              <Button variant="outline" size="sm" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Commit Project
              </Button>
            </div>

          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateProject;
