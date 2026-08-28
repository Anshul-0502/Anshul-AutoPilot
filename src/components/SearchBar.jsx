import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  className = '',
  style = {},
  ...props
}) => {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', ...style }}>
      <Search
        size={18}
        style={{
          position: 'absolute',
          left: '12px',
          color: 'var(--text-muted)',
          pointerEvents: 'none'
        }}
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px 14px',
          paddingLeft: '38px',
          paddingRight: onClear && value ? '38px' : '14px',
          borderRadius: '20px', // pill shaped
          fontSize: '0.9rem',
          boxSizing: 'border-box'
        }}
        className={`glass-input ${className}`}
        {...props}
      />
      {onClear && value && (
        <button
          type="button"
          onClick={onClear}
          style={{
            position: 'absolute',
            right: '12px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s'
          }}
          className="hover:text-primary"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
