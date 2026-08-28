import React, { useState, useEffect } from 'react';
import ProfileSettings from './settings/ProfileSettings';
import AppearanceSettings from './settings/AppearanceSettings';
import NotificationSettings from './settings/NotificationSettings';
import DashboardSettings from './settings/DashboardSettings';
import StudySettings from './settings/StudySettings';
import CodingSettings from './settings/CodingSettings';
import TimerSettings from './settings/TimerSettings';
import SecuritySettings from './settings/SecuritySettings';
import BackupRestore from './settings/BackupRestore';
import DataManagement from './settings/DataManagement';
import AboutPage from './settings/AboutPage';
import { useAuth } from '../contexts/AuthContext';
import userApi from '../services/api/userApi';

import { 
  User, 
  Paintbrush, 
  Layout, 
  Bell, 
  BookOpen, 
  Code, 
  Timer, 
  Lock, 
  Database, 
  AlertOctagon, 
  Info 
} from 'lucide-react';

const defaultSettings = {
  profile: {
    photo: '',
    fullName: 'Anshul Kumar',
    username: 'anshul_developer',
    email: 'anshul.kumar@college.edu',
    bio: 'CS Student & Aspiring Full Stack Software Architect. building autopilot widgets.',
    college: 'Delhi Technological University',
    skills: 'React, Node.js, C++, Data Structures & Algorithms',
    careerGoal: 'Software Engineer at Google DeepMind'
  },
  appearance: {
    theme: 'Dark', // 'Dark', 'Light', 'Auto'
    accentColor: 'indigo', // 'indigo', 'sky', 'emerald', 'amber', 'rose'
    fontSize: 'medium', // 'small', 'medium', 'large'
    sidebarStyle: 'glass',
    density: 'default' // 'compact', 'default', 'spacious'
  },
  dashboard: {
    widgets: {
      study: true,
      coding: true,
      tasks: true,
      projects: true,
      health: true,
      skills: true
    },
    defaultLanding: 'overview'
  },
  notifications: {
    tasks: true,
    planner: true,
    study: true,
    coding: true,
    projects: true,
    health: true,
    skills: true,
    focus: true,
    sound: true
  },
  study: {
    defaultDuration: 45, // mins
    breakDuration: 10, // mins
    revisionFrequency: 'Weekly',
    preferredSubjects: ['DSA', 'DBMS', 'Operating Systems', 'Networks'],
    pdfViewer: 'Default Browser'
  },
  coding: {
    defaultLanguage: 'JavaScript', // 'C++', 'JavaScript', 'Python'
    dailyGoal: 3, // problems
    dsaGoal: 100, // total solved
    timerDuration: 60, // mins
    codeTheme: 'vs-dark'
  },
  timer: {
    pomodoroWork: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: true,
    alarmSound: 'Chime'
  },
  security: {
    appLock: false,
    passcode: '',
    timeout: 15 // mins
  }
};

