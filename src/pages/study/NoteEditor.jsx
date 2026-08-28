import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Star, Pin, X } from 'lucide-react';

const NoteEditor = ({ activeNote, subjects, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const [tags, setTags] = useState('');
  const [pinned, setPinned] = useState(false);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title || '');
      setContent(activeNote.content || '');
      setSubject(activeNote.subject || (subjects[0] ? subjects[0].name : ''));
      setTags(activeNote.tags ? activeNote.tags.join(', ') : '');
      setPinned(activeNote.pinned || false);
      setFavorite(activeNote.favorite || false);
    } else {
      setTitle('');
      setContent('');
      setSubject(subjects[0] ? subjects[0].name : '');
      setTags('');
      setPinned(false);
      setFavorite(false);
    }
  }, [activeNote, subjects]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tagsArr = tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onSave({
      id: activeNote ? activeNote.id : undefined,
      title: title.trim(),
      content: content.trim(),
      subject,
      tags: tagsArr,
      pinned,
      favorite,
      lastUpdated: new Date().toLocaleDateString()
    });
  };

  return (
    <Card
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {activeNote ? '📝 Edit Note' : '➕ Write Study Note'}
          </span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Pin Toggle */}
            <button 
              type="button"
              onClick={() => setPinned(!pinned)}
              style={{
                background: 'transparent',
                border: 'none',
                color: pinned ? 'var(--color-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex'
              }}
            >
              <Pin size={16} style={{ fill: pinned ? 'currentColor' : 'none' }} />
            </button>

            {/* Star Toggle */}
            <button 
              type="button"
              onClick={() => setFavorite(!favorite)}
              style={{
                background: 'transparent',
                border: 'none',
                color: favorite ? 'var(--color-accent)' : 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex'
              }}
            >
              <Star size={16} style={{ fill: favorite ? 'currentColor' : 'none' }} />
            </button>

            {onCancel && (
              <button 
                type="button"
                onClick={onCancel}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Note Title</label>
          <input
            type="text"
            placeholder="e.g. OSI Model Layer Summary"
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                padding: '8px',
                background: 'var(--glass-input-bg)',
                border: '1px solid var(--glass-input-border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            >
              {subjects.map((subj, idx) => (
                <option key={idx} value={subj.name} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                  {subj.name}
                </option>
              ))}
              {subjects.length === 0 && (
                <option value="" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>General</option>
              )}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Tags (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. revision, networks, basics"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
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
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Content</label>
          <textarea
            placeholder="Write study guide sheet content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            style={{
              padding: '10px 12px',
              background: 'var(--glass-input-bg)',
              border: '1px solid var(--glass-input-border)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              resize: 'vertical',
              fontFamily: 'var(--mono)',
              lineHeight: 1.5
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <Button type="submit" variant="primary" size="sm">
            Save Note
          </Button>
          {onCancel && (
            <Button type="button" variant="glass" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default NoteEditor;
