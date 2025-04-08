import React, { useState, useEffect } from 'react';
import Panel from '../Shared/Panel';
import Button from '../Shared/Button';
import { Rocket, AlertTriangle } from 'lucide-react';

const DeploySection = ({ 
  bytecode, 
  abi, 
  deployContract,
  theme,
  chainId,
  walletAddress,
  switchToNewtonTestnet,
  contractType = 'token',
  poolTokens = { tokenA: '', tokenB: '' }
}) => {
  const [constructorArgs, setConstructorArgs] = useState([]);
  const [showBytecode, setShowBytecode] = useState(false);
  const [showAbi, setShowAbi] = useState(false);
  
  // Aktualizacja argumentów konstruktora na podstawie typu kontraktu
  useEffect(() => {
    if (contractType === 'pool' && poolTokens.tokenA && poolTokens.tokenB) {
      setConstructorArgs([poolTokens.tokenA, poolTokens.tokenB]);
    } else {
      setConstructorArgs([]);
    }
  }, [contractType, poolTokens]);
  
  // Check if contract has constructor with arguments
  const hasConstructorWithArgs = abi && abi.some(item => 
    item.type === 'constructor' && item.inputs && item.inputs.length > 0
  );
  
  // Get constructor arguments if they exist
  const constructorInputs = hasConstructorWithArgs ? 
    abi.find(item => item.type === 'constructor').inputs : 
    [];
    
  // Function to update constructor arguments
  const updateConstructorArg = (index, value) => {
    const newArgs = [...constructorArgs];
    newArgs[index] = value;
    setConstructorArgs(newArgs);
  };
  
  // Check if wallet is connected to Newton Testnet
  const isNewtonTestnet = chainId === 16600; // 0x40d8 (hex) = 16600 (decimal)
  
  // Handle deploy action with contract type info
  const handleDeploy = () => {
    deployContract(bytecode, abi, constructorArgs, { 
      contractType, 
      ...(contractType === 'pool' ? { poolTokens } : {})
    });
  };
  
  return (
    <Panel theme={theme} title={`${contractType === 'pool' ? 'Liquidity Pool' : 'Token'} Deployment`}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Network information */}
        {!isNewtonTestnet && (
          <div style={{
            backgroundColor: 'rgba(225, 133, 40, 0.1)',
            color: theme.system.warning,
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <AlertTriangle size={18} style={{ minWidth: '18px', marginTop: '2px' }} />
            <div>
              <strong>Incorrect network:</strong>
              <div style={{ marginTop: '4px' }}>
                This deployer only works on Newton Testnet.
              </div>
              <div style={{ marginTop: '8px' }}>
                <Button
                  onClick={switchToNewtonTestnet}
                  size="small"
                  variant="warning"
                  theme={theme}
                >
                  Switch to Newton Testnet
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Contract Type Info */}
        <div style={{
          backgroundColor: theme.bg.secondary,
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          marginBottom: '8px'
        }}>
          <strong>Contract Type:</strong> {contractType === 'pool' ? 'Liquidity Pool' : 'Token'} 
          {contractType === 'pool' && poolTokens.tokenA && poolTokens.tokenB && (
            <div style={{ marginTop: '8px', fontSize: '13px' }}>
              <div><strong>Token A:</strong> {poolTokens.tokenA}</div>
              <div><strong>Token B:</strong> {poolTokens.tokenB}</div>
            </div>
          )}
        </div>
        
        {/* Constructor arguments */}
        {hasConstructorWithArgs && (
          <div style={{
            backgroundColor: theme.bg.secondary,
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              marginTop: 0, 
              marginBottom: '16px',
              color: theme.bg.text
            }}>
              Constructor Arguments
            </h3>
            
            {constructorInputs.map((input, index) => (
              <div key={index} style={{ marginBottom: '12px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  color: theme.system.text
                }}>
                  {input.name} ({input.type})
                </label>
                <input
                  type="text"
                  value={constructorArgs[index] || ''}
                  onChange={(e) => updateConstructorArg(index, e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: theme.bg.main,
                    color: theme.bg.text,
                    border: `1px solid ${theme.bg.main === '#050505' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    borderRadius: '8px',
                    padding: '8px 12px',
                    outline: 'none',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder={`Enter value of type ${input.type}`}
                />
              </div>
            ))}
          </div>
        )}
        
        {/* Deploy button */}
        <Button
          onClick={handleDeploy}
          isLoading={false}
          disabled={!isNewtonTestnet || !walletAddress}
          fullWidth
          icon={<Rocket size={18} />}
          theme={theme}
          variant="primary"
        >
          {!walletAddress ? 'Connect wallet to deploy' : `Deploy ${contractType === 'pool' ? 'Liquidity Pool' : 'Token'}`}
        </Button>
        
        {/* Bytecode and ABI buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '16px',
          marginTop: '8px'
        }}>
          <Button
            onClick={() => setShowBytecode(!showBytecode)}
            variant="secondary"
            size="small"
            fullWidth
            theme={theme}
          >
            {showBytecode ? 'Hide Bytecode' : 'Show Bytecode'}
          </Button>
          
          <Button
            onClick={() => setShowAbi(!showAbi)}
            variant="secondary"
            size="small"
            fullWidth
            theme={theme}
          >
            {showAbi ? 'Hide ABI' : 'Show ABI'}
          </Button>
        </div>
        
        {/* Bytecode display */}
        {showBytecode && (
          <div style={{
            backgroundColor: theme.bg.secondary,
            padding: '12px',
            borderRadius: '8px',
            fontSize: '12px',
            overflowX: 'auto',
            marginTop: '8px'
          }}>
            <div style={{ 
              color: theme.system.text, 
              marginBottom: '8px',
              fontWeight: 'bold'
            }}>
              Bytecode:
            </div>
            <div style={{
              fontFamily: 'monospace',
              wordBreak: 'break-all',
              color: theme.bg.text
            }}>
              {bytecode}
            </div>
          </div>
        )}
        
        {/* ABI display */}
        {showAbi && (
          <div style={{
            backgroundColor: theme.bg.secondary,
            padding: '12px',
            borderRadius: '8px',
            fontSize: '12px',
            overflowX: 'auto',
            marginTop: '8px'
          }}>
            <div style={{ 
              color: theme.system.text, 
              marginBottom: '8px',
              fontWeight: 'bold'
            }}>
              ABI:
            </div>
            <div style={{
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              color: theme.bg.text
            }}>
              {JSON.stringify(abi, null, 2)}
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
};

export default DeploySection; 