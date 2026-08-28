import React, { useState } from 'react';
import Card from '../../components/Card';
import { Star, FileText, BookOpen, Link, GraduationCap } from 'lucide-react';

const Favorites = ({ notes, pdfs, resources, courses, onNavigate }) => {
  const [filter, setFilter] = useState('all');

  const favNotes = notes.filter(n => n.favorite).map(n => ({ ...n, type: 'Note', icon: <FileText size={16} style={{ color: 'var(--color-primary)' }} /> }));
  const favResources = resources.filter(r => r.favorite).map(r => ({ ...r, type: 'Resource', icon: <Link size={16} style={{ color: 'var(--color-secondary)' }} /> }));
  const favCourses = courses.filter(c => c.progress > 0).map(c => ({ ...c, type: 'Course', icon: <GraduationCap size={16} style={{ color: 'var(--color-accent)' }} /> }));
  
  // Custom check for favorited pdfs (e.g. last opened or progress > 0)
  const favPdfs = pdfs.filter(p => p.currentPage > 0).map(p => ({ ...p, type: 'PDF', icon: <BookOpen size={16} style={{ color: 'var(--color-success)' }} /> }));

  const allFavs = [...favNotes, ...favResources, ...favCourses, ...favPdfs];

  const getFilteredFavs = () => {
    if (filter === 'all') return allFavs;
    return allFavs.filter(item => item.type.toLowerCase() === filter);
  };

  const filtered = getFilteredFavs();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>
          Starred & Favorite Resources
        </h3>
      </div>

      {/* Mini Tabs */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {['all', 'note', 'pdf', 'resource', 'course'].map((t) => (
          <span 
            key={t}
            onClick={() => setFilter(t)}
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '20px',
              cursor: 'pointer',
              background: filter === t ? 'var(--color-primary)' : 'var(--glass-btn-bg)',
              color: filter === t ? '#ffffff' : 'var(--text-secondary)',
              border: '1px solid var(--glass-border)'
            }}
          >
            {t === 'all' ? 'Show All' : t === 'pdf' ? 'PDF Books' : `${t}s`}
          </span>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '36px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          border: '1px dashed var(--glass-border)',
          borderRadius: '8px'
        }}>
          No favorites marked yet. Click the star icon on notes, resource bookmarks, or courses to pin them here.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {filtered.map((item, idx) => (
            <Card 
              key={idx}
              hoverable={true}
              onClick={() => onNavigate(item.type.toLowerCase() + 's')}
              style={{ cursor: 'pointer', padding: '16px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      background: 'var(--glass-btn-bg)', 
                      padding: '6px', 
                      borderRadius: '6px',
                      display: 'flex'
                    }}>
                      {item.icon}
                    </span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      background: 'var(--color-primary-glow)', 
                      color: 'var(--color-primary)', 
                      padding: '1px 6px', 
                      borderRadius: '4px',
                      fontWeight: 600
                    }}>
                      {item.type}
                    </span>
                  </div>
                  <Star size={14} style={{ color: 'var(--color-accent)', fill: 'var(--color-accent)' }} />
                </div>

                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                  {item.title || item.name}
                </span>

                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Subject: {item.subject}
                </span>

                {item.url && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.url}
                  </span>
                )}

                {item.progress !== undefined && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Progress: {item.progress}% Completed
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
