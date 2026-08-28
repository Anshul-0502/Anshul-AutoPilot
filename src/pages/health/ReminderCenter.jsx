import React from 'react';
import Card from '../../components/Card';
import { Bell, Droplet, Moon, Activity, Eye, Compass, BookOpen } from 'lucide-react';

const ReminderCenter = ({ reminders = {}, onToggle }) => {
  const reminderItems = [
    {
      key: 'water',
      title: 'Hydration Reminders',
      desc: 'Send desktop push warnings every 2 hours to drink water and maintain metabolism focus.',
      icon: <Droplet size={18} style={{ color: 'var(--color-secondary)' }} />
    },
    {
      key: 'eyeBreak',
      title: '20-20-20 Eye Care Breaks',
      desc: 'Remind me every 20-30 minutes of active screen time to look away for 20 seconds.',
      icon: <Eye size={18} style={{ color: 'var(--color-accent)' }} />
    },
    {
      key: 'stretchBreak',
      title: 'Stretch Breaks',
      desc: 'Prompt active stretching when focus sessions exceed 60 minutes.',
      icon: <Activity size={18} style={{ color: 'var(--color-success)' }} />
    },
    {
      key: 'sleep',
      title: 'Bedtime Reminders',
      desc: 'Notify 30 minutes before sleep target time (23:00) to shut screen monitors.',
      icon: <Moon size={18} style={{ color: 'var(--color-primary)' }} />
    },
    {
      key: 'study',
      title: 'Study Hub Blocks',
      desc: 'Prompt notifications when subject review sessions are scheduled to start.',
      icon: <BookOpen size={18} style={{ color: 'var(--color-primary)' }} />
    },
    {
      key: 'meditate',
      title: 'Mindfulness Reminders',
      desc: 'Send a prompt mid-day to practice a 5-minute breathing box relaxation exercise.',
      icon: <Compass size={18} style={{ color: 'var(--color-accent)' }} />
    }
  ];

  return (
    <Card 
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={18} style={{ color: 'var(--color-accent)' }} />
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Personal Reminder Settings</span>
        </div>
      }
      style={{ border: '1px solid var(--glass-border)', textAlign: 'left' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '6px' }}>
        {reminderItems.map(item => {
          const isToggled = !!reminders[item.key];
          return (
            <div
              key={item.key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 14px',
                background: 'var(--glass-btn-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                <div style={{ display: 'flex', marginTop: '3px' }}>{item.icon}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{item.desc}</span>
                </div>
              </div>

              {/* iOS-like Toggle Switch */}
              <div
                onClick={() => onToggle && onToggle(item.key)}
                style={{
                  width: '42px',
                  height: '24px',
                  borderRadius: '12px',
                  background: isToggled ? 'var(--color-primary)' : 'var(--glass-border-hover)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                  flexShrink: 0
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    position: 'absolute',
                    top: '3px',
                    left: isToggled ? '21px' : '3px',
                    transition: 'left 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                />
              </div>

            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ReminderCenter;
