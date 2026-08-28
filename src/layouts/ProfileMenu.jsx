import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, HelpCircle, LogOut } from 'lucide-react';
import Card from '../components/Card';
import { useAuth } from '../contexts/AuthContext';

const ProfileMenu = ({ onClose }) => {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();

  const handleAction = (path) => {
    onClose();
    navigate(path);
  };

  const handleLogout = async () => {
    onClose();
    await logout();
    navigate('/');
  };

  return (
    <Card
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--color-primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700
          }}>
            {(currentUser?.name || 'Anshul')[0].toUpperCase()}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{currentUser?.name || 'Anshul Kumar'}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{currentUser?.email || 'Developer / Student'}</span>
          </div>
        </div>
      }
      hoverable={false}
      style={{
        position: 'absolute',
        top: '65px',
        right: '20px',
        width: '220px',
        zIndex: 1010,
        boxShadow: 'var(--glass-shadow-hover)',
        border: '1px solid var(--glass-border-hover)'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button
          onClick={() => handleAction('/settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            textAlign: 'left',
            borderRadius: '6px',
            fontSize: '0.85rem',
            transition: 'background 0.2s'
          }}
          className="glass-btn"
        >
          <User size={16} />
          <span>My Profile</span>
        </button>

        <button
          onClick={() => handleAction('/settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            textAlign: 'left',
            borderRadius: '6px',
            fontSize: '0.85rem',
            transition: 'background 0.2s'
          }}
          className="glass-btn"
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            color: 'var(--text-primary)',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '0.85rem',
            transition: 'background 0.2s'
          }}
          className="glass-btn"
        >
          <HelpCircle size={16} />
          <span>Documentation</span>
        </a>

        <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }} />

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-danger)',
            cursor: 'pointer',
            textAlign: 'left',
            borderRadius: '6px',
            fontSize: '0.85rem',
            transition: 'background 0.2s'
          }}
          className="glass-btn"
        >
          <LogOut size={16} />
          <span>Exit Workspace</span>
        </button>
      </div>
    </Card>
  );
};

export default ProfileMenu;
