import React from 'react';
import { Bell, BookOpen, Code, HeartPulse, CheckSquare } from 'lucide-react';
import Card from '../../components/Card';

const getIconForType = (type) => {
  switch (type) {
    case 'study':
      return <BookOpen size={14} style={{ color: 'var(--color-accent)' }} />;
    case 'coding':
      return <Code size={14} style={{ color: 'var(--color-primary)' }} />;
    case 'health':
      return <HeartPulse size={14} style={{ color: 'var(--color-danger)' }} />;
    case 'task':
      return <CheckSquare size={14} style={{ color: 'var(--color-success)' }} />;
    default:
      return <Bell size={14} style={{ color: 'var(--text-muted)' }} />;
  }
};

const NotificationWidget = ({ notifications = [] }) => {
  return (
    <Card
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={18} style={{ color: 'var(--color-primary)' }} />
          <span>Recent Notifications</span>
        </div>
      }
      style={{ height: '100%' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
        {notifications.length === 0 ? (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '10px 0', textAlign: 'center' }}>
            No recent notifications.
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id}
              style={{
                display: 'flex',
                gap: '10px',
                background: 'var(--glass-btn-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '0.85rem',
                alignItems: 'flex-start'
              }}
            >
              <span style={{ marginTop: '2px', flexShrink: 0 }}>
                {getIconForType(notif.type)}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden', minWidth: 0, flex: 1 }}>
                <span style={{ 
                  color: 'var(--text-primary)', 
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'block'
                }}>
                  {notif.title}
                </span>
                <span style={{ 
                  color: 'var(--text-secondary)', 
                  lineHeight: 1.3,
                  fontSize: '0.75rem',
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {notif.desc || notif.message}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {notif.time}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default NotificationWidget;
