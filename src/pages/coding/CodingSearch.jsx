import React, { useState } from 'react';
import Card from '../../components/Card';
import { Search, Code, FileText, Award, Layers, ArrowRight } from 'lucide-react';

const CodingSearch = ({ problems, snippets, notes, languages, onNavigate }) => {
  const [query, setQuery] = useState('');

  // Handle searching
  const getResults = () => {
    if (!query.trim()) return { problems: [], snippets: [], notes: [], languages: [] };
    
    const term = query.toLowerCase();

    return {
      problems: problems.filter(p => p.name.toLowerCase().includes(term) || p.topic.toLowerCase().includes(term)),
      snippets: snippets.filter(s => s.title.toLowerCase().includes(term) || s.tags.some(t => t.toLowerCase().includes(term))),
      notes: notes.filter(n => n.title.toLowerCase().includes(term) || n.content.toLowerCase().includes(term) || n.tags.some(t => t.toLowerCase().includes(term))),
      languages: languages.filter(l => l.name.toLowerCase().includes(term))
    };
  };

  const results = getResults();
  const totalResults = results.problems.length + results.snippets.length + results.notes.length + results.languages.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Search Input Card */}
      <Card hoverable={false} style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--glass-input-bg)', border: '1px solid var(--glass-input-border)', borderRadius: '8px', padding: '8px 12px' }}>
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Type keywords to search problems, notes, snippets or languages..."
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
            Found {totalResults} matching entries in your workspace.
          </span>
        )}
      </Card>

      {/* Results Display */}
      {query.trim() && totalResults > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Languages Matches */}
          {results.languages.length > 0 && (
            <Card header={<span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}><Layers size={14} /> Languages & Stack Matches</span>} hoverable={false}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {results.languages.map(l => (
                  <div 
                    key={l.id} 
                    onClick={() => onNavigate('languages')}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--glass-btn-bg)', border: '1px solid var(--glass-border)', borderRadius: '6px', cursor: 'pointer' }}
                    className="hover-opacity"
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{l.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Proficiency: {l.progress}% <ArrowRight size={12} />
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Problems Matches */}
          {results.problems.length > 0 && (
            <Card header={<span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}><Award size={14} /> DSA Problem Matches</span>} hoverable={false}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {results.problems.map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => onNavigate('dsa')}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--glass-btn-bg)', border: '1px solid var(--glass-border)', borderRadius: '6px', cursor: 'pointer' }}
                    className="hover-opacity"
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Platform: {p.platform} | Topic: {p.topic}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      View Tracker <ArrowRight size={12} />
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Snippets Matches */}
          {results.snippets.length > 0 && (
            <Card header={<span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}><Code size={14} /> Saved Code Snippets Matches</span>} hoverable={false}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {results.snippets.map(s => (
                  <div 
                    key={s.id} 
                    onClick={() => onNavigate('snippets')}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--glass-btn-bg)', border: '1px solid var(--glass-border)', borderRadius: '6px', cursor: 'pointer' }}
                    className="hover-opacity"
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{s.title}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Language: {s.lang}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      View Snippets <ArrowRight size={12} />
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Notes Matches */}
          {results.notes.length > 0 && (
            <Card header={<span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={14} /> Coding Notes Matches</span>} hoverable={false}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {results.notes.map(n => (
                  <div 
                    key={n.id} 
                    onClick={() => onNavigate('notes')}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--glass-btn-bg)', border: '1px solid var(--glass-border)', borderRadius: '6px', cursor: 'pointer' }}
                    className="hover-opacity"
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Subject: {n.lang}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      View Notes <ArrowRight size={12} />
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

        </div>
      )}

      {query.trim() && totalResults === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          border: '1px dashed var(--glass-border)',
          borderRadius: '8px'
        }}>
          No entries found matching "{query}". Try different keywords.
        </div>
      )}

      {!query.trim() && (
        <div style={{
          textAlign: 'center',
          padding: '60px 0',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}>
          Enter search terms above to search problems, notes, snippets, or tracked languages.
        </div>
      )}

    </div>
  );
};

export default CodingSearch;
