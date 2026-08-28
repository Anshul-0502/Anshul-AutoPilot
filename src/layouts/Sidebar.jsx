import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, CheckSquare, BookOpen, Code, 
  FolderKanban, Award, BarChart4, HeartPulse, Settings, 
  ChevronLeft, ChevronRight, LogOut 
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { path: '/planner', icon: <Calendar size={20} />, label: 'Planner' },
  { path: '/tasks', icon: <CheckSquare size={20} />, label: 'Tasks' },
  { path: '/study', icon: <BookOpen size={20} />, label: 'Study Hub' },
  { path: '/coding', icon: <Code size={20} />, label: 'Coding Workspace' },
  { path: '/projects', icon: <FolderKanban size={20} />, label: 'Projects' },
  { path: '/games', icon: <Award size={20} />, label: 'Skill Arena' },
  { path: '/analytics', icon: <BarChart4 size={20} />, label: 'Analytics' },
  { path: '/health', icon: <HeartPulse size={20} />, label: 'Health' },
  { path: '/settings', icon: <Settings size={20} />, label: 'Settings' }
];

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();

  const handleNavClick = () => {
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const sidebarStyle = {
    width: collapsed ? '80px' : '260px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    left: 0,
    zIndex: 990,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxSizing: 'border-box',
    borderRight: '1px solid var(--glass-border)',
    overflow: 'hidden'
  };

  return (
    <aside style={sidebarStyle} className="glass-sidebar">
      {/* Sidebar Header */}
      <div style={{
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: collapsed ? '0' : '0 20px',
        borderBottom: '1px solid var(--glass-border)'
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--color-primary)' }} />
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', letterSpacing: '0.5px' }}>AutoPilot</span>
          </div>
        )}
        {collapsed && (
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--color-primary)', cursor: 'pointer' }} onClick={() => navigate('/dashboard')} />
        )}
        
        {/* Toggle button on desktop */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px',
            display: collapsed ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="glass-btn"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Navigation list */}
      <nav style={{ flex: 1, padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleNavClick}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '8px',
              color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
              background: isActive ? 'var(--color-primary-glow)' : 'transparent',
              textDecoration: 'none',
              fontWeight: isActive ? 600 : 500,
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              border: isActive ? '1px solid var(--glass-border-hover)' : '1px solid transparent'
            })}
            className={({ isActive }) => isActive ? 'animate-glow-pulse' : 'glass-btn'}
            title={item.label}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.icon}
            </div>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapsed Toggle / Exit Footer */}
      <div style={{
        padding: '16px 10px',
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '12px 0',
              border: 'none',
              background: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              borderRadius: '8px'
            }}
            className="glass-btn"
          >
            <ChevronRight size={18} />
          </button>
        )}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '12px',
            padding: '12px 14px',
            width: '100%',
            border: 'none',
            background: 'transparent',
            color: 'var(--color-danger)',
            cursor: 'pointer',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: 600,
            boxSizing: 'border-box'
          }}
          className="glass-btn"
        >
          <LogOut size={20} />
          {!collapsed && <span>Exit App</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
