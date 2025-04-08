import { useState, useCallback } from 'react';
import axios from 'axios';

// URL do mikrousługi kompilatora - można zmienić na podstawie konfiguracji
const COMPILER_SERVICE_BASE_URL = 'http://localhost:3003';

export const useCompiler = (initialSourceCode = '') => {
  const [sourceCode, setSourceCode] = useState(initialSourceCode);
  const [isCompiling, setIsCompiling] = useState(false);
  const [bytecode, setBytecode] = useState('');
  const [abi, setAbi] = useState(null);
  const [compileError, setCompileError] = useState(null);
  const [contractType, setContractType] = useState('token'); // 'token' lub 'pool'
  const [poolTokens, setPoolTokens] = useState({ tokenA: '', tokenB: '' });

  // Funkcja do wykrywania typu kontraktu
  const detectContractType = useCallback((code) => {
    // Sprawdź, czy kod zawiera charakterystyczne elementy dla liquidity poola
    if (
      (code.includes('addLiquidity') && code.includes('swapAforB')) ||
      (code.includes('tokenA') && code.includes('tokenB') && code.includes('reserveA')) ||
      code.includes('LiquidityPool') ||
      code.includes('SwapPool')
    ) {
      setContractType('pool');
      
      // Próba ekstrakcji adresów tokenów
      const tokenAMatch = code.match(/tokenA\s*=\s*IERC20\s*\(\s*(?:address\s*\(\s*uint160\s*\(\s*)?0x([a-fA-F0-9]{40})/);
      const tokenBMatch = code.match(/tokenB\s*=\s*IERC20\s*\(\s*(?:address\s*\(\s*uint160\s*\(\s*)?0x([a-fA-F0-9]{40})/);
      
      if (tokenAMatch && tokenAMatch[1]) {
        setPoolTokens(prev => ({ ...prev, tokenA: '0x' + tokenAMatch[1] }));
      }
      
      if (tokenBMatch && tokenBMatch[1]) {
        setPoolTokens(prev => ({ ...prev, tokenB: '0x' + tokenBMatch[1] }));
      }
      
      return 'pool';
    } else {
      setContractType('token');
      return 'token';
    }
  }, []);

  // Funkcja do kompilacji kontraktu
  const compileContract = useCallback(async () => {
    if (!sourceCode.trim()) {
      setCompileError('Kod źródłowy nie może być pusty');
      return;
    }

    setIsCompiling(true);
    setCompileError(null);

    try {
      // Wykryj typ kontraktu
      const type = detectContractType(sourceCode);
      const endpointUrl = type === 'pool' 
        ? `${COMPILER_SERVICE_BASE_URL}/compile-pool` 
        : `${COMPILER_SERVICE_BASE_URL}/compile`;
      
      let requestData = {};
      
      if (type === 'pool') {
        // Wyciągnij nazwę kontraktu z kodu
        const contractNameMatch = sourceCode.match(/contract\s+(\w+)/);
        const contractName = contractNameMatch ? contractNameMatch[1] : 'LiquidityPool';
        
        requestData = {
          sourceCode,
          poolName: contractName,
          tokenA: poolTokens.tokenA,
          tokenB: poolTokens.tokenB
        };
      } else {
        // Dla zwykłego tokena, wyciągamy dane z kodu
        const contractNameMatch = sourceCode.match(/contract\s+(\w+)/);
        const contractName = contractNameMatch ? contractNameMatch[1] : 'Token';
        
        const symbolMatch = sourceCode.match(/string\s+public\s+symbol\s*=\s*['"](\w+)['"]/);
        const symbol = symbolMatch ? symbolMatch[1] : 'TKN';
        
        const totalSupplyMatch = sourceCode.match(/totalSupply\s*=\s*(\d+)/);
        const totalSupply = totalSupplyMatch ? parseInt(totalSupplyMatch[1], 10) : 1000000000;
        
        requestData = {
          sourceCode,
          tokenName: contractName,
          tokenSymbol: symbol,
          totalSupply: totalSupply
        };
      }
      
      console.log(`Compiling ${type} contract:`, requestData);
      
      // Próba kompilacji za pomocą mikrousługi
      const response = await axios.post(endpointUrl, requestData);

      if (response.data && response.data.success) {
        setBytecode(response.data.bytecode);
        setAbi(response.data.abi);
        return {
          success: true,
          bytecode: response.data.bytecode,
          abi: response.data.abi,
          contractType: type,
          ...(type === 'pool' ? { poolTokens: { tokenA: poolTokens.tokenA, tokenB: poolTokens.tokenB }} : {})
        };
      } else {
        throw new Error(response.data.error || 'Nieznany błąd kompilacji');
      }
    } catch (error) {
      console.error('Błąd podczas kompilacji:', error);
      setCompileError(error.message || 'Wystąpił błąd podczas kompilacji');
      return {
        success: false,
        error: error.message
      };
    } finally {
      setIsCompiling(false);
    }
  }, [sourceCode, detectContractType, poolTokens]);

  // Funkcja do ustawiania kodu źródłowego i analizy
  const setSourceCodeWithParsing = useCallback((code) => {
    setSourceCode(code);
    
    // Wykryj typ kontraktu
    detectContractType(code);
  }, [detectContractType]);

  return {
    sourceCode,
    setSourceCode: setSourceCodeWithParsing,
    compileContract,
    bytecode,
    abi,
    isCompiling,
    compileError,
    contractType,
    poolTokens,
    setPoolTokens
  };
}; 