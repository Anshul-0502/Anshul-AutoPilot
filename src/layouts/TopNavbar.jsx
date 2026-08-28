import React, { useContext } from 'react';
import { Menu, Bell, Sun, Moon, Bot } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import Breadcrumb from './Breadcrumb';
import SearchBar from '../components/SearchBar';
import NotificationBadge from '../components/NotificationBadge';
import Button from '../components/Button';
import { AIAssistantContext } from '../contexts/AIAssistantContext';

const TopNavbar = ({
  setMobileOpen,
  showNotifications,
  setShowNotifications,
  showProfile,
  setShowProfile,
  searchVal,
  setSearchVal,
  unreadCount = 0
}) => {
  const { theme, setTheme } = useTheme();
  const { isOpen, setIsOpen } = useContext(AIAssistantContext);

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleToggleNotifications = (e) => {
    e.stopPropagation();
    setShowProfile(false);
    setShowNotifications(!showNotifications);
  };

  const handleToggleProfile = (e) => {
    e.stopPropagation();
    setShowNotifications(false);
    setShowProfile(!showProfile);
  };

  return (
    <header
      style={{
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: '1px solid var(--glass-border)',
        position: 'sticky',
        top: 0,
        zIndex: 980
      }}
      className="glass-navbar"
    >
      {/* Left items: Menu button & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px',
            display: 'none', // Shown only on mobile screens via CSS
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="hamburger-btn glass-btn"
        >
          <Menu size={20} />
        </button>
        <div className="breadcrumb-wrapper">
          <Breadcrumb />
        </div>
      </div>

      {/* Middle item: Universal Search */}
      <div className="top-search-wrapper" style={{ width: '100%', maxWidth: '320px', margin: '0 24px' }}>
        <SearchBar
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onClear={() => setSearchVal('')}
          placeholder="Search workspace..."
        />
      </div>

      {/* Right items: Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          onClick={handleToggleTheme}
          style={{ padding: '8px', borderRadius: '50%' }}
        >
          {theme === 'dark' ? (
            <Sun size={18} style={{ color: 'var(--color-accent)' }} />
          ) : (
            <Moon size={18} />
          )}
        </Button>

        {/* AI Assistant Button */}
        <Button
          variant={isOpen ? 'primary' : 'ghost'}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: '8px',
            borderRadius: '50%',
            position: 'relative',
            background: isOpen ? 'var(--color-primary)' : 'transparent',
            border: isOpen ? '1.5px solid var(--color-primary)' : 'none',
            color: isOpen ? '#ffffff' : 'var(--text-primary)',
            boxShadow: isOpen ? '0 0 12px var(--color-primary-glow)' : 'none',
            transition: 'all 0.3s ease'
          }}
          className="hover-scale"
          title="Talk to Anshul AI"
        >
          <Bot size={18} />
          {!isOpen && (
            <span style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--color-success)',
              border: '1.5px solid var(--bg-secondary)',
              boxShadow: '0 0 4px var(--color-success)'
            }} />
          )}
        </Button>

        {/* Notifications badge */}
        <NotificationBadge count={unreadCount}>
          <Button
            variant="ghost"
            onClick={handleToggleNotifications}
            style={{ padding: '8px', borderRadius: '50%' }}
          >
            <Bell size={18} />
          </Button>
        </NotificationBadge>

        {/* User profile dropdown trigger */}
        <button
          onClick={handleToggleProfile}
          style={{
            background: 'var(--color-primary)',
            color: '#ffffff',
            border: '1px solid var(--glass-border)',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.85rem',
            boxShadow: 'var(--glass-shadow)'
          }}
          className="hover-scale"
        >
          A
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
