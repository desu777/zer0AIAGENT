import React, { useState } from 'react';
import { Sun, Moon, Key, LogOut } from 'lucide-react';

const Header = ({ 
  walletAddress, 
  isConnected, 
  connect,
  disconnect, 
  darkMode, 
  setDarkMode, 
  theme 
}) => {
  const [showDisconnect, setShowDisconnect] = useState(false);
  
  // Funkcja do skracania adresu portfela
  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Obsługa kliknięcia w przycisk portfela
  const handleWalletClick = () => {
    if (isConnected) {
      setShowDisconnect(!showDisconnect);
    } else {
      connect();
    }
  };

  // Obsługa odłączania portfela
  const handleDisconnect = (e) => {
    e.stopPropagation(); // Zatrzymaj propagację kliknięcia
    disconnect();
    setShowDisconnect(false);
  };

  return (
    <header style={{
      padding: '20px',
      backgroundColor: theme.bg.secondary,
      borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      {/* Logo */}
      <div style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: darkMode ? theme.system.main : theme.bg.text,
        display: 'flex',
        alignItems: 'center'
      }}>
        <span style={{ color: theme.primary.main }}>zer0</span> AIDeployer
      </div>

      {/* Przyciski akcji */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        {/* Przycisk połączenia z portfelem */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={handleWalletClick}
            style={{
              padding: '8px 16px',
              background: darkMode ? 
                theme.primary.main : 
                `linear-gradient(to right, ${theme.system.error}, ${theme.system.purple})`,
              borderRadius: '20px',
              color: 'white',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Key size={16} />
            {isConnected ? shortenAddress(walletAddress) : 'Connect Wallet'}
          </button>

          {/* Dropdown do rozłączania */}
          {showDisconnect && isConnected && (
            <div 
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                right: 0,
                backgroundColor: theme.bg.panel,
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 10,
                overflow: 'hidden',
                minWidth: '140px'
              }}
            >
              <button
                onClick={handleDisconnect}
                style={{
                  padding: '10px 16px',
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: theme.system.error,
                  fontSize: '14px'
                }}
              >
                <LogOut size={16} />
                Disconnect
              </button>
            </div>
          )}
        </div>
        
        {/* Przełącznik motywu */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          style={{
            background: darkMode ? theme.primary.light : 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: darkMode ? theme.primary.main : theme.bg.text,
            padding: '8px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header; 