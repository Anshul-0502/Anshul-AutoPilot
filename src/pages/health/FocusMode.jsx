import React, { useState, useEffect, useRef } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Target, Play, Pause, Square, Flame, AlertCircle } from 'lucide-react';

const FocusMode = ({ onFocusComplete }) => {
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState(30); // in mins
  const [mode, setMode] = useState('Deep Work'); // 'Deep Work', 'Study Mode', 'Coding Mode', 'Revision Mode'
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // secs
  const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0);

  const timerRef = useRef(null);

  const quotes = [
    "Keep coding, bugs are just unexpected features.",
    "The secret of getting ahead is getting started.",
    "Don't stop when you are tired. Stop when you are done.",
    "Focus is a muscle, and you build it by focusing.",
    "One study session at a time, one solved task at a time."
  ];

  // Rotate quotes every 20 seconds during active focus
  useEffect(() => {
    let quoteInterval;
    if (isActive) {
      quoteInterval = setInterval(() => {
        setCurrentQuoteIdx(prev => (prev + 1) % quotes.length);
      }, 20000);
    }
    return () => clearInterval(quoteInterval);
  }, [isActive]);

  // Synchronize timeLeft to duration selection
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration * 60);
    }
  }, [duration, isActive]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            if (onFocusComplete) {
              onFocusComplete(duration);
            }
            playCompletionSound();
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

  const handleStart = (e) => {
    e.preventDefault();
    if (!goal.trim()) return;
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleStop = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
  };

  const playCompletionSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.0);
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={18} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Focus Mode Dashboard</span>
        </div>
      }
      style={{ border: '1px solid var(--glass-border)', textAlign: 'left' }}
    >
      {!isActive ? (
        // Settings form
        <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>What is your focus goal today?</label>
            <input
              type="text"
              placeholder="e.g. Master binary tree logic, Draft Operating Systems note blocks"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              style={{
                padding: '8px 12px',
                background: 'var(--glass-input-bg)',
                border: '1px solid var(--glass-input-border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px' }} className="flex-col-mobile">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Duration: {duration} Mins</label>
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                style={{ accentColor: 'var(--color-primary)', height: '20px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Focus Type</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                style={{
                  padding: '8px',
                  background: 'var(--glass-input-bg)',
                  border: '1px solid var(--glass-input-border)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              >
                {['Deep Work', 'Study Mode', 'Coding Mode', 'Revision Mode'].map(m => (
                  <option key={m} value={m} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <Button type="submit" variant="primary" style={{ alignSelf: 'flex-start' }}>
            Start Focus Block
          </Button>

        </form>
      ) : (
        // Active Minimal Timer Layout
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '10px 0' }}>
          
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '0.5px' }}>
              {mode} active
            </span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              🎯 {goal}
            </h3>
          </div>

          {/* Minimal digital ticking layout */}
          <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--mono)', letterSpacing: '1px' }}>
            {formatTime(timeLeft)}
          </span>

          {/* Rotating motivation quote */}
          <div style={{
            background: 'var(--glass-btn-bg)',
            border: '1px solid var(--glass-border)',
            padding: '10px 16px',
            borderRadius: '8px',
            maxWidth: '400px',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            fontStyle: 'italic'
          }}>
            "{quotes[currentQuoteIdx]}"
          </div>

          {/* Status notice */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: 'var(--color-accent)', fontWeight: 700 }}>
            <AlertCircle size={12} />
            <span>Mute Status Active. Notification popups are blocked.</span>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              variant="glass"
              onClick={handlePause}
              iconLeft={<Pause size={14} />}
              style={{ height: '32px', fontSize: '0.8rem' }}
            >
              Pause Focus
            </Button>

            <Button
              variant="glass"
              onClick={handleStop}
              iconLeft={<Square size={14} />}
              style={{ height: '32px', fontSize: '0.8rem' }}
            >
              End Session
            </Button>
          </div>

        </div>
      )}
    </Card>
  );
};

export default FocusMode;
