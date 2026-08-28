import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Layout, CheckSquare, Square, Check } from 'lucide-react';

const DashboardSettings = ({ dashboard = {}, onSave }) => {
  const [widgets, setWidgets] = useState(dashboard.widgets || {
    study: true,
    coding: true,
    tasks: true,
    projects: true,
    health: true,
    skills: true
  });
  const [defaultLanding, setDefaultLanding] = useState(dashboard.defaultLanding || 'overview');
  const [success, setSuccess] = useState(false);

  const handleWidgetToggle = (key) => {
    setWidgets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        widgets,
        defaultLanding
      });
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const widgetItems = [
    { key: 'study', name: 'Study Tracker Widget', desc: 'Displays total focus hours and active subject allocations.' },
    { key: 'coding', name: 'Coding Problems solved widget', desc: 'Displays daily programming targets and streaks.' },
    { key: 'tasks', name: 'Tasks checklist widget', desc: 'Displays urgent pending, critical, and completed tasks.' },
    { key: 'projects', name: 'Projects progress widget', desc: 'Displays active project completion timelines.' },
    { key: 'health', name: 'Hydration & Sleep widget', desc: 'Displays today\'s glasses count and sleep metrics.' },
    { key: 'skills', name: 'Skill Arena Level widget', desc: 'Displays level progression, total XP, and streaks.' }
  ];

  return (
    <Card 
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layout size={18} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Dashboard Widget Customization</span>
        </div>
      }
      style={{ border: '1px solid var(--glass-border)' }}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'left' }}>
        
        {/* Default Landing route select */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Default Landing Workspace:</label>
          <select
            value={defaultLanding}
            onChange={(e) => setDefaultLanding(e.target.value)}
            style={{
              padding: '8px',
              background: 'var(--glass-input-bg)',
              border: '1px solid var(--glass-input-border)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              width: '100%',
              maxWidth: '300px'
            }}
          >
            <option value="overview" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Overview Dashboard</option>
            <option value="study" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Study Hub</option>
            <option value="tasks" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Tasks & Todo Lists</option>
            <option value="projects" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Projects Workspace</option>
            <option value="health" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Health & Wellness Hub</option>
          </select>
        </div>

        <div style={{ width: '100%', height: '1px', background: 'var(--glass-border)' }} />

        {/* Visibility checkboxes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Show/Hide Widgets on Home Screen:</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
            {widgetItems.map(w => {
              const isChecked = !!widgets[w.key];
              return (
                <div
                  key={w.key}
                  onClick={() => handleWidgetToggle(w.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'start',
                    gap: '12px',
                    cursor: 'pointer',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease'
                  }}
                  className="glass-btn-hover"
                >
                  <span style={{ display: 'flex', marginTop: '2px', color: isChecked ? 'var(--color-primary)' : 'var(--text-muted)' }}>
                    {isChecked ? <CheckSquare size={18} /> : <Square size={18} />}
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{w.name}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{w.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button type="submit" variant="primary">
            Save Layout Settings
          </Button>

          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700 }}>
              <Check size={14} />
              <span>Dashboard widgets updated!</span>
            </div>
          )}
        </div>

      </form>
    </Card>
  );
};

export default DashboardSettings;
