import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Activity, Plus, Flame, Clock, Clipboard } from 'lucide-react';

const WorkoutTracker = ({ workouts = [], onAddWorkout }) => {
  const [type, setType] = useState('Walking');
  const [duration, setDuration] = useState(30);
  const [calories, setCalories] = useState(150);
  const [notes, setNotes] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const workoutTypes = [
    'Walking', 
    'Running', 
    'Gym', 
    'Yoga', 
    'Stretching', 
    'Cycling', 
    'Home Workout'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAddWorkout) {
      onAddWorkout({
        type,
        duration: Number(duration),
        calories: Number(calories),
        notes: notes.trim()
      });
    }
    setNotes('');
    setShowAddForm(false);
  };

  // Calculate totals
  const totalMins = workouts.reduce((acc, w) => acc + (w.duration || 0), 0);
  const totalCals = workouts.reduce((acc, w) => acc + (w.calories || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Overview Totals */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px'
      }} className="flex-col-mobile">
        <div style={{ background: 'var(--glass-card-bg)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', display: 'flex' }}>
            <Activity size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Workouts Logged</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{workouts.length} Sessions</span>
          </div>
        </div>

        <div style={{ background: 'var(--glass-card-bg)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', borderRadius: '50%', background: 'var(--color-primary-glow)', color: 'var(--color-primary)', display: 'flex' }}>
            <Clock size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Duration</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{totalMins} Mins</span>
          </div>
        </div>

        <div style={{ background: 'var(--glass-card-bg)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', display: 'flex' }}>
            <Flame size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Calories Burned</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{totalCals} kcal</span>
          </div>
        </div>
      </div>

      {/* Button to toggle Form */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="primary"
          onClick={() => setShowAddForm(!showAddForm)}
          iconLeft={<Plus size={14} />}
          style={{ height: '32px', fontSize: '0.8rem' }}
        >
          {showAddForm ? 'Close Log Form' : 'Log New Exercise'}
        </Button>
      </div>

      {/* Logging form */}
      {showAddForm && (
        <Card header={<span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>🏃 Log Activity Parameters</span>}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }} className="flex-col-mobile">
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Exercise Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{
                    padding: '8px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  {workoutTypes.map(t => (
                    <option key={t} value={t} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{t}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Duration (Minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Calories Burned (kcal)</label>
                <input
                  type="number"
                  min="0"
                  max="2000"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
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

            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Comment / Notes</label>
              <input
                type="text"
                placeholder="e.g. Felt highly energetic, post-workout recovery stretching"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  padding: '8px 12px',
                  background: 'var(--glass-input-bg)',
                  border: '1px solid var(--glass-input-border)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <Button type="submit" variant="primary" style={{ alignSelf: 'flex-start' }}>
              Save Workout Log
            </Button>

          </form>
        </Card>
      )}

      {/* Workout Logs List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {workouts.map((w, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              background: 'var(--glass-card-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '10px',
              textAlign: 'left'
            }}
          >
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-primary-glow)', color: 'var(--color-primary)', display: 'flex' }}>
              <Activity size={16} />
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {w.type} Log
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {w.notes || 'No comments logged.'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <Clock size={14} />
                <span>{w.duration} mins</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--color-danger)', fontWeight: 700 }}>
                <Flame size={14} />
                <span>{w.calories} kcal</span>
              </div>
            </div>

          </div>
        ))}

        {workouts.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            border: '1px dashed var(--glass-border)',
            borderRadius: '8px'
          }}>
            No physical exercise logged today. Consistent exercise boosts daily energy level indices.
          </div>
        )}
      </div>

    </div>
  );
};

export default WorkoutTracker;
