import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Plus, Trash2, ExternalLink, Globe, Code, Image as ImageIcon, FileText } from 'lucide-react';

const Resources = ({ project, onUpdateProject }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('GitHub link');
  const [url, setUrl] = useState('');

  const types = ['GitHub link', 'Figma link', 'Wireframe URL', 'PDF Document', 'Other Link'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const newResource = {
      id: Date.now(),
      name: name.trim(),
      type,
      url: formattedUrl
    };

    onUpdateProject({
      ...project,
      resources: [...(project.resources || []), newResource]
    });

    setName('');
    setUrl('');
    setShowAddForm(false);
  };

  const handleDelete = (resourceId) => {
    onUpdateProject({
      ...project,
      resources: project.resources.filter(r => r.id !== resourceId)
    });
  };

  const getIcon = (resType) => {
    switch (resType) {
      case 'GitHub link':
        return <Code size={16} style={{ color: 'var(--text-primary)' }} />;
      case 'Figma link':
      case 'Wireframe URL':
        return <ImageIcon size={16} style={{ color: 'var(--color-primary)' }} />;
      case 'PDF Document':
        return <FileText size={16} style={{ color: 'var(--color-accent)' }} />;
      default:
        return <Globe size={16} style={{ color: 'var(--color-secondary)' }} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Design Assets & Code Resources
        </h4>

        <Button 
          variant="glass" 
          size="sm" 
          onClick={() => setShowAddForm(!showAddForm)}
          iconLeft={<Plus size={14} />}
          style={{ height: '30px', padding: '0 10px', fontSize: '0.8rem' }}
        >
          {showAddForm ? 'Cancel' : 'Add Link'}
        </Button>
      </div>

      {/* Add Resource Link Form overlay */}
      {showAddForm && (
        <Card
          header={<span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>➕ Link Project Resource Asset</span>}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '180px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Asset Name</label>
              <input
                type="text"
                placeholder="e.g. GitHub Repository, Figma Design Canvas"
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
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Link Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{
                  padding: '8px',
                  background: 'var(--glass-input-bg)',
                  border: '1px solid var(--glass-input-border)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  height: '37px'
                }}
              >
                {types.map(t => (
                  <option key={t} value={t} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{t}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1.2, minWidth: '220px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Asset URL</label>
              <input
                type="text"
                placeholder="e.g. figma.com/file/..., github.com/..."
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

            <Button type="submit" variant="primary" size="sm" style={{ height: '37px' }}>
              Save Resource
            </Button>
          </form>
        </Card>
      )}

      {/* Grid displays resource links */}
      {(!project.resources || project.resources.length === 0) ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          border: '1px dashed var(--glass-border)',
          borderRadius: '8px'
        }}>
          No external asset links set. Bookmark repositories, Figma frames, or documentation canvases!
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {project.resources.map((res) => (
            <Card
              key={res.id}
              hoverable={true}
              style={{ padding: '16px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ 
                    padding: '8px', 
                    background: 'var(--glass-btn-bg)', 
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    display: 'flex'
                  }}>
                    {getIcon(res.type)}
                  </span>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <a 
                      href={res.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ 
                        fontSize: '0.85rem', 
                        fontWeight: 700, 
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>
                        {res.name}
                      </span>
                      <ExternalLink size={10} style={{ color: 'var(--color-primary)' }} />
                    </a>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{res.type}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(res.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                  className="hover-scale"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
};

export default Resources;
