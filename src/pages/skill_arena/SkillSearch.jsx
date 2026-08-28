import React from 'react';
import { Search, X } from 'lucide-react';

const SkillSearch = ({ searchQuery, setSearchQuery }) => {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Search Input Box */}
      <input
        type="text"
        placeholder="Search games, topics..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="glass-input"
        style={{
          width: '100%',
          padding: '8px 12px 8px 34px',
          borderRadius: '8px',
          fontSize: '0.85rem',
          boxSizing: 'border-box'
        }}
      />
      {/* Search Icon */}
      <div style={{
        position: 'absolute',
        left: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none'
      }}>
        <Search size={16} />
      </div>
      {/* Clear Button */}
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            border: 'none',
            background: 'transparent',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SkillSearch;
