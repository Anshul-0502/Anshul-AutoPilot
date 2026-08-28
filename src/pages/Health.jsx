import React, { useState, useEffect } from 'react';
import HealthDashboard from './health/HealthDashboard';
import HabitTracker from './health/HabitTracker';
import WaterTracker from './health/WaterTracker';
import SleepTracker from './health/SleepTracker';
import WorkoutTracker from './health/WorkoutTracker';
import Meditation from './health/Meditation';
import FocusMode from './health/FocusMode';
import Pomodoro from './health/Pomodoro';
import ReminderCenter from './health/ReminderCenter';
import HealthAnalytics from './health/HealthAnalytics';
import focusApi from '../services/api/focusApi';
import healthApi from '../services/api/healthApi';
import notificationApi from '../services/api/notificationApi';
import { useAuth } from '../contexts/AuthContext';


import { 
  Heart, 
  CheckSquare, 
  Droplet, 
  Moon, 
  Activity, 
  Compass, 
  Timer, 
  Bell, 
  BarChart3,
  Flame,
  Zap
} from 'lucide-react';

const defaultHealthData = {
  waterGoal: 8, // glasses
  waterIntake: 3, // glasses
  sleepTime: '23:00',
  wakeTime: '07:00',
  sleepQuality: 80, // %
  sleepHistory: [
    { day: 'Mon', hours: 7.5 },
    { day: 'Tue', hours: 8.0 },
    { day: 'Wed', hours: 6.5 },
    { day: 'Thu', hours: 7.0 },
    { day: 'Fri', hours: 7.5 },
    { day: 'Sat', hours: 8.5 },
    { day: 'Sun', hours: 8.0 }
  ],
  workouts: [
    { id: 1, type: 'Running', duration: 30, calories: 300, status: 'Completed', notes: 'Morning outdoor run' },
    { id: 2, type: 'Yoga', duration: 15, calories: 80, status: 'Completed', notes: 'Stretching exercises' }
  ],
  meditationTime: 15, // total mins
  meditationHistory: [
    { date: new Date().toISOString().split('T')[0], duration: 15 }
  ],
  habits: [
    { id: 1, title: 'Read a book', category: 'Reading', streak: 4, history: {} },
    { id: 2, title: 'Drink 8 glasses of water', category: 'Hydration', streak: 5, history: {} },
    { id: 3, title: 'Physical Workout', category: 'Fitness', streak: 3, history: {} },
    { id: 4, title: 'Meditate', category: 'Mindfulness', streak: 2, history: {} }
  ],
  focusSessions: [
    { id: 1, type: 'Pomodoro', duration: 25, date: new Date().toISOString().split('T')[0] }
  ],
  reminders: {
    water: true,
    eyeBreak: true,
    stretchBreak: false,
    sleep: true
  }
};

