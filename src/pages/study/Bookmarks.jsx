import React, { useState } from 'react';
import Card from '../../components/Card';
import { Star, FileText, BookOpen, Link, ArrowRight } from 'lucide-react';

const Bookmarks = ({ notes, pdfs, resources, onSelectTab }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const favoriteNotes = notes.filter(n => n.favorite || n.pinned);
  const favoriteResources = resources.filter(r => r.favorite);
  
  // Let's assume PDFs in progress or favorited (e.g. progress > 0)
  const bookmarkedPdfs = pdfs.filter(p => p.currentPage > 0);

  const getFilteredItems = () => {
    switch (activeFilter) {
      case 'notes':
        return favoriteNotes.map(n => ({ ...n, itemType: 'note' }));
      case 'pdfs':
        return bookmarkedPdfs.map(p => ({ ...p, itemType: 'pdf' }));
      case 'resources':
        return favoriteResources.map(r => ({ ...r, itemType: 'resource' }));
      case 'all':
      default:
        return [
          ...favoriteNotes.map(n => ({ ...n, itemType: 'note' })),
          ...bookmarkedPdfs.map(p => ({ ...p, itemType: 'pdf' })),
          ...favoriteResources.map(r => ({ ...r, itemType: 'resource' }))
        ];
    }
  };

  const items = getFilteredItems();

  const getIcon = (type) => {
    switch (type) {
      case 'note':
        return <FileText size={16} style={{ color: 'var(--color-primary)' }} />;
      case 'pdf':
        return <BookOpen size={16} style={{ color: 'var(--color-success)' }} />;
      case 'resource':
      default:
        return <Link size={16} style={{ color: 'var(--color-secondary)' }} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>
          Study Bookmarks & Favorites
        </h3>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
        {['all', 'notes', 'pdfs', 'resources'].map((tab) => (
          <span
            key={tab}
            onClick={() => setActiveFilter(tab)}
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              background: activeFilter === tab ? 'var(--glass-btn-bg-hover)' : 'transparent',
              color: activeFilter === tab ? 'var(--color-primary)' : 'var(--text-secondary)',
              border: activeFilter === tab ? '1px solid var(--glass-border-hover)' : '1px solid transparent',
              textTransform: 'capitalize'
            }}
          >
            {tab === 'all' ? 'All Bookmarks' : tab === 'pdfs' ? 'Active PDFs' : `Starred ${tab}`}
          </span>
        ))}
      </div>

      {/* Grid of Favorited cards */}
      {items.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '36px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          border: '1px dashed var(--glass-border)',
          borderRadius: '8px'
        }}>
          No favorited/pinned items found in this section. Start marking your notes, textbooks, and online resources to keep them handy.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {items.map((item, idx) => (
            <Card
              key={`${item.itemType}-${item.id || idx}`}
              hoverable={true}
              style={{ padding: '16px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
                {/* Header: Type and Title */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <span style={{ 
                      background: 'var(--glass-btn-bg)', 
                      padding: '6px', 
                      borderRadius: '6px',
                      display: 'flex'
                    }}>
                      {getIcon(item.itemType)}
                    </span>
                    <span style={{ 
                      fontWeight: 700, 
                      color: 'var(--text-primary)', 
                      fontSize: '0.9rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {item.title}
                    </span>
                  </div>
                  <Star size={14} style={{ color: 'var(--color-accent)', fill: 'var(--color-accent)' }} />
                </div>

                {/* Subject & Sub-details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Subject: {item.subject}</span>
                  {item.itemType === 'note' && <span>Updated {item.lastUpdated}</span>}
                  {item.itemType === 'pdf' && <span>Page {item.currentPage}/{item.totalPages}</span>}
                  {item.itemType === 'resource' && <span style={{ textTransform: 'capitalize' }}>{item.type}</span>}
                </div>

                {/* Description / Content snippet */}
                {item.itemType === 'note' && (
                  <p style={{ 
                    fontSize: '0.8rem', 
                    color: 'var(--text-secondary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {item.content || 'No content written yet...'}
                  </p>
                )}
                {item.itemType === 'resource' && (
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--text-muted)', 
                    wordBreak: 'break-all', 
                    margin: 0 
                  }}>
                    {item.url}
                  </p>
                )}
                {item.itemType === 'pdf' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                    <div style={{ height: '4px', background: 'var(--glass-border)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${(item.currentPage / item.totalPages) * 100}%`, 
                        background: 'var(--color-success)' 
                      }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {Math.round((item.currentPage / item.totalPages) * 100)}% Syllabus read
                    </span>
                  </div>
                )}

                <div style={{ flex: 1 }} />

                {/* Quick navigation */}
                <div 
                  onClick={() => {
                    if (item.itemType === 'note') onSelectTab('notes');
                    if (item.itemType === 'pdf') onSelectTab('pdfs');
                    if (item.itemType === 'resource') onSelectTab('resources');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.8rem',
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    marginTop: '8px',
                    borderTop: '1px solid var(--glass-border)',
                    paddingTop: '8px'
                  }}
                  className="hover-scale"
                >
                  <span>Go to Section</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
