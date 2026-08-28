import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const routeMap = {
  dashboard: 'Dashboard',
  planner: 'Planner',
  tasks: 'Tasks',
  study: 'Study Hub',
  coding: 'Coding Workspace',
  projects: 'Projects',
  games: 'Skill Arena',
  analytics: 'Analytics',
  health: 'Health',
  settings: 'Settings'
};

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
      <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-primary">
        Home
      </Link>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const label = routeMap[value] || value.charAt(0).toUpperCase() + value.slice(1);

        return (
          <React.Fragment key={to}>
            <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
            {last ? (
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{label}</span>
            ) : (
              <Link to={to} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-primary">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
