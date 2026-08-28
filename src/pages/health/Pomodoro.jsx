import React, { useState, useEffect, useRef } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Timer, Play, Pause, Square, SkipForward } from 'lucide-react';

const Pomodoro = ({ onFocusComplete }) => {
  const [activePreset, setActivePreset] = useState('Work'); // 'Work', 'Short Break', 'Long Break'
  const [timeLeft, setTimeLeft] = useState(1500); // 25 mins in seconds
  const [isActive, setIsActive] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const timerRef = useRef(null);

  const presets = {
    'Work': 1500, // 25 mins
    'Short Break': 300, // 5 mins
    'Long Break': 900 // 15 mins
  };

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(presets[activePreset]);
    }
  }, [activePreset, isActive]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            
            if (activePreset === 'Work') {
              setCompletedCount(c => c + 1);
              if (onFocusComplete) {
                onFocusComplete(25); // completed 25 mins
              }
            }
            
            playBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, activePreset]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleStop = () => {
    setIsActive(false);
    setTimeLeft(presets[activePreset]);
  };

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {}
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <Card 
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Timer size={18} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Pomodoro timer</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Done Today: {completedCount} Blocks
          </span>
        </div>
      }
      style={{ border: '1px solid var(--glass-border)' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '10px 0' }}>
        
        {/* Preset selectors */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {Object.keys(presets).map(preset => {
            const isSel = preset === activePreset;
            return (
              <button
                key={preset}
                onClick={() => {
                  if (!isActive) {
                    setActivePreset(preset);
                  }
                }}
                disabled={isActive}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: isSel ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                  background: isSel ? 'var(--color-primary-glow)' : 'var(--glass-btn-bg)',
                  color: isSel ? 'var(--color-primary)' : 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: isActive ? 'not-allowed' : 'pointer',
                  opacity: isActive && !isSel ? 0.5 : 1
                }}
              >
                {preset}
              </button>
            );
          })}
        </div>

        {/* Big ticking digital layout */}
        <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--mono)', letterSpacing: '1px' }}>
          {formatTime(timeLeft)}
        </span>

        {/* Actions buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {isActive ? (
            <Button
              variant="glass"
              onClick={handlePause}
              iconLeft={<Pause size={14} />}
              style={{ height: '32px', fontSize: '0.8rem' }}
            >
              Pause
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleStart}
              iconLeft={<Play size={14} />}
              style={{ height: '32px', fontSize: '0.8rem' }}
              disabled={timeLeft <= 0}
            >
              Start
            </Button>
          )}

          <Button
            variant="glass"
            onClick={handleStop}
            iconLeft={<Square size={14} />}
            style={{ height: '32px', fontSize: '0.8rem' }}
            disabled={!isActive && timeLeft === presets[activePreset]}
          >
            Reset
          </Button>
        </div>

      </div>
    </Card>
  );
};

export default Pomodoro;
