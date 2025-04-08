import { useState, useCallback } from 'react';
import axios from 'axios';

// URL to compiler microservice
const COMPILER_SERVICE_URL = 'http://localhost:3003';

export const useLiquidityPoolCompiler = () => {
  const [poolSourceCode, setPoolSourceCode] = useState('');
  const [poolName, setPoolName] = useState('SkyBubblesPool');
  const [tokenA, setTokenA] = useState('');
  const [tokenB, setTokenB] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [bytecode, setBytecode] = useState('');
  const [abi, setAbi] = useState(null);
  const [compileError, setCompileError] = useState(null);
  const [approverContract, setApproverContract] = useState(null);
  const [isGeneratingApprover, setIsGeneratingApprover] = useState(false);

  // Function to compile liquidity pool contract
  const compilePool = useCallback(async () => {
    if (!poolSourceCode.trim() && (!tokenA || !tokenB)) {
      setCompileError('Either source code or token addresses must be provided');
      return;
    }

    setIsCompiling(true);
    setCompileError(null);

    try {
      // Compile using microservice
      const response = await axios.post(`${COMPILER_SERVICE_URL}/compile-pool`, {
        poolName,
        tokenA,
        tokenB,
        sourceCode: poolSourceCode.trim() || undefined
      });

      if (response.data && response.data.success) {
        setBytecode(response.data.bytecode);
        setAbi(response.data.abi);
        
        // If source code wasn't provided, set it from response
        if (!poolSourceCode.trim()) {
          setPoolSourceCode(response.data.sourceCode);
        }
        
        return {
          success: true,
          bytecode: response.data.bytecode,
          abi: response.data.abi
        };
      } else {
        throw new Error(response.data.error || 'Unknown compilation error');
      }
    } catch (error) {
      console.error('Error during pool compilation:', error);
      setCompileError(error.message || 'Error during compilation');
      return {
        success: false,
        error: error.message
      };
    } finally {
      setIsCompiling(false);
    }
  }, [poolSourceCode, poolName, tokenA, tokenB]);

  // Function to verify token address
  const verifyToken = useCallback(async (address) => {
    try {
      const response = await axios.post(`${COMPILER_SERVICE_URL}/verify-token`, {
        tokenAddress: address
      });
      
      return response.data;
    } catch (error) {
      console.error('Error verifying token:', error);
      throw error;
    }
  }, []);

  // Function to generate a token approver contract
  const generateApprover = useCallback(async (tokenAddress, spenderAddress, amount, decimals = 18) => {
    if (!tokenAddress || !spenderAddress) {
      setCompileError('Token address and spender address are required');
      return;
    }

    setIsGeneratingApprover(true);
    setCompileError(null);

    try {
      // Generate approver using microservice
      const response = await axios.post(`${COMPILER_SERVICE_URL}/generate-approver`, {
        tokenAddress,
        spenderAddress,
        amount: amount.toString(),
        decimals
      });

      if (response.data && response.data.success) {
        const approverData = {
          sourceCode: response.data.sourceCode,
          bytecode: response.data.bytecode,
          abi: response.data.abi,
          tokenAddress,
          spenderAddress,
          amount
        };
        
        setApproverContract(approverData);
        
        return {
          success: true,
          ...approverData
        };
      } else {
        throw new Error(response.data.error || 'Unknown error generating approver');
      }
    } catch (error) {
      console.error('Error generating token approver:', error);
      setCompileError(error.message || 'Error generating approver');
      return {
        success: false,
        error: error.message
      };
    } finally {
      setIsGeneratingApprover(false);
    }
  }, []);

  return {
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
    generateApprover,
    bytecode,
    abi,
    approverContract,
    isCompiling,
    isGeneratingApprover,
    compileError
  };
}; 