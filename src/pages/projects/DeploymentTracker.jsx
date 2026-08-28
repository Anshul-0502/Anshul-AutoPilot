import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Plus, Trash2, ExternalLink, Globe, Server, CheckCircle2 } from 'lucide-react';

const DeploymentTracker = ({ project, onUpdateProject }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [env, setEnv] = useState('Development');
  const [platform, setPlatform] = useState('Vercel');
  const [url, setUrl] = useState('');
  const [version, setVersion] = useState(project.version || 'v1.0.0');

  const envs = ['Development', 'Testing', 'Production'];
  const platforms = ['Vercel', 'Netlify', 'Render', 'GitHub Pages', 'Firebase', 'AWS', 'Localhost', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl) && platform !== 'Localhost') {
      formattedUrl = 'https://' + formattedUrl;
    }

    const newDeployment = {
      id: Date.now(),
      env,
      platform,
      url: formattedUrl,
      version,
      date: new Date().toLocaleDateString()
    };

    onUpdateProject({
      ...project,
      deployments: [...(project.deployments || []), newDeployment]
    });

    setUrl('');
    setShowAddForm(false);
  };

  const handleDelete = (deployId) => {
    onUpdateProject({
      ...project,
      deployments: project.deployments.filter(d => d.id !== deployId)
    });
  };

  const getEnvColor = (environment) => {
    switch (environment?.toLowerCase()) {
      case 'production': return 'var(--color-success)';
      case 'testing': return 'var(--color-info)';
      case 'development':
      default:
        return 'var(--color-primary)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Environment Deployment Pipelines
        </h4>

        <Button 
          variant="glass" 
          size="sm" 
          onClick={() => setShowAddForm(!showAddForm)}
          iconLeft={<Plus size={14} />}
          style={{ height: '30px', padding: '0 10px', fontSize: '0.8rem' }}
        >
          {showAddForm ? 'Cancel' : 'Log Deployment'}
        </Button>
      </div>

      {/* Log Form overlay */}
      {showAddForm && (
        <Card
          header={<span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>🚀 Log Build Deployment</span>}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Environment Target</label>
                <select
                  value={env}
                  onChange={(e) => setEnv(e.target.value)}
                  style={{
                    padding: '8px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  {envs.map(ev => (
                    <option key={ev} value={ev} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{ev}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Hosting Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  style={{
                    padding: '8px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  {platforms.map(pl => (
                    <option key={pl} value={pl} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{pl}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Build Version</label>
                <input
                  type="text"
                  placeholder="e.g. v1.0.0"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
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
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Deployment URL</label>
              <input
                type="text"
                placeholder="e.g. autopilot.vercel.app, localhost:3000"
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

            <Button type="submit" variant="primary" size="sm" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
              Register Log
            </Button>
          </form>
        </Card>
      )}

      {/* Grid listing deployments */}
      {(!project.deployments || project.deployments.length === 0) ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          border: '1px dashed var(--glass-border)',
          borderRadius: '8px'
        }}>
          No deployment logs recorded. Register staging, development or production builds!
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {project.deployments.map((dep) => {
            const eColor = getEnvColor(dep.env);
            return (
              <Card
                key={dep.id}
                hoverable={true}
                style={{ padding: '16px' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  
                  {/* Env, platform and actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ 
                      fontSize: '0.65rem', 
                      color: eColor, 
                      fontWeight: 700,
                      background: 'var(--glass-btn-bg)',
                      border: `1px solid ${eColor}`,
                      padding: '1px 8px',
                      borderRadius: '4px'
                    }}>
                      {dep.env}
                    </span>

                    <button
                      onClick={() => handleDelete(dep.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex' }}
                      className="hover-scale"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Platform & Version */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      padding: '6px', 
                      background: 'var(--glass-btn-bg)', 
                      border: '1px solid var(--glass-border)',
                      borderRadius: '6px',
                      display: 'flex',
                      color: 'var(--color-primary)'
                    }}>
                      <Server size={14} />
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <a 
                        href={dep.url} 
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
                        {dep.platform}
                        <ExternalLink size={10} style={{ color: 'var(--color-primary)' }} />
                      </a>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Build Version: {dep.version}</span>
                    </div>
                  </div>

                  {/* Date detail */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '8px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} style={{ color: 'var(--color-success)' }} /> Build Online
                    </span>
                    <span>{dep.date}</span>
                  </div>

                </div>
              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default DeploymentTracker;
