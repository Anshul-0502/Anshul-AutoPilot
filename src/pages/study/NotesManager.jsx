import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Pin, Star, Trash2, Edit, FileText } from 'lucide-react';

const NotesManager = ({ notes, onEdit, onDelete, onAddClick }) => {
  const pinnedNotes = notes.filter(n => n.pinned);
  const unpinnedNotes = notes.filter(n => !n.pinned);

  const getSubjectColor = (subjName) => {
    // Return standard representation
    return 'var(--color-primary)';
  };

  const renderNoteCard = (note) => (
    <div 
      key={note.id}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '12px',
        background: 'var(--glass-btn-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: '8px',
        position: 'relative'
      }}
    >
      {/* Title & Icons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
          <FileText size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
          <span style={{ 
            fontWeight: 600, 
            color: 'var(--text-primary)', 
            fontSize: '0.85rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {note.title}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
          {note.pinned && <Pin size={12} style={{ color: 'var(--color-primary)', fill: 'currentColor' }} />}
          {note.favorite && <Star size={12} style={{ color: 'var(--color-accent)', fill: 'currentColor' }} />}
        </div>
      </div>

      {/* Subtext info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span>Subject: {note.subject}</span>
        <span>{note.lastUpdated}</span>
      </div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {note.tags.map((tag, idx) => (
            <span 
              key={idx}
              style={{
                fontSize: '0.65rem',
                background: 'var(--glass-border)',
                color: 'var(--text-secondary)',
                padding: '1px 6px',
                borderRadius: '4px'
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Quick edit actions */}
      <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--glass-border)', paddingTop: '8px', marginTop: '4px' }}>
        <Button 
          variant="glass" 
          size="sm" 
          onClick={() => onEdit(note)}
          iconLeft={<Edit size={12} />}
          style={{ height: '24px', fontSize: '0.75rem', padding: '0 8px' }}
        >
          Edit
        </Button>
        <button 
          onClick={() => onDelete(note.id)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
            marginLeft: 'auto'
          }}
          className="hover-scale"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>
          Study Notes
        </h3>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={onAddClick}
          style={{ padding: '4px 10px', fontSize: '0.8rem' }}
        >
          Add Note
        </Button>
      </div>

      {notes.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '24px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          border: '1px dashed var(--glass-border)',
          borderRadius: '8px'
        }}>
          No notes sheets written. Click 'Add Note' to start writing.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Pinned section */}
          {pinnedNotes.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Pin size={12} />
                Pinned Notes
              </span>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '12px'
              }}>
                {pinnedNotes.map(note => renderNoteCard(note))}
              </div>
            </div>
          )}

          {/* Unpinned section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Recent Notes
            </span>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '12px'
            }}>
              {unpinnedNotes.map(note => renderNoteCard(note))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesManager;
