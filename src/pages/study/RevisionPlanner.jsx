import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Plus, Check, AlertCircle, Clock, Trash2 } from 'lucide-react';

const RevisionPlanner = ({ subjects, revisions, onAddRevision, onCompleteRevision, onDeleteRevision }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState(subjects[0] ? subjects[0].name : 'General');
  const [interval, setInterval] = useState('Weekly');

  const upcomingRevisions = revisions.filter(r => r.status === 'upcoming');
  const completedRevisions = revisions.filter(r => r.status === 'completed');
  const missedRevisions = revisions.filter(r => r.status === 'missed');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    // Calculate due date based on interval
    const today = new Date();
    let daysToAdd = 7;
    if (interval === 'Daily') daysToAdd = 1;
    if (interval === 'Monthly') daysToAdd = 30;

    const due = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

    onAddRevision({
      id: Date.now(),
      topic: topic.trim(),
      subject,
      interval,
      dueDate: due.toLocaleDateString(),
      status: 'upcoming'
    });

    setTopic('');
    setShowAddForm(false);
  };

  const getSubjectColor = (subjName) => {
    const found = subjects.find(s => s.name.toLowerCase() === subjName.toLowerCase());
    if (!found) return 'var(--color-primary)';
    switch (found.color?.toLowerCase()) {
      case 'purple': return 'var(--color-primary)';
      case 'green': return 'var(--color-success)';
      case 'blue': return 'var(--color-secondary)';
      case 'amber': return 'var(--color-accent)';
      case 'red': return 'var(--color-danger)';
      default: return 'var(--color-primary)';
    }
  };

  const renderRevisionCard = (rev) => {
    const subjColor = getSubjectColor(rev.subject);
    return (
      <div 
        key={rev.id}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '12px',
          background: 'var(--glass-btn-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          transition: 'all 0.15s ease'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <div>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
              {rev.topic}
            </span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
              <span style={{ 
                fontSize: '0.65rem', 
                background: 'var(--glass-btn-bg)', 
                border: `1px solid ${subjColor}`,
                color: subjColor,
                padding: '1px 6px',
                borderRadius: '4px',
                fontWeight: 600
              }}>
                {rev.subject}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                Interval: {rev.interval}
              </span>
            </div>
          </div>
          <button 
            onClick={() => onDeleteRevision(rev.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex'
            }}
            className="hover-scale"
          >
            <Trash2 size={12} />
          </button>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderTop: '1px solid var(--glass-border)',
          paddingTop: '8px', 
          marginTop: '4px' 
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={10} />
            {rev.status === 'completed' ? 'Done' : `Due: ${rev.dueDate}`}
          </span>

          {rev.status !== 'completed' && (
            <Button 
              variant="success" 
              size="sm"
              onClick={() => onCompleteRevision(rev.id)}
              style={{ padding: '2px 8px', fontSize: '0.75rem', height: '24px' }}
              iconLeft={<Check size={10} />}
            >
              Review
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header and Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>
          Active Recall & Spacing Revision Planner
        </h3>
        <Button 
          variant="glass" 
          size="sm" 
          onClick={() => setShowAddForm(!showAddForm)}
          iconLeft={<Plus size={14} />}
          style={{ padding: '2px 8px', fontSize: '0.8rem', height: '28px' }}
        >
          {showAddForm ? 'Cancel' : 'Plan Revision Spacing'}
        </Button>
      </div>

      {/* Form */}
      {showAddForm && (
        <Card
          header={
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              🔁 Schedule Spacing Interval
            </span>
          }
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Topic / Subject Area</label>
                <input
                  type="text"
                  placeholder="e.g. Graph BFS Traversal, OSI Layers"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
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
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Subject Category</label>
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
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Spacing Interval</label>
              <select
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                style={{
                  width: '180px',
                  padding: '8px',
                  background: 'var(--glass-input-bg)',
                  border: '1px solid var(--glass-input-border)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              >
                <option value="Daily" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Daily Recall (1 day)</option>
                <option value="Weekly" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Weekly Spacing (7 days)</option>
                <option value="Monthly" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Monthly Spacing (30 days)</option>
              </select>
            </div>

            <Button type="submit" variant="primary" size="sm" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
              Add to Spacing Plan
            </Button>
          </form>
        </Card>
      )}

      {/* Columns for status */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {/* Column 1: Upcoming */}
        <Card
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>📅 Spaced Review Tasks ({upcomingRevisions.length})</span>
            </div>
          }
          hoverable={false}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '120px' }}>
            {upcomingRevisions.map(rev => renderRevisionCard(rev))}
            {upcomingRevisions.length === 0 && (
              <span style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', padding: '20px 0' }}>
                No reviews scheduled. All topics up to date.
              </span>
            )}
          </div>
        </Card>

        {/* Column 2: Missed / Late */}
        <Card
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-danger)' }}>⚠️ Overdue Revisions ({missedRevisions.length})</span>
            </div>
          }
          hoverable={false}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '120px' }}>
            {missedRevisions.map(rev => renderRevisionCard(rev))}
            {missedRevisions.length === 0 && (
              <span style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', padding: '20px 0' }}>
                No overdue revisions. Outstanding!
              </span>
            )}
          </div>
        </Card>

        {/* Column 3: Completed */}
        <Card
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-success)' }}>✅ Done & Mastered ({completedRevisions.length})</span>
            </div>
          }
          hoverable={false}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '120px' }}>
            {completedRevisions.map(rev => renderRevisionCard(rev))}
            {completedRevisions.length === 0 && (
              <span style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', padding: '20px 0' }}>
                No completed reviews logged yet. Get studying!
              </span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RevisionPlanner;
