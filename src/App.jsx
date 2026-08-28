import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Planner from './pages/Planner';
import Tasks from './pages/Tasks';
import StudyHub from './pages/StudyHub';
import CodingWorkspace from './pages/CodingWorkspace';
import Projects from './pages/Projects';
import SkillArena from './pages/SkillArena';
import Analytics from './pages/Analytics';
import Health from './pages/Health';
import Settings from './pages/Settings';
import { useAuth } from './contexts/AuthContext';
import './App.css';

// Protected Route Wrapper Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        gap: '16px'
      }}>
        {/* Simple spinner */}
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--glass-border-hover)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>
          Loading Workspace...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Landing Page Route */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Core Application Routes wrapped in MainLayout & ProtectedRoute */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/study" element={<StudyHub />} />
        <Route path="/coding" element={<CodingWorkspace />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/games" element={<SkillArena />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/health" element={<Health />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
