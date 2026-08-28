import React from 'react';

const Input = ({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  helperText = '',
  disabled = false,
  icon = null,
  className = '',
  style = {},
  ...props
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--text-secondary)'
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            left: '12px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}>
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '10px 14px',
            paddingLeft: icon ? '40px' : '14px',
            borderRadius: '8px',
            fontSize: '0.95rem',
            boxSizing: 'border-box',
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
            ...style
          }}
          className={`glass-input ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)', fontWeight: 500 }}>
          {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
};

export default Input;
