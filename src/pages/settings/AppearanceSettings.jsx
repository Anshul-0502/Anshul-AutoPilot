import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Paintbrush, Check } from 'lucide-react';

const AppearanceSettings = ({ appearance = {}, onSave }) => {
  const [theme, setTheme] = useState(appearance.theme || 'Dark');
  const [accentColor, setAccentColor] = useState(appearance.accentColor || 'indigo');
  const [fontSize, setFontSize] = useState(appearance.fontSize || 'medium');
  const [density, setDensity] = useState(appearance.density || 'default');
  const [success, setSuccess] = useState(false);

  const colors = [
    { id: 'indigo', name: 'Indigo', hex: '#6366f1' },
    { id: 'sky', name: 'Sky Blue', hex: '#0ea5e9' },
    { id: 'emerald', name: 'Emerald Green', hex: '#10b981' },
    { id: 'amber', name: 'Amber Gold', hex: '#f59e0b' },
    { id: 'rose', name: 'Rose Petal', hex: '#f43f5e' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        theme,
        accentColor,
        fontSize,
        density
      });
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <Card 
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Paintbrush size={18} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Appearance & Theme Customization</span>
        </div>
      }
      style={{ border: '1px solid var(--glass-border)' }}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'left' }}>
        
        {/* Theme mode selectors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Theme Mode:</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['Dark', 'Light', 'Auto'].map(t => {
              const isActive = theme === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: isActive ? '1.5px solid var(--color-primary)' : '1px solid var(--glass-border)',
                    background: isActive ? 'var(--color-primary-glow)' : 'var(--glass-btn-bg)',
                    color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {t} Mode
                </button>
              );
            })}
          </div>
        </div>

        {/* Accent color selectors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Accent Focus Color:</span>
          <div style={{ display: 'flex', gap: '12px' }}>
            {colors.map(col => {
              const isSel = accentColor === col.id;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setAccentColor(col.id)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: col.hex,
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: isSel ? '0 0 0 3px var(--bg-secondary), 0 0 0 5px var(--color-primary)' : 'none',
                    transition: 'transform 0.15s ease'
                  }}
                  className="hover-scale"
                  title={col.name}
                >
                  {isSel && <Check size={16} style={{ color: '#ffffff' }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Font size presets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Font Scale:</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['small', 'medium', 'large'].map(sz => {
              const isActive = fontSize === sz;
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setFontSize(sz)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: isActive ? '1.5px solid var(--color-primary)' : '1px solid var(--glass-border)',
                    background: isActive ? 'var(--color-primary-glow)' : 'var(--glass-btn-bg)',
                    color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard layout densities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Workspace Density:</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['compact', 'default', 'spacious'].map(d => {
              const isActive = density === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDensity(d)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: isActive ? '1.5px solid var(--color-primary)' : '1px solid var(--glass-border)',
                    background: isActive ? 'var(--color-primary-glow)' : 'var(--glass-btn-bg)',
                    color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button type="submit" variant="primary">
            Apply Appearance Settings
          </Button>

          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700 }}>
              <Check size={14} />
              <span>Theme accents applied instantly!</span>
            </div>
          )}
        </div>

      </form>
    </Card>
  );
};

export default AppearanceSettings;
