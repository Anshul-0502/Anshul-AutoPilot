import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Code, BookOpen, CheckCircle, BarChart2, Flame } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';

const HeroSection = () => {
  const navigate = useNavigate();

  // Scroll to features section
  const handleLearnMore = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      <motion.div 
        className="hero-text"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Anshul AutoPilot</h1>
        <p>
          A premium, modular productivity operating system designed for students, developers, and creators. Maintain your daily schedule, manage subjects, track coding milestones, and monitor your health from a single glassmorphic workspace.
        </p>
        <div className="hero-buttons">
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => navigate('/dashboard')}
            iconRight={<Play size={18} />}
          >
            Get Started
          </Button>
          <Button 
            variant="glass" 
            size="lg" 
            onClick={handleLearnMore}
          >
            Learn More
          </Button>
        </div>
      </motion.div>

      <motion.div 
        className="hero-visual"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="mockup-container">
          {/* Main Dashboard Mockup Base */}
          <div className="mockup-base glass-panel">
            {/* Sidebar Mockup */}
            <div className="mockup-sidebar glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '16px 0' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifySelf: 'center' }} />
              <BookOpen size={18} style={{ color: 'var(--text-muted)' }} />
              <Code size={18} style={{ color: 'var(--color-primary)' }} />
              <CheckCircle size={18} style={{ color: 'var(--text-muted)' }} />
              <BarChart2 size={18} style={{ color: 'var(--text-muted)' }} />
            </div>

            {/* Navbar Mockup */}
            <div className="mockup-main glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Anshul's Workspace</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-success)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Online</span>
              </div>
            </div>

            {/* Floating Card 1: Study Timer */}
            <motion.div 
              className="mockup-card-1 glass-card"
              style={{ padding: '12px' }}
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>Focus Session</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary)' }}>Active</span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, margin: '4px 0', color: 'var(--text-primary)' }}>24:59</div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Subject: DSA Recursion</span>
            </motion.div>

            {/* Floating Card 2: Coding stats */}
            <motion.div 
              className="mockup-card-2 glass-card"
              style={{ padding: '14px' }}
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
            >
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                <Code size={16} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>DSA Practice</span>
              </div>
              <ProgressBar label="Leetcode Solver" value={78} max={100} showLabel={false} height="6px" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '6px', color: 'var(--text-secondary)' }}>
                <span>78 / 100 Solved</span>
                <span style={{ display: 'flex', alignItems: 'center', color: 'var(--color-accent)', fontWeight: 600 }}>
                  <Flame size={12} style={{ marginRight: '2px' }} /> 12 Days
                </span>
              </div>
            </motion.div>

            {/* Floating Card 3: Tasks */}
            <motion.div 
              className="mockup-card-3 glass-card"
              style={{ padding: '14px' }}
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>Today's Tasks</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: 'var(--color-primary)' }} />
                  <span style={{ textDecoration: 'line-through', opacity: 0.7 }}>Review JS Promises</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                  <input type="checkbox" style={{ accentColor: 'var(--color-primary)' }} />
                  <span>Build React Shell Component</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                  <input type="checkbox" style={{ accentColor: 'var(--color-primary)' }} />
                  <span>Gym focus session</span>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 4: Analytics */}
            <motion.div 
              className="mockup-card-4 glass-card"
              style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1.5 }}
            >
              <div style={{ background: 'var(--color-primary-glow)', padding: '6px', borderRadius: '6px', display: 'flex' }}>
                <BarChart2 size={16} style={{ color: 'var(--color-primary)' }} />
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Daily Score</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>92% Efficiency</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
