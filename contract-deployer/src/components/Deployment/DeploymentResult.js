import React, { useState, useEffect } from 'react';
import Panel from '../Shared/Panel';
import Button from '../Shared/Button';
import { CheckCircle, XCircle, Loader, ExternalLink, Copy } from 'lucide-react';

const DeploymentResult = ({ deploymentStatus, theme, approveTokensForPool, addLiquidity }) => {
  const { step, hash, contractAddress, error, contractType, poolTokens } = deploymentStatus;
  const [approvalState, setApprovalState] = useState({
    tokenA: { approved: false, loading: false, error: null },
    tokenB: { approved: false, loading: false, error: null }
  });
  const [approvalAmount, setApprovalAmount] = useState({
    tokenA: '1000',
    tokenB: '1000'
  });
  const [liquidityState, setLiquidityState] = useState({
    amountA: '100',
    amountB: '100',
    loading: false,
    error: null,
    success: false
  });
  
  // Log contract type for debugging
  useEffect(() => {
    console.log('Current contract type in DeploymentResult:', contractType);
    console.log('Pool tokens:', poolTokens);
  }, [contractType, poolTokens]);
  
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
  
  // Determine if contract is a pool
  const isLiquidityPool = contractType === 'pool';
  
  // Status text
  const getStatusText = () => {
    if (isDeploying) return `Initializing ${isLiquidityPool ? 'liquidity pool' : 'token'} deployment...`;
    if (isWaitingConfirmation) return 'Waiting for transaction confirmation...';
    if (isSuccess) return `${isLiquidityPool ? 'Liquidity Pool' : 'Token'} deployed successfully!`;
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
  
  // Ustawienie tytułu panelu
  const getPanelTitle = () => {
    if (isLiquidityPool) {
      return 'Liquidity Pool Deployment';
    }
    return 'Token Deployment';
  };
  
  // Funkcje obsługujące approve tokenu
  const handleApproveTokenA = async () => {
    if (!contractAddress || !poolTokens || !poolTokens.tokenA) return;
    
    setApprovalState(prev => ({
      ...prev,
      tokenA: { ...prev.tokenA, loading: true, error: null }
    }));
    
    try {
      const result = await approveTokensForPool(
        poolTokens.tokenA,
        contractAddress,
        approvalAmount.tokenA
      );
      
      if (result.success) {
        setApprovalState(prev => ({
          ...prev,
          tokenA: { ...prev.tokenA, approved: true, loading: false }
        }));
      } else {
        throw new Error(result.error || 'Failed to approve token A');
      }
    } catch (error) {
      console.error('Error approving token A:', error);
      setApprovalState(prev => ({
        ...prev,
        tokenA: { 
          ...prev.tokenA, 
          loading: false, 
          error: error.message || 'Error approving token'
        }
      }));
    }
  };
  
  const handleApproveTokenB = async () => {
    if (!contractAddress || !poolTokens || !poolTokens.tokenB) return;
    
    setApprovalState(prev => ({
      ...prev,
      tokenB: { ...prev.tokenB, loading: true, error: null }
    }));
    
    try {
      const result = await approveTokensForPool(
        poolTokens.tokenB,
        contractAddress,
        approvalAmount.tokenB
      );
      
      if (result.success) {
        setApprovalState(prev => ({
          ...prev,
          tokenB: { ...prev.tokenB, approved: true, loading: false }
        }));
      } else {
        throw new Error(result.error || 'Failed to approve token B');
      }
    } catch (error) {
      console.error('Error approving token B:', error);
      setApprovalState(prev => ({
        ...prev,
        tokenB: { 
          ...prev.tokenB, 
          loading: false, 
          error: error.message || 'Error approving token'
        }
      }));
    }
  };
  
  // Funkcja do dodawania płynności
  const handleAddLiquidity = async () => {
    if (!contractAddress || !addLiquidity) return;
    
    setLiquidityState(prev => ({
      ...prev,
      loading: true,
      error: null,
      success: false
    }));
    
    try {
      const result = await addLiquidity(
        contractAddress,
        liquidityState.amountA,
        liquidityState.amountB
      );
      
      if (result.success) {
        setLiquidityState(prev => ({
          ...prev,
          loading: false,
          success: true
        }));
      } else {
        throw new Error(result.error || 'Failed to add liquidity');
      }
    } catch (error) {
      console.error('Error adding liquidity:', error);
      setLiquidityState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Error adding liquidity'
      }));
    }
  };
  
  return (
    <Panel theme={theme} title={getPanelTitle()}>
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
        
        {/* Contract Type Info */}
        {contractAddress && (
          <div style={{
            backgroundColor: theme.bg.secondary,
            padding: '16px',
            borderRadius: '8px'
          }}>
            <div style={{ 
              fontSize: '14px', 
              color: theme.system.text,
              marginBottom: '8px',
              fontWeight: 'bold'
            }}>
              Contract Type: {isLiquidityPool ? 'Liquidity Pool' : 'Token'}
            </div>
            
            {isLiquidityPool && poolTokens && (
              <div style={{
                fontSize: '14px',
                color: theme.bg.text,
                padding: '8px 12px',
                backgroundColor: theme.bg.main,
                borderRadius: '4px',
                marginTop: '8px'
              }}>
                <div style={{ marginBottom: '4px' }}>
                  <strong>Token A:</strong> {poolTokens.tokenA}
                </div>
                <div>
                  <strong>Token B:</strong> {poolTokens.tokenB}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Liquidity Pool Token Approval */}
        {isSuccess && isLiquidityPool && approveTokensForPool && (
          <div style={{
            backgroundColor: theme.bg.secondary,
            padding: '16px',
            borderRadius: '8px',
            marginTop: '16px'
          }}>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 'bold',
              marginBottom: '16px',
              color: theme.bg.text
            }}>
              Token Approval for Liquidity Pool
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>
                  Amount of Token A to Approve
                </label>
                <input
                  type="text"
                  value={approvalAmount.tokenA}
                  onChange={(e) => setApprovalAmount(prev => ({ ...prev, tokenA: e.target.value }))}
                  disabled={approvalState.tokenA.approved || approvalState.tokenA.loading}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${theme.bg.main === '#050505' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    background: theme.bg.main,
                    color: theme.bg.text
                  }}
                />
              </div>
              
              <Button
                onClick={handleApproveTokenA}
                variant={approvalState.tokenA.approved ? 'success' : 'primary'}
                size="medium"
                theme={theme}
                fullWidth
                isLoading={approvalState.tokenA.loading}
                disabled={!poolTokens?.tokenA || approvalState.tokenA.approved}
              >
                {approvalState.tokenA.approved 
                  ? 'Token A Approved ✓' 
                  : 'Approve Token A'}
              </Button>
              
              {approvalState.tokenA.error && (
                <div style={{
                  color: theme.system.error,
                  fontSize: '14px',
                  marginTop: '8px'
                }}>
                  {approvalState.tokenA.error}
                </div>
              )}
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>
                  Amount of Token B to Approve
                </label>
                <input
                  type="text"
                  value={approvalAmount.tokenB}
                  onChange={(e) => setApprovalAmount(prev => ({ ...prev, tokenB: e.target.value }))}
                  disabled={approvalState.tokenB.approved || approvalState.tokenB.loading}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${theme.bg.main === '#050505' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    background: theme.bg.main,
                    color: theme.bg.text
                  }}
                />
              </div>
              
              <Button
                onClick={handleApproveTokenB}
                variant={approvalState.tokenB.approved ? 'success' : 'primary'}
                size="medium"
                theme={theme}
                fullWidth
                isLoading={approvalState.tokenB.loading}
                disabled={!poolTokens?.tokenB || approvalState.tokenB.approved}
              >
                {approvalState.tokenB.approved 
                  ? 'Token B Approved ✓' 
                  : 'Approve Token B'}
              </Button>
              
              {approvalState.tokenB.error && (
                <div style={{
                  color: theme.system.error,
                  fontSize: '14px',
                  marginTop: '8px'
                }}>
                  {approvalState.tokenB.error}
                </div>
              )}
            </div>
            
            {approvalState.tokenA.approved && approvalState.tokenB.approved && (
              <div style={{
                backgroundColor: 'rgba(25, 135, 84, 0.1)',
                color: theme.system.success,
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                marginTop: '8px',
                marginBottom: '16px'
              }}>
                <strong>Both tokens approved!</strong> Now you can add liquidity to your pool.
              </div>
            )}
            
            {/* Add Liquidity Section */}
            {approvalState.tokenA.approved && approvalState.tokenB.approved && addLiquidity && (
              <div style={{ marginTop: '24px' }}>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold',
                  marginBottom: '16px',
                  color: theme.bg.text
                }}>
                  Add Liquidity to Pool
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', marginBottom: '4px' }}>
                      Amount of Token A to Add
                    </label>
                    <input
                      type="text"
                      value={liquidityState.amountA}
                      onChange={(e) => setLiquidityState(prev => ({ ...prev, amountA: e.target.value }))}
                      disabled={liquidityState.loading || liquidityState.success}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: `1px solid ${theme.bg.main === '#050505' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                        background: theme.bg.main,
                        color: theme.bg.text
                      }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '4px' }}>
                      Amount of Token B to Add
                    </label>
                    <input
                      type="text"
                      value={liquidityState.amountB}
                      onChange={(e) => setLiquidityState(prev => ({ ...prev, amountB: e.target.value }))}
                      disabled={liquidityState.loading || liquidityState.success}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: `1px solid ${theme.bg.main === '#050505' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                        background: theme.bg.main,
                        color: theme.bg.text
                      }}
                    />
                  </div>
                  
                  <Button
                    onClick={handleAddLiquidity}
                    variant={liquidityState.success ? 'success' : 'primary'}
                    size="medium"
                    theme={theme}
                    fullWidth
                    isLoading={liquidityState.loading}
                    disabled={liquidityState.loading || liquidityState.success}
                  >
                    {liquidityState.success 
                      ? 'Liquidity Added Successfully ✓' 
                      : 'Add Liquidity'}
                  </Button>
                  
                  {liquidityState.error && (
                    <div style={{
                      color: theme.system.error,
                      fontSize: '14px',
                      marginTop: '8px'
                    }}>
                      {liquidityState.error}
                    </div>
                  )}
                  
                  {liquidityState.success && (
                    <div style={{
                      backgroundColor: 'rgba(25, 135, 84, 0.1)',
                      color: theme.system.success,
                      padding: '12px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      marginTop: '16px'
                    }}>
                      <strong>Liquidity added successfully!</strong> Your pool is now active.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
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