import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { Plus, Trash2, Calendar, Target, CheckCircle2 } from 'lucide-react';

const Milestones = ({ project, onUpdateProject }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    const newMilestone = {
      id: Date.now(),
      title: title.trim(),
      dueDate,
      status: 'pending',
      progress: 0
    };

    onUpdateProject({
      ...project,
      milestones: [...(project.milestones || []), newMilestone]
    });

    setTitle('');
    setDueDate('');
    setShowAddForm(false);
  };

  const handleDelete = (milestoneId) => {
    onUpdateProject({
      ...project,
      milestones: project.milestones.filter(m => m.id !== milestoneId)
    });
  };

  const handleProgressChange = (milestone, nextProgress) => {
    const val = Math.min(100, Math.max(0, nextProgress));
    onUpdateProject({
      ...project,
      milestones: project.milestones.map(m => {
        if (m.id === milestone.id) {
          return {
            ...m,
            progress: val,
            status: val === 100 ? 'completed' : 'pending'
          };
        }
        return m;
      })
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Project Milestones & Stages
        </h4>

        <Button 
          variant="glass" 
          size="sm" 
          onClick={() => setShowAddForm(!showAddForm)}
          iconLeft={<Plus size={14} />}
          style={{ height: '30px', padding: '0 10px', fontSize: '0.8rem' }}
        >
          {showAddForm ? 'Cancel' : 'Add Stage'}
        </Button>
      </div>

      {/* Add milestone Stage Form overlay */}
      {showAddForm && (
        <Card
          header={<span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>➕ Add Milestone Stage</span>}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '200px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Milestone Title</label>
              <input
                type="text"
                placeholder="e.g. Prototype Complete, Alpha Build Release"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Target Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
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

            <Button type="submit" variant="primary" size="sm" style={{ height: '36px' }}>
              Save Stage
            </Button>
          </form>
        </Card>
      )}

      {/* Milestones list grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {(project.milestones || []).map((m) => (
          <Card
            key={m.id}
            hoverable={false}
            style={{
              padding: '16px',
              border: m.status === 'completed' ? '1px solid var(--color-success)' : '1px solid var(--glass-border)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {/* Header Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                  {m.title}
                </span>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {m.status === 'completed' ? (
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                      <CheckCircle2 size={14} /> Completed
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                      <Target size={14} /> In Progress
                    </span>
                  )}

                  <button
                    onClick={() => handleDelete(m.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                    className="hover-scale"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Progress detail */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> Target Due: {m.dueDate}
                  </span>
                  <span style={{ fontWeight: 600 }}>{m.progress}% Completed</span>
                </div>
                <ProgressBar value={m.progress} color={m.status === 'completed' ? 'var(--color-success)' : 'var(--color-primary)'} height="6px" />
              </div>

              {/* Slider adjustment controls */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '8px', marginTop: '2px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Adjust progress:</span>
                
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={m.progress}
                  onChange={(e) => handleProgressChange(m, Number(e.target.value))}
                  style={{
                    flex: 1,
                    height: '4px',
                    borderRadius: '4px',
                    outline: 'none',
                    accentColor: 'var(--color-primary)',
                    cursor: 'pointer'
                  }}
                />

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button 
                    onClick={() => handleProgressChange(m, m.progress - 10)}
                    style={{ padding: '2px 8px', borderRadius: '4px', background: 'var(--glass-btn-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.7rem' }}
                  >
                    -10%
                  </button>
                  <button 
                    onClick={() => handleProgressChange(m, m.progress + 10)}
                    style={{ padding: '2px 8px', borderRadius: '4px', background: 'var(--glass-btn-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.7rem' }}
                  >
                    +10%
                  </button>
                </div>
              </div>

            </div>
          </Card>
        ))}

        {(!project.milestones || project.milestones.length === 0) && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            border: '1px dashed var(--glass-border)',
            borderRadius: '8px'
          }}>
            No milestone stages mapped. Add custom stages to partition development milestones!
          </div>
        )}
      </div>

    </div>
  );
};

export default Milestones;
