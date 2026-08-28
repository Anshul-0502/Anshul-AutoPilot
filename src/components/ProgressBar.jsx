import React from 'react';

const ProgressBar = ({
  value = 0, // 0 to 100
  max = 100,
  color = 'var(--color-primary)',
  showLabel = true,
  height = '8px',
  label = '',
  style = {},
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', ...style }} {...props}>
      {(showLabel || label) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          fontWeight: 500,
          color: 'var(--text-secondary)'
        }}>
          <span>{label}</span>
          {showLabel && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div style={{
        width: '100%',
        height: height,
        background: 'var(--glass-btn-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: '9999px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: color,
          borderRadius: '9999px',
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }} />
      </div>
    </div>
  );
};

export default ProgressBar;
