import React, { useState } from 'react';
import Card from '../../components/Card';
import { Search, FileText, BookOpen, Link, GraduationCap, ChevronRight } from 'lucide-react';

const StudySearch = ({ subjects, notes, pdfs, resources, courses, onNavigate }) => {
  const [query, setQuery] = useState('');

  const searchResults = () => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results = [];

    // Search Subjects
    subjects.forEach(s => {
      if (s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q))) {
        results.push({
          id: `subj-${s.id}`,
          title: s.name,
          category: 'Subject',
          subtitle: s.description || 'Subject Module',
          icon: <GraduationCap size={16} style={{ color: 'var(--color-primary)' }} />,
          tab: 'subjects'
        });
      }
    });

    // Search Notes
    notes.forEach(n => {
      if (n.title.toLowerCase().includes(q) || (n.content && n.content.toLowerCase().includes(q)) || (n.tags && n.tags.some(t => t.toLowerCase().includes(q)))) {
        results.push({
          id: `note-${n.id}`,
          title: n.title,
          category: 'Note',
          subtitle: `Subject: ${n.subject} • Last updated: ${n.lastUpdated}`,
          icon: <FileText size={16} style={{ color: 'var(--color-secondary)' }} />,
          tab: 'notes'
        });
      }
    });

    // Search PDFs
    pdfs.forEach(p => {
      if (p.title.toLowerCase().includes(q) || p.subject.toLowerCase().includes(q)) {
        results.push({
          id: `pdf-${p.id}`,
          title: p.title,
          category: 'PDF Book',
          subtitle: `Subject: ${p.subject} • Page ${p.currentPage}/${p.totalPages}`,
          icon: <BookOpen size={16} style={{ color: 'var(--color-success)' }} />,
          tab: 'pdfs'
        });
      }
    });

    // Search Resources
    resources.forEach(r => {
      if (r.title.toLowerCase().includes(q) || r.url.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q)) {
        results.push({
          id: `res-${r.id}`,
          title: r.title,
          category: 'Bookmark / Link',
          subtitle: `${r.type} under ${r.subject} • ${r.url}`,
          icon: <Link size={16} style={{ color: 'var(--color-accent)' }} />,
          tab: 'resources'
        });
      }
    });

    // Search Courses
    courses.forEach(c => {
      if (c.title.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q)) {
        results.push({
          id: `course-${c.id}`,
          title: c.title,
          category: 'Course Syllabus',
          subtitle: `Subject: ${c.subject} • ${c.progress}% Finished`,
          icon: <GraduationCap size={16} style={{ color: 'var(--color-primary)' }} />,
          tab: 'courses'
        });
      }
    });

    return results;
  };

  const results = searchResults();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Search Input Card */}
      <Card hoverable={false}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--glass-input-bg)', border: '1px solid var(--glass-input-border)', borderRadius: '8px', padding: '10px 16px' }}>
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search notes, book names, web bookmarks, courses, and syllabus topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              outline: 'none',
              width: '100%',
              fontFamily: 'inherit'
            }}
            autoFocus
          />
        </div>
      </Card>

      {/* Results Display */}
      {query.trim() === '' ? (
        <div style={{
          textAlign: 'center',
          padding: '48px',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          border: '1px dashed var(--glass-border)',
          borderRadius: '8px'
        }}>
          🔍 Search across your entire Study Hub. Type keywords above to search notes, subjects, pdfs, courses, and bookmarks.
        </div>
      ) : results.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          border: '1px dashed var(--glass-border)',
          borderRadius: '8px'
        }}>
          No matches found for "{query}". Try checking your spelling or adjusting filters.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Search Results ({results.length} Matches Found)
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {results.map((res) => (
              <div
                key={res.id}
                onClick={() => onNavigate(res.tab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--glass-card-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                className="glass-card-hover"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                  <span style={{ 
                    background: 'var(--glass-btn-bg)', 
                    padding: '8px', 
                    borderRadius: '6px',
                    display: 'flex'
                  }}>
                    {res.icon}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {res.title}
                      </span>
                      <span style={{ 
                        fontSize: '0.65rem', 
                        background: 'var(--color-primary-glow)', 
                        color: 'var(--color-primary)', 
                        padding: '1px 6px', 
                        borderRadius: '4px',
                        fontWeight: 600
                      }}>
                        {res.category}
                      </span>
                    </div>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {res.subtitle}
                    </span>
                  </div>
                </div>

                <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudySearch;
