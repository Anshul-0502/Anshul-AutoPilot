import React from 'react';
import { Search } from 'lucide-react';

const TaskSearch = ({ searchVal, setSearchVal }) => {
  return (
    <div style={{
      position: 'relative',
      width: '100%'
    }}>
      <span style={{
        position: 'absolute',
        left: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Search size={16} />
      </span>
      <input
        type="text"
        placeholder="Search tasks by title, details..."
        value={searchVal}
        onChange={(e) => setSearchVal(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 12px 10px 38px',
          background: 'var(--glass-input-bg)',
          border: '1px solid var(--glass-input-border)',
          borderRadius: '8px',
          color: 'var(--text-primary)',
          fontSize: '0.85rem',
          boxSizing: 'border-box'
        }}
        className="glass-input"
      />
    </div>
  );
};

export default TaskSearch;