const Settings = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('anshul_autopilot_settings_data');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  // Fetch settings from backend on mount with LocalStorage cache fallback
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [profileRes, prefRes] = await Promise.all([
          userApi.getProfile(),
          userApi.getPreferences()
        ]);

        if (profileRes.success && prefRes.success) {
          const profileData = profileRes.data.profile;
          const prefData = prefRes.data.preferences;

          // Merge backend profile and preferences into local state
          setSettings({
            profile: {
              photo: profileData.photo || '',
              fullName: profileData.fullName || '',
              username: profileData.username || '',
              email: currentUser?.email || profileData.email || 'anshul.kumar@college.edu',
              bio: profileData.bio || '',
              college: profileData.college || '',
              skills: profileData.skills || '',
              careerGoal: profileData.careerGoal || ''
            },
            appearance: prefData.appearance,
            dashboard: prefData.dashboard,
            notifications: prefData.notifications,
            study: prefData.study,
            coding: prefData.coding,
            timer: prefData.timer,
            security: prefData.security
          });
        }
      } catch (err) {
        console.warn('[Settings Load Warning] Could not load settings from backend. Using local cache fallback.', err.message);
      }
    };

    fetchSettings();
  }, [currentUser]);

  // Sync settings to LocalStorage as cache
  useEffect(() => {
    localStorage.setItem('anshul_autopilot_settings_data', JSON.stringify(settings));

    // Dynamic accent color mapper
    const accents = {
      indigo: '#6366f1',
      sky: '#0ea5e9',
      emerald: '#10b981',
      amber: '#f59e0b',
      rose: '#f43f5e'
    };
    const primaryColor = accents[settings.appearance.accentColor] || accents.indigo;
    
    // Apply styling overrides directly to CSS vars on the document root
    document.documentElement.style.setProperty('--color-primary', primaryColor);
    document.documentElement.style.setProperty('--color-primary-glow', `${primaryColor}1a`); // 10% opacity
  }, [settings]);

  const updateSetting = async (category, updatedValues) => {
    // Update local React state instantly for snappy UI
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        ...updatedValues
      }
    }));

    try {
      if (category === 'profile') {
        await userApi.updateProfile(updatedValues);
      } else {
        await userApi.updatePreferences({ [category]: updatedValues });
      }
    } catch (err) {
      console.error(`[Settings Sync Error] Failed to update category ${category}:`, err.message);
    }
  };

  const tabs = [
    { id: 'profile', label: 'User Profile', icon: <User size={16} /> },
    { id: 'appearance', label: 'Appearance', icon: <Paintbrush size={16} /> },
    { id: 'dashboard', label: 'Dashboard Config', icon: <Layout size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { id: 'study', label: 'Study Setup', icon: <BookOpen size={16} /> },
    { id: 'coding', label: 'Coding Workspace', icon: <Code size={16} /> },
    { id: 'timers', label: 'Timer Options', icon: <Timer size={16} /> },
    { id: 'security', label: 'Security & Backup', icon: <Lock size={16} /> },
    { id: 'data', label: 'Data Management', icon: <AlertOctagon size={16} /> },
    { id: 'about', label: 'About', icon: <Info size={16} /> }
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
      <div>
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          ⚙️ Settings & Configuration
        </h1>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Customize workspace views, study preferences, theme accents, database backups, and notification limits.
        </p>
      </div>

      {/* Settings Grid Panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        gap: '20px',
        alignItems: 'start'
      }} className="flex-col-mobile">
        
        {/* Navigation Sidebar */}
        <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '6px 10px', display: 'block' }}>
            Control Center
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

        {/* Dynamic Details View Area */}
        <div style={{ minWidth: 0 }}>
          {activeTab === 'profile' && (
            <ProfileSettings 
              key={settings.profile.username || 'profile-tab'}
              profile={settings.profile} 
              onSave={(vals) => updateSetting('profile', vals)} 
            />
          )}

          {activeTab === 'appearance' && (
            <AppearanceSettings 
              key={settings.appearance.theme + settings.appearance.accentColor}
              appearance={settings.appearance} 
              onSave={(vals) => updateSetting('appearance', vals)} 
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardSettings 
              key={JSON.stringify(settings.dashboard.widgets)}
              dashboard={settings.dashboard} 
              onSave={(vals) => updateSetting('dashboard', vals)} 
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationSettings 
              key={JSON.stringify(settings.notifications)}
              notifications={settings.notifications} 
              onSave={(vals) => updateSetting('notifications', vals)} 
            />
          )}

          {activeTab === 'study' && (
            <StudySettings 
              key={JSON.stringify(settings.study.preferredSubjects) + settings.study.defaultDuration}
              study={settings.study} 
              onSave={(vals) => updateSetting('study', vals)} 
            />
          )}

          {activeTab === 'coding' && (
            <CodingSettings 
              key={settings.coding.defaultLanguage + settings.coding.dailyGoal}
              coding={settings.coding} 
              onSave={(vals) => updateSetting('coding', vals)} 
            />
          )}

          {activeTab === 'timers' && (
            <TimerSettings 
              key={settings.timer.pomodoroWork + settings.timer.alarmSound}
              timer={settings.timer} 
              onSave={(vals) => updateSetting('timer', vals)} 
            />
          )}

          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <SecuritySettings 
                key={settings.security.appLock + settings.security.timeout}
                security={settings.security} 
                onSave={(vals) => updateSetting('security', vals)} 
              />
              <BackupRestore />
            </div>
          )}

          {activeTab === 'data' && (
            <DataManagement />
          )}

          {activeTab === 'about' && (
            <AboutPage />
          )}
        </div>

      </div>
    </div>
  );
};

export default Settings;
