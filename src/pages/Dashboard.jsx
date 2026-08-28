import React, { useState, useEffect } from 'react';
import DashboardLayout from './dashboard/DashboardLayout';
import WelcomeWidget from './dashboard/WelcomeWidget';
import TaskWidget from './dashboard/TaskWidget';
import PlannerWidget from './dashboard/PlannerWidget';
import StudyWidget from './dashboard/StudyWidget';
import CodingWidget from './dashboard/CodingWidget';
import ProjectWidget from './dashboard/ProjectWidget';
import SkillArenaWidget from './dashboard/SkillArenaWidget';
import AnalyticsWidget from './dashboard/AnalyticsWidget';
import GoalWidget from './dashboard/GoalWidget';
import HealthWidget from './dashboard/HealthWidget';
import NotificationWidget from './dashboard/NotificationWidget';
import CalendarWidget from './dashboard/CalendarWidget';
import dashboardApi from '../services/api/dashboardApi';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!isAuthenticated) return;
      setIsLoading(true);
      try {
        const res = await dashboardApi.getDashboardSummary();
        if (res.success && res.data) {
          setSummary(res.data);
        }
      } catch (err) {
        console.error('[Dashboard Load Error] Failed to fetch summary:', err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, [isAuthenticated]);

  if (isLoading || !summary) {
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
        Loading workspace dashboard...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Dashboard Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Workspace Dashboard
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Welcome back! Here is a summary of your performance, tasks, and calendar.
          </p>
        </div>
      </div>

      {/* Widgets Grid */}
      <DashboardLayout>
        {/* Row 1 */}
        <div style={{ gridColumn: 'span 8' }} className="col-span-desktop-8">
          <WelcomeWidget user={summary.user} />
        </div>
        <div style={{ gridColumn: 'span 4' }} className="col-span-desktop-4">
          <CalendarWidget calendar={summary.calendar} />
        </div>

        {/* Row 2 */}
        <div style={{ gridColumn: 'span 4' }} className="col-span-desktop-4">
          <TaskWidget />
        </div>
        <div style={{ gridColumn: 'span 4' }} className="col-span-desktop-4">
          <PlannerWidget upcomingEvents={summary.calendar.upcomingEvents} />
        </div>
        <div style={{ gridColumn: 'span 4' }} className="col-span-desktop-4">
          <StudyWidget study={summary.study} />
        </div>

        {/* Row 3 */}
        <div style={{ gridColumn: 'span 4' }} className="col-span-desktop-4">
          <CodingWidget coding={summary.coding} />
        </div>
        <div style={{ gridColumn: 'span 4' }} className="col-span-desktop-4">
          <ProjectWidget projects={summary.projects} />
        </div>
        <div style={{ gridColumn: 'span 4' }} className="col-span-desktop-4">
          <AnalyticsWidget 
            skills={summary.skills} 
            study={summary.study} 
            coding={summary.coding} 
            tasks={summary.tasks} 
          />
        </div>

        {/* Row 4 */}
        <div style={{ gridColumn: 'span 4' }} className="col-span-desktop-4">
          <GoalWidget />
        </div>
        <div style={{ gridColumn: 'span 4' }} className="col-span-desktop-4">
          <HealthWidget health={summary.health} />
        </div>
        <div style={{ gridColumn: 'span 4' }} className="col-span-desktop-4">
          <NotificationWidget notifications={summary.notifications} />
        </div>

        {/* Optional Row 5 / Extra widgets could go here */}
        <div style={{ gridColumn: 'span 12' }}>
          <SkillArenaWidget />
        </div>
      </DashboardLayout>
    </div>
  );
};

export default Dashboard;
