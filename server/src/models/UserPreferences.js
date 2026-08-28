import mongoose from 'mongoose';

const userPreferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  appearance: {
    theme: { type: String, default: 'Dark' },
    accentColor: { type: String, default: 'indigo' },
    fontSize: { type: String, default: 'medium' },
    sidebarStyle: { type: String, default: 'glass' },
    density: { type: String, default: 'default' }
  },
  dashboard: {
    widgets: {
      study: { type: Boolean, default: true },
      coding: { type: Boolean, default: true },
      tasks: { type: Boolean, default: true },
      projects: { type: Boolean, default: true },
      health: { type: Boolean, default: true },
      skills: { type: Boolean, default: true }
    },
    defaultLanding: { type: String, default: 'overview' }
  },
  notifications: {
    tasks: { type: Boolean, default: true },
    planner: { type: Boolean, default: true },
    study: { type: Boolean, default: true },
    coding: { type: Boolean, default: true },
    projects: { type: Boolean, default: true },
    health: { type: Boolean, default: true },
    skills: { type: Boolean, default: true },
    focus: { type: Boolean, default: true },
    sound: { type: Boolean, default: true },
    voiceEnabled: { type: Boolean, default: true },
    preferredVoice: { type: String, default: 'Default' }
  },
  study: {
    defaultDuration: { type: Number, default: 45 },
    breakDuration: { type: Number, default: 10 },
    revisionFrequency: { type: String, default: 'Weekly' },
    preferredSubjects: { type: [String], default: ['DSA', 'DBMS', 'Operating Systems', 'Networks'] },
    pdfViewer: { type: String, default: 'Default Browser' }
  },
  coding: {
    defaultLanguage: { type: String, default: 'JavaScript' },
    dailyGoal: { type: Number, default: 3 },
    dsaGoal: { type: Number, default: 100 },
    timerDuration: { type: Number, default: 60 },
    codeTheme: { type: String, default: 'vs-dark' }
  },
  timer: {
    pomodoroWork: { type: Number, default: 25 },
    shortBreak: { type: Number, default: 5 },
    longBreak: { type: Number, default: 15 },
    autoStartBreaks: { type: Boolean, default: true },
    alarmSound: { type: String, default: 'Chime' }
  },
  security: {
    appLock: { type: Boolean, default: false },
    passcode: { type: String, default: '' },
    timeout: { type: Number, default: 15 }
  }
}, {
  timestamps: true
});

const UserPreferences = mongoose.model('UserPreferences', userPreferencesSchema);

export default UserPreferences;
