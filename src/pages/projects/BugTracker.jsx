import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Plus, Trash2, Search, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

const BugTracker = ({ project, onUpdateProject }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [severity, setSeverity] = useState('Major');
  const [module, setModule] = useState('Core');

  // Filter states
  const [searchVal, setSearchVal] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const severities = ['Minor', 'Major', 'Critical'];
  const modules = ['Core', 'UI/UX', 'Database', 'API Integration', 'Authentication'];
  const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newBug = {
      id: Date.now(),
      title: title.trim(),
      description: desc.trim(),
      severity,
      module,
      status: 'Open',
      date: new Date().toLocaleDateString()
    };

    onUpdateProject({
      ...project,
      bugs: [...(project.bugs || []), newBug]
    });

    setTitle('');
    setDesc('');
    setSeverity('Major');
    setModule('Core');
    setShowAddForm(false);
  };

  const handleDelete = (bugId) => {
    onUpdateProject({
      ...project,
      bugs: project.bugs.filter(b => b.id !== bugId)
    });
  };

  const handleStatusChange = (bug, nextStatus) => {
    onUpdateProject({
      ...project,
      bugs: project.bugs.map(b => b.id === bug.id ? { ...b, status: nextStatus } : b)
    });
  };

  const getSeverityStyle = (sev) => {
    switch (sev?.toLowerCase()) {
      case 'critical':
        return { color: 'var(--color-danger)', border: '1px solid var(--color-danger)' };
      case 'major':
        return { color: 'var(--color-accent)', border: '1px solid var(--color-accent)' };
      case 'minor':
      default:
        return { color: 'var(--color-success)', border: '1px solid var(--color-success)' };
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
      case 'closed':
        return { background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)' };
      case 'in progress':
        return { background: 'var(--color-primary-glow)', color: 'var(--color-primary)' };
      case 'open':
      default:
        return { background: 'var(--glass-btn-bg)', color: 'var(--text-secondary)' };
    }
  };

  const filteredBugs = (project.bugs || []).filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchVal.toLowerCase()) || 
                          b.description.toLowerCase().includes(searchVal.toLowerCase()) ||
                          b.module.toLowerCase().includes(searchVal.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top action header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Active Issue Ticket Register
        </h4>

        <Button 
          variant="glass" 
          size="sm" 
          onClick={() => setShowAddForm(!showAddForm)}
          iconLeft={<Plus size={14} />}
          style={{ height: '30px', padding: '0 10px', fontSize: '0.8rem' }}
        >
          {showAddForm ? 'Cancel' : 'Report Bug'}
        </Button>
      </div>

      {/* Add Bug Form overlay */}
      {showAddForm && (
        <Card
          header={<span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>🐞 Open Ticket Report</span>}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Bug / Issue Title</label>
                <input
                  type="text"
                  placeholder="e.g. Memory leak on dashboard widget toggle, Auth token expires early"
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
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
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
                  {severities.map(s => (
                    <option key={s} value={s} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Description Details</label>
                <input
                  type="text"
                  placeholder="Steps to reproduce, expected behavior, or console logs..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
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
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Assigned Module</label>
                <select
                  value={module}
                  onChange={(e) => setModule(e.target.value)}
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
                  {modules.map(m => (
                    <option key={m} value={m} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button type="submit" variant="primary" size="sm" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
              File Ticket
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
            placeholder="Search tickets or modules..."
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

        {/* Filter status */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {['All', 'Open', 'In Progress', 'Resolved'].map(st => (
            <span
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '20px',
                cursor: 'pointer',
                background: statusFilter === st ? 'var(--color-primary)' : 'var(--glass-btn-bg)',
                color: statusFilter === st ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--glass-border)'
              }}
            >
              {st}
            </span>
          ))}
        </div>
      </div>

      {/* Display Grid of Bug Cards */}
      {filteredBugs.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          border: '1px dashed var(--glass-border)',
          borderRadius: '8px'
        }}>
          No bug tickets registered yet. Everything is running smoothly!
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {filteredBugs.map((bug) => {
            const sevStyle = getSeverityStyle(bug.severity);
            const statStyle = getStatusStyle(bug.status);
            const isClosed = bug.status === 'Resolved' || bug.status === 'Closed';

            return (
              <Card
                key={bug.id}
                hoverable={false}
                style={{ padding: '16px', border: isClosed ? '1px solid var(--color-success)' : '1px solid var(--glass-border)' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  
                  {/* Row 1: Module & Severity */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.65rem', background: 'var(--glass-btn-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      {bug.module}
                    </span>

                    <span style={{ 
                      fontSize: '0.65rem', 
                      color: sevStyle.color, 
                      fontWeight: 700,
                      background: 'var(--glass-btn-bg)',
                      border: sevStyle.border,
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}>
                      {bug.severity}
                    </span>
                  </div>

                  {/* Title */}
                  <span style={{ 
                    fontWeight: 700, 
                    color: isClosed ? 'var(--text-muted)' : 'var(--text-primary)', 
                    fontSize: '0.9rem',
                    textDecoration: isClosed ? 'line-through' : 'none'
                  }}>
                    {bug.title}
                  </span>

                  {/* Description details */}
                  {bug.description && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                      {bug.description}
                    </p>
                  )}

                  {/* Footer status switcher & actions */}
                  <div style={{ display: 'flex', borderTop: '1px solid var(--glass-border)', paddingTop: '10px', marginTop: '6px', alignItems: 'center', justifyContent: 'space-between' }}>
                    
                    {/* Status Select switcher */}
                    <select
                      value={bug.status}
                      onChange={(e) => handleStatusChange(bug, e.target.value)}
                      style={{
                        padding: '3px 6px',
                        background: statStyle.background,
                        border: '1px solid var(--glass-border)',
                        borderRadius: '4px',
                        color: statStyle.color,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {statuses.map(st => (
                        <option key={st} value={st} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{st}</option>
                      ))}
                    </select>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{bug.date}</span>
                      <button
                        onClick={() => handleDelete(bug.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px', display: 'flex' }}
                        className="hover-scale"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

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

export default BugTracker;
