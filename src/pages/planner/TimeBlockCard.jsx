import React from 'react';
import { Trash2, BookOpen, Code, Folder, Coffee, Users, Info } from 'lucide-react';

const TimeBlockCard = ({ event, onDelete }) => {
  const getCategoryTheme = (category) => {
    switch (category) {
      case 'study':
        return {
          bg: 'rgba(79, 70, 229, 0.08)',
          border: 'var(--color-primary)',
          color: 'var(--color-primary)',
          icon: <BookOpen size={14} />
        };
      case 'coding':
        return {
          bg: 'rgba(16, 185, 129, 0.08)',
          border: 'var(--color-success)',
          color: 'var(--color-success)',
          icon: <Code size={14} />
        };
      case 'project':
        return {
          bg: 'rgba(14, 165, 233, 0.08)',
          border: 'var(--color-secondary)',
          color: 'var(--color-secondary)',
          icon: <Folder size={14} />
        };
      case 'break':
        return {
          bg: 'rgba(245, 158, 11, 0.08)',
          border: 'var(--color-accent)',
          color: 'var(--color-accent)',
          icon: <Coffee size={14} />
        };
      case 'meeting':
        return {
          bg: 'rgba(239, 68, 68, 0.08)',
          border: 'var(--color-danger)',
          color: 'var(--color-danger)',
          icon: <Users size={14} />
        };
      default:
        return {
          bg: 'var(--glass-btn-bg)',
          border: 'var(--glass-border)',
          color: 'var(--text-secondary)',
          icon: <Info size={14} />
        };
    }
  };

  const theme = getCategoryTheme(event.category);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 14px',
      background: theme.bg,
      borderLeft: `4px solid ${theme.border}`,
      borderTop: '1px solid var(--glass-border)',
      borderRight: '1px solid var(--glass-border)',
      borderBottom: '1px solid var(--glass-border)',
      borderRadius: '8px',
      fontSize: '0.85rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
        <span style={{ 
          color: theme.color, 
          background: 'var(--glass-card-bg)', 
          padding: '4px', 
          borderRadius: '4px',
          display: 'flex'
        }}>
          {theme.icon}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
          <span style={{ 
            fontWeight: 600, 
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {event.title}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {event.startTime} - {event.endTime} ({event.duration} mins)
          </span>
        </div>
      </div>

      <button 
        onClick={() => onDelete(event.id)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-danger)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default TimeBlockCard;
