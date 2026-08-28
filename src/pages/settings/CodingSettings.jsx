import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Code, Check } from 'lucide-react';

const CodingSettings = ({ coding = {}, onSave }) => {
  const [defaultLanguage, setDefaultLanguage] = useState(coding.defaultLanguage || 'JavaScript');
  const [dailyGoal, setDailyGoal] = useState(coding.dailyGoal || 3);
  const [dsaGoal, setDsaGoal] = useState(coding.dsaGoal || 100);
  const [timerDuration, setTimerDuration] = useState(coding.timerDuration || 60);
  const [codeTheme, setCodeTheme] = useState(coding.codeTheme || 'vs-dark');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        defaultLanguage,
        dailyGoal,
        dsaGoal,
        timerDuration,
        codeTheme
      });
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <Card 
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code size={18} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Coding Workspace Configuration</span>
        </div>
      }
      style={{ border: '1px solid var(--glass-border)' }}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
        
        {/* Language select */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="flex-col-mobile">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Default Language Compiler:</label>
            <select
              value={defaultLanguage}
              onChange={(e) => setDefaultLanguage(e.target.value)}
              style={{
                padding: '8px',
                background: 'var(--glass-input-bg)',
                border: '1px solid var(--glass-input-border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            >
              {['C++', 'JavaScript', 'Python', 'Java', 'Go'].map(lang => (
                <option key={lang} value={lang} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{lang}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>IDE Editor Code Theme:</label>
            <select
              value={codeTheme}
              onChange={(e) => setCodeTheme(e.target.value)}
              style={{
                padding: '8px',
                background: 'var(--glass-input-bg)',
                border: '1px solid var(--glass-input-border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            >
              <option value="vs-dark" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>VS Dark Theme</option>
              <option value="vs-light" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>VS Light Theme</option>
              <option value="monokai" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Monokai (Retro)</option>
              <option value="oceanic" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Material Oceanic</option>
            </select>
          </div>
        </div>

        {/* Goal sliders */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="flex-col-mobile">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Daily Solved Problems Goal: {dailyGoal} Target
            </label>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(Number(e.target.value))}
              style={{ accentColor: 'var(--color-primary)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              DSA Target Limit Solves: {dsaGoal} Problems
            </label>
            <input
              type="range"
              min="20"
              max="1000"
              step="10"
              value={dsaGoal}
              onChange={(e) => setDsaGoal(Number(e.target.value))}
              style={{ accentColor: 'var(--color-primary)' }}
            />
          </div>
        </div>

        {/* Coding session defaults */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '300px' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Coding Session block: {timerDuration} Mins
          </label>
          <input
            type="range"
            min="15"
            max="240"
            step="15"
            value={timerDuration}
            onChange={(e) => setDuration && setTimerDuration(Number(e.target.value))}
            style={{ accentColor: 'var(--color-primary)' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button type="submit" variant="primary">
            Save Coding Settings
          </Button>

          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700 }}>
              <Check size={14} />
              <span>Workspace defaults saved!</span>
            </div>
          )}
        </div>

      </form>
    </Card>
  );
};

export default CodingSettings;
