import React from 'react';
import Panel from '../Shared/Panel';
import Button from '../Shared/Button';
import { AlertTriangle } from 'lucide-react';

const CompileSection = ({ 
  compileContract, 
  isCompiling, 
  compileError, 
  theme,
  bytecode,
  abi
}) => {
  return (
    <Panel theme={theme} title="Contract Compilation">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Compilation button */}
        <Button
          onClick={compileContract}
          isLoading={isCompiling}
          disabled={isCompiling}
          fullWidth
          theme={theme}
          variant="gradient"
        >
          {bytecode ? 'Recompile contract' : 'Compile contract'}
        </Button>
        
        {/* Compilation error */}
        {compileError && (
          <div style={{
            backgroundColor: 'rgba(254, 78, 82, 0.1)',
            color: theme.system.error,
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <AlertTriangle size={18} style={{ minWidth: '18px', marginTop: '2px' }} />
            <div>
              <strong>Compilation error:</strong>
              <div style={{ marginTop: '4px', wordBreak: 'break-word' }}>
                {compileError}
              </div>
            </div>
          </div>
        )}
        
        {/* Bytecode and ABI counters */}
        {bytecode && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            <div style={{
              flex: 1,
              backgroundColor: theme.bg.secondary,
              padding: '12px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '12px', color: theme.system.text }}>
                Bytecode size
              </div>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 'bold',
                color: theme.bg.text,
                marginTop: '4px'
              }}>
                {Math.round(bytecode.length / 2 - 1)} bytes
              </div>
            </div>
            
            <div style={{
              flex: 1,
              backgroundColor: theme.bg.secondary,
              padding: '12px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '12px', color: theme.system.text }}>
                ABI Methods
              </div>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 'bold',
                color: theme.bg.text,
                marginTop: '4px'
              }}>
                {abi ? abi.filter(item => item.type === 'function').length : 0}
              </div>
            </div>
          </div>
        )}
        
        {/* Compilation info */}
        <div style={{
          fontSize: '12px',
          color: theme.system.text,
          backgroundColor: theme.bg.secondary,
          padding: '8px 12px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          Compilation uses a microservice with Solidity compiler 0.7.5 for Newton network
        </div>
      </div>
    </Panel>
  );
};

export default CompileSection; 