import React from 'react';

const NotificationBadge = ({
  count = 0,
  dot = false,
  color = 'var(--color-danger)',
  children,
  style = {},
  ...props
}) => {
  const badgeStyle = {
    position: 'absolute',
    top: dot ? '0px' : '-4px',
    right: dot ? '0px' : '-8px',
    background: color,
    color: '#ffffff',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    minWidth: dot ? '8px' : '16px',
    height: dot ? '8px' : '16px',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: dot ? '0' : '0 4px',
    boxSizing: 'border-box',
    boxShadow: '0 0 0 2px var(--bg-secondary)',
    transform: 'translate(25%, -25%)',
    zIndex: 1,
    ...style
  };

  const hasBadge = dot || count > 0;

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }} {...props}>
      {children}
      {hasBadge && (
        <span style={badgeStyle}>
          {!dot && count > 99 ? '99+' : !dot ? count : null}
        </span>
      )}
    </div>
  );
};

export default NotificationBadge;
