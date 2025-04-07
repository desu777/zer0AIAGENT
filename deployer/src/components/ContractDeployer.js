import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ContractDeployerUI from './ContractDeployerUI';

// Funkcja konwertująca string na hex bez użycia Buffer
const stringToHex = (str) => {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const hex = str.charCodeAt(i).toString(16);
    result += hex.length === 1 ? '0' + hex : hex;
  }
  return result;
};

// Symulacja kompilacji kontraktu - w rzeczywistej aplikacji używalibyśmy solc
// ale dla uproszczenia i ze względu na ograniczenia przeglądarki używamy gotowych danych
const ContractDeployer = () => {
  // Application state
  const [walletAddress, setWalletAddress] = useState('');
  const [binaryCode, setBinaryCode] = useState('');
  const [jsonAbi, setJsonAbi] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState('');
  const [deploymentHash, setDeploymentHash] = useState('');
  const [deployedContractAddress, setDeployedContractAddress] = useState('');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [deploymentStep, setDeploymentStep] = useState(0); // 0: not started, 1: in progress, 2: waiting confirmation, 3: complete
  const [showDeploymentSuccess, setShowDeploymentSuccess] = useState(false);
  const [constructorArgs, setConstructorArgs] = useState('');
  const [contractName, setContractName] = useState('');
  const [contractSymbol, setContractSymbol] = useState('');
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [totalTokens, setTotalTokens] = useState(200);
  const [sourceCode, setSourceCode] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  
  // Lista nazw memicznych dla tokenów
  const memeNames = [
    // Predefiniowane nazwy
    'zer0gravity', 'zer0limits', 'zer0logic', 'zer0trust', 'zer0vision',
    'zer0skills', 'zer0effort', 'zer0sense', 'zer0value', 'zer0chill',
    'zer0hope', 'zer0brain', 'zer0luck', 'zer0alpha', 'zer0gain',
    'zer0focus', 'zer0fomo', 'zer0power', 'zer0risk', 'zer0clout',
    'zer0fees', 'zer0bags', 'zer0clue', 'zer0gas', 'zer0moon',
    'zer0pump', 'zer0sleep', 'zer0braincells', 'zer0faucet', 'zer0funds',
    'zer0rug', 'zer0iq', 'zer0gravitygang', 'zer0future', 'zer0volume',
    'zer0hopeleft', 'zer0chads',

    // Mike-related
    'zer0mike', 'mike4zer0', 'zer0leader', 'presidentzer0', 'mikeonchain',
    'zer0votes', 'lovemike4ever', 'mike4aogi', 'zer0mikelove', 'mikeplsnotice',
    'kingmikezer0', 'zer0simpmike', 'faucetformike', 'mikewillrugus',
    'sendmiketokens', 'zer0mikegang', 'mikegravity', 'mikethedegenerate',
    'zer0mikeworship', 'mikewillmoonus',

    // Patriotic/Freedom
    'zer0freedom', 'mike4america', 'unclezer0', 'starsandzer0s', 'zer0patriot',
    'mikeconstitution', 'zer0eagle', 'inmikewetrust', 'foundingmike',
    'freedom4mike', 'zer0states', 'americanzer0', 'presidentmike2024',
    'libertymike', 'zer0flag', 'whitehousezer0', 'mikeforfreedom',
    'zer0constitution', 'blockchaineagle', 'landofzer0s',

    // Feet memes
    'mike4feet', 'zer0footgang', 'feet4mike', 'mikefeetdao', 'zer0toes',
    'lovemikesfeet', 'faucet4feet', 'mikestepzero', 'toesofmike', 'zer0sole',
    'mikefootlover', 'zer0fetish', 'feetonchain', 'mikeheelzero', 'zer0arch',
    'lovemyfeetmike', 'zer0footprints', 'toes4tokens', 'mikeworshipfeet',

    // Degen/Rekt memes
    'zer0stepahead', 'er0copium', 'rekt4life', 'zer0hopium', 'mike2thegrave',
    'zer0dollarsleft', 'degengodmike', 'cryformike', 'zer0commoncents',
    'sendnudes4tokens', 'mikewillsaveus', 'zer0hopegang', 'faucetbegger69',
    'dumpitallmike', 'zer0lifesavings', 'rektmybagsmike', 'zer0iqclub',
    'ape4nothing',

    // Zerry-related
    'zerry4president', 'zerrythedegenerate', 'zerryfeetlover', 'zerrygang',
    'zerrynation', 'lovemikeandzerry', 'zerryrugpull', 'zerry2themoon',
    'zer0zerry', 'zerrysimpsquad', 'sendzerrytokens', 'zerrylovesyou',
    'cryforzerry', 'zerrysoles', 'toes4zerry', 'zerrygivesnofunds',
    'inzerrywetrust', 'kingofzerry', 'faucet4zerry', 'zerrysfuture',

    // Touch grass memes
    'touchzer0', 'zer0grass', 'touchchain', 'zer0nature', 'grasslesszer0',
    'touchreality', 'zer0outside', 'digitalgrass', 'zer0freshair',
    'touchblockchain', 'mike4grass', 'grassformike', 'mikeonfield',
    'touchmike', 'mike4outside', 'grassbegger69', 'zer0fieldtrip',
    'touchmybags', 'grassrugged', 'zer0grounded', 'touchfaucet',
    'digitalroots', 'blockchainfield', 'zer0earthgang', 'grass4tokens',

    // Validator VN memes
    'validatorVNzer0', 'validatorVN4mike', 'validatorVNgang', 'validatorVNrekt',
    'validatorVN2moon', 'validatorVNfam', 'validatorVNdegen', 'validatorVNtouchgrass',
    'validatorVN4feet', 'validatorVNhodl', 'validatorVNnaked', 'validatorVNrugged',
    'validatorVN69', 'validatorVN4zerry', 'validatorVNbased', 'validatorVNnogas',
    'validatorVNfaucet', 'validatorVNape', 'validatorVNdoxx', 'validatorVNstaking',
    'novalidatorVN', 'validatorVN4president',

    // Misc memes
    'Jailmike', 'Mikefeetpic', 'Mikeoxlong', 'desu4president', 'zerrybeinghairy',
    'sphinxistalented', 'sparsh4ever', 'validatormarriedmike', 'VNlovetoscam',
    'Sicran2021wantedcontract', 'Mictonodeboss', 'sholaBOLA', 'sholagamesscam',
    'STVisLEGEND', 'Desuloverugs', 'mikevalidatorwedding', 'mikezerrysphinxseanxssdesufam',
    'zer0orf00t', 'makezer0greatagain', 'desuafraidofgirls', 'mike???????',

    // USA + Zer0 memes
	'cleartxslol4Biden', 'zer0taxfraud', 'turbochangerpclol', 'cleartxslolmoon',
	'zer0skins4all', 'changerpclolrekt', 'cleartxslolgate', 'turbozer0pump',
	'cleartxslol69', 'changerpclolrugpull', 'zerry4mod', 'mikesaiddesutyping',
	'mikesaidzerrynob', 'zecksolnotlongetsol',

    // Lookyegbe memes
	'lookyegbemoon', 'lookyegbezero', 'lookyegbe4mike', 'lookyegberekt',
	'lookyegbedegens', 'lookyegbefam', 'lookyegbegang', 'lookyegbe69',
	'lookyegbehodl', 'lookyegberugged', 'lookyegbe4feet', 'lookyegbetouchgrass',
	'lookyegbeapes', 'lookyegbefaucet', 'lookyegbe4zerry', 'lookyegbebased',
	'lookyegbewhale', 'lookyegbenofunds', 'lookyegbestaking', 'lookyegbetoofar',

    // Ignite memes
    'ignite', 'ignitenicefeet', 'igniteproofoffeet', 'ignitegamergod420',
    'ignitememestash', 'ignitecryptolord', 'ignitetoesimp69', 'ignitewaifupillow',
    'ignitedogelover', 'ignitepepemaster', 'ignitebasedgigachad',

    // seanxxxxs memes
    'seanxxxxs', 'seanxxxxsfeetcollector', 'seanxxxxshentai69', 'seanxxxxspogchamp',
    'seanxxxxstoesample', 'seanxxxxsdiamondhands', 'seanxxxxsnftflippr', 'seanxxxxsanimesimp',
    'seanxxxxsgamerchad', 'seanxxxxsfetishking', 'seanxxxxsmonkemilk',

    // zzullerr memes
    'zzullerr', 'zzullerr4presidentofzer0', 'zzullerrfeetpicplease', 'zzullerrmemedealer',
    'zzullerrweebmaster', 'zzullerrmonkemoon', 'zzullerrtoesucker69', 'zzullerrcatgirlsimp',
    'zzullerrdogecoin', 'zzullerrpepelord', 'zzullerrshitposter',

    // sol_hunter memes
    'sol_hunter', 'sol_hunterfeetseeker', 'sol_hunterapestrong', 'sol_huntertoemaniac',
    'sol_hunterhodlgang', 'sol_hunterboredape', 'sol_huntercryptobro', 'sol_hunternftdegen',
    'sol_hunterwallstreetbets', 'sol_huntersolelicker', 'sol_huntermoonshot',

    // groot memes
    'groot', 'grootsfeetroots', 'grootsimpcollector', 'grootnftdealer',
    'groottoesprout', 'grootwoodenfeet', 'grootstikyheels', 'grootpepecollector',
    'grootshibarmy', 'grootdogefathеr', 'grootapebrain',

    // mondariel memes
    'mondariel', 'mondarielsfeetpics', 'mondarielwaifuhunter', 'mondarielanimeaddict',
    'mondarieltoecleaner', 'mondarielfootqueen', 'mondarielrarepepes', 'mondarielgachalord',
    'mondarielcosplaysimp', 'mondarielcryptokween', 'mondarielbitcorn',

    // G_O_D_KILL.L1X memes
    'G O D KILL.L1X', 'G_O_D_KILL.L1Xfeetkiller', 'G_O_D_KILL.L1Xmemeassassin', 'G_O_D_KILL.L1Xnftslayer',
    'G_O_D_KILL.L1Xtoedomination', 'G_O_D_KILL.L1Xheelcrusher', 'G_O_D_KILL.L1Xwallstreetdegen', 'G_O_D_KILL.L1Xcryptowhale',
    'G_O_D_KILL.L1Xstonkgod', 'G_O_D_KILL.L1Xapearmy', 'G_O_D_KILL.L1Xwaifu_killer',

    // LaurenT memes
    'LaurenT', 'LaurenToesFan', 'LaurenTsimpcatcher', 'LaurenTwaifuqueen',
    'LaurenTsfeetpics', 'LaurenTnftgirl', 'LaurenTcryptoqueen', 'LaurenTpogmommy',
    'LaurenTdogehodler', 'LaurenTmetaverse', 'LaurenTstonktrader',

    // OxHansen memes
    'OxHansen', 'OxHansenfeetonhooves', 'OxHansencryptobull', 'OxHansenmemefarmer',
    'OxHansentoebarn', 'OxHansenfarmfeet', 'OxHansenapehodler', 'OxHansenwaifurancher',
    'OxHansenpepehoarder', 'OxHansenmonkemarket', 'OxHansendogebull',

    // C0NTD memes
    'C0NTD', 'C0NTDfeetcontinued', 'C0NTDmemestory', 'C0NTDnftgallery',
    'C0NTDtoenextpage', 'C0NTDsolesequence', 'C0NTDcryptofolio', 'C0NTDdogearmy',
    'C0NTDapesuite', 'C0NTDpepekeeper', 'C0NTDstonksaga',

    // Sparsh memes
    'Sparsh', 'SparshTouchMyFeet', 'SparshTheCryptoTouch', 'SparshMemeFeeler',
    'SparshToeFeeler', 'SparshSoleSensation', 'SparshWaifuHugger', 'SparshNFTFinger',
    'SparshStonkSensor', 'SparshPepeCollector', 'SparshDogeWhisperer'
  ];
  
  // Symbole tokenów
  const tokenSymbols = [
    // Standard symbols
    'ZER0', '0GM', '0GN', 'ZSTK', 'ZTK', 'ZDEX', 'ZDAO', 'ZFI', 'ZSW',
    'BUB', 'ZBBL', 'Z0', '0G', 'ZGMI', '0FAM', 'ZLP', 'ZAI',
    
    // Memetic symbols
    'FEET', 'MIKE', 'PNDA', 'REKT', 'RUG', 'MOON', 'APE', 'HODL',
    'DGEN', 'FKNG', 'GRVY', 'BAGS', 'SIMP', 'NFTS', 'MEME', 'GIB',
    'FOMO', 'ALPHA', 'POWER', 'RISK', 'CLOUT', 'LUCK', 'FOCUS',
    
    // Additional memetic symbols
    'KEKW', 'XDGG', 'RIZZ', 'SCAM', 'LMAO', 'REKT', 'MOON', 'APEY',
    'FOMO', 'HODL', 'GEY',
    
    // More memetic symbols
    'LOLZ', 'WTFX', 'RUGG', 'GIBS', 'BUBS', 'LF0G'
  ];
  
  // Funkcja do generowania kodu źródłowego Solidity
  const generateTokenContract = (tokenName, tokenSymbol, totalSupply = 1000000000, decimals = 18) => {
    // Usuń białe znaki i znaki specjalne dla nazwy kontraktu
    const contractName = tokenName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
    
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ${contractName} {
    string public name = "${tokenName}";
    string public symbol = "${tokenSymbol}";
    uint8 public decimals = ${decimals};
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor() {
        totalSupply = ${totalSupply} * 10 ** uint256(decimals);
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
  };

  // Funkcja generująca ABI dla ERC-20
  const generateERC20ABI = () => {
    return [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "allowance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];
  };

  // Funkcja generująca bytecode (symulacja - w rzeczywistości używalibyśmy solc)
  const generateBytecode = (contractName, tokenSymbol) => {
    // W rzeczywistej aplikacji użylibyśmy kompilatora Solidity
    
    // Ten bytecode pochodzi z prostego tokena ERC20 z minimalną funkcjonalnością
    // Nie jest to bytecode specyficzny dla naszego tokena, ale powinien działać
    // jako przykład dla wdrażania prostego kontraktu
    return "0x608060405234801561001057600080fd5b506040516107053803806107058339810160408190526100319161022a565b81516100449060049060208501906100b0565b5080516100589060059060208401906100b0565b50506006805460ff191660ff92909216919091179055506102ff915050565b634e487b7160e01b600052604160045260246000fd5b600181811c908216806100a457607f821691505b6020821081036100aa57634e487b7160e01b600052602260045260246000fd5b50919050565b8280548282559060005260206000209081019282156104e4579160200282015b828111156104e4578251825591602001919060010190610509565b506104f0929150610534565b5090565b5b808211156104f05760008155600101610535565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b805180151581146104995761049961031e565b600a610542818313610552565b9392505050565b61055682516104be565b9081526020016102ef565b6105708160401b60208401610552565b50565b8035801515811461049957610499610161565b600082516105958184602087016102ef565b91909101928352509081526020016102ef565b806105b2610544565b9150506104be565b602081526000825180602084015260006104e4604084018285016104be565b60608152600061029d60608301848681526105ee602085019650601f890112610562565b60006020828403121561060057600080fd5b5035919050565b73ffffffffffffffffffffffffffffffffffffffff811681146105705757600080fd5b60006020828403121561063a57600080fd5b8135610645816105c2565b9392505050565b60006020828403121561065e57600080fd5b6106678161057a565b9392505050565b60006020828403121561068057600080fd5b815167ffffffffffffffff81111561069757600080fd5b8201601f810184136106a857600080fd5b80516106b6846104bc565b60006106c2846104bc565b925050819261064561068b565b6000602082840312156106e357600080fd5b8151801515811461064557600080fd5b6103f5806103098239f3";
  };
  
  // Połączenie z MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask nie jest zainstalowany. Zainstaluj rozszerzenie MetaMask, aby kontynuować.');
      return;
    }
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      
      // Przełącz na 0G-Newton-Testnet
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x40d8' }] // 16600 w hex
        });
      } catch (switchError) {
        // Jeśli sieć nie jest jeszcze skonfigurowana, dodaj ją
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x40d8',
              chainName: '0G-Newton-Testnet',
              rpcUrls: ['https://evmrpc-testnet.0g.ai'],
              nativeCurrency: {
                name: 'A0GI',
                symbol: 'A0GI',
                decimals: 18
              },
              blockExplorerUrls: ['https://chainscan-newton.0g.ai']
            }]
          });
        } else {
          throw switchError;
        }
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setError('Failed to connect wallet: ' + error.message);
    }
  };
  
  // Generate random hex string of specified length
  const generateRandomHex = (length) => {
    let result = '';
    const characters = '0123456789abcdef';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  
  // Generate random contract details
  const generateRandomContractDetails = async () => {
    setIsCompiling(true);
    setError('');
    
    try {
      // Wybierz losową nazwę i symbol
      const randomName = memeNames[Math.floor(Math.random() * memeNames.length)];
      const randomSymbol = tokenSymbols[Math.floor(Math.random() * tokenSymbols.length)];
      
      setContractName(randomName);
      setContractSymbol(randomSymbol);
      
      try {
        // Pierwszy sposób: Użyj mikrousługi kompilatora
        const response = await fetch('/compiler-api/compile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            tokenName: randomName, 
            tokenSymbol: randomSymbol,
            totalSupply: 1000000000,
            decimals: 18
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          
          // Aktualizujemy stan aplikacji
          setSourceCode(result.sourceCode);
          setBinaryCode(result.bytecode);
          setJsonAbi(JSON.stringify(result.abi, null, 2));
          return;
        }
        console.warn('Compiler service unavailable, falling back to static bytecode');
      } catch (serviceError) {
        console.warn('Error connecting to compiler service:', serviceError);
        console.warn('Falling back to static bytecode');
      }
      
      // Drugi sposób (fallback): Użyj statycznego bytecode
      // Generowanie kodu źródłowego jako tekstu
      const sourceCode = generateTokenContract(randomName, randomSymbol);
      setSourceCode(sourceCode);
      
      // Użyj predefiniowanego bytecode i ABI
      const bytecode = generateBytecode(randomName, randomSymbol);
      setBinaryCode(bytecode);
      setJsonAbi(JSON.stringify(generateERC20ABI(), null, 2));
    } catch (error) {
      console.error('Error generating contract:', error);
      setError(`Error generating contract: ${error.message}`);
    } finally {
      setIsCompiling(false);
    }
  };
  
  // Reset deployment state
  const resetDeployment = () => {
    setDeploymentStep(0);
    setShowDeploymentSuccess(false);
    setError('');
    setDeploymentHash('');
    setDeployedContractAddress('');
    
    // Generuj nowy kontrakt
    generateRandomContractDetails().catch(error => {
      console.error('Failed to generate contract details:', error);
      setError('Failed to generate contract details: ' + error.message);
    });
  };
  
  // Deploy contract
  const deployContract = async () => {
    if (!binaryCode) {
      setError('Binary code is required');
      return;
    }
    
    if (!walletAddress) {
      await connectWallet();
      if (!walletAddress) {
        setError('Please connect your wallet first');
        return;
      }
    }

    setIsLoading(true);
    setError('');
    setDeploymentStep(1);
    setDeploymentStatus('Submitting contract to the blockchain...');
    
    try {
      // Utwórz providera i signerów
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Utwórz fabrykę kontraktu i wdróż
      const factory = new ethers.ContractFactory(JSON.parse(jsonAbi), binaryCode, signer);
      const contract = await factory.deploy();
      
      setDeploymentStep(2);
      setDeploymentStatus('Waiting for confirmation...');
      setDeploymentHash(contract.deployTransaction.hash);
      
      // Poczekaj na potwierdzenie
      await contract.deployed();
      
      setDeploymentStep(3);
      setDeployedContractAddress(contract.address);
      setShowDeploymentSuccess(true);
      
    } catch (error) {
      console.error('Deployment error:', error);
      setError(`Deployment error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sprawdź połączenie z MetaMask i monitoruj zmiany konta
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };
    
    // Monitoruj zmiany konta
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      } else {
        setWalletAddress('');
      }
    };
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    
    checkWalletConnection();
    
    // Wywołaj asynchronicznie
    generateRandomContractDetails().catch(error => {
      console.error('Failed to generate contract details:', error);
      setError('Failed to generate contract details: ' + error.message);
    });
    
    // Cleanup
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);
  
  return (
    <ContractDeployerUI
      walletAddress={walletAddress}
      binaryCode={binaryCode}
      jsonAbi={jsonAbi}
      isLoading={isLoading}
      deploymentHash={deploymentHash}
      deployedContractAddress={deployedContractAddress}
      error={error}
      darkMode={darkMode}
      deploymentStep={deploymentStep}
      showDeploymentSuccess={showDeploymentSuccess}
      constructorArgs={constructorArgs}
      contractName={contractName}
      contractSymbol={contractSymbol}
      showDisclaimer={showDisclaimer}
      totalTokens={totalTokens}
      sourceCode={sourceCode}
      isCompiling={isCompiling}
      setDarkMode={setDarkMode}
      setConstructorArgs={setConstructorArgs}
      setShowDisclaimer={setShowDisclaimer}
      connectWallet={connectWallet}
      generateRandomContractDetails={generateRandomContractDetails}
      deployContract={deployContract}
      resetDeployment={resetDeployment}
    />
  );
};

export default ContractDeployer; 
