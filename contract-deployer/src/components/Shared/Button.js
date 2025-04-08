import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  isLoading = false, 
  disabled = false,
  icon,
  theme,
  fullWidth = false,
  size = 'medium',
  ...props 
}) => {
  // Base styles for all buttons
  const baseStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
  };
  
  // Size-specific styles
  const sizeStyles = {
    small: {
      padding: '6px 12px',
      fontSize: '12px',
    },
    medium: {
      padding: '8px 16px',
      fontSize: '14px',
    },
    large: {
      padding: '12px 24px',
      fontSize: '16px',
    }
  };
  
  // Variant-specific styles
  const getVariantStyles = () => {
    switch(variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #1e90ff, #ff69b4)',
          color: '#ffffff',
          boxShadow: '0 2px 8px rgba(255,105,180,0.3)',
          ':hover': {
            transform: !disabled ? 'translateY(-2px)' : 'none',
            boxShadow: !disabled ? '0 4px 12px rgba(255,105,180,0.4)' : 'none',
          }
        };
      case 'secondary':
        return {
          backgroundColor: theme.bg.secondary,
          color: theme.bg.text,
          border: `1px solid ${theme.bg.main === '#050505' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          ':hover': {
            backgroundColor: !disabled ? (theme.bg.main === '#050505' ? '#333' : '#e6e6e6') : theme.bg.secondary,
          }
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: theme.primary.main,
          border: `1px solid ${theme.primary.main}`,
          ':hover': {
            backgroundColor: !disabled ? (theme.bg.main === '#050505' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)') : 'transparent',
          }
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          color: theme.primary.main,
          padding: '0',
          ':hover': {
            textDecoration: !disabled ? 'underline' : 'none',
          }
        };
      case 'danger':
        return {
          background: theme.system.error,
          color: 'white',
        };
      case 'success':
        return {
          background: theme.system.success,
          color: 'white',
        };
      case 'gradient':
        return {
          background: `linear-gradient(to right, ${theme.system.error}, ${theme.system.purple})`,
          color: '#ffffff',
        };
      default:
        return {
          background: 'linear-gradient(135deg, #1e90ff, #ff69b4)',
          color: '#ffffff',
        };
    }
  };
  
  const combinedStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...getVariantStyles(),
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      style={combinedStyles}
      {...props}
    >
      {icon && <span className="button-icon">{icon}</span>}
      
      {isLoading ? (
        <span className="loading-spinner" style={{ display: 'inline-block', marginRight: children ? '8px' : 0 }}>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ animation: 'spin 1s linear infinite' }}
          >
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4" 
              fill="none" 
              strokeDasharray="30 60"
            />
          </svg>
        </span>
      ) : null}
      
      {children}
    </button>
  );
};

export default Button; 