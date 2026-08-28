import React, { useState, useEffect } from 'react';
import { BellRing, ShieldCheck } from 'lucide-react';
import Card from '../../components/Card';
import notificationApi from '../../services/api/notificationApi';

const ReminderPanel = () => {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await notificationApi.getAlertRegisters();
        if (res.success && res.data) {
          setReminders(res.data);
        }
      } catch (err) {
        console.error('[Fetch Alerts Error] Failed to fetch alert registers:', err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const toggleReminder = async (id, currentEnabled) => {
    try {
      const res = await notificationApi.toggleAlertRegister(id, { enabled: !currentEnabled });
      if (res.success && res.data) {
        setReminders(prev => prev.map(rem => rem.id === id ? res.data : rem));
      }
    } catch (err) {
      console.error('[Toggle Alert Error] Failed to toggle alert register:', err.message);
    }
  };

  return (
    <Card
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BellRing size={18} style={{ color: 'var(--color-primary)' }} />
          <span>Local Alarms & Alerts</span>
        </div>
      }
      style={{ height: '100%' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '10px' }}>
            Loading alarms...
          </div>
        ) : reminders.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '10px' }}>
            No alarms registered.
          </div>
        ) : (
          reminders.map((rem) => (
            <div 
              key={rem.id}
              onClick={() => toggleReminder(rem.id, rem.enabled)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                background: rem.enabled ? 'rgba(79, 70, 229, 0.03)' : 'var(--glass-btn-bg)',
                border: rem.enabled ? '1px solid rgba(79, 70, 229, 0.2)' : '1px solid var(--glass-border)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              className="hover-scale"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: 600, 
                  color: rem.enabled ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}>
                  {rem.label}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Trigger: {rem.time}
                </span>
              </div>

              {/* Simulated Toggle Switch */}
              <div style={{
                width: '36px',
                height: '20px',
                background: rem.enabled ? 'var(--color-primary)' : 'var(--glass-border)',
                borderRadius: '9999px',
                position: 'relative',
                transition: 'background-color 0.2s ease'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  left: rem.enabled ? '18px' : '2px',
                  width: '16px',
                  height: '16px',
                  background: '#ffffff',
                  borderRadius: '50%',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </div>
            </div>
          ))
        )}

        <div style={{
          background: 'var(--glass-btn-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '10px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          marginTop: '6px'
        }}>
          <ShieldCheck size={16} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
          <span>Reminders fire locally via web notifications.</span>
        </div>
      </div>
    </Card>
  );
};

export default ReminderPanel;
