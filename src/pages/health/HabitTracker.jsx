import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { CheckSquare, Square, Flame, Plus, Trash2, Filter } from 'lucide-react';

const HabitTracker = ({ habits = [], onToggle, onAddHabit }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Mindfulness');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const todayStr = new Date().toISOString().split('T')[0];
  const categories = ['Mindfulness', 'Fitness', 'Hydration', 'Reading', 'General'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (onAddHabit) {
      onAddHabit({
        id: Date.now(),
        title: title.trim(),
        category,
        streak: 0,
        history: {}
      });
    }

    setTitle('');
    setShowAddForm(false);
  };

  // Filter logic
  const filteredHabits = habits.filter(h => {
    return selectedFilter === 'All' || h.category === selectedFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header filter bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', ...categories].map(cat => {
            const isActive = selectedFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                  background: isActive ? 'var(--color-primary-glow)' : 'var(--glass-btn-bg)',
                  color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <Button
          variant="glass"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          iconLeft={<Plus size={14} />}
          style={{ height: '30px', fontSize: '0.8rem' }}
        >
          {showAddForm ? 'Cancel' : 'Add Custom Habit'}
        </Button>
      </div>

      {/* Add Habit Form */}
      {showAddForm && (
        <Card header={<span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>✍️ Create Custom Habit</span>}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px' }} className="flex-col-mobile">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Habit Description / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Read 10 pages, Sleep by 10 PM"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    padding: '8px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  {categories.map(c => (
                    <option key={c} value={c} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button type="submit" variant="primary" size="sm" style={{ alignSelf: 'flex-start' }}>
              Create Habit
            </Button>
          </form>
        </Card>
      )}

      {/* Habit items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredHabits.map(habit => {
          const isDone = !!habit.history[todayStr];
          return (
            <div
              key={habit.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: isDone ? 'rgba(16, 185, 129, 0.03)' : 'var(--glass-card-bg)',
                border: isDone ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--glass-border)',
                borderRadius: '10px',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Checkbox */}
              <div 
                onClick={() => onToggle(habit.id)}
                style={{ display: 'flex', cursor: 'pointer', color: isDone ? 'var(--color-success)' : 'var(--text-muted)' }}
              >
                {isDone ? <CheckSquare size={20} /> : <Square size={20} />}
              </div>

              {/* Title / Description */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                  textDecoration: isDone ? 'line-through' : 'none'
                }}>
                  {habit.title}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                  {habit.category}
                </span>
              </div>

              {/* Streak */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 700 }}>
                <Flame size={14} />
                <span>{habit.streak} Days</span>
              </div>

            </div>
          );
        })}

        {filteredHabits.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            border: '1px dashed var(--glass-border)',
            borderRadius: '8px'
          }}>
            No habits active in this category. Define custom routines to track progress.
          </div>
        )}
      </div>

    </div>
  );
};

export default HabitTracker;
