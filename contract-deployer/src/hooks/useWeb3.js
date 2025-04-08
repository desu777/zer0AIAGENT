import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

// ABI dla podstawowych funkcji ERC20 (potrzebny tylko balanceOf)
const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{ "name": "owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "", "type": "uint256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  // Dodajemy funkcję approve do ABI
  {
    "constant": false,
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "name": "", "type": "bool" }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Dodajemy funkcję allowance do ABI
  {
    "constant": true,
    "inputs": [
      { "name": "owner", "type": "address" },
      { "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "name": "", "type": "uint256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

// Adres tokena $MAT
const MAT_TOKEN_ADDRESS = '0x061325649c085e6e4f2e322774ca83008017b4f8';

export const useWeb3 = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isMatHolder, setIsMatHolder] = useState(false);
  const [isCheckingMatBalance, setIsCheckingMatBalance] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState({
    step: 0, // 0: not started, 1: deploying, 2: confirming, 3: completed, 4: error
    hash: '',
    contractAddress: '',
    error: ''
  });

  // Min $MAT
  const MIN_MAT_BALANCE = ethers.utils.parseUnits("100000", 18); // 100,000 tokenów

  // Sprawdzenie balansu tokena $MAT
  const checkMatBalance = useCallback(async (address) => {
    if (!provider || !address) return false;
    
    setIsCheckingMatBalance(true);
    console.log('Checking MAT balance for address:', address);
    console.log('Using MAT token address:', MAT_TOKEN_ADDRESS);
    console.log('Minimum required MAT balance:', ethers.utils.formatEther(MIN_MAT_BALANCE));
    
    try {
      // Utwórz instancję kontraktu tokena $MAT
      const matTokenContract = new ethers.Contract(
        MAT_TOKEN_ADDRESS,
        ERC20_ABI,
        provider
      );
      
      // Sprawdź balans tokena $MAT dla danego adresu
      const balance = await matTokenContract.balanceOf(address);
      
      console.log('$MAT Balance (raw):', balance.toString());
      console.log('$MAT Balance (formatted):', ethers.utils.formatEther(balance));
      
      // Sprawdź czy balans jest większy lub równy MIN_MAT_BALANCE (100,000 tokenów)
      const hasEnoughMatTokens = balance.gte(MIN_MAT_BALANCE);
      console.log('Has enough MAT tokens (≥100,000):', hasEnoughMatTokens);
      
      setIsMatHolder(hasEnoughMatTokens);
      return hasEnoughMatTokens;
    } catch (error) {
      console.error('Błąd podczas sprawdzania balansu $MAT:', error);
      setIsMatHolder(false);
      return false;
    } finally {
      setIsCheckingMatBalance(false);
    }
  }, [provider]);

  // Inicjalizacja providera, jeśli dostępny jest window.ethereum
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(web3Provider);
          
          // Sprawdź, czy użytkownik jest już połączony
          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            const currentSigner = web3Provider.getSigner();
            setSigner(currentSigner);
            setWalletAddress(accounts[0]);
            setIsConnected(true);
            
            // Pobierz chainId i balance
            const network = await web3Provider.getNetwork();
            setChainId(network.chainId);
            
            const bal = await web3Provider.getBalance(accounts[0]);
            setBalance(ethers.utils.formatEther(bal));
            console.log("Native token balance:", ethers.utils.formatEther(bal));
            
            // Domyślnie ustawiamy isMatHolder na false
            setIsMatHolder(false);
            
            // Pierwszy check posiadania tokena $MAT - informacyjnie w konsoli
            console.log("Performing initial MAT balance check...");
            await checkMatBalance(accounts[0]);
            
            // Pierwszy właściwy check po 5 sekundach
            setTimeout(async () => {
              console.log("Performing delayed MAT balance check (after 5s)...");
              try {
                const matTokenContract = new ethers.Contract(
                  MAT_TOKEN_ADDRESS,
                  ERC20_ABI,
                  web3Provider
                );
                const balance = await matTokenContract.balanceOf(accounts[0]);
                console.log('$MAT Balance after 5s:', ethers.utils.formatEther(balance));
                const hasEnoughMatTokens = balance.gte(MIN_MAT_BALANCE);
                setIsMatHolder(hasEnoughMatTokens);
              } catch (error) {
                console.error("Error in delayed check:", error);
              }
            }, 5000);
            
            // Drugi, potwierdzający check po 10 sekundach
            setTimeout(async () => {
              console.log("Performing final MAT balance check (after 10s)...");
              try {
                const matTokenContract = new ethers.Contract(
                  MAT_TOKEN_ADDRESS,
                  ERC20_ABI,
                  web3Provider
                );
                const balance = await matTokenContract.balanceOf(accounts[0]);
                console.log('$MAT Balance after 10s:', ethers.utils.formatEther(balance));
                const hasEnoughMatTokens = balance.gte(MIN_MAT_BALANCE);
                setIsMatHolder(hasEnoughMatTokens);
              } catch (error) {
                console.error("Error in final check:", error);
              }
            }, 10000);
          }
        } catch (error) {
          console.error('Błąd inicjalizacji Web3:', error);
        }
      }
    };
    
    init();
    
    // Nasłuchiwanie na zmiany konta
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
        } else {
          setWalletAddress('');
          setIsConnected(false);
          setSigner(null);
        }
      });
      
      // Nasłuchiwanie na zmiany sieci
      window.ethereum.on('chainChanged', async () => {
        window.location.reload();
      });
    }
    
    return () => {
      // Czyszczenie listenerów
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);
  
  // Funkcja do łączenia z portfelem
  const connect = useCallback(async () => {
    if (!window.ethereum) {
      alert('Zainstaluj MetaMask, aby móc korzystać z tej aplikacji');
      return false;
    }
    
    try {
      console.log("Connecting wallet...");
      // Żądanie dostępu do konta
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        console.log("Wallet connected:", accounts[0]);
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const currentSigner = web3Provider.getSigner();
        
        setProvider(web3Provider);
        setSigner(currentSigner);
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        
        // Pobierz chainId i balance
        const network = await web3Provider.getNetwork();
        setChainId(network.chainId);
        console.log("Network:", network.name, "ChainId:", network.chainId);
        
        const bal = await web3Provider.getBalance(accounts[0]);
        setBalance(ethers.utils.formatEther(bal));
        console.log("Native token balance:", ethers.utils.formatEther(bal));
        
        // Domyślnie ustawiamy isMatHolder na false
        setIsMatHolder(false);
        
        // Pierwszy check posiadania tokena $MAT - informacyjnie w konsoli
        console.log("Performing initial MAT balance check...");
        await checkMatBalance(accounts[0]);
        
        // Pierwszy właściwy check po 5 sekundach
        setTimeout(async () => {
          console.log("Performing delayed MAT balance check (after 5s)...");
          try {
            const matTokenContract = new ethers.Contract(
              MAT_TOKEN_ADDRESS,
              ERC20_ABI,
              web3Provider
            );
            const balance = await matTokenContract.balanceOf(accounts[0]);
            console.log('$MAT Balance after 5s:', ethers.utils.formatEther(balance));
            const hasEnoughMatTokens = balance.gte(MIN_MAT_BALANCE);
            setIsMatHolder(hasEnoughMatTokens);
          } catch (error) {
            console.error("Error in delayed check:", error);
          }
        }, 5000);
        
        // Drugi, potwierdzający check po 10 sekundach
        setTimeout(async () => {
          console.log("Performing final MAT balance check (after 10s)...");
          try {
            const matTokenContract = new ethers.Contract(
              MAT_TOKEN_ADDRESS,
              ERC20_ABI,
              web3Provider
            );
            const balance = await matTokenContract.balanceOf(accounts[0]);
            console.log('$MAT Balance after 10s:', ethers.utils.formatEther(balance));
            const hasEnoughMatTokens = balance.gte(MIN_MAT_BALANCE);
            setIsMatHolder(hasEnoughMatTokens);
          } catch (error) {
            console.error("Error in final check:", error);
          }
        }, 10000);
        
        return true;
      }
    } catch (error) {
      console.error('Błąd podczas łączenia z portfelem:', error);
      return false;
    }
    
    return false;
  }, [checkMatBalance]);
  
  // Funkcja do deployowania kontraktu
  const deployContract = useCallback(async (bytecode, abi, constructorArgs = [], contractInfo = {}) => {
    if (!signer) {
      setDeploymentStatus({
        step: 4,
        error: 'Nie połączono z portfelem',
        hash: '',
        contractAddress: ''
      });
      return null;
    }
    
    try {
      const contractType = contractInfo.contractType || 'token';
      console.log('Contract info at deployment start:', contractInfo);
      
      // Zapisz typ kontraktu w stanie na samym początku procesu
      setDeploymentStatus({
        step: 1,
        hash: '',
        contractAddress: '',
        error: '',
        contractType: contractType,
        ...(contractType === 'pool' ? { poolTokens: contractInfo.poolTokens } : {})
      });
      
      // Dla pool kontraktów nie przekazujemy argumentów (ponieważ są hardcoded w kodzie)
      const finalArgs = contractType === 'pool' ? [] : constructorArgs;
      
      console.log(`Deploying ${contractType} contract with args:`, finalArgs);
      
      // Utwórz fabrykę kontraktów
      const factory = new ethers.ContractFactory(abi, bytecode, signer);
      
      // Deploy kontraktu
      const contract = await factory.deploy(...finalArgs);
      
      // Aktualizuj status, zachowując typ kontraktu
      setDeploymentStatus(prev => ({
        ...prev,
        step: 2,
        hash: contract.deployTransaction.hash,
        contractAddress: ''
      }));
      
      // Czekaj na potwierdzenie
      await contract.deployed();
      
      // Aktualizuj status, zachowując typ kontraktu i tokeny
      setDeploymentStatus(prev => ({
        ...prev,
        step: 3,
        hash: contract.deployTransaction.hash,
        contractAddress: contract.address
      }));
      
      // Jeśli to jest pool kontrakt, dodaj dodatkowe informacje
      if (contractType === 'pool' && contractInfo.poolTokens) {
        console.log('Pool deployed, tokens:', contractInfo.poolTokens);
      }
      
      return contract;
    } catch (error) {
      console.error('Błąd podczas deployowania kontraktu:', error);
      
      setDeploymentStatus(prev => ({
        ...prev,
        step: 4,
        hash: '',
        contractAddress: '',
        error: error.message || 'Nieznany błąd podczas deployowania'
      }));
      
      return null;
    }
  }, [signer]);
  
  // Funkcja do przełączania sieci na Newton Testnet
  const switchToNewtonTestnet = useCallback(async () => {
    if (!window.ethereum) return false;
    
    const NEWTON_TESTNET_CHAIN_ID = '0x40d8'; // 16600 w hex
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NEWTON_TESTNET_CHAIN_ID }],
      });
      return true;
    } catch (switchError) {
      // Jeśli sieć nie istnieje w MetaMasku, dodaj ją
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: NEWTON_TESTNET_CHAIN_ID,
                chainName: '0G-Newton-Testnet',
                nativeCurrency: {
                  name: 'AOGI',
                  symbol: 'AOGI',
                  decimals: 18
                },
                rpcUrls: ['https://evmrpc-testnet.0g.ai'],
                blockExplorerUrls: ['https://testnet.0g.ai']
              }
            ],
          });
          return true;
        } catch (addError) {
          console.error('Błąd podczas dodawania sieci Newton Testnet:', addError);
          return false;
        }
      }
      console.error('Błąd podczas przełączania sieci:', switchError);
      return false;
    }
  }, []);
  
  // Funkcja do odłączania portfela
  const disconnect = useCallback(() => {
    setWalletAddress('');
    setIsConnected(false);
    setSigner(null);
    setProvider(null);
    setChainId(null);
    setBalance(null);
    setIsMatHolder(false);
    
    // Nie można wywołać disconnect na poziomie MetaMaska/Web3,
    // ale możemy wyczyścić stany aplikacji
    console.log('Wallet disconnected from application');
    return true;
  }, []);
  
  // Funkcja do zatwierdzania tokenów dla kontraktu puli
  const approveTokensForPool = useCallback(async (tokenAddress, poolAddress, amount) => {
    if (!signer) {
      console.error("Wallet not connected");
      return { success: false, error: "Wallet not connected" };
    }
    
    try {
      console.log(`Approving token ${tokenAddress} for pool ${poolAddress} with amount ${amount}`);
      
      // Utwórz instancję kontraktu tokena
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        signer
      );
      
      // Konwertuj kwotę na dużą liczbę (uwzględniając 18 decimals)
      const amountBN = ethers.utils.parseUnits(amount.toString(), 18);
      
      console.log(`Approving ${ethers.utils.formatEther(amountBN)} tokens from ${walletAddress} to pool address ${poolAddress}`);
      
      // Wywołaj funkcję approve
      const tx = await tokenContract.approve(poolAddress, amountBN);
      
      console.log("Approval transaction sent:", tx.hash);
      
      // Poczekaj na potwierdzenie transakcji
      const receipt = await tx.wait();
      
      console.log("Approval transaction confirmed:", receipt);
      
      return { 
        success: true, 
        hash: tx.hash,
        receipt
      };
    } catch (error) {
      console.error("Error approving tokens:", error);
      return { 
        success: false, 
        error: error.message || "Error approving tokens"
      };
    }
  }, [signer, walletAddress]);
  
  // Funkcja do dodawania płynności do puli
  const addLiquidity = useCallback(async (poolAddress, amountA, amountB) => {
    if (!signer) {
      console.error("Wallet not connected");
      return { success: false, error: "Wallet not connected" };
    }
    
    try {
      console.log(`Adding liquidity to pool ${poolAddress}: Token A: ${amountA}, Token B: ${amountB}`);
      
      // Minimalny ABI dla funkcji addLiquidity
      const POOL_ABI = [
        {
          "inputs": [
            { "name": "amountA", "type": "uint256" },
            { "name": "amountB", "type": "uint256" }
          ],
          "name": "addLiquidity",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];
      
      // Utwórz instancję kontraktu puli
      const poolContract = new ethers.Contract(
        poolAddress,
        POOL_ABI,
        signer
      );
      
      // Konwertuj kwoty na duże liczby (uwzględniając 18 decimals)
      const amountABN = ethers.utils.parseUnits(amountA.toString(), 18);
      const amountBBN = ethers.utils.parseUnits(amountB.toString(), 18);
      
      console.log(`Adding ${ethers.utils.formatEther(amountABN)} of Token A and ${ethers.utils.formatEther(amountBBN)} of Token B to pool ${poolAddress}`);
      
      // Wywołaj funkcję addLiquidity
      const tx = await poolContract.addLiquidity(amountABN, amountBBN);
      
      console.log("Add liquidity transaction sent:", tx.hash);
      
      // Poczekaj na potwierdzenie transakcji
      const receipt = await tx.wait();
      
      console.log("Add liquidity transaction confirmed:", receipt);
      
      return { 
        success: true, 
        hash: tx.hash,
        receipt
      };
    } catch (error) {
      console.error("Error adding liquidity:", error);
      return { 
        success: false, 
        error: error.message || "Error adding liquidity"
      };
    }
  }, [signer]);
  
  return {
    provider,
    signer,
    walletAddress,
    isConnected,
    chainId,
    balance,
    isMatHolder,
    isCheckingMatBalance,
    checkMatBalance,
    connect,
    disconnect,
    deployContract,
    approveTokensForPool,
    addLiquidity,
    switchToNewtonTestnet,
    deploymentStatus
  };
}; 