import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Bell, CheckSquare, Square, Volume2, VolumeX, Check } from 'lucide-react';

const NotificationSettings = ({ notifications = {}, onSave }) => {
  const [notifyState, setNotifyState] = useState({
    tasks: notifications.tasks !== undefined ? notifications.tasks : true,
    planner: notifications.planner !== undefined ? notifications.planner : true,
    study: notifications.study !== undefined ? notifications.study : true,
    coding: notifications.coding !== undefined ? notifications.coding : true,
    projects: notifications.projects !== undefined ? notifications.projects : true,
    health: notifications.health !== undefined ? notifications.health : true,
    skills: notifications.skills !== undefined ? notifications.skills : true,
    focus: notifications.focus !== undefined ? notifications.focus : true,
    sound: notifications.sound !== undefined ? notifications.sound : true,
    voiceEnabled: notifications.voiceEnabled !== undefined ? notifications.voiceEnabled : true,
    preferredVoice: notifications.preferredVoice || 'Default'
  });
  const [success, setSuccess] = useState(false);

  const keysList = [
    { key: 'tasks', name: 'Task Reminders', desc: 'Trigger alerts when daily task deadlines approach.' },
    { key: 'planner', name: 'Planner Checklists', desc: 'Trigger alerts for daily focus schedules.' },
    { key: 'study', name: 'Study Focus Limits', desc: 'Trigger notifications when study focus intervals complete.' },
    { key: 'coding', name: 'Code Compilations', desc: 'Notify when problem solutions compile successfully.' },
    { key: 'projects', name: 'Project Milestones', desc: 'Trigger logs when milestone targets are updated.' },
    { key: 'health', name: 'Health Hydration', desc: 'Send water target water check-ins every 2 hours.' },
    { key: 'skills', name: 'Skill Arena Rank', desc: 'Notify upon leveling up or earning coins.' },
    { key: 'focus', name: 'Focus Countdown Clock', desc: 'Show visual countdown banners on browser pages.' }
  ];

  const handleToggle = (key) => {
    setNotifyState(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(notifyState);
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <Card 
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={18} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Notification Preference Control</span>
        </div>
      }
      style={{ border: '1px solid var(--glass-border)' }}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
        
        {/* Sound toggle switch */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--glass-btn-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '12px 14px'
        }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {notifyState.sound ? <Volume2 size={18} style={{ color: 'var(--color-primary)' }} /> : <VolumeX size={18} style={{ color: 'var(--text-muted)' }} />}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Sound Effect Alerts</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Play chimes and alarm ringtones when timers finish.</span>
            </div>
          </div>
          
          <div
            onClick={() => handleToggle('sound')}
            style={{
              width: '42px',
              height: '24px',
              borderRadius: '12px',
              background: notifyState.sound ? 'var(--color-primary)' : 'var(--glass-border-hover)',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
          >
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: '#ffffff',
              position: 'absolute',
              top: '3px',
              left: notifyState.sound ? '21px' : '3px',
              transition: 'left 0.2s ease'
            }} />
          </div>
        </div>

        {/* AI Voice Response toggle switch */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--glass-btn-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '12px 14px'
        }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Volume2 size={18} style={{ color: notifyState.voiceEnabled ? 'var(--color-primary)' : 'var(--text-muted)' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>AI Voice Responses</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Enable synthesis speech readbacks for command replies.</span>
            </div>
          </div>
          
          <div
            onClick={() => handleToggle('voiceEnabled')}
            style={{
              width: '42px',
              height: '24px',
              borderRadius: '12px',
              background: notifyState.voiceEnabled ? 'var(--color-primary)' : 'var(--glass-border-hover)',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
          >
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: '#ffffff',
              position: 'absolute',
              top: '3px',
              left: notifyState.voiceEnabled ? '21px' : '3px',
              transition: 'left 0.2s ease'
            }} />
          </div>
        </div>

        {/* Preferred voice selector dropdown */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          background: 'var(--glass-btn-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '12px 14px'
        }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Preferred AI Voice Speaker</label>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Select from active browser text-to-speech audio outputs.</span>
          <select
            value={notifyState.preferredVoice}
            onChange={(e) => setNotifyState(prev => ({ ...prev, preferredVoice: e.target.value }))}
            style={{
              padding: '8px 12px',
              background: 'var(--glass-input-bg)',
              border: '1px solid var(--glass-input-border)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.8rem',
              width: '100%',
              maxWidth: '300px'
            }}
          >
            <option value="Default" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Default System Voice</option>
            <option value="Google US English" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Google US English (Female)</option>
            <option value="Google UK English Female" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Google UK English Female</option>
            <option value="Microsoft David" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Microsoft David (Male)</option>
            <option value="Microsoft Zira" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Microsoft Zira (Female)</option>
          </select>
        </div>

        <div style={{ width: '100%', height: '1px', background: 'var(--glass-border)' }} />

        {/* Checkbox matrix */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {keysList.map(item => {
            const isChecked = !!notifyState[item.key];
            return (
              <div
                key={item.key}
                onClick={() => handleToggle(item.key)}
                style={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  transition: 'background 0.2s ease'
                }}
                className="glass-btn-hover"
              >
                <span style={{ display: 'flex', marginTop: '2px', color: isChecked ? 'var(--color-primary)' : 'var(--text-muted)' }}>
                  {isChecked ? <CheckSquare size={18} /> : <Square size={18} />}
                </span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.name}</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{item.desc}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button type="submit" variant="primary">
            Save Preferences
          </Button>

          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700 }}>
              <Check size={14} />
              <span>Preferences saved!</span>
            </div>
          )}
        </div>

      </form>
    </Card>
  );
};

export default NotificationSettings;
