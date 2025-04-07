import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Layout/Header';
import TwoColumnLayout from './components/Layout/TwoColumnLayout';
import AIChat from './components/AIChat/AIChat';
import CodeEditor from './components/CodeEditor/CodeEditor';
import CompileSection from './components/Deployment/CompileSection';
import DeploySection from './components/Deployment/DeploySection';
import DeploymentResult from './components/Deployment/DeploymentResult';
import Panel from './components/Shared/Panel';
import Button from './components/Shared/Button';

import { useAIChat } from './hooks/useAIChat';
import { useCompiler } from './hooks/useCompiler';
import { useWeb3 } from './hooks/useWeb3';

import theme from './styles/theme';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const currentTheme = darkMode ? theme.dark : theme.light;
  
  // State for disclaimer
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  
  // Hook do obsługi AI i czatu
  const { 
    messages, 
    sendMessage, 
    isTyping, 
    suggestedPrompts, 
    clearChat
  } = useAIChat([], (code) => {
    // Callback wywoływany, gdy AI wygeneruje kod
    if (code) {
      setSourceCode(code);
    }
  });
  
  // Hook do obsługi kompilacji
  const {
    sourceCode,
    setSourceCode,
    contractName,
    setContractName,
    contractSymbol,
    setContractSymbol,
    totalTokens,
    setTotalTokens,
    compileContract,
    bytecode,
    abi,
    isCompiling,
    compileError
  } = useCompiler();
  
  // Hook do obsługi Web3
  const {
    walletAddress,
    isConnected,
    chainId,
    connect,
    deployContract,
    switchToNewtonTestnet,
    deploymentStatus,
    isMatHolder,
    isCheckingMatBalance,
    disconnect
  } = useWeb3();

  // Funkcja do generowania losowego tokena (można rozszerzyć)
  const generateRandomContractDetails = useCallback(() => {
    // Przykładowe losowe nazwy i symbole (można rozszerzyć)
    const names = [
      'ZerryMoon', 'MikeToken', 'ZERAIToken', 'NewtonMeme',
      'Zer0Gravity', 'MoonToken', 'PandaZer0', 'GravityGang'
    ];
    
    const symbols = [
      'ZMOON', 'MIKE', 'ZERAI', 'NEWT',
      'ZER0', 'MOON', 'PANDA', 'GANG'
    ];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const randomSupply = Math.floor(Math.random() * 9000000000) + 1000000000;
    
    setContractName(randomName);
    setContractSymbol(randomSymbol);
    setTotalTokens(randomSupply);
    
    // Generowanie prostego szablonu kontraktu
    const contractTemplate = `// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

contract ${randomName} {
    string public name = "${randomName}";
    string public symbol = "${randomSymbol}";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor() {
        totalSupply = ${randomSupply} * 10 ** uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0), "Invalid address");
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0), "Invalid address");
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Allowance exceeded");
        
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        
        emit Transfer(_from, _to, _value);
        return true;
    }
}`;
    
    setSourceCode(contractTemplate);
  }, [setContractName, setContractSymbol, setTotalTokens, setSourceCode]);
  
  // Efekt do ładowania preferencji ciemnego trybu z localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    }
  }, []);
  
  // Efekt do zapisywania preferencji ciemnego trybu w localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);
  
  // Przygotowanie contentu dla lewej kolumny (czat)
  const leftColumnContent = (
    <>
      {!isConnected ? (
        <Panel theme={currentTheme} title="Connect Your Wallet">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 16px',
            gap: '24px',
            backgroundColor: currentTheme.bg.secondary,
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '18px',
              marginBottom: '16px',
              color: currentTheme.system.text
            }}>
              Please connect your wallet to use the zer0 AI Assistant and deploy contracts
            </div>
            <Button
              onClick={connect}
              variant="primary"
              theme={currentTheme}
              size="large"
            >
              Connect Wallet
            </Button>
          </div>
        </Panel>
      ) : isCheckingMatBalance ? (
        // Preloader podczas sprawdzania balansu $MAT
        <Panel theme={currentTheme} title="Checking Wallet...">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 16px',
            gap: '24px',
            backgroundColor: currentTheme.bg.secondary,
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '3px solid rgba(255, 105, 180, 0.2)',
                borderTopColor: 'rgba(255, 105, 180, 0.8)',
                animation: 'spin 1s linear infinite'
              }} />
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
              <div style={{
                fontSize: '16px',
                color: currentTheme.system.text
              }}>
                Checking if your wallet has at least 100 $MAT tokens...
              </div>
            </div>
          </div>
        </Panel>
      ) : isConnected && !isMatHolder ? (
        // Panel informujący o potrzebie zakupu tokena $MAT
        <Panel theme={currentTheme} title="$MAT Token Required">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 16px',
            gap: '24px',
            backgroundColor: currentTheme.bg.secondary,
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '16px',
              marginBottom: '16px',
              color: currentTheme.system.text,
              lineHeight: '1.5'
            }}>
              <p>To use zer0 AI Assistant, you need to hold at least 100 $MAT tokens.</p>
              <p style={{ marginTop: '12px' }}>$MAT token was created in honor of the creator's cat, get some to support the project!</p>
            </div>
            <Button
              onClick={() => window.open('https://zer0checker.xyz/mat/', '_blank')}
              variant="primary"
              theme={currentTheme}
              size="large"
            >
              Get $MAT Token
            </Button>
            <div style={{
              color: currentTheme.system.text,
              fontSize: '14px',
              marginTop: '8px',
              opacity: 0.7
            }}>
              After getting at least 100 $MAT tokens, refresh the page or reconnect your wallet.
            </div>
          </div>
        </Panel>
      ) : (
        <>
          <AIChat
            messages={messages}
            sendMessage={sendMessage}
            isTyping={isTyping}
            suggestedPrompts={suggestedPrompts}
            clearChat={clearChat}
            theme={currentTheme}
          />
          
          {bytecode && abi && (
            <DeploySection
              bytecode={bytecode}
              abi={abi}
              deployContract={deployContract}
              contractName={contractName}
              theme={currentTheme}
              chainId={chainId}
              walletAddress={walletAddress}
              switchToNewtonTestnet={switchToNewtonTestnet}
            />
          )}
          
          {deploymentStatus.step > 0 && (
            <DeploymentResult
              deploymentStatus={deploymentStatus}
              theme={currentTheme}
            />
          )}
        </>
      )}
    </>
  );
  
  // Przygotowanie contentu dla prawej kolumny (edytor i wdrażanie)
  const rightColumnContent = (
    <>
      <CodeEditor
        sourceCode={sourceCode}
        setSourceCode={setSourceCode}
        contractName={contractName}
        setContractName={setContractName}
        contractSymbol={contractSymbol}
        setContractSymbol={setContractSymbol}
        totalTokens={totalTokens}
        setTotalTokens={setTotalTokens}
        theme={currentTheme}
        generateRandomContractDetails={generateRandomContractDetails}
      />
      
      <CompileSection
        compileContract={compileContract}
        isCompiling={isCompiling}
        compileError={compileError}
        theme={currentTheme}
        bytecode={bytecode}
        abi={abi}
      />
    </>
  );
  
  return (
    <div style={{
      fontFamily: "'Montserrat', sans-serif",
      minHeight: '100vh',
      backgroundColor: currentTheme.bg.main,
      color: currentTheme.bg.text,
      transition: 'background-color 0.3s, color 0.3s'
    }}>
      <Header 
        walletAddress={walletAddress}
        isConnected={isConnected}
        connect={connect}
        disconnect={disconnect}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        theme={currentTheme}
      />
      
      {showDisclaimer && (
        <div style={{
          backgroundColor: currentTheme.primary.light,
          color: currentTheme.primary.main,
          padding: '8px 16px',
          textAlign: 'center',
          position: 'relative',
          maxWidth: '1400px',
          margin: '0 auto',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <p style={{ margin: '4px 0' }}>
            Disclaimer: This is a fan-made tool not affiliated with the official zer0_dex on the 0G Labs Newton Network.
          </p>
          <button 
            onClick={() => setShowDisclaimer(false)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: currentTheme.primary.main
            }}
          >
            ✕
          </button>
        </div>
      )}
      
      <TwoColumnLayout
        leftColumn={leftColumnContent}
        rightColumn={rightColumnContent}
        theme={currentTheme}
      />
    </div>
  );
}

export default App; 