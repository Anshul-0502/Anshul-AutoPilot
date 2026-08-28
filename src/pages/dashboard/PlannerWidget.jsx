import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Play, Pause, RotateCcw, Clock, ArrowRight } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const PlannerWidget = ({ upcomingEvents = [] }) => {
  const navigate = useNavigate();

  // Pomodoro Timer State
  const [secondsLeft, setSecondsLeft] = useState(1500); // 25 mins
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((seconds) => seconds - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(1500);
  };

  const formatTimeLeft = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getBulletColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'study':
        return 'var(--color-primary)';
      case 'meeting':
      case 'other':
        return 'var(--color-accent)';
      case 'coding':
      case 'work':
        return 'var(--color-success)';
      default:
        return 'var(--text-muted)';
    }
  };

  return (
    <Card
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} style={{ color: 'var(--color-secondary)' }} />
            <span>Today's Planner</span>
          </div>
          <Button 
            variant="glass" 
            size="sm" 
            onClick={() => navigate('/planner')}
            style={{ padding: '2px 8px', fontSize: '0.8rem', height: '28px' }}
          >
            Open Planner
          </Button>
        </div>
      }
      style={{ height: '100%' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
        {/* Timer Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(10, 15, 29, 0.2) 100%)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={20} style={{ color: 'var(--color-secondary)' }} />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Focus Session</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>
                {formatTimeLeft(secondsLeft)}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <Button 
              variant={isActive ? 'glass' : 'primary'}
              size="sm" 
              onClick={toggleTimer}
              style={{ width: '32px', height: '32px', borderRadius: '50%', padding: 0, minWidth: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {isActive ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: '2px' }} />}
            </Button>
            <Button 
              variant="glass" 
              size="sm" 
              onClick={resetTimer}
              style={{ width: '32px', height: '32px', borderRadius: '50%', padding: 0, minWidth: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <RotateCcw size={14} />
            </Button>
          </div>
        </div>

        {/* Timeline Events */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Timeline
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', paddingLeft: '12px' }}>
            {/* Timeline Line */}
            <div style={{
              position: 'absolute',
              left: '4px',
              top: '8px',
              bottom: '8px',
              width: '1px',
              background: 'var(--glass-border)'
            }} />

            {upcomingEvents.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '10px 0' }}>
                No events scheduled for today.
              </div>
            ) : (
              upcomingEvents.map((evt, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    position: 'relative',
                    fontSize: '0.85rem'
                  }}
                >
                  {/* Bullet Node */}
                  <div style={{
                    position: 'absolute',
                    left: '-11px',
                    top: '4px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: getBulletColor(evt.type),
                    boxShadow: '0 0 8px currentColor'
                  }} />
                  
                  <span style={{ 
                    fontFamily: 'var(--mono)', 
                    color: 'var(--text-muted)', 
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    width: '65px',
                    flexShrink: 0
                  }}>
                    {evt.time}
                  </span>
                  
                  <span style={{ 
                    color: 'var(--text-primary)',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {evt.title}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div 
          onClick={() => navigate('/planner')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '6px', 
            fontSize: '0.85rem', 
            color: 'var(--color-secondary)', 
            cursor: 'pointer',
            fontWeight: 500,
            padding: '4px 0'
          }}
          className="hover-scale"
        >
          <span>Open Full Planner</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </Card>
  );
};

export default PlannerWidget;
