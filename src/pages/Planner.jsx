import React, { useState, useEffect } from 'react';
import Calendar from './planner/Calendar';
import DailyPlanner from './planner/DailyPlanner';
import WeeklyPlanner from './planner/WeeklyPlanner';
import MonthlyPlanner from './planner/MonthlyPlanner';
import TimelineView from './planner/TimelineView';
import AgendaView from './planner/AgendaView';
import ReminderPanel from './planner/ReminderPanel';
import PlannerStats from './planner/PlannerStats';
import Button from '../components/Button';
import { Calendar as CalendarIcon, Clock, Layers, ClipboardList } from 'lucide-react';
import plannerApi from '../services/api/plannerApi';
import { useAuth } from '../contexts/AuthContext';

const initialMockEvents = [
  {
    title: 'Computer Networks Lecture',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    category: 'study',
    duration: 90,
    date: new Date(2026, 7, 6)
  },
  {
    title: 'DSA Leetcode Challenge: Trees',
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    category: 'coding',
    duration: 90,
    date: new Date(2026, 7, 6)
  },
  {
    title: 'Project Sync Meeting',
    startTime: '02:30 PM',
    endTime: '03:30 PM',
    category: 'meeting',
    duration: 60,
    date: new Date(2026, 7, 6)
  },
  {
    title: 'Lunch Break & Relax',
    startTime: '01:00 PM',
    endTime: '02:00 PM',
    category: 'break',
    duration: 60,
    date: new Date(2026, 7, 6)
  },
  {
    title: 'Database Assignment Submission',
    startTime: '09:00 AM',
    endTime: '12:00 PM',
    category: 'project',
    duration: 180,
    date: new Date(2026, 7, 10)
  },
  {
    title: 'Physics Review Session',
    startTime: '03:00 PM',
    endTime: '05:00 PM',
    category: 'study',
    duration: 120,
    date: new Date(2026, 7, 18)
  }
];

const Planner = () => {
  const { isAuthenticated } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 7, 6));
  const [activeView, setActiveView] = useState('day'); // 'day', 'week', 'month', 'agenda'
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch events on mount and when authentication state changes
  useEffect(() => {
    const fetchEvents = async () => {
      if (!isAuthenticated) return;
      setIsLoading(true);

      try {
        const res = await plannerApi.getEvents();
        if (res.success && res.data?.events) {
          const loadedEvents = res.data.events.map(evt => ({
            ...evt,
            date: new Date(evt.date) // parse date string back to Date object
          }));

          // Seeding strategy: If database contains 0 events and we have not seeded yet
          const alreadySeeded = localStorage.getItem('anshul_autopilot_planner_seeded');
          if (loadedEvents.length === 0 && !alreadySeeded) {
            console.log('[Planner] Seeding initial mock events...');
            const seedPromises = initialMockEvents.map(mockEvt => plannerApi.createEvent(mockEvt));
            await Promise.all(seedPromises);
            localStorage.setItem('anshul_autopilot_planner_seeded', 'true');
            
            // Reload seeded events
            const reloadRes = await plannerApi.getEvents();
            if (reloadRes.success && reloadRes.data?.events) {
              setEvents(reloadRes.data.events.map(evt => ({
                ...evt,
                date: new Date(evt.date)
              })));
            }
          } else {
            setEvents(loadedEvents);
          }
        }
      } catch (err) {
        console.error('[Planner Load Error] Failed to load planner events:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [isAuthenticated]);

  const handleAddEvent = async (newEvent) => {
    try {
      const res = await plannerApi.createEvent(newEvent);
      if (res.success && res.data?.event) {
        const savedEvent = {
          ...res.data.event,
          date: new Date(res.data.event.date)
        };
        setEvents(prev => [...prev, savedEvent]);
      }
    } catch (err) {
      console.error('[Planner Add Error] Failed to create event:', err.message);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const res = await plannerApi.deleteEvent(eventId);
      if (res.success) {
        setEvents(prev => prev.filter(evt => evt.id !== eventId && evt._id !== eventId));
      }
    } catch (err) {
      console.error('[Planner Delete Error] Failed to delete event:', err.message);
    }
  };

  // Views navigation controls
  const viewOptions = [
    { value: 'day', label: 'Day View', icon: <Clock size={14} /> },
    { value: 'week', label: 'Week View', icon: <Layers size={14} /> },
    { value: 'month', label: 'Month View', icon: <CalendarIcon size={14} /> },
    { value: 'agenda', label: 'Agenda List', icon: <ClipboardList size={14} /> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Smart Planner
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Organize study times, coding tasks, project milestones, and habits in time blocks.
          </p>
        </div>

        {/* View Switches */}
        <div style={{
          display: 'flex',
          background: 'var(--glass-btn-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '2px',
          gap: '2px'
        }}>
          {viewOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setActiveView(opt.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: activeView === opt.value ? 'var(--color-primary)' : 'transparent',
                color: activeView === opt.value ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {opt.icon}
              <span className="btn-label-text">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main layout layout split */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '20px',
        width: '100%',
        boxSizing: 'border-box'
      }} className="planner-split-layout">
        
        {/* Left column (Calendar Picker, Stats & Reminders) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="planner-sidebar">
          <Calendar 
            selectedDate={selectedDate} 
            setSelectedDate={setSelectedDate} 
            events={events}
          />
          <PlannerStats events={events} />
          <ReminderPanel />
        </div>

        {/* Right column (Active Viewport) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="planner-viewport">
          {isLoading ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '100px 0',
              color: 'var(--text-secondary)'
            }}>
              Loading planner schedule...
            </div>
          ) : (
            <>
              {activeView === 'day' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="day-view-grid">
                  <DailyPlanner
                    selectedDate={selectedDate}
                    events={events}
                    onAddEvent={handleAddEvent}
                    onDeleteEvent={handleDeleteEvent}
                  />
                  <TimelineView
                    selectedDate={selectedDate}
                    events={events}
                  />
                </div>
              )}

              {activeView === 'week' && (
                <WeeklyPlanner
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  events={events}
                />
              )}

              {activeView === 'month' && (
                <MonthlyPlanner
                  selectedDate={selectedDate}
                  events={events}
                  onAddEvent={handleAddEvent}
                />
              )}

              {activeView === 'agenda' && (
                <AgendaView
                  events={events}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Inject styling rules for responsiveness */}
      <style>{`
        @media (max-width: 1024px) {
          .planner-split-layout {
            grid-template-columns: 1fr !important;
          }
          .planner-sidebar {
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
            gap: 20px !important;
          }
        }
        @media (max-width: 768px) {
          .day-view-grid {
            grid-template-columns: 1fr !important;
          }
          .planner-sidebar {
            grid-template-columns: 1fr !important;
          }
          .btn-label-text {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Planner;
