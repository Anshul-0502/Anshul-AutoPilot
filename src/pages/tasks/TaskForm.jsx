import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const TaskForm = ({ onSubmit, editTask, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Study');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState('');

  // Hydrate form if editing
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title || '');
      setDescription(editTask.description || '');
      setCategory(editTask.category || 'Study');
      setPriority(editTask.priority || 'Medium');
      setDeadline(editTask.deadline || '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('Study');
      setPriority('Medium');
      setDeadline('');
    }
  }, [editTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      deadline,
      id: editTask ? editTask.id : undefined
    });
  };

  const categories = ['Study', 'Coding', 'Projects', 'College', 'Personal', 'Others'];
  const priorities = ['Critical', 'High', 'Medium', 'Low'];

  return (
    <Card
      header={
        <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {editTask ? '📝 Edit Task' : '➕ Create Task'}
        </span>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Task Title</label>
          <input
            type="text"
            placeholder="e.g. Implement DFS Algorithm"
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
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Description</label>
          <textarea
            placeholder="Describe details of the task..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{
              padding: '8px 12px',
              background: 'var(--glass-input-bg)',
              border: '1px solid var(--glass-input-border)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              resize: 'none',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
              {categories.map((cat, idx) => (
                <option key={idx} value={cat} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{
                padding: '8px',
                background: 'var(--glass-input-bg)',
                border: '1px solid var(--glass-input-border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            >
              {priorities.map((prio, idx) => (
                <option key={idx} value={prio} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                  {prio}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            style={{
              padding: '7px 8px',
              background: 'var(--glass-input-bg)',
              border: '1px solid var(--glass-input-border)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.85rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          <Button type="submit" variant="primary" size="sm">
            {editTask ? 'Save Changes' : 'Add Task'}
          </Button>
          {onCancel && (
            <Button type="button" variant="glass" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default TaskForm;
