import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Plus, Trash2, Copy, Check, Heart, Search } from 'lucide-react';

const SnippetManager = ({ snippets, onAddSnippet, onDeleteSnippet, onUpdateSnippet }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [lang, setLang] = useState('JavaScript');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [tags, setTags] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  
  // Search & Filter
  const [searchVal, setSearchVal] = useState('');
  const [langFilter, setLangFilter] = useState('All');

  const languages = ['JavaScript', 'Python', 'Java', 'C++', 'SQL', 'HTML/CSS', 'TypeScript', 'React', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    onAddSnippet({
      id: Date.now(),
      title: title.trim(),
      lang,
      description: description.trim(),
      code: code.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      favorite: false
    });

    setTitle('');
    setDescription('');
    setCode('');
    setTags('');
    setLang('JavaScript');
    setShowAddForm(false);
  };

  const handleCopy = (snippetId, codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedId(snippetId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleFavorite = (snip) => {
    onUpdateSnippet({
      ...snip,
      favorite: !snip.favorite
    });
  };

  const filteredSnippets = snippets.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchVal.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchVal.toLowerCase()) ||
                          s.tags.some(t => t.toLowerCase().includes(searchVal.toLowerCase()));
    const matchesLang = langFilter === 'All' || s.lang === langFilter;
    return matchesSearch && matchesLang;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Upper header action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>
          Code Snippets Library
        </h3>
        <Button 
          variant="glass" 
          size="sm" 
          onClick={() => setShowAddForm(!showAddForm)}
          iconLeft={<Plus size={14} />}
          style={{ height: '30px', fontSize: '0.8rem', padding: '0 10px' }}
        >
          {showAddForm ? 'Cancel Snippet' : 'Save Snippet'}
        </Button>
      </div>

      {/* Save form */}
      {showAddForm && (
        <Card
          header={<span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>💾 Save Reuseable Code Snippet</span>}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Snippet Title</label>
                <input
                  type="text"
                  placeholder="e.g. Quick Binary Search Implementation"
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Language</label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  style={{
                    padding: '8px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  {languages.map(l => (
                    <option key={l} value={l} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Brief Description</label>
                <input
                  type="text"
                  placeholder="What does this snippet do or solve?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="binary-search, dsa, templates"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Raw Code Content</label>
              <textarea
                placeholder="// Write or paste snippet here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={6}
                style={{
                  padding: '10px 12px',
                  background: 'var(--glass-input-bg)',
                  border: '1px solid var(--glass-input-border)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--mono)',
                  fontSize: '0.8rem',
                  resize: 'vertical'
                }}
                required
              />
            </div>

            <Button type="submit" variant="primary" size="sm" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
              Commit Snippet
            </Button>
          </form>
        </Card>
      )}

      {/* Filter and Search Panel */}
      <div style={{
        display: 'flex',
        gap: '12px',
        background: 'var(--glass-card-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: '8px',
        padding: '12px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '200px', background: 'var(--glass-input-bg)', border: '1px solid var(--glass-input-border)', borderRadius: '6px', padding: '6px 10px' }}>
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search snippets..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none',
              width: '100%'
            }}
          />
        </div>

        {/* Language Filter */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', maxWidth: '100%', paddingBottom: '2px' }}>
          {['All', ...languages.slice(0, 5)].map(l => (
            <span
              key={l}
              onClick={() => setLangFilter(l)}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '20px',
                cursor: 'pointer',
                background: langFilter === l ? 'var(--color-primary)' : 'var(--glass-btn-bg)',
                color: langFilter === l ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--glass-border)',
                whiteSpace: 'nowrap'
              }}
            >
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Display List */}
      {filteredSnippets.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          border: '1px dashed var(--glass-border)',
          borderRadius: '8px'
        }}>
          No snippets matching your search. Add snippets to reuse code template patterns!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredSnippets.map((snip) => (
            <Card
              key={snip.id}
              hoverable={false}
              style={{ padding: '16px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Header info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.7rem', background: 'var(--color-primary-glow)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                      {snip.lang}
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      {snip.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => toggleFavorite(snip)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', color: snip.favorite ? 'var(--color-danger)' : 'var(--text-muted)' }}
                    >
                      <Heart size={14} fill={snip.favorite ? 'var(--color-danger)' : 'transparent'} />
                    </button>

                    <Button 
                      variant="glass" 
                      size="sm" 
                      onClick={() => handleCopy(snip.id, snip.code)}
                      iconLeft={copiedId === snip.id ? <Check size={12} style={{ color: 'var(--color-success)' }} /> : <Copy size={12} />}
                      style={{ height: '24px', padding: '0 8px', fontSize: '0.75rem' }}
                    >
                      {copiedId === snip.id ? 'Copied' : 'Copy'}
                    </Button>

                    <button
                      onClick={() => onDeleteSnippet(snip.id)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--text-muted)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {snip.description && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {snip.description}
                  </p>
                )}

                {/* Preformatted code snippet block */}
                <pre style={{
                  margin: 0,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--mono)',
                  fontSize: '0.8rem',
                  overflowX: 'auto',
                  maxHeight: '180px',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.5
                }}>
                  <code>{snip.code}</code>
                </pre>

                {/* Tags bottom list */}
                {snip.tags && snip.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {snip.tags.map((tag, idx) => (
                      <span key={idx} style={{ fontSize: '0.65rem', background: 'var(--glass-btn-bg)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '4px' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SnippetManager;