const Health = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [healthData, setHealthData] = useState(() => {
    const saved = localStorage.getItem('anshul_autopilot_health_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Process daily resets on water intake
        const todayStr = new Date().toISOString().split('T')[0];
        if (parsed.lastActiveDate !== todayStr) {
          return {
            ...parsed,
            waterIntake: 0, // reset hydration
            lastActiveDate: todayStr
          };
        }
        return parsed;
      } catch (e) {
        return { ...defaultHealthData, lastActiveDate: new Date().toISOString().split('T')[0] };
      }
    }
    return { ...defaultHealthData, lastActiveDate: new Date().toISOString().split('T')[0] };
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('anshul_autopilot_health_data', JSON.stringify(healthData));
  }, [healthData]);

  // Load completed focus sessions from backend
  useEffect(() => {
    const fetchFocusSessions = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await focusApi.getFocusSessions();
        if (res.success && res.data?.focusSessions) {
          setHealthData(prev => ({
            ...prev,
            focusSessions: res.data.focusSessions
          }));
        }
      } catch (err) {
        console.error('[Focus Session Load Error] Failed to load focus sessions:', err.message);
      }
    };
    fetchFocusSessions();
  }, [isAuthenticated]);

  // Load health profile and wellness trackers from backend Mongoose
  useEffect(() => {
    const fetchHealthProfile = async () => {
      if (!isAuthenticated) return;
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const res = await healthApi.getHealthProfile(todayStr);
        if (res.success && res.data) {
          setHealthData(prev => ({
            ...prev,
            ...res.data,
            focusSessions: prev.focusSessions || []
          }));
        }
      } catch (err) {
        console.error('[Health Load Error] Failed to load health profile:', err.message);
      }
    };
    fetchHealthProfile();
  }, [isAuthenticated]);

  // Updater: Water intake
  const updateWaterIntake = async (amount) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const res = await healthApi.updateWaterIntake(amount, todayStr);
      if (res.success && res.data) {
        setHealthData(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error('[Health Hydration Sync Error] Failed to update water intake:', err.message);
    }
  };

  // Updater: Water target limit
  const updateWaterGoal = async (goal) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const res = await healthApi.updateWaterGoal(goal, todayStr);
      if (res.success && res.data) {
        setHealthData(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error('[Health Hydration Sync Error] Failed to update water goal:', err.message);
    }
  };

  // Updater: Add workout log
  const addWorkout = async (workout) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const res = await healthApi.addWorkout({ ...workout, today: todayStr });
      if (res.success && res.data) {
        setHealthData(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error('[Health Workout Sync Error] Failed to add workout log:', err.message);
    }
  };

  // Updater: Sleep tracking
  const logSleep = async (sleepTime, wakeTime, quality, hours) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const res = await healthApi.logSleep({ sleepTime, wakeTime, quality, hours, today: todayStr });
      if (res.success && res.data) {
        setHealthData(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error('[Health Sleep Sync Error] Failed to log sleep details:', err.message);
    }
  };

  // Updater: Meditation mins
  const logMeditation = async (duration) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const res = await healthApi.logMeditation({ duration, today: todayStr });
      if (res.success && res.data) {
        setHealthData(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error('[Health Meditation Sync Error] Failed to record meditation time:', err.message);
    }
  };

  // Updater: Habit toggle
  const toggleHabit = async (id) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const res = await healthApi.toggleHabitToday(id, todayStr);
      if (res.success && res.data) {
        setHealthData(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error('[Health Habits Sync Error] Failed to toggle habit status:', err.message);
    }
  };

  // Updater: Add custom habit
  const addHabit = async (habit) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const res = await healthApi.addHabit({ ...habit, today: todayStr });
      if (res.success && res.data) {
        setHealthData(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error('[Health Habits Sync Error] Failed to add custom habit:', err.message);
    }
  };

  // Updater: Complete focus pomodoro session
  const completeFocusSession = async (type, duration) => {
    const todayStr = new Date().toISOString().split('T')[0];

    try {
      const res = await focusApi.createFocusSession({
        type,
        duration,
        date: todayStr
      });

      if (res.success && res.data?.session) {
        const newSession = res.data.session;
        const { xpEarned, coinsEarned } = res.data;

        // 1. Log focus session in health data
        setHealthData(prev => ({
          ...prev,
          focusSessions: [newSession, ...prev.focusSessions]
        }));

        // 2. Award XP and coins to Skill Arena state
        const skillSaved = localStorage.getItem('anshul_autopilot_skill_data');
        if (skillSaved) {
          const skill = JSON.parse(skillSaved);
          const nextXp = skill.xp + xpEarned;

          let nextLevel = skill.level;
          if (nextXp >= 2000) nextLevel = 5;
          if (nextXp >= 4000) nextLevel = 6;

          const updatedSkill = {
            ...skill,
            xp: nextXp,
            coins: skill.coins + coinsEarned,
            level: nextLevel
          };
          localStorage.setItem('anshul_autopilot_skill_data', JSON.stringify(updatedSkill));
        }

        // 3. Push alert log to notifications context
        await notificationApi.createNotification({
          title: '⏳ Focus Block Met!',
          message: `Finished ${duration} min ${type} focus block. Earned +${xpEarned} XP!`,
          type: 'health'
        });
        window.dispatchEvent(new CustomEvent('notification-created'));
      }
    } catch (err) {
      console.error('[Focus Session Save Error] Failed to log focus session:', err.message);
    }
  };

  // Updater: Reminder Center Toggles
  const toggleReminder = async (key) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const res = await healthApi.toggleReminder(key, todayStr);
      if (res.success && res.data) {
        setHealthData(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error('[Health Preferences Sync Error] Failed to toggle reminder center toggle:', err.message);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Health Dashboard', icon: <Heart size={16} /> },
    { id: 'habits', label: 'Habit Tracker', icon: <CheckSquare size={16} /> },
    { id: 'water', label: 'Water Tracker', icon: <Droplet size={16} /> },
    { id: 'sleep', label: 'Sleep Tracker', icon: <Moon size={16} /> },
    { id: 'workouts', label: 'Workout Tracker', icon: <Activity size={16} /> },
    { id: 'meditation', label: 'Meditation', icon: <Compass size={16} /> },
    { id: 'focus', label: 'Focus & Pomodoro', icon: <Timer size={16} /> },
    { id: 'reminders', label: 'Reminder Center', icon: <Bell size={16} /> },
    { id: 'analytics', label: 'Health Stats', icon: <BarChart3 size={16} /> }
  ];

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
            ❤️ Health & Focus Hub
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Balance wellness habits, sleep metrics, and Pomodoro deep focus sessions.
          </p>
        </div>

        {/* Dynamic Hydration Streak info */}
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          background: 'var(--glass-card-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          padding: '8px 16px',
          boxShadow: 'var(--glass-shadow)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
            <Flame size={16} style={{ color: 'var(--color-accent)' }} />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Streak: {healthData.habits[1]?.streak || 5} Days</span>
          </div>
          <div style={{ width: '1px', height: '20px', background: 'var(--glass-border)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
            <Droplet size={16} style={{ color: 'var(--color-secondary)' }} />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{healthData.waterIntake}/{healthData.waterGoal} Glasses</span>
          </div>
        </div>
      </div>

      {/* Main Grid split */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        gap: '20px',
        alignItems: 'start'
      }} className="flex-col-mobile">
        
        {/* Navigation Sidebar */}
        <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '6px 10px', display: 'block' }}>
            Wellness Modules
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

        {/* Workspace views area */}
        <div style={{ minWidth: 0 }}>
          {activeTab === 'overview' && (
            <HealthDashboard 
              data={healthData} 
              onTriggerTab={(tabId) => setActiveTab(tabId)}
              onQuickHydrate={() => updateWaterIntake(1)}
            />
          )}

          {activeTab === 'habits' && (
            <HabitTracker habits={healthData.habits} onToggle={toggleHabit} onAddHabit={addHabit} />
          )}

          {activeTab === 'water' && (
            <WaterTracker 
              intake={healthData.waterIntake} 
              goal={healthData.waterGoal} 
              onAddGlass={(amt) => updateWaterIntake(amt)}
              onUpdateGoal={updateWaterGoal}
            />
          )}

          {activeTab === 'sleep' && (
            <SleepTracker 
              sleepTime={healthData.sleepTime} 
              wakeTime={healthData.wakeTime} 
              quality={healthData.sleepQuality}
              history={healthData.sleepHistory} 
              onLogSleep={logSleep} 
            />
          )}

          {activeTab === 'workouts' && (
            <WorkoutTracker workouts={healthData.workouts} onAddWorkout={addWorkout} />
          )}

          {activeTab === 'meditation' && (
            <Meditation onCompleteMeditation={logMeditation} />
          )}

          {activeTab === 'focus' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Pomodoro onFocusComplete={(d) => completeFocusSession('Pomodoro', d)} />
              <FocusMode onFocusComplete={(d) => completeFocusSession('Deep Work', d)} />
            </div>
          )}

          {activeTab === 'reminders' && (
            <ReminderCenter reminders={healthData.reminders} onToggle={toggleReminder} />
          )}

          {activeTab === 'analytics' && (
            <HealthAnalytics data={healthData} />
          )}
        </div>

      </div>
    </div>
  );
};

export default Health;
