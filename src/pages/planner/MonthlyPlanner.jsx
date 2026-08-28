import React, { useState } from 'react';
import { CalendarDays, AlertCircle, Plus } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const MonthlyPlanner = ({ selectedDate, events, onAddEvent }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [category, setCategory] = useState('project');

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  // Filter events in the current month
  const monthlyMilestones = events.filter(evt => {
    const evtDate = new Date(evt.date);
    return evtDate.getMonth() === currentMonth &&
           evtDate.getFullYear() === currentYear;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !dateStr) return;

    onAddEvent({
      title,
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      category,
      duration: 480, // 8h standard block
      date: new Date(dateStr)
    });

    setTitle('');
    setDateStr('');
    setShowAddForm(false);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'study': return 'var(--color-primary)';
      case 'coding': return 'var(--color-success)';
      case 'project': return 'var(--color-secondary)';
      case 'meeting': return 'var(--color-danger)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <Card
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarDays size={18} style={{ color: 'var(--color-secondary)' }} />
            <span>Monthly Milestones & Deadlines</span>
          </div>
          <Button 
            variant="glass" 
            size="sm" 
            onClick={() => setShowAddForm(!showAddForm)}
            iconLeft={<Plus size={14} />}
            style={{ padding: '2px 8px', fontSize: '0.8rem', height: '28px' }}
          >
            {showAddForm ? 'Cancel' : 'Add Milestone'}
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {showAddForm && (
          <form 
            onSubmit={handleSubmit}
            style={{
              background: 'var(--glass-btn-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Milestone Title</label>
              <input
                type="text"
                placeholder="e.g. Submit DBMS Project, Physics Final Exam"
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Target Date</label>
                <input
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  style={{
                    padding: '7px 8px',
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
                  <option value="project" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Project Deadline</option>
                  <option value="study" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Exam / Revision</option>
                  <option value="coding" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Coding Contest</option>
                  <option value="meeting" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Meeting Sync</option>
                </select>
              </div>
            </div>

            <Button type="submit" variant="primary" size="sm" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
              Record Milestone
            </Button>
          </form>
        )}

        {monthlyMilestones.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '24px',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            border: '1px dashed var(--glass-border)',
            borderRadius: '8px'
          }}>
            No major milestones recorded for this month.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {monthlyMilestones.map(evt => {
              const evtDate = new Date(evt.date);
              return (
                <div 
                  key={evt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: 'var(--glass-btn-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: getCategoryColor(evt.category),
                      boxShadow: `0 0 6px ${getCategoryColor(evt.category)}`
                    }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                        {evt.title}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Category: {evt.category.charAt(0).toUpperCase() + evt.category.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {evtDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-danger)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <AlertCircle size={10} />
                      Milestone Event
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MonthlyPlanner;
