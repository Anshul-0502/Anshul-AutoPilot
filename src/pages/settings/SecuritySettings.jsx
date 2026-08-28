import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Lock, Check } from 'lucide-react';

const SecuritySettings = ({ security = {}, onSave }) => {
  const [appLock, setAppLock] = useState(security.appLock !== undefined ? security.appLock : false);
  const [passcode, setPasscode] = useState(security.passcode || '');
  const [timeout, setTimeoutVal] = useState(security.timeout || 15);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        appLock,
        passcode,
        timeout
      });
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <Card 
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={18} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Lock Screen & Session Timeout Settings</span>
        </div>
      }
      style={{ border: '1px solid var(--glass-border)' }}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
        
        {/* Toggle Lock */}
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
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Enable Passcode Lock Screen</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Require password validation when reopening the browser console.</span>
          </div>

          <div
            onClick={() => setAppLock(!appLock)}
            style={{
              width: '42px',
              height: '24px',
              borderRadius: '12px',
              background: appLock ? 'var(--color-primary)' : 'var(--glass-border-hover)',
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
              left: appLock ? '21px' : '3px',
              transition: 'left 0.2s ease'
            }} />
          </div>
        </div>

        {/* Form Inputs (Disabled if lock is off) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="flex-col-mobile">
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Set Security Passcode:</label>
            <input
              type="password"
              placeholder="e.g. 4-digit code or text"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              disabled={!appLock}
              style={{
                padding: '8px 12px',
                background: appLock ? 'var(--glass-input-bg)' : 'rgba(255,255,255,0.02)',
                border: '1px solid var(--glass-input-border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                cursor: appLock ? 'text' : 'not-allowed',
                opacity: appLock ? 1 : 0.5
              }}
              required={appLock}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Auto-Lock Timeout Limits:</label>
            <select
              value={timeout}
              onChange={(e) => setTimeoutVal(Number(e.target.value))}
              disabled={!appLock}
              style={{
                padding: '8px',
                background: appLock ? 'var(--glass-input-bg)' : 'rgba(255,255,255,0.02)',
                border: '1px solid var(--glass-input-border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                cursor: appLock ? 'pointer' : 'not-allowed',
                opacity: appLock ? 1 : 0.5
              }}
            >
              {[5, 15, 30, 60].map(mins => (
                <option key={mins} value={mins} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{mins} Minutes</option>
              ))}
            </select>
          </div>

        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button type="submit" variant="primary">
            Save Security Locks
          </Button>

          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700 }}>
              <Check size={14} />
              <span>Passcode preferences saved!</span>
            </div>
          )}
        </div>

      </form>
    </Card>
  );
};

export default SecuritySettings;
