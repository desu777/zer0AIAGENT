import { useState, useCallback } from 'react';
import axios from 'axios';

// URL do mikrousługi kompilatora - można zmienić na podstawie konfiguracji
const COMPILER_SERVICE_URL = 'http://localhost:3003/compile';

export const useCompiler = (initialSourceCode = '') => {
  const [sourceCode, setSourceCode] = useState(initialSourceCode);
  const [contractName, setContractName] = useState('ZerryToken');
  const [contractSymbol, setContractSymbol] = useState('ZER0');
  const [totalTokens, setTotalTokens] = useState(1000000000);
  const [isCompiling, setIsCompiling] = useState(false);
  const [bytecode, setBytecode] = useState('');
  const [abi, setAbi] = useState(null);
  const [compileError, setCompileError] = useState(null);

  // Funkcja do kompilacji kontraktu
  const compileContract = useCallback(async () => {
    if (!sourceCode.trim()) {
      setCompileError('Kod źródłowy nie może być pusty');
      return;
    }

    setIsCompiling(true);
    setCompileError(null);

    try {
      // Próba kompilacji za pomocą mikrousługi
      const response = await axios.post(COMPILER_SERVICE_URL, {
        sourceCode,
        tokenName: contractName,
        tokenSymbol: contractSymbol,
        totalSupply: totalTokens
      });

      if (response.data && response.data.success) {
        setBytecode(response.data.bytecode);
        setAbi(response.data.abi);
        return {
          success: true,
          bytecode: response.data.bytecode,
          abi: response.data.abi
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
  }, [sourceCode, contractName, contractSymbol, totalTokens]);

  // Funkcja do ustawiania kodu źródłowego i automatycznej ekstrakcji nazwy i symbolu
  const setSourceCodeWithParsing = useCallback((code) => {
    setSourceCode(code);
    
    // Próba wyciągnięcia nazwy kontraktu
    const contractNameMatch = code.match(/contract\s+(\w+)/);
    if (contractNameMatch && contractNameMatch[1]) {
      setContractName(contractNameMatch[1]);
    }
    
    // Próba wyciągnięcia symbolu
    const symbolMatch = code.match(/string\s+public\s+symbol\s*=\s*['"](\w+)['"]/);
    if (symbolMatch && symbolMatch[1]) {
      setContractSymbol(symbolMatch[1]);
    }
    
    // Próba wyciągnięcia total supply
    const totalSupplyMatch = code.match(/totalSupply\s*=\s*(\d+)/);
    if (totalSupplyMatch && totalSupplyMatch[1]) {
      setTotalTokens(parseInt(totalSupplyMatch[1], 10));
    }
  }, []);

  return {
    sourceCode,
    setSourceCode: setSourceCodeWithParsing,
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
  };
}; 