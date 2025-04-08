import React from 'react';
import MonacoEditor from './MonacoEditor';
import Panel from '../Shared/Panel';
import Button from '../Shared/Button';
import { RefreshCw, FileJson } from 'lucide-react';

const CodeEditor = ({
  sourceCode,
  setSourceCode,
  theme,
  generateRandomContractDetails
}) => {
  return (
    <Panel theme={theme} title="Contract Editor">
      {/* Editor action buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            onClick={() => generateRandomContractDetails && generateRandomContractDetails()}
            variant="secondary"
            size="small"
            icon={<RefreshCw size={14} />}
            theme={theme}
          >
            Random token
          </Button>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            onClick={() => {
              try {
                // Copy code to clipboard
                navigator.clipboard.writeText(sourceCode);
                // Success notification could be added here
              } catch (err) {
                console.error('Failed to copy code:', err);
              }
            }}
            variant="secondary"
            size="small"
            icon={<FileJson size={14} />}
            theme={theme}
          >
            Copy code
          </Button>
        </div>
      </div>
      
      {/* Monaco Editor */}
      <div style={{ 
        border: `1px solid ${theme.bg.main === '#050505' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <MonacoEditor
          value={sourceCode}
          onChange={setSourceCode}
          height="400px"
          theme={theme.bg.main === '#050505' ? 'vs-dark' : 'vs-light'}
          language="solidity"
        />
      </div>
      
      {/* Editor information */}
      <div style={{
        fontSize: '12px',
        color: theme.system.text,
        marginTop: '16px',
        textAlign: 'center'
      }}>
        You can directly edit the contract code or let AI generate it based on your description.
      </div>
    </Panel>
  );
};

export default CodeEditor; 