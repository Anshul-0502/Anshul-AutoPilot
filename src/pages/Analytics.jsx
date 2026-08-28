import React, { useState, useEffect } from 'react';
import ProductivityAnalytics from './analytics/ProductivityAnalytics';
import StudyAnalytics from './analytics/StudyAnalytics';
import CodingAnalytics from './analytics/CodingAnalytics';
import TaskAnalytics from './analytics/TaskAnalytics';
import ProjectAnalytics from './analytics/ProjectAnalytics';
import SkillAnalytics from './analytics/SkillAnalytics';
import HabitAnalytics from './analytics/HabitAnalytics';
import GoalAnalytics from './analytics/GoalAnalytics';
import Reports from './analytics/Reports';
import Insights from './analytics/Insights';
import analyticsApi from '../services/api/analyticsApi';
import { useAuth } from '../contexts/AuthContext';

import { 
  BarChart3, 
  BookOpen, 
  Code, 
  CheckSquare, 
  Briefcase, 
  Gamepad2, 
  Heart, 
  Target, 
  FileText, 
  Lightbulb
} from 'lucide-react';

const Analytics = () => {
  const { isAuthenticated } = useAuth();
  const [timeFilter, setTimeFilter] = useState('Weekly'); // 'Daily', 'Weekly', 'Monthly', 'Yearly'
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Unified State Aggregator
  const [aggregatedData, setAggregatedData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!isAuthenticated) return;
      setIsLoading(true);
      try {
        const res = await analyticsApi.getAnalyticsSummary(timeFilter);
        if (res.success && res.data) {
          setAggregatedData(res.data);
        }
      } catch (err) {
        console.error('[Analytics Load Error] Failed to fetch analytics:', err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [isAuthenticated, timeFilter]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
    { id: 'study', label: 'Study Stats', icon: <BookOpen size={16} /> },
    { id: 'coding', label: 'Code Stats', icon: <Code size={16} /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={16} /> },
    { id: 'projects', label: 'Projects', icon: <Briefcase size={16} /> },
    { id: 'skills', label: 'Skill Arena', icon: <Gamepad2 size={16} /> },
    { id: 'habits', label: 'Habits', icon: <Heart size={16} /> },
    { id: 'goals', label: 'Goals', icon: <Target size={16} /> },
    { id: 'reports', label: 'Reports', icon: <FileText size={16} /> },
    { id: 'insights', label: 'Insights', icon: <Lightbulb size={16} /> }
  ];

  if (isLoading || !aggregatedData) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '100px 0', 
        color: 'var(--text-secondary)',
        fontSize: '1rem',
        fontWeight: 600
      }}>
        Loading performance analytics...
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '100%',
      minHeight: '80vh',
      boxSizing: 'border-box',
      textAlign: 'left'
    }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            📊 Productivity Analytics
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Track study hours, code solutions, milestone timelines, and health consistency.
          </p>
        </div>

        {/* Date Filter Selection */}
        <div style={{
          display: 'flex',
          background: 'var(--glass-card-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '10px',
          padding: '4px',
          gap: '4px'
        }}>
          {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(filter => {
            const isActive = filter === timeFilter;
            return (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  borderRadius: '6px',
                  background: isActive ? 'var(--color-primary)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Navigation + Sub-views */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        gap: '20px',
        alignItems: 'start'
      }} className="flex-col-mobile">
        
        {/* Navigation Sidebar */}
        <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '6px 10px', display: 'block' }}>
            Analytics Cockpit
          </span>
          <div style={{ height: '1px', background: 'var(--glass-border)', marginBottom: '4px' }} />
          {tabs.map(tab => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 14px',
                  border: 'none',
                  borderRadius: '8px',
                  background: isActive ? 'var(--color-primary-glow)' : 'transparent',
                  color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.85rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                className="glass-btn-hover"
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Display Area */}
        <div style={{ minWidth: 0 }}>
          {activeTab === 'overview' && (
            <ProductivityAnalytics data={aggregatedData} filter={timeFilter} />
          )}
          {activeTab === 'study' && (
            <StudyAnalytics data={aggregatedData.study} filter={timeFilter} />
          )}
          {activeTab === 'coding' && (
            <CodingAnalytics data={aggregatedData.coding} filter={timeFilter} />
          )}
          {activeTab === 'tasks' && (
            <TaskAnalytics data={aggregatedData.tasks} filter={timeFilter} />
          )}
          {activeTab === 'projects' && (
            <ProjectAnalytics data={aggregatedData.projects} filter={timeFilter} />
          )}
          {activeTab === 'skills' && (
            <SkillAnalytics data={aggregatedData.skill} filter={timeFilter} />
          )}
          {activeTab === 'habits' && (
            <HabitAnalytics data={aggregatedData.habits} filter={timeFilter} />
          )}
          {activeTab === 'goals' && (
            <GoalAnalytics data={aggregatedData.goals} filter={timeFilter} />
          )}
          {activeTab === 'reports' && (
            <Reports data={aggregatedData} filter={timeFilter} />
          )}
          {activeTab === 'insights' && (
            <Insights data={aggregatedData} filter={timeFilter} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
