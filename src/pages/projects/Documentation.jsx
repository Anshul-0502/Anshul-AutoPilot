import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { FileText, Save, Edit3, Eye } from 'lucide-react';

const Documentation = ({ project, onUpdateProject }) => {
  const [activeDocType, setActiveDocType] = useState('README');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const docTypes = [
    { type: 'README', label: 'README.md' },
    { type: 'Playbook', label: 'Master Playbook' },
    { type: 'Requirements', label: 'Functional Requirements' },
    { type: 'API Notes', label: 'API Endpoints & Specs' },
    { type: 'Database Design', label: 'Schema Architecture' }
  ];

  // Sync content with project docs on tab switch
  useEffect(() => {
    const doc = (project.docs || []).find(d => d.type === activeDocType);
    setContent(doc ? doc.content : `# ${activeDocType}\n\nAdd content details here...`);
    setIsEditing(false);
  }, [activeDocType, project.docs]);

  const handleSave = () => {
    // Check if doc exists, if so update, else append
    const docs = project.docs || [];
    let updatedDocs;

    if (docs.some(d => d.type === activeDocType)) {
      updatedDocs = docs.map(d => d.type === activeDocType ? { ...d, content } : d);
    } else {
      updatedDocs = [...docs, { id: Date.now(), type: activeDocType, content }];
    }

    onUpdateProject({
      ...project,
      docs: updatedDocs
    });

    setIsEditing(false);
    alert(`Saved documentation update for ${activeDocType}.`);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px' }} className="docs-responsive-grid">
      
      {/* Left panel: switch pages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Card
          header={<span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Wiki Chapters</span>}
          hoverable={false}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {docTypes.map((doc) => (
              <div
                key={doc.type}
                onClick={() => setActiveDocType(doc.type)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: activeDocType === doc.type ? 'var(--color-primary-glow)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: activeDocType === doc.type ? 'var(--color-primary)' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
                className="hover-scale"
              >
                <FileText size={14} />
                {doc.label}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Right panel: rich document reader and simple text editor */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <Card
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>{activeDocType} Editor Panel</span>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button 
                  variant="glass" 
                  size="sm" 
                  onClick={() => setIsEditing(!isEditing)}
                  iconLeft={isEditing ? <Eye size={12} /> : <Edit3 size={12} />}
                  style={{ height: '26px', padding: '0 8px', fontSize: '0.75rem' }}
                >
                  {isEditing ? 'Preview Mode' : 'Edit Mode'}
                </Button>

                {isEditing && (
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={handleSave}
                    iconLeft={<Save size={12} />}
                    style={{ height: '26px', padding: '0 8px', fontSize: '0.75rem' }}
                  >
                    Save Wiki
                  </Button>
                )}
              </div>
            </div>
          }
          hoverable={false}
        >
          <div style={{ minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
            {isEditing ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={16}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--glass-input-bg)',
                  border: '1px solid var(--glass-input-border)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--mono)',
                  resize: 'vertical',
                  lineHeight: 1.5,
                  boxSizing: 'border-box'
                }}
              />
            ) : (
              <pre style={{
                margin: 0,
                padding: '16px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontFamily: 'var(--sans)',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6,
                overflowX: 'auto',
                flex: 1
              }}>
                <code>{content}</code>
              </pre>
            )}
          </div>
        </Card>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .docs-responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Documentation;
