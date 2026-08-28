import React, { useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import TimeBlockCard from './TimeBlockCard';

const DailyPlanner = ({ selectedDate, events, onAddEvent, onDeleteEvent }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('10:00 AM');
  const [category, setCategory] = useState('study');

  // Filter events matching the selected date
  const dailyEvents = events.filter(evt => {
    const evtDate = new Date(evt.date);
    return evtDate.getDate() === selectedDate.getDate() &&
           evtDate.getMonth() === selectedDate.getMonth() &&
           evtDate.getFullYear() === selectedDate.getFullYear();
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Estimate duration
    const parseTime = (timeStr) => {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (hours === 12) hours = 0;
      if (modifier === 'PM') hours += 12;
      return hours * 60 + minutes;
    };

    const startMinutes = parseTime(startTime);
    const endMinutes = parseTime(endTime);
    const duration = Math.max(endMinutes - startMinutes, 30); // minimum 30 minutes

    onAddEvent({
      title,
      startTime,
      endTime,
      category,
      duration,
      date: selectedDate
    });

    setTitle('');
    setShowAddForm(false);
  };

  const timeOptions = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM'
  ];

  return (
    <Card
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} style={{ color: 'var(--color-primary)' }} />
            <span>Today's Blocks ({selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})</span>
          </div>
          <Button 
            variant="glass" 
            size="sm" 
            onClick={() => setShowAddForm(!showAddForm)}
            iconLeft={<Plus size={14} />}
            style={{ padding: '2px 8px', fontSize: '0.8rem', height: '28px' }}
          >
            {showAddForm ? 'Cancel' : 'Block Time'}
          </Button>
        </div>
      }
      style={{ height: '100%' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Inline Add Event Form */}
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
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Block Title</label>
              <input
                type="text"
                placeholder="e.g. Study Operating Systems, Code LeetCode"
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
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Start Time</label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  style={{
                    padding: '8px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  {timeOptions.map((time, idx) => (
                    <option key={idx} value={time} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>End Time</label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  style={{
                    padding: '8px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  {timeOptions.map((time, idx) => (
                    <option key={idx} value={time} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
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
                <option value="study" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Study Session</option>
                <option value="coding" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Coding & DSA</option>
                <option value="project" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Project Dev</option>
                <option value="break" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Break / Lunch</option>
                <option value="meeting" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Meeting</option>
              </select>
            </div>

            <Button type="submit" variant="primary" size="sm" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
              Add Time Block
            </Button>
          </form>
        )}

        {/* Render Scheduled Blocks */}
        {dailyEvents.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '24px',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            border: '1px dashed var(--glass-border)',
            borderRadius: '8px'
          }}>
            No scheduled events for today. Click 'Block Time' to schedule tasks.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {dailyEvents.map(evt => (
              <TimeBlockCard key={evt.id} event={evt} onDelete={onDeleteEvent} />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default DailyPlanner;
