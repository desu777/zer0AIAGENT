import React from 'react';

// Komponent TwoColumnLayout - dwukolumnowy układ z responsywnością
const TwoColumnLayout = ({ leftColumn, rightColumn, theme }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      maxWidth: '1600px',
      margin: '0 auto',
      padding: '24px 16px',
      gap: '24px',
      flexWrap: 'wrap'
    }}>
      {/* Lewa kolumna - Chat AI */}
      <div style={{
        flex: '1 1 500px',
        minWidth: '350px',
      }}>
        {leftColumn}
      </div>
      
      {/* Prawa kolumna - Edytor i narzędzia */}
      <div style={{
        flex: '1 1 500px',
        minWidth: '350px',
      }}>
        {rightColumn}
      </div>
    </div>
  );
};

export default TwoColumnLayout; 