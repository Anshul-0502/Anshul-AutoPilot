import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Plus, Trash2, History, Tag } from 'lucide-react';

const VersionHistory = ({ project, onUpdateProject }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [version, setVersion] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!version.trim() || !notes.trim()) return;

    const newRelease = {
      id: Date.now(),
      version: version.trim(),
      date: new Date().toLocaleDateString(),
      releaseNotes: notes.trim()
    };

    onUpdateProject({
      ...project,
      releases: [...(project.releases || []), newRelease]
    });

    setVersion('');
    setNotes('');
    setShowAddForm(false);
  };

  const handleDelete = (releaseId) => {
    onUpdateProject({
      ...project,
      releases: project.releases.filter(r => r.id !== releaseId)
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Project Release History & Versioning
        </h4>

        <Button 
          variant="glass" 
          size="sm" 
          onClick={() => setShowAddForm(!showAddForm)}
          iconLeft={<Plus size={14} />}
          style={{ height: '30px', padding: '0 10px', fontSize: '0.8rem' }}
        >
          {showAddForm ? 'Cancel' : 'Log Release'}
        </Button>
      </div>

      {/* Form overlay */}
      {showAddForm && (
        <Card
          header={<span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>🏷️ Register Version Release Note</span>}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '200px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Version Number</label>
              <input
                type="text"
                placeholder="e.g. v1.1.0, v2.0.0"
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
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Changelog / Release Notes</label>
              <textarea
                placeholder="List major changes, feature updates, bug fixes resolved in this build..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
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

            <Button type="submit" variant="primary" size="sm" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
              Log Release Note
            </Button>
          </form>
        </Card>
      )}

      {/* Release chronological list */}
      {(!project.releases || project.releases.length === 0) ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          border: '1px dashed var(--glass-border)',
          borderRadius: '8px'
        }}>
          No releases recorded yet. Tag project changes when deploying build iterations!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {project.releases.slice().reverse().map((rel) => (
            <Card
              key={rel.id}
              hoverable={false}
              style={{ padding: '16px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                
                {/* Header Tag version, date and delete */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      padding: '4px', 
                      background: 'var(--color-primary-glow)', 
                      border: '1px solid var(--glass-border)',
                      borderRadius: '6px',
                      display: 'flex',
                      color: 'var(--color-primary)'
                    }}>
                      <Tag size={14} />
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {rel.version}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Released: {rel.date}</span>
                  </div>

                  <button
                    onClick={() => handleDelete(rel.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex' }}
                    className="hover-scale"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Release text notes */}
                <pre style={{
                  margin: 0,
                  padding: '12px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--sans)',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  overflowX: 'auto'
                }}>
                  {rel.releaseNotes}
                </pre>

              </div>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
};

export default VersionHistory;
