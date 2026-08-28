import React from 'react';
import { Bell, BookOpen, Code, HeartPulse, CheckSquare } from 'lucide-react';
import Card from '../components/Card';
import notificationApi from '../services/api/notificationApi';

const getIconForType = (type) => {
  switch (type) {
    case 'study':
      return <BookOpen size={16} style={{ color: 'var(--color-accent)' }} />;
    case 'coding':
      return <Code size={16} style={{ color: 'var(--color-primary)' }} />;
    case 'health':
      return <HeartPulse size={16} style={{ color: 'var(--color-danger)' }} />;
    case 'task':
      return <CheckSquare size={16} style={{ color: 'var(--color-success)' }} />;
    default:
      return <Bell size={16} style={{ color: 'var(--text-muted)' }} />;
  }
};

const NotificationPanel = ({ notifications = [], onClose, onRefresh }) => {
  
  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationApi.markAsRead(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('[Notification Read Error] Failed to mark read:', err.message);
    }
  };

  const handleClearAll = async (e) => {
    e.stopPropagation();
    try {
      await notificationApi.clearAllNotifications();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('[Notification Clear Error] Failed to clear all:', err.message);
    }
  };

  return (
    <Card
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
            <Bell size={18} /> Notifications
          </span>
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
              className="hover:text-primary"
            >
              Clear All
            </button>
          )}
        </div>
      }
      hoverable={false}
      style={{
        position: 'absolute',
        top: '65px',
        right: '20px',
        width: '320px',
        zIndex: 1010,
        boxShadow: 'var(--glass-shadow-hover)',
        border: '1px solid var(--glass-border-hover)'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
        {notifications.length === 0 ? (
          <div style={{ 
            padding: '24px 10px', 
            textAlign: 'center', 
            color: 'var(--text-muted)', 
            fontSize: '0.85rem' 
          }}>
            No notifications yet.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={(e) => !notif.read && handleMarkRead(notif.id, e)}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '10px',
                borderRadius: '8px',
                background: notif.read ? 'rgba(255, 255, 255, 0.02)' : 'rgba(79, 70, 229, 0.06)',
                border: notif.read ? '1px solid var(--glass-border)' : '1px solid rgba(79, 70, 229, 0.25)',
                transition: 'all 0.2s',
                cursor: notif.read ? 'default' : 'pointer'
              }}
              className={notif.read ? '' : 'hover-scale'}
            >
              <div style={{
                background: 'var(--glass-btn-bg)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {getIconForType(notif.type)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px', gap: '4px' }}>
                  <span style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: notif.read ? 600 : 700, 
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {notif.title}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                    {notif.date || new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ 
                  margin: 0, 
                  fontSize: '0.75rem', 
                  color: notif.read ? 'var(--text-secondary)' : 'var(--text-primary)', 
                  lineHeight: '1.4',
                  wordBreak: 'break-word'
                }}>
                  {notif.desc || notif.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default NotificationPanel;
