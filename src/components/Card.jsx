import React from 'react';

const Card = ({
  children,
  header = null,
  footer = null,
  hoverable = true,
  className = '',
  style = {},
  onClick,
  ...props
}) => {
  const cardStyle = {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    cursor: onClick ? 'pointer' : 'default',
    ...style
  };

  return (
    <div
      onClick={onClick}
      style={cardStyle}
      className={`glass-card ${hoverable ? 'glass-card-hover' : ''} ${className}`}
      {...props}
    >
      {header && (
        <div style={{
          borderBottom: '1px solid var(--glass-border)',
          paddingBottom: '12px',
          marginBottom: '4px',
          fontWeight: 600,
          color: 'var(--text-primary)'
        }}>
          {header}
        </div>
      )}
      <div style={{ flex: 1, color: 'var(--text-secondary)' }}>
        {children}
      </div>
      {footer && (
        <div style={{
          borderTop: '1px solid var(--glass-border)',
          paddingTop: '12px',
          marginTop: '4px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
