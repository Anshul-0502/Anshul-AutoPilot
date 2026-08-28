import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary | secondary | outline | ghost | glass | danger | success
  size = 'md', // sm | md | lg
  disabled = false,
  loading = false,
  iconLeft = null,
  iconRight = null,
  className = '',
  style = {},
  ...props
}) => {
  // Styles for different variants
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'var(--color-primary)',
          borderColor: 'var(--color-primary)',
          color: '#ffffff',
          boxShadow: '0 4px 14px 0 var(--color-primary-glow)'
        };
      case 'secondary':
        return {
          background: 'var(--color-secondary)',
          borderColor: 'var(--color-secondary)',
          color: '#ffffff',
          boxShadow: '0 4px 14px 0 rgba(14, 165, 233, 0.2)'
        };
      case 'outline':
        return {
          background: 'transparent',
          borderColor: 'var(--glass-border-hover)',
          color: 'var(--text-primary)'
        };
      case 'ghost':
        return {
          background: 'transparent',
          borderColor: 'transparent',
          color: 'var(--text-primary)'
        };
      case 'danger':
        return {
          background: 'var(--color-danger)',
          borderColor: 'var(--color-danger)',
          color: '#ffffff',
          boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.2)'
        };
      case 'success':
        return {
          background: 'var(--color-success)',
          borderColor: 'var(--color-success)',
          color: '#ffffff',
          boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.2)'
        };
      case 'glass':
      default:
        return {
          background: 'var(--glass-btn-bg)',
          borderColor: 'var(--glass-btn-border)',
          color: 'var(--text-primary)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: 'var(--glass-shadow)'
        };
    }
  };

  // Styles for different sizes
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '6px 12px',
          fontSize: '0.85rem',
          borderRadius: '6px'
        };
      case 'lg':
        return {
          padding: '12px 28px',
          fontSize: '1.1rem',
          borderRadius: '10px'
        };
      case 'md':
      default:
        return {
          padding: '9px 20px',
          fontSize: '0.95rem',
          borderRadius: '8px'
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderWidth: '1px',
    borderStyle: 'solid',
    fontWeight: 600,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
    ...variantStyles,
    ...sizeStyles,
    ...style
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={buttonStyle}
      className={`custom-btn hover-scale ${variant === 'glass' ? 'glass-btn' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner" style={{
          width: '1em',
          height: '1em',
          border: '2px solid currentColor',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'fadeIn 0.6s linear infinite, float 1s infinite' // simple CSS animate fallback
        }} />
      ) : (
        iconLeft
      )}
      {!loading && children}
      {!loading && iconRight}
    </button>
  );
};

export default Button;
