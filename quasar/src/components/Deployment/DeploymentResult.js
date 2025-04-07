import React from 'react';
import Panel from '../Shared/Panel';
import Button from '../Shared/Button';
import { CheckCircle, XCircle, Loader, ExternalLink, Copy } from 'lucide-react';

const DeploymentResult = ({ deploymentStatus, theme }) => {
  const { step, hash, contractAddress, error } = deploymentStatus;
  
  // Helper functions
  const shortenHash = (hash) => {
    if (!hash) return '';
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .catch(err => console.error('Failed to copy to clipboard:', err));
  };
  
  const getExplorerTxUrl = (hash) => {
    return `https://chainscan-newton.0g.ai/tx/${hash}`;
  };
  
  const getExplorerAddressUrl = (address) => {
    return `https://chainscan-newton.0g.ai/address/${address}`;
  };
  
  // Deployment state determination
  const isDeploying = step === 1;
  const isWaitingConfirmation = step === 2;
  const isSuccess = step === 3;
  const isError = step === 4;
  
  // Status text
  const getStatusText = () => {
    if (isDeploying) return 'Initializing deployment...';
    if (isWaitingConfirmation) return 'Waiting for transaction confirmation...';
    if (isSuccess) return 'Contract deployed successfully!';
    if (isError) return 'An error occurred during contract deployment';
    return '';
  };
  
  // Status color
  const getStatusColor = () => {
    if (isSuccess) return theme.system.success;
    if (isError) return theme.system.error;
    if (isDeploying || isWaitingConfirmation) return theme.primary.main;
    return theme.system.text;
  };
  
  // Status icon
  const getStatusIcon = () => {
    if (isSuccess) return <CheckCircle size={24} color={theme.system.success} />;
    if (isError) return <XCircle size={24} color={theme.system.error} />;
    if (isDeploying || isWaitingConfirmation) return (
      <div style={{ animation: 'spin 2s linear infinite' }}>
        <Loader size={24} color={theme.primary.main} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
    return null;
  };
  
  return (
    <Panel theme={theme} title="Deployment Status">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Deployment status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: theme.bg.secondary,
          padding: '16px',
          borderRadius: '8px'
        }}>
          {getStatusIcon()}
          <div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 'bold',
              color: getStatusColor()
            }}>
              {getStatusText()}
            </div>
            
            {isError && (
              <div style={{
                color: theme.system.error,
                marginTop: '8px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}
          </div>
        </div>
        
        {/* Transaction hash */}
        {hash && (
          <div style={{
            backgroundColor: theme.bg.secondary,
            padding: '16px',
            borderRadius: '8px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <div style={{ 
                fontSize: '14px', 
                color: theme.system.text
              }}>
                Transaction hash:
              </div>
              <div style={{
                display: 'flex',
                gap: '8px'
              }}>
                <button
                  onClick={() => copyToClipboard(hash)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: theme.system.text,
                    padding: '4px'
                  }}
                  title="Copy hash"
                >
                  <Copy size={16} />
                </button>
                <a
                  href={getExplorerTxUrl(hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: theme.system.link,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="View in explorer"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '14px',
              padding: '8px 12px',
              backgroundColor: theme.bg.main,
              borderRadius: '4px',
              color: theme.bg.text,
              wordBreak: 'break-all'
            }}>
              {shortenHash(hash)}
            </div>
          </div>
        )}
        
        {/* Contract address */}
        {contractAddress && (
          <div style={{
            backgroundColor: theme.bg.secondary,
            padding: '16px',
            borderRadius: '8px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <div style={{ 
                fontSize: '14px', 
                color: theme.system.text
              }}>
                Contract address:
              </div>
              <div style={{
                display: 'flex',
                gap: '8px'
              }}>
                <button
                  onClick={() => copyToClipboard(contractAddress)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: theme.system.text,
                    padding: '4px'
                  }}
                  title="Copy address"
                >
                  <Copy size={16} />
                </button>
                <a
                  href={getExplorerAddressUrl(contractAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: theme.system.link,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="View in explorer"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '14px',
              padding: '8px 12px',
              backgroundColor: theme.bg.main,
              borderRadius: '4px',
              color: isSuccess ? theme.system.success : theme.bg.text,
              fontWeight: isSuccess ? 'bold' : 'normal',
              wordBreak: 'break-all'
            }}>
              {contractAddress}
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
};

export default DeploymentResult; 