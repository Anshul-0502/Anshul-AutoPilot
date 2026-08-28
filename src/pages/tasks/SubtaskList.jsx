import React, { useState } from 'react';
import { Plus, X, Square, CheckSquare } from 'lucide-react';

const SubtaskList = ({ subtasks = [], onChange }) => {
  const [newTitle, setNewTitle] = useState('');

  const toggleSubtask = (id) => {
    const updated = subtasks.map(sub => 
      sub.id === id ? { ...sub, completed: !sub.completed } : sub
    );
    onChange(updated);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem = {
      id: Date.now(),
      title: newTitle.trim(),
      completed: false
    };

    onChange([...subtasks, newItem]);
    setNewTitle('');
  };

  const handleRemove = (id) => {
    const updated = subtasks.filter(sub => sub.id !== id);
    onChange(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '8px' }}>
      {/* Subtasks Listing */}
      {subtasks.map((sub) => (
        <div 
          key={sub.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            padding: '4px 0'
          }}
        >
          <div 
            onClick={() => toggleSubtask(sub.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', overflow: 'hidden' }}
          >
            <span style={{ color: 'var(--color-primary)', display: 'flex' }}>
              {sub.completed ? <CheckSquare size={14} /> : <Square size={14} />}
            </span>
            <span style={{ 
              color: sub.completed ? 'var(--text-muted)' : 'var(--text-primary)',
              textDecoration: sub.completed ? 'line-through' : 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {sub.title}
            </span>
          </div>

          <button 
            onClick={() => handleRemove(sub.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              padding: '2px'
            }}
          >
            <X size={12} />
          </button>
        </div>
      ))}

      {/* Add Subtask Form */}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
        <input 
          type="text"
          placeholder="Add subtask..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{
            flex: 1,
            padding: '4px 8px',
            fontSize: '0.75rem',
            background: 'var(--glass-input-bg)',
            border: '1px solid var(--glass-input-border)',
            borderRadius: '4px',
            color: 'var(--text-primary)'
          }}
        />
        <button 
          type="submit"
          style={{
            background: 'var(--color-primary)',
            border: 'none',
            color: '#ffffff',
            borderRadius: '4px',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Plus size={12} />
        </button>
      </form>
    </div>
  );
};

export default SubtaskList;
