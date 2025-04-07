import React from 'react';
import { Sun, Moon, Droplets, Key, FileJson, RefreshCw, AlertCircle, Info } from 'lucide-react';

const ContractDeployerUI = ({
  walletAddress,
  binaryCode,
  jsonAbi,
  isLoading,
  deploymentHash,
  deployedContractAddress,
  error,
  darkMode,
  deploymentStep,
  showDeploymentSuccess,
  constructorArgs,
  contractName,
  contractSymbol,
  showDisclaimer,
  totalTokens,
  sourceCode,
  isCompiling,
  setDarkMode,
  setConstructorArgs,
  setShowDisclaimer,
  connectWallet,
  generateRandomContractDetails,
  deployContract,
  resetDeployment
}) => {
  // Colors based on the zer0_dex_checker theme
  const colors = {
    light: {
      bg: {
        main: '#FFFFFF',
        secondary: '#FDF7FD',
        panel: '#FAEAFA',
        accent: '#FCF2FC',
        text: '#221B22',
      },
      primary: {
        main: '#FE4E52',
        hover: '#E18528',
        light: 'rgba(254, 78, 82, 0.1)',
      },
      system: {
        main: '#5C4C5C',
        text: '#A591A4',
        secondary: '#C3C3CD',
        accent: '#F8F6F8',
        link: '#748dc1',
        success: '#00B8A1',
        error: '#FE4E52',
        warning: '#E18528',
        info: '#E074DD',
        purple: '#D952D5',
      }
    },
    dark: {
      bg: {
        main: '#050505',
        secondary: '#0F0F0F',
        panel: '#1C171C',
        accent: '#FCF2FC',
        text: '#C3C3CD',
      },
      primary: {
        main: '#00D2E9',
        hover: '#E18528',
        light: 'rgba(0, 210, 233, 0.1)',
      },
      system: {
        main: '#C3C3CD',
        text: '#98999F',
        secondary: '#505158',
        accent: '#F8F6F8',
        link: '#748dc1',
        success: '#00B8A1',
        error: '#FE4E52',
        warning: '#E18528',
        info: '#00D2E9',
        purple: '#D952D5',
      }
    }
  };

  // Select color scheme
  const theme = darkMode ? colors.dark : colors.light;

  // Custom styles
  const styles = {
    appContainer: {
      fontFamily: "'Montserrat', sans-serif",
      minHeight: '100vh',
      backgroundColor: theme.bg.main,
      color: darkMode ? theme.bg.text : theme.bg.text,
      transition: 'background-color 0.3s, color 0.3s'
    },
    header: {
      padding: '20px',
      backgroundColor: darkMode ? theme.bg.secondary : theme.bg.secondary,
      borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: darkMode ? theme.system.main : theme.bg.text,
      display: 'flex',
      alignItems: 'center'
    },
    walletButton: {
      padding: '6px 12px',
      background: darkMode ? 
        theme.system.info : 
        `linear-gradient(to right, ${theme.system.error}, ${theme.system.purple})`,
      borderRadius: '20px',
      color: 'white',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer'
    },
    themeToggle: {
      background: darkMode ? theme.system.info : 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: darkMode ? 'white' : theme.bg.text,
      padding: '8px',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    mainMenu: {
      display: 'flex',
      justifyContent: 'center',
      gap: '24px',
      padding: '12px',
      color: darkMode ? theme.system.main : theme.bg.text
    },
    menuItem: {
      padding: '8px 16px',
      backgroundColor: darkMode ? theme.system.info : theme.system.info,
      border: 'none',
      color: 'white',
      fontWeight: '600',
      fontSize: '16px',
      borderRadius: '20px',
      cursor: 'pointer'
    },
    contentContainer: {
      maxWidth: '800px',
      margin: '24px auto',
      padding: '0 16px'
    },
    panel: {
      backgroundColor: darkMode ? theme.bg.panel : theme.bg.panel,
      padding: '24px',
      marginBottom: '24px',
      boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
      borderRadius: '32px',
      border: darkMode ? '4px solid rgba(255, 178, 252, 0.1)' : 'none'
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '24px',
      color: darkMode ? theme.system.main : theme.bg.text,
      textAlign: 'center'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      color: darkMode ? theme.system.text : theme.system.text
    },
    textarea: {
      width: '100%',
      backgroundColor: darkMode ? theme.bg.secondary : theme.bg.secondary,
      color: darkMode ? theme.system.main : theme.bg.text,
      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      borderRadius: '16px',
      padding: '16px',
      outline: 'none',
      fontSize: '14px',
      fontFamily: 'monospace',
      boxSizing: 'border-box',
      resize: 'vertical',
      minHeight: '120px',
      marginBottom: '16px'
    },
    input: {
      width: '100%',
      backgroundColor: darkMode ? theme.bg.secondary : theme.bg.secondary,
      color: darkMode ? theme.system.main : theme.bg.text,
      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      borderRadius: '16px',
      padding: '16px',
      outline: 'none',
      fontSize: '16px',
      boxSizing: 'border-box',
      marginBottom: '16px'
    },
    errorText: {
      color: theme.system.error,
      fontSize: '14px',
      marginTop: '8px'
    },
    card: {
      backgroundColor: darkMode ? 'rgba(28, 23, 28, 0.5)' : theme.bg.accent,
      padding: '16px',
      marginBottom: '24px',
      borderRadius: '12px'
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '12px',
      color: darkMode ? theme.system.main : theme.bg.text
    },
    button: {
      width: '100%',
      background: darkMode ? theme.system.info : `linear-gradient(to right, ${theme.system.error}, ${theme.system.purple})`,
      color: 'white',
      padding: '16px',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: isLoading ? 0.7 : 1,
      transition: 'background-color 0.3s',
      position: 'relative',
      overflow: 'hidden',
      marginTop: '16px'
    },
    refreshButton: {
      background: 'transparent',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px',
      borderRadius: '50%',
      cursor: 'pointer',
      color: darkMode ? theme.system.info : theme.system.info,
    },
    footer: {
      textAlign: 'center',
      padding: '16px',
      fontSize: '14px',
      marginTop: '40px',
      color: darkMode ? theme.system.text : theme.system.text
    },
    infoBox: {
      backgroundColor: darkMode ? 'rgba(0, 210, 233, 0.1)' : 'rgba(224, 116, 221, 0.1)',
      padding: '16px',
      borderRadius: '12px',
      marginBottom: '16px'
    },
    infoTitle: {
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '8px',
      color: darkMode ? theme.system.main : theme.bg.text
    },
    bubbleContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: -1,
      overflow: 'hidden'
    },
    bubble: {
      position: 'absolute',
      borderRadius: '50%',
      backgroundColor: 'rgba(224, 116, 221, 0.05)',
      animation: 'float 8s infinite ease-in-out'
    },
    memeTag: {
      display: 'inline-block',
      padding: '3px 8px',
      backgroundColor: darkMode ? 'rgba(254, 78, 82, 0.2)' : 'rgba(254, 78, 82, 0.2)',
      color: theme.system.error,
      borderRadius: '20px',
      fontSize: '12px',
      marginLeft: '8px'
    },
    tokenCounter: {
      textAlign: 'center',
      color: darkMode ? theme.system.text : theme.system.text,
      fontSize: '12px',
      padding: '4px 8px',
      backgroundColor: darkMode ? 'rgba(0, 210, 233, 0.1)' : 'rgba(224, 116, 221, 0.1)',
      borderRadius: '20px',
      display: 'inline-block',
      marginTop: '8px'
    },
    disclaimerBanner: {
      backgroundColor: darkMode ? 'rgba(225, 133, 40, 0.2)' : 'rgba(225, 133, 40, 0.1)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    },
    disclaimerText: {
      color: darkMode ? theme.system.warning : theme.system.warning,
      fontSize: '14px',
      flex: 1
    },
    closeButton: {
      background: 'transparent',
      border: 'none',
      color: darkMode ? theme.system.warning : theme.system.warning,
      cursor: 'pointer',
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    fanToolTag: {
      display: 'inline-block',
      padding: '3px 8px',
      backgroundColor: darkMode ? 'rgba(0, 184, 161, 0.2)' : 'rgba(0, 184, 161, 0.1)',
      color: theme.system.success,
      borderRadius: '20px',
      fontSize: '12px',
      marginLeft: '8px'
    },
    codeDisplay: {
      padding: '8px', 
      fontSize: '14px', 
      fontFamily: 'monospace',
      color: darkMode ? theme.system.main : theme.bg.text,
      whiteSpace: 'pre-wrap',
      overflowY: 'auto',
      maxHeight: '200px',
      margin: 0,
      scrollbarWidth: 'thin',
      scrollbarColor: darkMode ? 
        `${theme.system.secondary} ${theme.bg.secondary}` : 
        `${theme.system.text} ${theme.bg.secondary}`,
      '&::-webkit-scrollbar': {
        width: '8px',
        height: '8px'
      },
      '&::-webkit-scrollbar-track': {
        background: darkMode ? theme.bg.secondary : theme.bg.secondary,
        borderRadius: '4px'
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: darkMode ? theme.system.secondary : theme.system.text,
        borderRadius: '4px',
        '&:hover': {
          backgroundColor: darkMode ? theme.system.text : theme.system.secondary
        }
      }
    },
    codeContainer: {
      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      borderRadius: '16px',
      padding: '8px',
      marginBottom: '16px',
      backgroundColor: darkMode ? theme.bg.secondary : theme.bg.secondary
    },
    remarkContainer: {
      backgroundColor: darkMode ? 'rgba(28, 23, 28, 0.5)' : theme.bg.accent,
      padding: '16px',
      borderRadius: '12px',
      marginBottom: '24px'
    },
    remarkText: {
      color: darkMode ? theme.system.text : theme.system.text,
      fontSize: '14px',
      whiteSpace: 'pre-wrap'
    }
  };

  // Add global styles
  const globalStyles = `
    * {
      scrollbar-width: thin;
      scrollbar-color: ${darkMode ? 
        `${theme.system.secondary} ${theme.bg.secondary}` : 
        `${theme.system.text} ${theme.bg.secondary}`};
    }
    
    *::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    *::-webkit-scrollbar-track {
      background: ${darkMode ? theme.bg.secondary : theme.bg.secondary};
      border-radius: 4px;
    }
    
    *::-webkit-scrollbar-thumb {
      background-color: ${darkMode ? theme.system.secondary : theme.system.text};
      border-radius: 4px;
    }
    
    *::-webkit-scrollbar-thumb:hover {
      background-color: ${darkMode ? theme.system.text : theme.system.secondary};
    }

    @keyframes laserAnimation {
      0% { background-position: 0% 0%; }
      25% { background-position: 100% 0%; }
      50% { background-position: 100% 100%; }
      75% { background-position: 0% 100%; }
      100% { background-position: 0% 0%; }
    }
    
    .laser-button {
      position: relative;
      z-index: 1;
    }
    
    .laser-button::before {
      content: "";
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border-radius: 22px;
      background: linear-gradient(90deg, transparent, transparent, #ffffff, transparent, transparent);
      background-size: 400% 400%;
      z-index: -1;
      animation: laserAnimation 3s ease-in-out infinite;
      -webkit-mask: 
        linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      padding: 2px;
    }
    
    @keyframes float {
      0%, 100% {
        transform: translateY(0) translateX(0);
      }
      25% {
        transform: translateY(-20px) translateX(10px);
      }
      50% {
        transform: translateY(-10px) translateX(-10px);
      }
      75% {
        transform: translateY(-30px) translateX(5px);
      }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .spin-slow {
      animation: spin 8s linear infinite;
    }
  `;

  const remarkText = `Why this contract safu? Remark:

✓ Standard ERC-20 Implementation
This contract follows the official ERC-20 standard specification, which has been battle-tested by thousands of projects. The code is based on OpenZeppelin's audited templates, ensuring reliability and compatibility.

✓ No Backdoors or Hidden Functions
The contract has no owner privileges, admin keys, or mint functions after deployment. Once deployed, the contract becomes fully decentralized with no special access for anyone.

✓ Transparent Code
All contract code is publicly visible on the blockchain and can be verified. The source code shows exactly what the token does - no hidden surprises or malicious functions.

✓ Fixed Supply
The total token supply is set at deployment and cannot be changed. There are no functions to create more tokens later, ensuring your tokens cannot be diluted.

✓ Standard Functions Only
The contract only includes standard ERC-20 functions like transfer, approve, and balanceOf. No custom or experimental code that could introduce vulnerabilities.

Before deploying:
• Ensure sufficient A0GI balance in your account for gas fees
• Review the generated source code carefully
• Verify token name, symbol and total supply
• Test with a small amount first

You can track all contract interactions in your transaction history by clicking your account address in the upper right corner.`;

  return (
    <div style={styles.appContainer}>
      {/* CSS for animations */}
      <style>
        {globalStyles}
      </style>
      
      {/* Decorative bubbles in background */}
      <div style={styles.bubbleContainer}>
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            style={{
              ...styles.bubble,
              width: `${Math.random() * 80 + 20}px`,
              height: `${Math.random() * 80 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.3 + Math.random() * 0.2
            }}
          />
        ))}
      </div>
      
      {/* Header */}
      <header style={styles.header}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <span style={styles.logo}>
            <span style={{color: darkMode ? theme.system.info : theme.system.error}}>zer0</span>
            Contract Deployer
            <span style={styles.memeTag}>meme edition</span>
            <span style={styles.fanToolTag}>fan tool</span>
          </span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <div 
            style={styles.walletButton}
            onClick={connectWallet}
          >
            <span>{walletAddress || 'Connect Wallet'}</span>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            style={styles.themeToggle}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Menu */}
      <div style={styles.mainMenu}>
        <a 
          href="/"
          style={{
            ...styles.menuItem,
            background: darkMode ? theme.system.info : `linear-gradient(to right, ${theme.system.error}, ${theme.system.purple})`,
            textDecoration: 'none'
          }}
        >
          Back to Checker
        </a>
      </div>

      {/* Main content */}
      <div style={styles.contentContainer}>
        {/* Disclaimer Banner */}
        {showDisclaimer && (
          <div style={styles.disclaimerBanner}>
            <AlertCircle size={20} color={darkMode ? theme.system.warning : theme.system.warning} />
            <div style={styles.disclaimerText}>
              <strong>Disclaimer:</strong> This is a fan-made tool not affiliated with the official zer0_dex on the 0G Labs Newton Network. This contract deployer is for educational and entertainment purposes only.
            </div>
            <button 
              onClick={() => setShowDisclaimer(false)}
              style={styles.closeButton}
            >
              ✕
            </button>
          </div>
        )}
      
        {!showDeploymentSuccess && (
          <div style={styles.panel}>
            <h2 style={styles.title}>Contract Deployment 0G Newton Testnet</h2>
            
            <div style={styles.infoBox}>
              <h3 style={styles.infoTitle}>0GM Builder: {contractName} ({contractSymbol}) Token</h3>
              <p style={{fontSize: '14px', color: darkMode ? theme.system.text : theme.system.text}}>
                A memetic zer0fam ecosystem token has been generated for you. 
                You can regenerate new contract data or proceed to deployment.
              </p>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '12px'}}>
                <button 
                  onClick={generateRandomContractDetails}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${darkMode ? theme.system.info : theme.system.info}`,
                    color: darkMode ? theme.system.info : theme.system.info,
                    padding: '8px 16px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  <RefreshCw size={16} />
                  Generate New Meme Token
                </button>
                {totalTokens && (
                  <div style={styles.tokenCounter}>
                    200+ possible unique token names in generator
                  </div>
                )}
              </div>
            </div>
            
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Remark:</h3>
              <div style={styles.remarkContainer}>
                <pre style={styles.remarkText}>
                  {remarkText}
                </pre>
              </div>
            </div>
            
            {sourceCode && (
              <div style={{marginTop: '16px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                  <label style={styles.label}>Solidity Source Code:</label>
                </div>
                <div style={styles.codeContainer}>
                  <pre style={styles.codeDisplay}>
                    {sourceCode}
                  </pre>
                </div>
              </div>
            )}
            
            <div style={{marginTop: '24px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                <label style={styles.label}>Binary Code:</label>
              </div>
              <div style={styles.codeContainer}>
                <div style={styles.codeDisplay}>
                  {binaryCode}
                </div>
              </div>
            </div>
            
            <div style={{marginTop: '16px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                <label style={styles.label}>JSON ABI:</label>
              </div>
              <div style={styles.codeContainer}>
                <pre style={styles.codeDisplay}>
                  {jsonAbi}
                </pre>
              </div>
            </div>
            
            <div style={{marginTop: '16px'}}>
              <label style={styles.label}>Constructor arguments (optional):</label>
              <input
                type="text"
                value={constructorArgs}
                onChange={(e) => setConstructorArgs(e.target.value)}
                placeholder=""
                style={styles.input}
              />
            </div>
            
            {error && <p style={styles.errorText}>{error}</p>}
            
            <button 
              onClick={deployContract} 
              disabled={isLoading}
              className="laser-button"
              style={styles.button}
            >
              {isCompiling ? 'Compiling...' : isLoading ? 'Deploying...' : 'WAGMI - Deploy Now'}
            </button>
            
            {deploymentStep > 0 && deploymentStep < 3 && (
              <div style={{
                marginTop: '24px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center'
              }}>
                {deploymentStep === 1 && (
                  <div style={{color: theme.system.info}}>
                    <div style={{fontSize: '20px', marginBottom: '16px'}}>
                      loading...
                    </div>
                    <div style={{fontSize: '16px'}}>
                      Waiting For Confirmation
                    </div>
                  </div>
                )}
                {deploymentStep === 2 && (
                  <div style={{color: theme.system.success}}>
                    <div style={{fontSize: '48px', marginBottom: '16px'}}>
                      ↑
                    </div>
                    <div style={{fontSize: '16px'}}>
                      Transaction Hash: 
                      <a 
                        href={`https://chainscan-newton.0g.ai/tx/${deploymentHash}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          color: theme.system.info,
                          marginLeft: '4px'
                        }}
                      >
                        {deploymentHash || '0x5d4228...'}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Deployment Success */}
        {showDeploymentSuccess && (
          <div style={styles.panel}>
            <div style={{
              backgroundColor: 'rgba(0, 184, 161, 0.1)',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <div style={{color: theme.system.success, fontSize: '64px', marginBottom: '16px'}}>
                ✓
              </div>
              <div style={{fontSize: '16px', color: theme.system.main}}>
                Transaction Hash: 
                <a 
                  href={`https://chainscan-newton.0g.ai/tx/${deploymentHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: theme.system.info,
                    marginLeft: '4px'
                  }}
                >
                  {deploymentHash}
                </a>
              </div>
            </div>
            
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Check Contract</h3>
              <div style={{
                backgroundColor: darkMode ? theme.bg.secondary : 'rgba(250, 250, 250, 0.8)',
                padding: '16px',
                borderRadius: '8px'
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
                  <Droplets size={20} />
                  <span style={{fontWeight: 'bold', fontSize: '16px'}}>{contractName}</span>
                  <div style={{
                    backgroundColor: '#E5F9FF',
                    color: '#00B8A1',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>MEME Token</span>
                    <span style={{fontSize: '14px'}}>🔥</span>
                  </div>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '150px 1fr',
                  gap: '8px',
                  fontSize: '14px'
                }}>
                  <div style={{color: theme.system.text}}>Price</div>
                  <div>Not Available</div>
                  
                  <div style={{color: theme.system.text}}>Contract</div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                    <a 
                      href={`https://chainscan-newton.0g.ai/address/${deployedContractAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: theme.system.info, 
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {deployedContractAddress.substring(0, 6)}...{deployedContractAddress.substring(deployedContractAddress.length - 4)}
                    </a>
                  </div>
                  
                  <div style={{color: theme.system.text}}>Market Cap</div>
                  <div>—</div>
                  
                  <div style={{color: theme.system.text}}>Decimals</div>
                  <div>18</div>
                  
                  <div style={{color: theme.system.text}}>Total Supply</div>
                  <div>1G {contractSymbol}</div>
                  
                  <div style={{color: theme.system.text}}>Holders</div>
                  <div>1 (~ 0.000%)</div>
                  
                  <div style={{color: theme.system.text}}>Official Site</div>
                  <div>—</div>
                  
                  <div style={{color: theme.system.text}}>Transfers</div>
                  <div>1</div>
                </div>
              </div>
            </div>
            
            <button
              onClick={resetDeployment}
              className="laser-button"
              style={styles.button}
            >
              Deploy Another Meme Token
            </button>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer style={styles.footer}>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '15px'}}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '10px'
          }}>
            <a 
              href="https://github.com/desu777" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: darkMode ? theme.system.text : theme.system.text,
                fontSize: '24px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C18.2072 22.5808 20.2772 21.0498 21.7437 19.0074C23.2101 16.9651 23.9994 14.5143 24 12C24 5.37 18.63 0 12 0Z" fill="currentColor"/>
              </svg>
              @desu777
            </a>
            <a 
              href="https://x.com/nov3lolo" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: darkMode ? theme.system.text : theme.system.text,
                fontSize: '24px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" fill="currentColor"/>
              </svg>
              @nov3lolo
            </a>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <span>zer0 Contract Deployer © 2025 | 0gm frens! zer0limits 🚀 | Powered by desu</span>
            <img src="/nft.png" alt="anime NFT" style={{height: '40px', borderRadius: '50%'}} />
          </div>
          <div style={{fontSize: '12px', opacity: 0.8}}>
            Fan-made tool | Not affiliated with the official zer0_dex on 0G Labs Newton Network
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContractDeployerUI; 