import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { Plus, Trash2, CheckCircle, Award, Target, Flame } from 'lucide-react';

const CodingGoals = ({ goals, onAddGoal, onDeleteGoal, onUpdateGoal }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [targetCount, setTargetCount] = useState(5);
  const [period, setPeriod] = useState('Daily');

  const periods = ['Daily', 'Weekly', 'Monthly'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddGoal({
      id: Date.now(),
      title: title.trim(),
      targetCount: Number(targetCount) || 1,
      currentCount: 0,
      period,
      completed: false,
      progress: 0
    });

    setTitle('');
    setTargetCount(5);
    setPeriod('Daily');
    setShowAddForm(false);
  };

  const handleIncrement = (goal) => {
    const nextCount = Math.min(goal.targetCount, goal.currentCount + 1);
    const isCompleted = nextCount === goal.targetCount;
    const progressPercent = Math.round((nextCount / goal.targetCount) * 100);

    onUpdateGoal({
      ...goal,
      currentCount: nextCount,
      completed: isCompleted,
      progress: progressPercent
    });
  };

  const handleDecrement = (goal) => {
    const nextCount = Math.max(0, goal.currentCount - 1);
    const progressPercent = Math.round((nextCount / goal.targetCount) * 100);

    onUpdateGoal({
      ...goal,
      currentCount: nextCount,
      completed: false,
      progress: progressPercent
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>
          Coding & Stack Milestones
        </h3>
        <Button 
          variant="glass" 
          size="sm" 
          onClick={() => setShowAddForm(!showAddForm)}
          iconLeft={<Plus size={14} />}
          style={{ height: '30px', fontSize: '0.8rem', padding: '0 10px' }}
        >
          {showAddForm ? 'Cancel' : 'Set New Goal'}
        </Button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <Card
          header={<span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>🎯 Create Coding Target</span>}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Goal Description / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Solve 5 Array Problems, Study OOP"
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
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Period</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  style={{
                    padding: '8px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  {periods.map(p => (
                    <option key={p} value={p} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '200px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Target Quantity (Count)</label>
              <input
                type="number"
                placeholder="e.g. 5"
                value={targetCount}
                onChange={(e) => setTargetCount(e.target.value)}
                style={{
                  padding: '8px 12px',
                  background: 'var(--glass-input-bg)',
                  border: '1px solid var(--glass-input-border)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
                required
                min={1}
              />
            </div>

            <Button type="submit" variant="primary" size="sm" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
              Set Target
            </Button>
          </form>
        </Card>
      )}

      {/* Goal listing */}
      {goals.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          border: '1px dashed var(--glass-border)',
          borderRadius: '8px'
        }}>
          No milestones defined. Set daily coding challenges or stack goals to build consistency!
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {goals.map((goal) => (
            <Card
              key={goal.id}
              hoverable={true}
              style={{
                padding: '16px',
                border: goal.completed ? '1px solid var(--color-success)' : '1px solid var(--glass-border)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                {/* Header Period and Done Icon */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    fontSize: '0.65rem', 
                    background: goal.completed ? 'rgba(16, 185, 129, 0.1)' : 'var(--color-primary-glow)', 
                    color: goal.completed ? 'var(--color-success)' : 'var(--color-primary)', 
                    padding: '2px 8px', 
                    borderRadius: '4px',
                    fontWeight: 700 
                  }}>
                    {goal.period} Target
                  </span>

                  {goal.completed ? (
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                      <CheckCircle size={14} /> Achieved
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                      <Target size={14} /> Active
                    </span>
                  )}
                </div>

                {/* Title */}
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                  {goal.title}
                </span>

                {/* Progress metrics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span>Quantity: {goal.currentCount} / {goal.targetCount}</span>
                    <span style={{ fontWeight: 600 }}>{goal.progress}%</span>
                  </div>
                  <ProgressBar value={goal.progress} color={goal.completed ? 'var(--color-success)' : 'var(--color-primary)'} height="6px" />
                </div>

                {/* Footer buttons */}
                <div style={{ display: 'flex', justifySelf: 'flex-end', borderTop: '1px solid var(--glass-border)', paddingTop: '10px', marginTop: '4px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button 
                      onClick={() => handleDecrement(goal)}
                      style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'var(--glass-btn-bg)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}
                    >
                      -1
                    </button>
                    <button 
                      onClick={() => handleIncrement(goal)}
                      disabled={goal.completed}
                      style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: goal.completed ? 'var(--glass-btn-bg)' : 'var(--color-primary-glow)',
                        border: '1px solid var(--glass-border)',
                        color: goal.completed ? 'var(--text-muted)' : 'var(--color-primary)',
                        cursor: goal.completed ? 'not-allowed' : 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}
                    >
                      +1
                    </button>
                  </div>

                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '2px',
                      marginLeft: 'auto',
                      display: 'flex'
                    }}
                    className="hover-scale"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

              </div>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
};

export default CodingGoals;
