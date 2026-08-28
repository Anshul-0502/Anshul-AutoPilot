import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Zap, Menu, X, ArrowRight, Shield, Rocket, Heart } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import ModulePreview from './ModulePreview';
import Footer from './Footer';
import Button from '../components/Button';
import '../styles/landing.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor scroll for fixed navbar glass effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="landing-container">
      {/* Navigation Bar */}
      <nav className={`landing-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex' }} />
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', letterSpacing: '0.5px' }}>AutoPilot</span>
        </div>

        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#why-autopilot" className="nav-link">About</a>
          <a href="#preview" className="nav-link">Modules</a>
          
          <Button variant="ghost" onClick={toggleTheme} style={{ padding: '8px', borderRadius: '50%' }}>
            {theme === 'dark' ? <Sun size={18} style={{ color: 'var(--color-accent)' }} /> : <Moon size={18} />}
          </Button>

          <Button variant="glass" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}>
            {isAuthenticated ? 'Enter App' : 'Sign In'}
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="hamburger">
          <Button variant="ghost" onClick={toggleTheme} style={{ padding: '8px', borderRadius: '50%' }}>
            {theme === 'dark' ? <Sun size={18} style={{ color: 'var(--color-accent)' }} /> : <Moon size={18} />}
          </Button>
          <button 
            className="hamburger" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="mobile-drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <a href="#features" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#why-autopilot" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#preview" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Modules</a>
            <Button variant="primary" onClick={() => { setMobileMenuOpen(false); navigate(isAuthenticated ? '/dashboard' : '/login'); }} style={{ width: '100%' }}>
              {isAuthenticated ? 'Enter App' : 'Sign In'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <div id="features">
        <FeaturesSection />
      </div>

      {/* Why Choose AutoPilot Section */}
      <section id="why-autopilot" className="landing-section" style={{ borderTop: '1px solid var(--glass-border)' }}>
        <div className="section-header">
          <span style={{
            color: 'var(--color-primary)',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            display: 'block',
            marginBottom: '8px'
          }}>
            Why AutoPilot
          </span>
          <h2>A Connected Workspace</h2>
          <p>Tired of bouncing between tabs, planners, notes and code editors? Here is why AutoPilot is built differently.</p>
        </div>

        <div className="why-grid">
          <div className="why-card">
            <Zap size={32} style={{ color: 'var(--color-accent)', marginBottom: '16px' }} />
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 600 }}>Eliminate Fragmentation</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Keep your tasks, notes, health parameters and coding goals in one unified frame. One source of truth for your day.
            </p>
          </div>
          <div className="why-card">
            <Shield size={32} style={{ color: 'var(--color-success)', marginBottom: '16px' }} />
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 600 }}>Local & Client-First</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Your data is completely yours. All logs are stored securely on your browser local state, guaranteeing privacy and offline usage.
            </p>
          </div>
          <div className="why-card">
            <Rocket size={32} style={{ color: 'var(--color-primary)', marginBottom: '16px' }} />
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 600 }}>Future AI Ready</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Designed modularly with abstraction hooks. Future updates will plug in Gemini intelligence without altering core layouts.
            </p>
          </div>
        </div>
      </section>

      {/* Module Previews Section */}
      <div id="preview">
        <ModulePreview />
      </div>

      {/* CTA Final Banner */}
      <section className="landing-section" style={{ textAlign: 'center', background: 'radial-gradient(circle, var(--color-primary-glow) 0%, transparent 70%)', padding: '100px 8%' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '-1.2px' }}>
          Take Control of Your Productivity
        </h2>
        <p style={{ maxWidth: '600px', margin: '0 auto 32px', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Start building consistent habits, crush your coding targets, and review your progress metrics today.
        </p>
        <Button 
          variant="primary" 
          size="lg" 
          onClick={() => navigate('/dashboard')}
          iconRight={<ArrowRight size={18} />}
        >
          Get Started Now
        </Button>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
