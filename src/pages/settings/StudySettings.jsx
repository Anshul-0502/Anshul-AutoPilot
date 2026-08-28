import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { BookOpen, Plus, X, Check } from 'lucide-react';

const StudySettings = ({ study = {}, onSave }) => {
  const [defaultDuration, setDefaultDuration] = useState(study.defaultDuration || 45);
  const [breakDuration, setBreakDuration] = useState(study.breakDuration || 10);
  const [revisionFrequency, setRevisionFrequency] = useState(study.revisionFrequency || 'Weekly');
  const [pdfViewer, setPdfViewer] = useState(study.pdfViewer || 'Default Browser');
  const [subjects, setSubjects] = useState(study.preferredSubjects || []);
  const [newSubject, setNewSubject] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    if (subjects.includes(newSubject.trim())) return;
    setSubjects([...subjects, newSubject.trim()]);
    setNewSubject('');
  };

  const handleRemoveSubject = (sub) => {
    setSubjects(subjects.filter(s => s !== sub));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        defaultDuration,
        breakDuration,
        revisionFrequency,
        pdfViewer,
        preferredSubjects: subjects
      });
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <Card 
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={18} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Study Hub Preferences</span>
        </div>
      }
      style={{ border: '1px solid var(--glass-border)' }}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
        
        {/* Study Focus Sliders */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="flex-col-mobile">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Default Focus Duration: {defaultDuration} Mins
            </label>
            <input
              type="range"
              min="10"
              max="180"
              step="5"
              value={defaultDuration}
              onChange={(e) => setDefaultDuration(Number(e.target.value))}
              style={{ accentColor: 'var(--color-primary)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Default Break Duration: {breakDuration} Mins
            </label>
            <input
              type="range"
              min="2"
              max="60"
              step="2"
              value={breakDuration}
              onChange={(e) => setBreakDuration(Number(e.target.value))}
              style={{ accentColor: 'var(--color-primary)' }}
            />
          </div>
        </div>

        {/* Option Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="flex-col-mobile">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Revision Warning Intervals:</label>
            <select
              value={revisionFrequency}
              onChange={(e) => setRevisionFrequency(e.target.value)}
              style={{
                padding: '8px',
                background: 'var(--glass-input-bg)',
                border: '1px solid var(--glass-input-border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            >
              {['Daily', 'Weekly', 'Bi-Weekly', 'Monthly'].map(f => (
                <option key={f} value={f} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{f}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Default PDF Reader View:</label>
            <select
              value={pdfViewer}
              onChange={(e) => setPdfViewer(e.target.value)}
              style={{
                padding: '8px',
                background: 'var(--glass-input-bg)',
                border: '1px solid var(--glass-input-border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            >
              {['Default Browser', 'AutoPilot Reader Overlay', 'Download Direct'].map(v => (
                <option key={v} value={v} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ width: '100%', height: '1px', background: 'var(--glass-border)' }} />

        {/* Preferred subjects manager */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Preferred Study Subjects:</span>
          
          {/* Add input */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="e.g. Computer Networks, Compiler Design"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              style={{
                padding: '8px 12px',
                background: 'var(--glass-input-bg)',
                border: '1px solid var(--glass-input-border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                flex: 1
              }}
            />
            <Button variant="glass" onClick={handleAddSubject} style={{ height: '35px' }}>
              Add Subject
            </Button>
          </div>

          {/* Pill list */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
            {subjects.map(sub => (
              <div
                key={sub}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--glass-btn-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  color: 'var(--text-primary)'
                }}
              >
                <span>{sub}</span>
                <X
                  size={12}
                  onClick={() => handleRemoveSubject(sub)}
                  style={{ cursor: 'pointer', color: 'var(--text-muted)' }}
                  className="hover-scale"
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button type="submit" variant="primary">
            Save Preferences
          </Button>

          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700 }}>
              <Check size={14} />
              <span>Study defaults configured!</span>
            </div>
          )}
        </div>

      </form>
    </Card>
  );
};

export default StudySettings;
