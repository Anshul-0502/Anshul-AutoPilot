import React, { useState } from 'react';
import SubjectCard from './SubjectCard';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Plus } from 'lucide-react';

const Subjects = ({ subjects, notes, onAddSubject, onSelectSubject }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('purple');
  const [studyGoal, setStudyGoal] = useState('3h');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddSubject({
      name: name.trim(),
      description: description.trim(),
      color,
      studyGoal,
      progress: 0,
      favorite: false
    });

    setName('');
    setDescription('');
    setShowAddForm(false);
  };

  const getNotesCount = (subjName) => {
    return notes.filter(n => n.subject?.toLowerCase() === subjName.toLowerCase()).length;
  };

  const colors = ['purple', 'green', 'blue', 'amber', 'red'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>
          Study Subjects
        </h3>
        <Button 
          variant="glass" 
          size="sm" 
          onClick={() => setShowAddForm(!showAddForm)}
          iconLeft={<Plus size={14} />}
          style={{ padding: '2px 8px', fontSize: '0.8rem', height: '28px' }}
        >
          {showAddForm ? 'Cancel' : 'New Subject'}
        </Button>
      </div>

      {showAddForm && (
        <Card
          header={
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              ➕ Create Subject Module
            </span>
          }
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Subject Name</label>
              <input
                type="text"
                placeholder="e.g. Operating Systems, Java Programming"
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Description</label>
              <input
                type="text"
                placeholder="Short module overview details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Study Goal</label>
                <input
                  type="text"
                  placeholder="e.g. 3h/week"
                  value={studyGoal}
                  onChange={(e) => setStudyGoal(e.target.value)}
                  style={{
                    padding: '8px 10px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Label Color</label>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', height: '34px' }}>
                  {colors.map((c) => (
                    <span 
                      key={c}
                      onClick={() => setColor(c)}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: c === 'purple' ? 'var(--color-primary)' : c === 'green' ? 'var(--color-success)' : c === 'blue' ? 'var(--color-secondary)' : c === 'amber' ? 'var(--color-accent)' : 'var(--color-danger)',
                        border: color === c ? '2px solid var(--text-primary)' : 'none',
                        cursor: 'pointer',
                        transform: color === c ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.15s ease'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <Button type="submit" variant="primary" size="sm" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
              Create Subject
            </Button>
          </form>
        </Card>
      )}

      {/* List display */}
      {subjects.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '24px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          border: '1px dashed var(--glass-border)',
          borderRadius: '8px'
        }}>
          No subjects created yet. Click 'New Subject' to start.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {subjects.map((subj) => (
            <SubjectCard 
              key={subj.id}
              subject={subj}
              notesCount={getNotesCount(subj.name)}
              onClick={() => onSelectSubject(subj.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Subjects;
