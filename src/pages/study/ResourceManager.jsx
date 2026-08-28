import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Plus, ExternalLink, Trash2, Star, BookOpen, Link, Search } from 'lucide-react';

const YoutubeIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const GithubIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const ResourceManager = ({ subjects, resources, onAddResource, onDeleteResource, onToggleFavorite }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('Website');
  const [subject, setSubject] = useState(subjects[0] ? subjects[0].name : 'General');
  const [favorite, setFavorite] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    // Standardize URL protocol
    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    onAddResource({
      title: title.trim(),
      url: formattedUrl,
      type,
      subject,
      favorite,
      id: Date.now()
    });

    setTitle('');
    setUrl('');
    setFavorite(false);
    setShowAddForm(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'YouTube':
        return <YoutubeIcon size={16} style={{ color: '#ef4444' }} />;
      case 'GitHub':
        return <GithubIcon size={16} style={{ color: 'var(--text-primary)' }} />;
      case 'Documentation':
        return <BookOpen size={16} style={{ color: 'var(--color-secondary)' }} />;
      default:
        return <Link size={16} style={{ color: 'var(--color-primary)' }} />;
    }
  };

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          res.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubjectFilter === 'All' || res.subject === selectedSubjectFilter;
    return matchesSearch && matchesSubject;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>
          Study Resources & Bookmarks
        </h3>
        <Button 
          variant="glass" 
          size="sm" 
          onClick={() => setShowAddForm(!showAddForm)}
          iconLeft={<Plus size={14} />}
          style={{ padding: '2px 8px', fontSize: '0.8rem', height: '28px' }}
        >
          {showAddForm ? 'Cancel' : 'Add Link / Resource'}
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card
          header={
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              🔗 Bookmarks & Links Manager
            </span>
          }
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Resource Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g. GeeksforGeeks Sorting Algos"
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
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>URL / Web Address</label>
                <input
                  type="text"
                  placeholder="e.g. github.com/username/repo"
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: '12px', alignItems: 'end' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Subject Category</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{
                    padding: '8px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  {subjects.map((subj, idx) => (
                    <option key={idx} value={subj.name} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                      {subj.name}
                    </option>
                  ))}
                  {subjects.length === 0 && (
                    <option value="General" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>General</option>
                  )}
                </select>
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
                  <option value="Website" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Website Link</option>
                  <option value="YouTube" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>YouTube Video</option>
                  <option value="GitHub" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>GitHub Repository</option>
                  <option value="Documentation" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Documentation Page</option>
                  <option value="Blog" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Article / Blog Post</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', paddingBottom: '8px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Favorite</label>
                <input
                  type="checkbox"
                  checked={favorite}
                  onChange={(e) => setFavorite(e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: 'var(--color-primary)',
                    cursor: 'pointer'
                  }}
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="sm" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
              Add Resource
            </Button>
          </form>
        </Card>
      )}

      {/* Filters Panel */}
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
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '200px', background: 'var(--glass-input-bg)', border: '1px solid var(--glass-input-border)', borderRadius: '6px', padding: '6px 10px' }}>
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search links..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* Subject Filter */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span 
            onClick={() => setSelectedSubjectFilter('All')}
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '20px',
              cursor: 'pointer',
              background: selectedSubjectFilter === 'All' ? 'var(--color-primary)' : 'var(--glass-btn-bg)',
              color: selectedSubjectFilter === 'All' ? '#ffffff' : 'var(--text-secondary)',
              border: '1px solid var(--glass-border)'
            }}
          >
            All
          </span>
          {subjects.map((subj) => (
            <span 
              key={subj.name}
              onClick={() => setSelectedSubjectFilter(subj.name)}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '20px',
                cursor: 'pointer',
                background: selectedSubjectFilter === subj.name ? 'var(--color-primary)' : 'var(--glass-btn-bg)',
                color: selectedSubjectFilter === subj.name ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--glass-border)'
              }}
            >
              {subj.name}
            </span>
          ))}
        </div>
      </div>

      {/* Grid displays */}
      {filteredResources.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '36px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          border: '1px dashed var(--glass-border)',
          borderRadius: '8px'
        }}>
          No links or bookmarks registered here. Click 'Add Link / Resource' to start.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {filteredResources.map((res) => (
            <div 
              key={res.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '8px',
                padding: '16px',
                background: 'var(--glass-card-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              className="glass-card-hover"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    {getIcon(res.type)}
                    <span style={{ 
                      fontWeight: 600, 
                      color: 'var(--text-primary)', 
                      fontSize: '0.9rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {res.title}
                    </span>
                  </div>
                  <button 
                    onClick={() => onToggleFavorite(res.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: res.favorite ? 'var(--color-accent)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex'
                    }}
                    className="hover-scale"
                  >
                    <Star size={14} style={{ fill: res.favorite ? 'currentColor' : 'none' }} />
                  </button>
                </div>

                <span style={{ 
                  fontSize: '0.7rem', 
                  alignSelf: 'flex-start',
                  background: 'var(--glass-btn-bg)', 
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-secondary)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 600
                }}>
                  {res.subject}
                </span>

                <span style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--text-muted)',
                  wordBreak: 'break-all',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {res.url}
                </span>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                borderTop: '1px solid var(--glass-border)', 
                paddingTop: '12px', 
                marginTop: '4px',
                alignItems: 'center'
              }}>
                <a 
                  href={res.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.8rem',
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                  className="hover-scale"
                >
                  Visit Resource
                  <ExternalLink size={12} />
                </a>

                <button 
                  onClick={() => onDeleteResource(res.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '2px',
                    marginLeft: 'auto',
                    display: 'flex'
                  }}
                  className="hover-scale"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceManager;
