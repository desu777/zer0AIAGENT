import React from 'react';

const TokenConfig = ({
  contractName,
  setContractName,
  contractSymbol,
  setContractSymbol,
  totalTokens,
  setTotalTokens,
  theme
}) => {
  // Styles for input fields
  const inputStyle = {
    width: '100%',
    backgroundColor: theme.bg.secondary,
    color: theme.bg.text,
    border: `1px solid ${theme.bg.main === '#050505' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: '16px',
    padding: '12px 16px',
    outline: 'none',
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    marginBottom: '16px'
  };
  
  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    color: theme.system.text
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle} htmlFor="contractName">
          Contract name
        </label>
        <input
          id="contractName"
          type="text"
          value={contractName}
          onChange={(e) => setContractName(e.target.value)}
          style={inputStyle}
          placeholder="e.g. ZerryMoon"
        />
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '16px',
        marginBottom: '16px'
      }}>
        <div>
          <label style={labelStyle} htmlFor="contractSymbol">
            Token symbol
          </label>
          <input
            id="contractSymbol"
            type="text"
            value={contractSymbol}
            onChange={(e) => setContractSymbol(e.target.value.toUpperCase())}
            style={inputStyle}
            placeholder="e.g. ZER0"
            maxLength={10}
          />
        </div>
        
        <div>
          <label style={labelStyle} htmlFor="totalTokens">
            Total supply
          </label>
          <input
            id="totalTokens"
            type="number"
            value={totalTokens}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value) && value > 0) {
                setTotalTokens(value);
              }
            }}
            style={inputStyle}
            placeholder="e.g. 1000000000"
            min="1"
          />
        </div>
      </div>
      
      <div style={{
        fontSize: '12px',
        color: theme.system.text,
        backgroundColor: theme.primary.light,
        padding: '8px 12px',
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <strong>Tip:</strong> Changes in these fields automatically update the Solidity code.
      </div>
    </div>
  );
};

export default TokenConfig; 