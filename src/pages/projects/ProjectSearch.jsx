import React, { useState } from 'react';
import Card from '../../components/Card';
import { Search, Code, FileText, ShieldAlert, CheckSquare, ArrowRight } from 'lucide-react';

const ProjectSearch = ({ project, onNavigateTab }) => {
  const [query, setQuery] = useState('');

  const getResults = () => {
    if (!query.trim()) return { tasks: [], docs: [], bugs: [], resources: [] };
    const term = query.toLowerCase();

    const tasks = (project.tasks || []).filter(t => 
      t.title.toLowerCase().includes(term) || t.description?.toLowerCase().includes(term)
    );

    const docs = (project.docs || []).filter(d => 
      d.type.toLowerCase().includes(term) || d.content.toLowerCase().includes(term)
    );

    const bugs = (project.bugs || []).filter(b => 
      b.title.toLowerCase().includes(term) || b.description?.toLowerCase().includes(term) || b.module.toLowerCase().includes(term)
    );

    const resources = (project.resources || []).filter(r => 
      r.name.toLowerCase().includes(term) || r.type.toLowerCase().includes(term)
    );

    return { tasks, docs, bugs, resources };
  };

  const results = getResults();
  const total = results.tasks.length + results.docs.length + results.bugs.length + results.resources.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Search Input Box */}
      <Card hoverable={false} style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--glass-input-bg)', border: '1px solid var(--glass-input-border)', borderRadius: '8px', padding: '8px 12px' }}>
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search tasks, documents, bug reports, or linked assets in this project..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              outline: 'none',
              width: '100%'
            }}
            autoFocus
          />
        </div>
        {query.trim() && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>
            Found {total} matches.
          </span>
        )}
      </Card>

      {/* Results viewport */}
      {query.trim() && total > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Tasks matches */}
          {results.tasks.length > 0 && (
            <Card header={<span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}><CheckSquare size={14} /> Task Matches</span>} hoverable={false}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {results.tasks.map(t => (
                  <div 
                    key={t.id} 
                    onClick={() => onNavigateTab('tasks')}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--glass-btn-bg)', border: '1px solid var(--glass-border)', borderRadius: '6px', cursor: 'pointer' }}
                    className="hover-opacity"
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t.title}</span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Status: {t.status} | Priority: {t.priority}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Open Kanban <ArrowRight size={12} />
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Docs matches */}
          {results.docs.length > 0 && (
            <Card header={<span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={14} /> Documentation Matches</span>} hoverable={false}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {results.docs.map(d => (
                  <div 
                    key={d.id} 
                    onClick={() => onNavigateTab('docs')}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--glass-btn-bg)', border: '1px solid var(--glass-border)', borderRadius: '6px', cursor: 'pointer' }}
                    className="hover-opacity"
                  >
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{d.type} Wiki Chapter</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Open Wiki <ArrowRight size={12} />
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Bugs matches */}
          {results.bugs.length > 0 && (
            <Card header={<span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldAlert size={14} /> Bug Report Matches</span>} hoverable={false}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {results.bugs.map(b => (
                  <div 
                    key={b.id} 
                    onClick={() => onNavigateTab('bugs')}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--glass-btn-bg)', border: '1px solid var(--glass-border)', borderRadius: '6px', cursor: 'pointer' }}
                    className="hover-opacity"
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{b.title}</span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Module: {b.module} | Severity: {b.severity}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Open Bug Tracker <ArrowRight size={12} />
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Resource matches */}
          {results.resources.length > 0 && (
            <Card header={<span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}><Code size={14} /> Linked Asset Matches</span>} hoverable={false}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {results.resources.map(r => (
                  <div 
                    key={r.id} 
                    onClick={() => onNavigateTab('resources')}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--glass-btn-bg)', border: '1px solid var(--glass-border)', borderRadius: '6px', cursor: 'pointer' }}
                    className="hover-opacity"
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{r.name}</span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Type: {r.type}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Open Resources <ArrowRight size={12} />
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

        </div>
      )}

      {query.trim() && total === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          border: '1px dashed var(--glass-border)',
          borderRadius: '8px'
        }}>
          No items matching "{query}". Try different terms.
        </div>
      )}

      {!query.trim() && (
        <div style={{
          textAlign: 'center',
          padding: '40px 0',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}>
          Enter search terms above to search components of this project.
        </div>
      )}

    </div>
  );
};

export default ProjectSearch;
