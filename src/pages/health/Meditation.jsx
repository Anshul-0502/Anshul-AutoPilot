import React, { useState, useEffect, useRef } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Compass, Play, Pause, Square, Wind, Volume2, VolumeX } from 'lucide-react';

const Meditation = ({ onCompleteMeditation }) => {
  const [duration, setDuration] = useState(5); // preset in mins
  const [timeLeft, setTimeLeft] = useState(300); // in seconds
  const [isActive, setIsActive] = useState(false);
  const [breathState, setBreathState] = useState('Inhale'); // Inhale, Hold, Exhale
  const [breathSec, setBreathSec] = useState(4); // 4-sec box cycle
  const [ambientSound, setAmbientSound] = useState(true);

  const timerRef = useRef(null);
  const breathTimerRef = useRef(null);

  // Synchronize timeLeft to duration selection
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration * 60);
    }
  }, [duration, isActive]);

  // Main countdown timer
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            clearInterval(breathTimerRef.current);
            setIsActive(false);
            if (onCompleteMeditation) {
              onCompleteMeditation(duration);
            }
            // Completion beep sound
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
  }, [isActive, duration]);

  // Breathing guidance timer (4s cycle: Inhale -> Hold -> Exhale -> Hold)
  useEffect(() => {
    if (isActive) {
      breathTimerRef.current = setInterval(() => {
        setBreathSec(prev => {
          if (prev <= 1) {
            // Transition breath phase
            setBreathState(curr => {
              if (curr === 'Inhale') return 'Hold (Full)';
              if (curr === 'Hold (Full)') return 'Exhale';
              if (curr === 'Exhale') return 'Hold (Empty)';
              return 'Inhale';
            });
            return 4; // Reset to 4s
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(breathTimerRef.current);
      setBreathState('Prepare...');
    }
    return () => clearInterval(breathTimerRef.current);
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleStop = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
    setBreathState('Inhale');
    setBreathSec(4);
  };

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {}
  };

  // Breathing guide circle animation scale calculation
  const getCircleScale = () => {
    if (!isActive) return 1.0;
    if (breathState === 'Inhale') {
      return 1.0 + ((4 - breathSec) / 4) * 0.5; // grows from 1.0 to 1.5
    }
    if (breathState === 'Hold (Full)') {
      return 1.5; // holds expanded
    }
    if (breathState === 'Exhale') {
      return 1.5 - ((4 - breathSec) / 4) * 0.5; // shrinks from 1.5 to 1.0
    }
    return 1.0; // holds contracted
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
            <Compass size={18} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Guided Box Breathing</span>
          </div>
          <button 
            onClick={() => setAmbientSound(!ambientSound)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            {ambientSound ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      }
      style={{ border: '1px solid var(--glass-border)' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', padding: '16px 0' }}>
        
        {/* Preset selectors */}
        {!isActive && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 5, 10, 15, 30].map(mins => (
              <button
                key={mins}
                onClick={() => {
                  setDuration(mins);
                  setTimeLeft(mins * 60);
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: duration === mins ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                  background: duration === mins ? 'var(--color-primary-glow)' : 'var(--glass-btn-bg)',
                  color: duration === mins ? 'var(--color-primary)' : 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {mins} Mins
              </button>
            ))}
          </div>
        )}

        {/* Breathing Animator Circle */}
        <div style={{
          position: 'relative',
          width: '180px',
          height: '180px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Pulsing Guide Ring */}
          <div
            style={{
              position: 'absolute',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.02) 70%)',
              border: '2px dashed rgba(99, 102, 241, 0.3)',
              transform: `scale(${getCircleScale()})`,
              transition: 'transform 1s linear',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />

          {/* Central Instruction Ring */}
          <div style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'var(--glass-card-bg)',
            border: '1.5px solid var(--glass-border-hover)',
            boxShadow: 'var(--glass-shadow)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            zIndex: 2
          }}>
            <Wind size={18} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {breathState}
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, fontFamily: 'var(--mono)' }}>
              {isActive ? `${breathSec}s` : ''}
            </span>
          </div>
        </div>

        {/* Digital Time count */}
        <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>
          {formatTime(timeLeft)}
        </span>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {isActive ? (
            <Button
              variant="glass"
              onClick={handlePause}
              iconLeft={<Pause size={16} />}
              style={{ height: '36px', fontSize: '0.85rem' }}
            >
              Pause
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleStart}
              iconLeft={<Play size={16} />}
              style={{ height: '36px', fontSize: '0.85rem' }}
              disabled={timeLeft <= 0}
            >
              Start Session
            </Button>
          )}

          <Button
            variant="glass"
            onClick={handleStop}
            iconLeft={<Square size={16} />}
            style={{ height: '36px', fontSize: '0.85rem' }}
            disabled={!isActive && timeLeft === duration * 60}
          >
            Reset
          </Button>
        </div>

      </div>
    </Card>
  );
};

export default Meditation;
