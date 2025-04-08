import React, { useState } from 'react';
import { useLiquidityPoolCompiler } from '../../hooks/useLiquidityPoolCompiler';
import Panel from '../Shared/Panel';
import Button from '../Shared/Button';
import { AlertTriangle } from 'lucide-react';

const LiquidityPoolCreator = ({ theme, walletAddress, deployContract, approveTokensForPool }) => {
  const {
    poolSourceCode,
    setPoolSourceCode,
    poolName,
    setPoolName,
    tokenA,
    setTokenA,
    tokenB,
    setTokenB,
    compilePool,
    verifyToken,
    bytecode,
    abi,
    isCompiling,
    compileError
  } = useLiquidityPoolCompiler();

  const [tokenAVerified, setTokenAVerified] = useState(false);
  const [tokenBVerified, setTokenBVerified] = useState(false);
  const [verifyingToken, setVerifyingToken] = useState(false);
  const [deployedPoolAddress, setDeployedPoolAddress] = useState('');
  const [approvalStatus, setApprovalStatus] = useState({
    tokenA: false,
    tokenB: false,
    inProgress: false,
    error: null
  });
  const [tokenAmounts, setTokenAmounts] = useState({
    amountA: '1000',
    amountB: '1000',
  });

  // Handle token A verification
  const handleVerifyTokenA = async () => {
    if (!tokenA) return;
    
    setVerifyingToken(true);
    try {
      const result = await verifyToken(tokenA);
      setTokenAVerified(result.success);
    } catch (error) {
      setTokenAVerified(false);
    } finally {
      setVerifyingToken(false);
    }
  };

  // Handle token B verification
  const handleVerifyTokenB = async () => {
    if (!tokenB) return;
    
    setVerifyingToken(true);
    try {
      const result = await verifyToken(tokenB);
      setTokenBVerified(result.success);
    } catch (error) {
      setTokenBVerified(false);
    } finally {
      setVerifyingToken(false);
    }
  };

  // Compile and deploy pool
  const handleDeployPool = async () => {
    const compileResult = await compilePool();
    if (compileResult && compileResult.success) {
      // Reset approval status on new deployment
      setApprovalStatus({
        tokenA: false,
        tokenB: false,
        inProgress: false,
        error: null
      });
      
      // Deploy using the existing deployment function
      const contract = await deployContract(compileResult.bytecode, compileResult.abi, [tokenA, tokenB]);
      
      if (contract && contract.address) {
        setDeployedPoolAddress(contract.address);
        console.log("Pool deployed at:", contract.address);
      }
    }
  };
  
  // Approve tokens for pool
  const handleApproveTokenA = async () => {
    if (!deployedPoolAddress || !tokenA) return;
    
    setApprovalStatus(prev => ({ ...prev, inProgress: true, error: null }));
    
    try {
      const result = await approveTokensForPool(tokenA, deployedPoolAddress, tokenAmounts.amountA);
      
      if (result.success) {
        setApprovalStatus(prev => ({ ...prev, tokenA: true, inProgress: false }));
        console.log("Token A approved for pool");
      } else {
        throw new Error(result.error || "Failed to approve Token A");
      }
    } catch (error) {
      console.error("Error approving Token A:", error);
      setApprovalStatus(prev => ({ 
        ...prev, 
        inProgress: false, 
        error: `Error approving Token A: ${error.message || error}`
      }));
    }
  };
  
  const handleApproveTokenB = async () => {
    if (!deployedPoolAddress || !tokenB) return;
    
    setApprovalStatus(prev => ({ ...prev, inProgress: true, error: null }));
    
    try {
      const result = await approveTokensForPool(tokenB, deployedPoolAddress, tokenAmounts.amountB);
      
      if (result.success) {
        setApprovalStatus(prev => ({ ...prev, tokenB: true, inProgress: false }));
        console.log("Token B approved for pool");
      } else {
        throw new Error(result.error || "Failed to approve Token B");
      }
    } catch (error) {
      console.error("Error approving Token B:", error);
      setApprovalStatus(prev => ({ 
        ...prev, 
        inProgress: false, 
        error: `Error approving Token B: ${error.message || error}`
      }));
    }
  };

  return (
    <Panel theme={theme} title="Create Liquidity Pool">
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          Pool Name
        </label>
        <input
          type="text"
          value={poolName}
          onChange={(e) => setPoolName(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '8px',
            border: `1px solid ${theme.bg.main === '#050505' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            background: theme.bg.secondary,
            color: theme.bg.text
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <label style={{ flex: 1 }}>Token A Address</label>
          <div>
            {tokenAVerified && <span style={{ color: theme.system.success, marginRight: '8px' }}>Verified ✓</span>}
            <Button
              onClick={handleVerifyTokenA}
              variant="secondary"
              size="small"
              theme={theme}
              disabled={!tokenA || verifyingToken}
            >
              Verify
            </Button>
          </div>
        </div>
        <input
          type="text"
          value={tokenA}
          onChange={(e) => setTokenA(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '8px',
            border: `1px solid ${theme.bg.main === '#050505' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            background: theme.bg.secondary,
            color: theme.bg.text
          }}
          placeholder="0x..."
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <label style={{ flex: 1 }}>Token B Address</label>
          <div>
            {tokenBVerified && <span style={{ color: theme.system.success, marginRight: '8px' }}>Verified ✓</span>}
            <Button
              onClick={handleVerifyTokenB}
              variant="secondary"
              size="small"
              theme={theme}
              disabled={!tokenB || verifyingToken}
            >
              Verify
            </Button>
          </div>
        </div>
        <input
          type="text"
          value={tokenB}
          onChange={(e) => setTokenB(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '8px',
            border: `1px solid ${theme.bg.main === '#050505' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            background: theme.bg.secondary,
            color: theme.bg.text
          }}
          placeholder="0x..."
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          Custom Pool Source Code (Optional)
        </label>
        <textarea
          value={poolSourceCode}
          onChange={(e) => setPoolSourceCode(e.target.value)}
          style={{
            width: '100%',
            height: '200px',
            padding: '8px 12px',
            borderRadius: '8px',
            border: `1px solid ${theme.bg.main === '#050505' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            background: theme.bg.secondary,
            color: theme.bg.text,
            fontFamily: 'monospace'
          }}
          placeholder="// If left empty, the system will generate a pool contract using the token addresses"
        />
      </div>

      {/* Token Amounts Input Fields */}
      {deployedPoolAddress && (
        <div style={{ marginTop: '16px', padding: '16px', backgroundColor: theme.bg.secondary, borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px', color: theme.primary.main }}>
            Manage Liquidity
          </h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Pool Address</label>
            <div style={{ 
              padding: '8px 12px',
              borderRadius: '8px',
              border: `1px solid ${theme.bg.main === '#050505' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              background: theme.bg.main,
              color: theme.bg.text,
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {deployedPoolAddress}
            </div>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Token A Amount</label>
            <input
              type="text"
              value={tokenAmounts.amountA}
              onChange={(e) => setTokenAmounts(prev => ({ ...prev, amountA: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: `1px solid ${theme.bg.main === '#050505' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                background: theme.bg.secondary,
                color: theme.bg.text
              }}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Token B Amount</label>
            <input
              type="text"
              value={tokenAmounts.amountB}
              onChange={(e) => setTokenAmounts(prev => ({ ...prev, amountB: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: `1px solid ${theme.bg.main === '#050505' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                background: theme.bg.secondary,
                color: theme.bg.text
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <Button
              onClick={handleApproveTokenA}
              variant={approvalStatus.tokenA ? "success" : "primary"}
              theme={theme}
              disabled={!deployedPoolAddress || approvalStatus.inProgress || !tokenA}
              fullWidth
            >
              {approvalStatus.tokenA ? "Token A Approved ✓" : "Approve Token A"}
            </Button>
            
            <Button
              onClick={handleApproveTokenB}
              variant={approvalStatus.tokenB ? "success" : "primary"}
              theme={theme}
              disabled={!deployedPoolAddress || approvalStatus.inProgress || !tokenB}
              fullWidth
            >
              {approvalStatus.tokenB ? "Token B Approved ✓" : "Approve Token B"}
            </Button>
          </div>
          
          {approvalStatus.error && (
            <div style={{
              backgroundColor: 'rgba(254, 78, 82, 0.1)',
              color: theme.system.error,
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              marginTop: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
              <AlertTriangle size={18} style={{ minWidth: '18px', marginTop: '2px' }} />
              <div>
                <strong>Approval error:</strong>
                <div style={{ marginTop: '4px', wordBreak: 'break-word' }}>
                  {approvalStatus.error}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {compileError && (
        <div style={{
          backgroundColor: 'rgba(254, 78, 82, 0.1)',
          color: theme.system.error,
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          marginBottom: '16px',
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

      <div style={{ display: 'flex', gap: '16px' }}>
        <Button
          onClick={compilePool}
          variant="primary"
          theme={theme}
          isLoading={isCompiling}
          disabled={isCompiling || (!poolSourceCode && (!tokenA || !tokenB))}
          fullWidth
        >
          Compile Pool
        </Button>
        
        <Button
          onClick={handleDeployPool}
          variant="gradient"
          theme={theme}
          disabled={!bytecode || !abi || !walletAddress}
          fullWidth
        >
          Deploy Pool
        </Button>
      </div>
    </Panel>
  );
};

export default LiquidityPoolCreator; 