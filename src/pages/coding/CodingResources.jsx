import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Plus, Trash2, ExternalLink, Search, Globe, Video, BookOpen, FileText } from 'lucide-react';

const CodingResources = ({ resources, onAddResource, onDeleteResource }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('Documentation');
  const [url, setUrl] = useState('');
  const [lang, setLang] = useState('General');
  const [notes, setNotes] = useState('');

  // Search & Filter
  const [searchVal, setSearchVal] = useState('');
  const [selectedLang, setSelectedLang] = useState('All');

  const languages = ['General', 'Java', 'Python', 'C++', 'JavaScript', 'SQL', 'React', 'TypeScript', 'CSS/HTML'];
  const types = ['Documentation', 'Tutorial', 'YouTube Video', 'GitHub Repo', 'Article', 'Cheat Sheet'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    // Validate and prepend http if missing
    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    onAddResource({
      id: Date.now(),
      name: name.trim(),
      type,
      url: formattedUrl,
      lang,
      notes: notes.trim()
    });

    setName('');
    setUrl('');
    setNotes('');
    setLang('General');
    setType('Documentation');
    setShowAddForm(false);
  };

  const getIcon = (resType) => {
    switch (resType) {
      case 'YouTube Video':
        return <Video size={16} style={{ color: 'var(--color-danger)' }} />;
      case 'Documentation':
      case 'Cheat Sheet':
        return <FileText size={16} style={{ color: 'var(--color-primary)' }} />;
      case 'GitHub Repo':
        return <BookOpen size={16} style={{ color: 'var(--text-primary)' }} />;
      default:
        return <Globe size={16} style={{ color: 'var(--color-secondary)' }} />;
    }
  };

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchVal.toLowerCase()) || 
                          r.notes.toLowerCase().includes(searchVal.toLowerCase());
    const matchesLang = selectedLang === 'All' || r.lang === selectedLang;
    return matchesSearch && matchesLang;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top action header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>
          Documentation & Learning Resources
        </h3>
        <Button 
          variant="glass" 
          size="sm" 
          onClick={() => setShowAddForm(!showAddForm)}
          iconLeft={<Plus size={14} />}
          style={{ height: '30px', fontSize: '0.8rem', padding: '0 10px' }}
        >
          {showAddForm ? 'Cancel' : 'Save Reference'}
        </Button>
      </div>

      {/* Add resource form */}
      {showAddForm && (
        <Card
          header={<span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>📚 Save Documentation / Resource Link</span>}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Resource Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Java Streams Cheat Sheet, MDN Flexbox Guide"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Resource Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{
                    padding: '8px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  {types.map(t => (
                    <option key={t} value={t} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>URL / Web Address</label>
                <input
                  type="text"
                  placeholder="e.g. devdocs.io/java, github.com/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
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
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Language Category</label>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Notes / Quick Details</label>
              <input
                type="text"
                placeholder="e.g. Useful for interview preparation, revision rules..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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

            <Button type="submit" variant="primary" size="sm" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
              Save Reference
            </Button>
          </form>
        </Card>
      )}

      {/* Toolbar filters */}
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
            placeholder="Search resources..."
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

        {/* Category Picker */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', maxWidth: '100%', paddingBottom: '2px' }}>
          {languages.map(l => (
            <span
              key={l}
              onClick={() => setSelectedLang(l === 'General' ? 'All' : l)}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '20px',
                cursor: 'pointer',
                background: (selectedLang === l || (selectedLang === 'All' && l === 'General')) ? 'var(--color-primary)' : 'var(--glass-btn-bg)',
                color: (selectedLang === l || (selectedLang === 'All' && l === 'General')) ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--glass-border)',
                whiteSpace: 'nowrap'
              }}
            >
              {l === 'General' ? 'All Stack' : l}
            </span>
          ))}
        </div>
      </div>

      {/* Grid distribution */}
      {filteredResources.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          border: '1px dashed var(--glass-border)',
          borderRadius: '8px'
        }}>
          No references logged yet. Save bookmark references to documentation or guides!
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {filteredResources.map((res) => (
            <Card
              key={res.id}
              hoverable={true}
              style={{ padding: '16px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'space-between', height: '100%' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {/* Category and Type */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.65rem', background: 'var(--glass-btn-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      {res.lang}
                    </span>

                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {getIcon(res.type)}
                      {res.type}
                    </span>
                  </div>

                  {/* Name link */}
                  <a 
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ 
                      fontWeight: 700, 
                      color: 'var(--text-primary)', 
                      fontSize: '0.9rem', 
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    className="hover-opacity"
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                      {res.name}
                    </span>
                    <ExternalLink size={12} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  </a>

                  {/* Notes */}
                  {res.notes && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      {res.notes}
                    </p>
                  )}
                </div>

                {/* Footer action Delete */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--glass-border)', paddingTop: '8px', marginTop: '4px' }}>
                  <button
                    onClick={() => onDeleteResource(res.id)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--text-muted)' }}
                    className="hover-scale"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

              </div>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
};

export default CodingResources;
