import React, { useState, useEffect, useRef } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Play, Pause, RotateCcw, Save, History, BookOpen, Clock, Activity } from 'lucide-react';

const StudySession = ({ subjects, sessions, onSaveSession }) => {
  const [subject, setSubject] = useState(subjects[0] ? subjects[0].name : 'General');
  const [sessionType, setSessionType] = useState('Reading');
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0); // in seconds
  const incrementRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(incrementRef.current);
  }, []);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    incrementRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const handlePause = () => {
    setIsPaused(true);
    clearInterval(incrementRef.current);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(true);
    setTime(0);
    clearInterval(incrementRef.current);
  };

  const handleSave = () => {
    if (time === 0) return;

    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

    onSaveSession({
      id: Date.now(),
      subject,
      type: sessionType,
      durationSeconds: time,
      durationText: formatDuration(time),
      date: formattedDate
    });

    handleReset();
  };

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  const formatDuration = (totalSeconds) => {
    if (totalSeconds < 60) return `${totalSeconds}s`;
    const mins = Math.round(totalSeconds / 60);
    if (mins < 60) return `${mins}m`;
    const hrs = (totalSeconds / 3600).toFixed(1);
    return `${hrs}h`;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flexWrap: 'wrap' }}>
      
      {/* Session Timer Card */}
      <Card
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} style={{ color: 'var(--color-primary)' }} />
            <span>Active Study Session</span>
          </div>
        }
        hoverable={false}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', padding: '12px 0' }}>
          
          {/* Select Configuration */}
          {!isActive && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{
                    padding: '8px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  {subjects.map((subj, idx) => (
                    <option key={idx} value={subj.name} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                      {subj.name}
                    </option>
                  ))}
                  {subjects.length === 0 && (
                    <option value="General" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>General</option>
                  )}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Session Type</label>
                <select
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  style={{
                    padding: '8px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="Reading">📖 Reading Session</option>
                  <option value="Revision">🔁 Revision Session</option>
                  <option value="Practice">💻 Practice Session</option>
                  <option value="Mock Test">📝 Mock Test Session</option>
                </select>
              </div>
            </div>
          )}

          {/* If Timer is running, show current configurations in read-only tags */}
          {isActive && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', background: 'var(--color-primary-glow)', color: 'var(--color-primary)', border: '1px solid var(--glass-border)', padding: '4px 12px', borderRadius: '4px', fontWeight: 600 }}>
                {subject}
              </span>
              <span style={{ fontSize: '0.75rem', background: 'var(--glass-btn-bg-hover)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)', padding: '4px 12px', borderRadius: '4px', fontWeight: 600 }}>
                {sessionType}
              </span>
            </div>
          )}

          {/* Time Display */}
          <div style={{
            fontSize: '3.6rem',
            fontWeight: 800,
            fontFamily: 'var(--mono)',
            color: isActive ? 'var(--color-primary)' : 'var(--text-primary)',
            textShadow: isActive ? '0 0 16px var(--color-primary-glow)' : 'none',
            margin: '20px 0',
            letterSpacing: '2px',
            transition: 'all 0.3s ease'
          }}>
            {formatTime(time)}
          </div>

          {/* Control Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {isPaused ? (
              <Button 
                variant="primary" 
                onClick={handleStart}
                iconLeft={<Play size={16} />}
              >
                {time > 0 ? 'Resume' : 'Start Timer'}
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={handlePause}
                iconLeft={<Pause size={16} />}
              >
                Pause
              </Button>
            )}

            {time > 0 && (
              <>
                <Button 
                  variant="glass" 
                  onClick={handleReset}
                  iconLeft={<RotateCcw size={16} />}
                >
                  Reset
                </Button>
                <Button 
                  variant="success" 
                  onClick={handleSave}
                  iconLeft={<Save size={16} />}
                >
                  Save Log
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* History Card */}
      <Card
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={18} style={{ color: 'var(--color-secondary)' }} />
            <span>Study Logs & History</span>
          </div>
        }
        hoverable={false}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '310px', overflowY: 'auto', paddingRight: '4px' }}>
          {sessions.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '36px 0',
              color: 'var(--text-muted)',
              fontSize: '0.85rem'
            }}>
              No study logs logged in this workspace yet. Start timer to record study streak.
            </div>
          ) : (
            [...sessions].reverse().map((log) => (
              <div 
                key={log.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: 'var(--glass-btn-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '6px',
                  fontSize: '0.8rem'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {log.subject}
                  </span>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <span>{log.type}</span>
                    <span>•</span>
                    <span>{log.date}</span>
                  </div>
                </div>

                <span style={{ 
                  fontWeight: 700, 
                  color: 'var(--color-primary)', 
                  background: 'var(--color-primary-glow)', 
                  padding: '2px 8px', 
                  borderRadius: '4px',
                  fontFamily: 'var(--mono)'
                }}>
                  {log.durationText}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default StudySession;
