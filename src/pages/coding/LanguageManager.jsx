import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { Plus, Archive, Trash2, CheckCircle2, Award } from 'lucide-react';

const LanguageManager = ({ languages, onAddLanguage, onRemoveLanguage, onUpdateLanguage }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('Java');
  const [customName, setCustomName] = useState('');
  const [progress, setProgress] = useState(30);

  const presets = ['Java', 'Python', 'C++', 'JavaScript', 'SQL', 'HTML', 'CSS', 'React', 'TypeScript', 'Go', 'Rust'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalName = name === 'Custom' ? customName.trim() : name;
    if (!finalName) return;

    // Check duplicate
    if (languages.some(l => l.name.toLowerCase() === finalName.toLowerCase())) {
      alert('Language already exists!');
      return;
    }

    onAddLanguage({
      id: Date.now(),
      name: finalName,
      progress: Number(progress) || 0,
      status: 'active'
    });

    setCustomName('');
    setName('Java');
    setProgress(30);
    setShowAddForm(false);
  };

  const toggleArchive = (lang) => {
    onUpdateLanguage({
      ...lang,
      status: lang.status === 'archived' ? 'active' : 'archived'
    });
  };

  const handleProgressChange = (lang, newProgress) => {
    onUpdateLanguage({
      ...lang,
      progress: Math.min(100, Math.max(0, newProgress))
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>
          Languages & Stack Manager
        </h3>
        <Button 
          variant="glass" 
          size="sm" 
          onClick={() => setShowAddForm(!showAddForm)}
          iconLeft={<Plus size={14} />}
          style={{ padding: '2px 8px', fontSize: '0.8rem', height: '28px' }}
        >
          {showAddForm ? 'Cancel' : 'Track Language'}
        </Button>
      </div>

      {showAddForm && (
        <Card
          header={
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              ➕ Track Programming Language
            </span>
          }
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Select Language</label>
                <select
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    padding: '8px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  {presets.map((p) => (
                    <option key={p} value={p} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{p}</option>
                  ))}
                  <option value="Custom" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Custom Option...</option>
                </select>
              </div>

              {name === 'Custom' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Custom Language Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Kotlin, Swift"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
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
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Current Proficiency (%)</label>
                <input
                  type="number"
                  placeholder="e.g. 50"
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
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

            <Button type="submit" variant="primary" size="sm" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
              Add to Track
            </Button>
          </form>
        </Card>
      )}

      {/* Grid of Languages */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '16px'
      }}>
        {languages.map((lang) => (
          <Card 
            key={lang.id}
            style={{
              padding: '16px',
              opacity: lang.status === 'archived' ? 0.6 : 1,
              transition: 'opacity 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {/* Header: Name and Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  {lang.name}
                </span>

                <span style={{ 
                  fontSize: '0.65rem',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  background: lang.status === 'active' ? 'var(--color-primary-glow)' : 'var(--glass-btn-bg)',
                  color: lang.status === 'active' ? 'var(--color-primary)' : 'var(--text-muted)',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  {lang.status}
                </span>
              </div>

              {/* Progress and control buttons */}
              <div>
                <ProgressBar
                  value={lang.progress}
                  color={lang.progress > 80 ? 'var(--color-success)' : lang.progress > 40 ? 'var(--color-primary)' : 'var(--color-accent)'}
                  showLabel={true}
                  label="Proficiency Level"
                  height="5px"
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px', borderTop: '1px solid var(--glass-border)', paddingTop: '8px' }}>
                {/* Manual increment progress */}
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <button 
                    onClick={() => handleProgressChange(lang, lang.progress - 5)}
                    style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'var(--glass-btn-bg)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                  >
                    -5%
                  </button>
                  <button 
                    onClick={() => handleProgressChange(lang, lang.progress + 5)}
                    style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'var(--glass-btn-bg)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                  >
                    +5%
                  </button>
                </div>

                <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
                  <button 
                    onClick={() => toggleArchive(lang)}
                    title={lang.status === 'archived' ? 'Activate Language' : 'Archive Language'}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex'
                    }}
                    className="hover-scale"
                  >
                    <Archive size={14} />
                  </button>

                  <button 
                    onClick={() => onRemoveLanguage(lang.id)}
                    title="Delete Track"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex'
                    }}
                    className="hover-scale"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LanguageManager;
