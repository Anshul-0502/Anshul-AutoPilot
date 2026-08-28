import React, { useState, useEffect, useRef } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Play, Pause, RotateCcw, Award, CheckCircle, Zap } from 'lucide-react';

const CodingTimer = ({ activeSession, onStartSession, onEndSession }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [preset, setPreset] = useState(25);
  const [mode, setMode] = useState('Coding Session');
  
  const timerRef = useRef(null);
  const totalSecondsRef = useRef(25 * 60);
  const secondsElapsedRef = useRef(0);

  const modes = [
    'Coding Session',
    'DSA Session',
    'Interview Practice',
    'Revision Session'
  ];

  const presets = [15, 25, 45, 60];

  // If activeSession is loaded from parent, sync states (for cross-page persistent sessions)
  useEffect(() => {
    if (activeSession) {
      setIsActive(activeSession.isActive);
      setMode(activeSession.mode);
      const elapsed = Math.floor((Date.now() - activeSession.startTime) / 1000);
      const remaining = Math.max(0, activeSession.totalSeconds - elapsed);
      setMinutes(Math.floor(remaining / 60));
      setSeconds(remaining % 60);
      totalSecondsRef.current = activeSession.totalSeconds;
      secondsElapsedRef.current = elapsed;
    }
  }, [activeSession]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSeconds((prevSec) => {
          if (prevSec > 0) {
            secondsElapsedRef.current += 1;
            return prevSec - 1;
          } else {
            setMinutes((prevMin) => {
              if (prevMin > 0) {
                secondsElapsedRef.current += 1;
                return prevMin - 1;
              } else {
                // Timer finished!
                handleTimerFinished();
                return 0;
              }
            });
            return 59;
          }
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive]);

  const handlePresetClick = (mins) => {
    if (isActive) return;
    setPreset(mins);
    setMinutes(mins);
    setSeconds(0);
    totalSecondsRef.current = mins * 60;
    secondsElapsedRef.current = 0;
  };

  const handleStart = () => {
    if (!isActive) {
      const totalSecs = minutes * 60 + seconds;
      totalSecondsRef.current = totalSecs;
      setIsActive(true);
      if (onStartSession) {
        onStartSession({
          mode,
          startTime: Date.now() - (secondsElapsedRef.current * 1000),
          totalSeconds: totalSecs,
          isActive: true
        });
      }
    }
  };

  const handlePause = () => {
    setIsActive(false);
    if (onStartSession) {
      onStartSession({
        mode,
        startTime: Date.now() - (secondsElapsedRef.current * 1000),
        totalSeconds: totalSecondsRef.current,
        isActive: false
      });
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setMinutes(preset);
    setSeconds(0);
    secondsElapsedRef.current = 0;
    if (onEndSession) {
      onEndSession(null); // Clear session
    }
  };

  const handleTimerFinished = () => {
    setIsActive(false);
    const timeSpentMinutes = Math.round(totalSecondsRef.current / 60);
    
    if (onEndSession) {
      onEndSession({
        id: Date.now(),
        type: mode,
        durationMinutes: timeSpentMinutes,
        date: new Date().toLocaleDateString()
      });
    }
    
    alert(`🎉 Great job! You completed a ${timeSpentMinutes}-minute ${mode}!`);
    setMinutes(preset);
    setSeconds(0);
    secondsElapsedRef.current = 0;
  };

  const handleSaveEarly = () => {
    setIsActive(false);
    const timeSpentMinutes = Math.round(secondsElapsedRef.current / 60);
    
    if (timeSpentMinutes < 1) {
      alert("Note: Sessions shorter than 1 minute won't be saved to stats.");
      handleReset();
      return;
    }

    if (onEndSession) {
      onEndSession({
        id: Date.now(),
        type: mode,
        durationMinutes: timeSpentMinutes,
        date: new Date().toLocaleDateString()
      });
    }

    alert(`Saved focus log: ${timeSpentMinutes} mins of ${mode}.`);
    setMinutes(preset);
    setSeconds(0);
    secondsElapsedRef.current = 0;
  };

  const formatNumber = (num) => num.toString().padStart(2, '0');

  const progressPercent = totalSecondsRef.current > 0 
    ? Math.min(100, ((totalSecondsRef.current - (minutes * 60 + seconds)) / totalSecondsRef.current) * 100) 
    : 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="timer-responsive-grid">
      
      {/* Left panel: The visual clock */}
      <Card
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={16} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>Focus Chronometer</span>
          </div>
        }
        hoverable={false}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 0', gap: '20px' }}>
          
          {/* Circular progress container */}
          <div style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'var(--glass-btn-bg)',
            border: '2px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: 'var(--glass-shadow)'
          }}>
            {/* SVG Progress Circle wrapper */}
            <svg style={{ position: 'absolute', width: '100%', height: '100%', transform: 'rotate(-90deg)', top: 0, left: 0 }}>
              <circle 
                cx="100" 
                cy="100" 
                r="92" 
                stroke="var(--color-primary-glow)" 
                strokeWidth="6" 
                fill="transparent" 
              />
              <circle 
                cx="100" 
                cy="100" 
                r="92" 
                stroke="var(--color-primary)" 
                strokeWidth="6" 
                fill="transparent" 
                strokeDasharray={2 * Math.PI * 92}
                strokeDashoffset={2 * Math.PI * 92 * (1 - progressPercent / 100)}
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>

            {/* Time reading */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--mono)', letterSpacing: '-1px' }}>
                {formatNumber(minutes)}:{formatNumber(seconds)}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginTop: '2px' }}>
                {mode}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center', maxWidth: '240px' }}>
            {isActive ? (
              <Button 
                variant="outline" 
                onClick={handlePause}
                iconLeft={<Pause size={16} />}
                style={{ flex: 1 }}
              >
                Pause
              </Button>
            ) : (
              <Button 
                variant="primary" 
                onClick={handleStart}
                iconLeft={<Play size={16} />}
                style={{ flex: 1 }}
              >
                Start
              </Button>
            )}

            {(isActive || secondsElapsedRef.current > 0) && (
              <Button 
                variant="success" 
                onClick={handleSaveEarly}
                iconLeft={<CheckCircle size={16} />}
                style={{ padding: '8px' }}
                title="Save session progress now"
              />
            )}

            <Button 
              variant="glass" 
              onClick={handleReset}
              iconLeft={<RotateCcw size={16} />}
              style={{ padding: '8px' }}
              title="Reset focus clock"
            />
          </div>

        </div>
      </Card>

      {/* Right panel: Presets and configurations */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Preset configuration selection */}
        <Card
          header={<span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Choose Duration Preset</span>}
          hoverable={false}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {presets.map((p) => (
              <button
                key={p}
                disabled={isActive}
                onClick={() => handlePresetClick(p)}
                style={{
                  padding: '12px 6px',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: preset === p ? 'var(--color-primary-glow)' : 'var(--glass-btn-bg)',
                  color: preset === p ? 'var(--color-primary)' : 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: isActive ? 'not-allowed' : 'pointer',
                  opacity: isActive && preset !== p ? 0.5 : 1,
                  transition: 'all 0.2s ease'
                }}
                className={!isActive ? "hover-scale" : ""}
              >
                {p} Mins
              </button>
            ))}
          </div>
        </Card>

        {/* Focus Mode selection */}
        <Card
          header={<span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Session Type / Focus Mode</span>}
          hoverable={false}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {modes.map((m) => (
              <div
                key={m}
                onClick={() => !isActive && setMode(m)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: mode === m ? 'var(--color-primary-glow)' : 'transparent',
                  cursor: isActive ? 'not-allowed' : 'pointer',
                  opacity: isActive && mode !== m ? 0.5 : 1,
                  transition: 'all 0.2s ease',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: mode === m ? 'var(--color-primary)' : 'var(--text-secondary)'
                }}
                className={!isActive ? "hover-scale" : ""}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: mode === m ? 'var(--color-primary)' : 'var(--text-muted)',
                  marginRight: '12px'
                }} />
                {m}
              </div>
            ))}
          </div>
        </Card>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .timer-responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CodingTimer;
