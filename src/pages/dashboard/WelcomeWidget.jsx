import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Cloud, Moon, Plus, Timer, Edit, Code } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const quotes = [
  "Small progress every day leads to big results.",
  "Make today count. Code, learn, repeat.",
  "Focus is a muscle. Keep training it.",
  "Consistency beats intensity any day.",
  "Your future self will thank you for the work you do today."
];

const WelcomeWidget = ({ user = {} }) => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Choose random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hours = time.getHours();
    if (hours < 12) return { text: 'Good Morning', icon: <Sun size={24} style={{ color: 'var(--color-accent)' }} /> };
    if (hours < 18) return { text: 'Good Afternoon', icon: <Cloud size={24} style={{ color: 'var(--color-secondary)' }} /> };
    return { text: 'Good Evening', icon: <Moon size={24} style={{ color: 'var(--color-primary)' }} /> };
  };

  const greeting = getGreeting();
  
  const formatDate = (date) => {
    return date.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <Card hoverable={false} style={{ height: '100%', background: 'linear-gradient(135deg, var(--color-primary-glow) 0%, var(--glass-card-bg) 100%)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            {greeting.icon}
            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {greeting.text}, {user.name || 'User'}
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {formatDate(time)}
          </p>
          <p style={{ margin: '12px 0 0 0', fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--color-primary)' }}>
            "{quote}"
          </p>
        </div>
        <div style={{
          textAlign: 'right',
          background: 'var(--glass-btn-bg)',
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1px solid var(--glass-border)',
          fontFamily: 'var(--mono)'
        }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
            {formatTime(time)}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Local Time</span>
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--glass-border)', margin: '18px 0' }} />

      {/* Quick shortcuts */}
      <div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
          Quick Launcher
        </span>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button variant="glass" size="sm" onClick={() => navigate('/tasks')} iconLeft={<Plus size={14} />}>
            Add Task
          </Button>
          <Button variant="glass" size="sm" onClick={() => navigate('/planner')} iconLeft={<Timer size={14} />}>
            Timer
          </Button>
          <Button variant="glass" size="sm" onClick={() => navigate('/study')} iconLeft={<Edit size={14} />}>
            New Note
          </Button>
          <Button variant="glass" size="sm" onClick={() => navigate('/coding')} iconLeft={<Code size={14} />}>
            DSA
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default WelcomeWidget;
