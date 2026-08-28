import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Timer, Check } from 'lucide-react';

const TimerSettings = ({ timer = {}, onSave }) => {
  const [pomodoroWork, setPomodoroWork] = useState(timer.pomodoroWork || 25);
  const [shortBreak, setShortBreak] = useState(timer.shortBreak || 5);
  const [longBreak, setLongBreak] = useState(timer.longBreak || 15);
  const [autoStartBreaks, setAutoStartBreaks] = useState(timer.autoStartBreaks !== undefined ? timer.autoStartBreaks : true);
  const [alarmSound, setAlarmSound] = useState(timer.alarmSound || 'Chime');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        pomodoroWork,
        shortBreak,
        longBreak,
        autoStartBreaks,
        alarmSound
      });
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <Card 
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Timer size={18} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Focus & Pomodoro Timer Configuration</span>
        </div>
      }
      style={{ border: '1px solid var(--glass-border)' }}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
        
        {/* Presets sliders */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }} className="flex-col-mobile">
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Work Interval: {pomodoroWork} Mins
            </label>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={pomodoroWork}
              onChange={(e) => setPomodoroWork(Number(e.target.value))}
              style={{ accentColor: 'var(--color-primary)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Short Break: {shortBreak} Mins
            </label>
            <input
              type="range"
              min="2"
              max="20"
              step="1"
              value={shortBreak}
              onChange={(e) => setShortBreak(Number(e.target.value))}
              style={{ accentColor: 'var(--color-primary)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Long Break: {longBreak} Mins
            </label>
            <input
              type="range"
              min="5"
              max="45"
              step="5"
              value={longBreak}
              onChange={(e) => setLongBreak(Number(e.target.value))}
              style={{ accentColor: 'var(--color-primary)' }}
            />
          </div>

        </div>

        <div style={{ width: '100%', height: '1px', background: 'var(--glass-border)' }} />

        {/* Ringtone select */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '300px' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Alarm Ringtone Sound:</label>
          <select
            value={alarmSound}
            onChange={(e) => setAlarmSound(e.target.value)}
            style={{
              padding: '8px',
              background: 'var(--glass-input-bg)',
              border: '1px solid var(--glass-input-border)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.85rem'
            }}
          >
            {['Chime', 'Digital Beep', 'Soft Bell', 'Muted'].map(s => (
              <option key={s} value={s} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{s}</option>
            ))}
          </select>
        </div>

        {/* Auto start toggle */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--glass-btn-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '12px 14px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Auto-Start Break Intervals</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Instantly launch break countdowns when work focus runs out.</span>
          </div>

          <div
            onClick={() => setAutoStartBreaks(!autoStartBreaks)}
            style={{
              width: '42px',
              height: '24px',
              borderRadius: '12px',
              background: autoStartBreaks ? 'var(--color-primary)' : 'var(--glass-border-hover)',
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
              left: autoStartBreaks ? '21px' : '3px',
              transition: 'left 0.2s ease'
            }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button type="submit" variant="primary">
            Save Timer Options
          </Button>

          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700 }}>
              <Check size={14} />
              <span>Interval configurations saved!</span>
            </div>
          )}
        </div>

      </form>
    </Card>
  );
};

export default TimerSettings;
