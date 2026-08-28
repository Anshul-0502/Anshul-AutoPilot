import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Plus, Trash2, Edit3, Heart, Search, Eye, ChevronLeft } from 'lucide-react';

const CodingNotes = ({ notes, onAddNote, onDeleteNote, onUpdateNote }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  
  // Note Form Fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [lang, setLang] = useState('Java');

  // Search & Filter
  const [searchVal, setSearchVal] = useState('');
  const [favOnly, setFavOnly] = useState(false);
  
  // Active Viewer
  const [activeNoteDetail, setActiveNoteDetail] = useState(null);

  const presets = ['Java', 'Python', 'C++', 'JavaScript', 'SQL', 'React', 'TypeScript', 'General'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const noteData = {
      title: title.trim(),
      content: content.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      codeSnippet: codeSnippet.trim(),
      lang,
      favorite: editingNote ? editingNote.favorite : false,
      date: new Date().toLocaleDateString()
    };

    if (editingNote) {
      onUpdateNote({
        ...editingNote,
        ...noteData
      });
      setEditingNote(null);
    } else {
      onAddNote({
        id: Date.now(),
        ...noteData
      });
    }

    // Reset Form
    setTitle('');
    setContent('');
    setTags('');
    setCodeSnippet('');
    setLang('Java');
    setShowAddForm(false);
  };

  const handleEditClick = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags.join(', '));
    setCodeSnippet(note.codeSnippet || '');
    setLang(note.lang || 'Java');
    setShowAddForm(true);
    setActiveNoteDetail(null);
  };

  const toggleFavorite = (note) => {
    onUpdateNote({
      ...note,
      favorite: !note.favorite
    });
  };

  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchVal.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchVal.toLowerCase()) ||
                          n.tags.some(t => t.toLowerCase().includes(searchVal.toLowerCase()));
    const matchesFav = !favOnly || n.favorite;
    return matchesSearch && matchesFav;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>
          Coding Notes Vault
        </h3>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {activeNoteDetail && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setActiveNoteDetail(null)}
              iconLeft={<ChevronLeft size={14} />}
              style={{ height: '30px', fontSize: '0.8rem', padding: '0 10px' }}
            >
              Back to List
            </Button>
          )}

          <Button 
            variant="glass" 
            size="sm" 
            onClick={() => {
              setEditingNote(null);
              // Reset values
              setTitle('');
              setContent('');
              setTags('');
              setCodeSnippet('');
              setLang('Java');
              setShowAddForm(!showAddForm);
              setActiveNoteDetail(null);
            }}
            iconLeft={<Plus size={14} />}
            style={{ height: '30px', fontSize: '0.8rem', padding: '0 10px' }}
          >
            {showAddForm ? 'Cancel Note' : 'Create Note'}
          </Button>
        </div>
      </div>

      {/* Editor Form Overlay / Component */}
      {showAddForm && (
        <Card
          header={
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {editingNote ? '📝 Edit Note' : '📝 Create Programming Note'}
            </span>
          }
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Note Title</label>
                <input
                  type="text"
                  placeholder="e.g. Graph Traversals DFS vs BFS"
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
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Category Language</label>
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
                  {presets.map(p => (
                    <option key={p} value={p} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Content Description</label>
              <textarea
                placeholder="Explain the concept, rules, formulas, algorithm details..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                style={{
                  padding: '10px 12px',
                  background: 'var(--glass-input-bg)',
                  border: '1px solid var(--glass-input-border)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  resize: 'vertical'
                }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Optional Code Block</label>
                <textarea
                  placeholder="void dfs(int u) { ... }"
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  rows={4}
                  style={{
                    padding: '8px 12px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--mono)',
                    fontSize: '0.8rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="dfs, graph, recursion"
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
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Help: separate tags by comma.</span>
              </div>
            </div>

            <Button type="submit" variant="primary" size="sm" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
              {editingNote ? 'Save Note' : 'Commit Note'}
            </Button>
          </form>
        </Card>
      )}

      {/* Main View Split */}
      {!showAddForm && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: activeNoteDetail ? '300px 1fr' : '1fr',
          gap: '20px',
          transition: 'all 0.3s ease'
        }} className="notes-responsive-split">
          
          {/* Note Selection Lists */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Search and filter toolbar */}
            <div style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              background: 'var(--glass-card-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              padding: '10px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '150px', background: 'var(--glass-input-bg)', border: '1px solid var(--glass-input-border)', borderRadius: '6px', padding: '5px 8px' }}>
                <Search size={14} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                    outline: 'none',
                    width: '100%'
                  }}
                />
              </div>

              <span
                onClick={() => setFavOnly(!favOnly)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-border)',
                  background: favOnly ? 'rgba(239, 68, 68, 0.1)' : 'var(--glass-btn-bg)',
                  color: favOnly ? 'var(--color-danger)' : 'var(--text-secondary)'
                }}
              >
                <Heart size={12} fill={favOnly ? 'var(--color-danger)' : 'transparent'} />
                Favs Only
              </span>
            </div>

            {/* Note items display list */}
            {filteredNotes.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                border: '1px dashed var(--glass-border)',
                borderRadius: '8px'
              }}>
                No notes found matching your search. Create one!
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: activeNoteDetail ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '16px'
              }}>
                {filteredNotes.map((note) => (
                  <Card
                    key={note.id}
                    hoverable={true}
                    onClick={() => setActiveNoteDetail(note)}
                    style={{
                      cursor: 'pointer',
                      padding: '16px',
                      border: activeNoteDetail?.id === note.id ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', background: 'var(--glass-btn-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', padding: '1px 8px', borderRadius: '4px', fontWeight: 600 }}>
                          {note.lang}
                        </span>
                        
                        <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => toggleFavorite(note)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', color: note.favorite ? 'var(--color-danger)' : 'var(--text-muted)' }}
                          >
                            <Heart size={14} fill={note.favorite ? 'var(--color-danger)' : 'transparent'} />
                          </button>
                          
                          <button
                            onClick={() => handleEditClick(note)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--text-muted)' }}
                          >
                            <Edit3 size={14} />
                          </button>

                          <button
                            onClick={() => onDeleteNote(note.id)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--text-muted)' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {note.title}
                      </span>

                      <p style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.4
                      }}>
                        {note.content}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', borderTop: '1px solid var(--glass-border)', paddingTop: '8px' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                          {note.date}
                        </span>

                        <span style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--color-primary)', fontWeight: 600 }}>
                          <Eye size={10} /> View details
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Active Note Reader Panel */}
          {activeNoteDetail && (
            <Card
              header={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', background: 'var(--color-primary-glow)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      {activeNoteDetail.lang}
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
                      {activeNoteDetail.title}
                    </span>
                  </div>
                  
                  <Button 
                    variant="glass" 
                    size="sm" 
                    onClick={() => setActiveNoteDetail(null)}
                    style={{ height: '24px', padding: '0 8px', fontSize: '0.75rem' }}
                  >
                    Close
                  </Button>
                </div>
              }
              hoverable={false}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  background: 'var(--glass-btn-bg)',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid var(--glass-border)'
                }}>
                  {activeNoteDetail.content}
                </p>

                {activeNoteDetail.codeSnippet && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                      Code Illustration
                    </span>
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
                      maxHeight: '200px',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.5
                    }}>
                      <code>{activeNoteDetail.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                {activeNoteDetail.tags && activeNoteDetail.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tags:</span>
                    {activeNoteDetail.tags.map((tag, idx) => (
                      <span key={idx} style={{ fontSize: '0.65rem', background: 'var(--glass-btn-bg-hover)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '4px' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}

        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .notes-responsive-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CodingNotes;
