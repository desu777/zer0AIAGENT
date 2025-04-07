import React from 'react';

const Panel = ({ children, title, theme, onClose }) => {
  return (
    <div style={{
      backgroundColor: theme.bg.panel,
      padding: '24px',
      marginBottom: '24px',
      boxShadow: theme.bg.main === '#050505' ? 
        '0 4px 20px rgba(0,0,0,0.3)' : 
        '0 4px 20px rgba(0,0,0,0.1)',
      borderRadius: '32px',
      border: theme.bg.main === '#050505' ? 
        '4px solid rgba(255, 178, 252, 0.1)' : 
        'none',
      position: 'relative'
    }}>
      {title && (
        <div style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          position: 'relative'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: theme.bg.main === '#050505' ? theme.system.main : theme.bg.text,
            margin: 0,
            padding: 0
          }}>
            {title}
          </h2>
        </div>
      )}
      
      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: theme.system.text,
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px'
          }}
          aria-label="Close"
        >
          ✕
        </button>
      )}
      
      {children}
    </div>
  );
};

export default Panel; 