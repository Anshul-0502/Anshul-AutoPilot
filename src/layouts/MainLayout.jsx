import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import NotificationPanel from './NotificationPanel';
import ProfileMenu from './ProfileMenu';
import QuickActions from './QuickActions';
import AIAssistantPanel from '../components/AIAssistantPanel';
import skillApi from '../services/api/skillApi';
import notificationApi from '../services/api/notificationApi';
import { useAuth } from '../contexts/AuthContext';
import userApi from '../services/api/userApi';

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [notifications, setNotifications] = useState([]);

  // Handle responsive resize rules
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        // Mobile sizes: hide sidebar completely (shown via hamburger button drawer)
        setCollapsed(false);
      } else if (width >= 768 && width <= 1024) {
        // Tablet sizes: collapse sidebar
        setCollapsed(true);
        setMobileOpen(false);
      } else {
        // Desktop: expand sidebar
        setCollapsed(false);
        setMobileOpen(false);
      }
    };

    handleResize(); // trigger initially
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync Preferences / Accent Color on mount
  useEffect(() => {
    const applyPreferences = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await userApi.getPreferences();
        if (res.success && res.data?.preferences) {
          const pref = res.data.preferences;
          const accents = {
            indigo: '#6366f1',
            sky: '#0ea5e9',
            emerald: '#10b981',
            amber: '#f59e0b',
            rose: '#f43f5e'
          };
          const primaryColor = accents[pref.appearance?.accentColor] || accents.indigo;
          document.documentElement.style.setProperty('--color-primary', primaryColor);
          document.documentElement.style.setProperty('--color-primary-glow', `${primaryColor}1a`);
        }
      } catch (err) {
        console.warn('[MainLayout Preferences Error] Failed to load preferences:', err.message);
      }
    };
    applyPreferences();
  }, [isAuthenticated]);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await notificationApi.getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error('[Notifications Fetch Error] Failed to fetch notifications:', err.message);
    }
  };

  // Sync and process notifications
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchNotifications();

    // Call queue process initially and periodically to catch due background items
    const processAndFetch = async () => {
      try {
        await notificationApi.processQueue();
        fetchNotifications();
      } catch (err) {
        console.error('[Notifications Sync Error] Failed to process queue:', err.message);
      }
    };

    processAndFetch();
    const interval = setInterval(processAndFetch, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Listen to custom notification creation events
  useEffect(() => {
    if (!isAuthenticated) return;
    const handleNotificationUpdate = () => {
      fetchNotifications();
    };
    window.addEventListener('notification-created', handleNotificationUpdate);
    return () => window.removeEventListener('notification-created', handleNotificationUpdate);
  }, [isAuthenticated]);

  // Sync Skill Profile from backend on load
  useEffect(() => {
    const syncSkillProfile = async () => {
      if (!isAuthenticated) return;
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const res = await skillApi.getSkillProfile(todayStr);
        if (res.success && res.data?.profile) {
          localStorage.setItem('anshul_autopilot_skill_data', JSON.stringify(res.data.profile));
          window.dispatchEvent(new Event('storage'));
        }
      } catch (err) {
        console.error('[Skill Profile Sync Error] Failed to sync skill profile:', err.message);
      }
    };
    syncSkillProfile();
  }, [isAuthenticated]);


  // Close menus on click outside
  const handlePageClick = () => {
    setShowNotifications(false);
    setShowProfile(false);
  };

  return (
    <div 
      onClick={handlePageClick}
      style={{ 
        display: 'flex', 
        minHeight: '100vh', 
        background: 'var(--bg-primary)', 
        color: 'var(--text-primary)',
        width: '100%'
      }}
    >
      {/* Mobile Drawer Sidebar Overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 995
          }}
        />
      )}

      {/* Sidebar Panel Container */}
      <div 
        style={{
          display: 'block',
          position: mobileOpen ? 'fixed' : 'sticky',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: mobileOpen ? 996 : 990,
          transform: mobileOpen ? 'translateX(0)' : window.innerWidth < 768 ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <Sidebar 
          collapsed={collapsed} 
          setCollapsed={setCollapsed}
          setMobileOpen={setMobileOpen}
        />
      </div>

      {/* Main Layout Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopNavbar 
          setMobileOpen={setMobileOpen}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          showProfile={showProfile}
          setShowProfile={setShowProfile}
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          unreadCount={notifications.filter(n => !n.read).length}
        />
        
        {/* Dropdowns panel */}
        {showNotifications && (
          <NotificationPanel 
            notifications={notifications}
            onClose={() => setShowNotifications(false)} 
            onRefresh={fetchNotifications}
          />
        )}
        {showProfile && (
          <ProfileMenu onClose={() => setShowProfile(false)} />
        )}

        {/* Content Outlet */}
        <main 
          style={{ 
            padding: '24px', 
            flex: 1, 
            boxSizing: 'border-box',
            maxWidth: '100%',
            overflowX: 'hidden'
          }}
        >
          <Outlet />
        </main>
      </div>

      {/* Floating Action Button (FAB) */}
      <QuickActions />

      {/* AI Assistant Side panel drawer */}
      <AIAssistantPanel />

      {/* Inject styling rules for layout items */}
      <style>{`
        @media (max-width: 767px) {
          .hamburger-btn {
            display: flex !important;
          }
          .breadcrumb-wrapper {
            display: none !important;
          }
          .top-search-wrapper {
            max-width: 180px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
