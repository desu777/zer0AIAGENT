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
  const MIN_MAT_BALANCE = ethers.utils.parseUnits("100", 18); // 100 tokenów

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
      
      // Sprawdź czy balans jest większy lub równy MIN_MAT_BALANCE (100 tokenów)
      const hasEnoughMatTokens = balance.gte(MIN_MAT_BALANCE);
      console.log('Has enough MAT tokens (≥100):', hasEnoughMatTokens);
      
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
            
            // Sprawdź posiadanie tokena $MAT
            await checkMatBalance(accounts[0]);
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
        
        // Pierwszy check posiadania tokena $MAT
        console.log("Performing initial MAT balance check...");
        await checkMatBalance(accounts[0]);
        
        // Ustawiamy aby użytkownik mógł kontynuować nawet jeśli sprawdzanie się nie powiedzie
        // Hack tymczasowy
        console.log("TEMPORARY HACK: Setting isMatHolder to true");
        setIsMatHolder(true);
        
        // Drugi check po 5 sekundach, aby dać czas na załadowanie danych
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
        
        // Trzeci check po 10 sekundach dla pewności
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
  const deployContract = useCallback(async (bytecode, abi, constructorArgs = []) => {
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
      setDeploymentStatus({
        step: 1,
        hash: '',
        contractAddress: '',
        error: ''
      });
      
      // Utwórz fabrykę kontraktów
      const factory = new ethers.ContractFactory(abi, bytecode, signer);
      
      // Deploy kontraktu
      const contract = await factory.deploy(...constructorArgs);
      
      setDeploymentStatus({
        step: 2,
        hash: contract.deployTransaction.hash,
        contractAddress: '',
        error: ''
      });
      
      // Czekaj na potwierdzenie
      await contract.deployed();
      
      setDeploymentStatus({
        step: 3,
        hash: contract.deployTransaction.hash,
        contractAddress: contract.address,
        error: ''
      });
      
      return contract;
    } catch (error) {
      console.error('Błąd podczas deployowania kontraktu:', error);
      
      setDeploymentStatus({
        step: 4,
        hash: '',
        contractAddress: '',
        error: error.message || 'Nieznany błąd podczas deployowania'
      });
      
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
    switchToNewtonTestnet,
    deploymentStatus
  };
}; 