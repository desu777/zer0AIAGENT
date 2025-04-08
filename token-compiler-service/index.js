const express = require('express');
const cors = require('cors');
const solc = require('solc');
const fs = require('fs');

// Lista gotowych nazw tokenów
const predefinedTokenNames = [
    "zer0gravity", "zer0limits", "zer0logic", "zer0trust", "zer0vision",
    "zer0skills", "zer0effort", "zer0sense", "zer0value", "zer0chill",
    "zer0hope", "zer0brain", "zer0luck", "zer0alpha", "zer0gain",
    "zer0focus", "zer0fomo", "zer0power", "zer0risk", "zer0clout",
    "zer0fees", "zer0bags", "zer0clue", "zer0gas", "zer0moon",
    "zer0pump", "zer0sleep", "zer0braincells", "zer0faucet", "zer0funds",
    "zer0rug", "zer0iq", "zer0gravitygang", "zer0future", "zer0volume",
    "zer0hopeleft", "zer0chads", "zer0mike", "mike4zer0", "zer0leader",
    "presidentzer0", "mikeonchain", "zer0votes", "lovemike4ever", "mike4aogi",
    "zer0mikelove", "mikeplsnotice", "kingmikezer0", "zer0simpmike", "faucetformike",
    "mikewillrugus", "sendmiketokens", "zer0mikegang", "mikegravity", "mikethedegenerate",
    "zer0mikeworship", "mikewillmoonus", "zer0freedom", "mike4america", "unclezer0",
    "starsandzer0s", "zer0patriot", "mikeconstitution", "zer0eagle", "inmikewetrust",
    "foundingmike", "freedom4mike", "zer0states", "americanzer0", "presidentmike2024",
    "libertymike", "zer0flag", "whitehousezer0", "mikeforfreedom", "zer0constitution",
    "blockchaineagle", "landofzer0s", "mike4feet", "zer0footgang", "feet4mike",
    "mikefeetdao", "zer0toes", "lovemikesfeet", "faucet4feet", "mikestepzero",
    "toesofmike", "zer0sole", "mikefootlover", "zer0fetish", "feetonchain",
    "mikeheelzero", "zer0arch", "lovemyfeetmike", "zer0footprints", "toes4tokens",
    "mikeworshipfeet", "zer0stepahead", "er0copium", "rekt4life", "zer0hopium",
    "mike2thegrave", "zer0dollarsleft", "degengodmike", "cryformike", "zer0commoncents",
    "sendnudes4tokens", "mikewillsaveus", "zer0hopegang", "faucetbegger69", "dumpitallmike",
    "zer0lifesavings", "rektmybagsmike", "zer0iqclub", "ape4nothing", "zerry4president",
    "zerrythedegenerate", "zerryfeetlover", "zerrygang", "zerrynation", "lovemikeandzerry",
    "zerryrugpull", "zerry2themoon", "zer0zerry", "zerrysimpsquad", "sendzerrytokens",
    "zerrylovesyou", "cryforzerry", "zerrysoles", "toes4zerry", "zerrygivesnofunds",
    "inzerrywetrust", "kingofzerry", "faucet4zerry", "zerrysfuture", "touchzer0",
    "zer0grass", "touchchain", "zer0nature", "grasslesszer0", "touchreality",
    "zer0outside", "digitalgrass", "zer0freshair", "touchblockchain", "mike4grass",
    "grassformike", "mikeonfield", "touchmike", "mike4outside", "grassbegger69",
    "zer0fieldtrip", "touchmybags", "grassrugged", "zer0grounded", "touchfaucet",
    "digitalroots", "blockchainfield", "zer0earthgang", "grass4tokens", "Jailmike",
    "Mikefeetpic", "Mikeoxlong", "desu4president", "zerrybeinghairy", "sphinxistalented",
    "sparsh4ever", "validatormarriedmike", "VNlovetoscam", "Sicran2021wantedcontract",
    "Mictonodeboss", "sholaBOLA", "sholagamesscam", "STVisLEGEND", "Desuloverugs",
    "validatorVNzer0", "validatorVN4mike", "validatorVNgang", "validatorVNrekt",
    "validatorVN2moon", "validatorVNfam", "validatorVNdegen", "validatorVNtouchgrass",
    "validatorVN4feet", "validatorVNhodl", "validatorVNnaked", "validatorVNrugged",
    "validatorVN69", "validatorVN4zerry", "validatorVNbased", "validatorVNnogas",
    "validatorVNfaucet", "validatorVNape", "validatorVNdoxx", "validatorVNstaking",
    "novalidatorVN", "validatorVN4president"
];

// Komponenty do generowania nazw
const nameOptions = [
    // Standard zer0 ecosystem names
    'Zer0', 'ZStake', '0GM', '0GN', 'Zer0FAM', 'LoveZer0', 'Zer0Swap',
    '0G', '0GProtocol', 'Zer0DEX', 'Zer0Chain', 'Zer0DAO', 'Zer0Node',
    'BubblesDAO', 'ZAI', 'Zer0AI', 'ApeZer0', 'Zer0Frens',
    'WAGMI0', 'GmZer0', 'Zer0Exchange', 'BullishZer0', 'Zer0Pulse',
    'Zer0Labs', 'Zer0Pay', 'Zer0Finance', 'Zer0Bank', 'ZToken',
    
    // First batch of memetic community names
    'zer0verse', 'gravity0', 'fam0us', 'zer0cool', 'orbitMike', 'panda0g',
    'zer0hub', 'aogi4life', 'cosmiczer0', 'lovelyMike', 'zeronauts',
    'astro0g', 'zer0flow', 'mikeonchain', 'faucetking', 'beggerz0g',
    'zerryfam', 'zeroedout', 'feet4dex', 'mikegravity', '0Feet',
    'rekt0fam', 'zer0hope', 'pumpndump', 'bagholder69', 'moonboi',
    'rugpuller', 'ape4life', 'hodlmyfeet', 'zer0bags', 'faucetlord'
];

const suffixOptions = [
    'Token', 'Coin', 'DEX', 'DAO', 'Protocol', 'Exchange', 'Finance',
    'Pay', 'Swap', 'Network', 'Chain', 'Node', 'Gem', 'Capital',
    'Meme', 'Degen', 'Rekt', 'Moon', 'Rug', 'Ape', 'HODL', 'Bag',
    'Feet', 'Panda', 'Mike', 'Gravity', 'Verse', 'Pump', 'Dump'
];

const symbolOptions = [
    // Standard symbols
    'ZER0', '0GM', '0GN', 'ZSTK', 'ZTK', 'ZDEX', 'ZDAO', 'ZFI', 'ZSW',
    'BUB', 'ZBBL', 'Z0', '0G', 'ZGMI', '0FAM', 'ZLP', 'ZAI',
    
    // Memetic symbols
    'FEET', 'MIKE', 'PNDA', 'REKT', 'RUG', 'MOON', 'APE', 'HODL',
    'DGEN', 'FKNG', 'GRVY', 'BAGS', 'SIMP', 'NFTS', 'MEME', 'GIB',
    'FOMO', 'ALPHA', 'POWER', 'RISK', 'CLOUT', 'LUCK', 'FOCUS'
];

// Funkcja generująca nazwę tokena
function generateTokenName() {
    // 50% szans na użycie predefiniowanej nazwy
    if (Math.random() < 0.5) {
        return predefinedTokenNames[Math.floor(Math.random() * predefinedTokenNames.length)];
    }
    
    // 50% szans na wygenerowanie nazwy z komponentów
    const baseName = nameOptions[Math.floor(Math.random() * nameOptions.length)];
    
    // 30% szans na dodanie suffiksu
    if (Math.random() < 0.3) {
        const suffix = suffixOptions[Math.floor(Math.random() * suffixOptions.length)];
        return baseName + suffix;
    }
    
    return baseName;
}

// Funkcja generująca symbol tokena
function generateTokenSymbol() {
    return symbolOptions[Math.floor(Math.random() * symbolOptions.length)];
}

const app = express();
const PORT = process.env.PORT || 3003;

// Włączenie parsowania JSON i CORS
app.use(express.json());
app.use(cors());

// Generowanie szablonu kontraktu ERC-20
function generateTokenContract(tokenName, tokenSymbol, totalSupply = 1000000000, decimals = 18) {
  // Usuń białe znaki i znaki specjalne dla nazwy kontraktu
  const contractName = tokenName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
  
  return `// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

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
}

// Kompilacja kontraktu Solidity
function compileContract(sourceCode, contractName) {
  try {
    // Przygotuj input dla kompilatora solc
    const input = {
      language: 'Solidity',
      sources: {
        'token.sol': {
          content: sourceCode
        }
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['abi', 'evm.bytecode']
          }
        },
        optimizer: {
          enabled: true,
          runs: 200
        },
        evmVersion: 'berlin'
      }
    };
    
    // Kompilacja
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    // Sprawdź błędy
    if (output.errors) {
      const criticalErrors = output.errors.filter(error => error.severity === 'error');
      if (criticalErrors.length > 0) {
        throw new Error(criticalErrors.map(error => error.formattedMessage).join('\n'));
      }
    }
    
    // Pobierz skompilowane dane
    const contractOutput = output.contracts['token.sol'][contractName];
    
    return {
      bytecode: '0x' + contractOutput.evm.bytecode.object,
      abi: contractOutput.abi
    };
  } catch (error) {
    console.error('Compilation error:', error);
    throw error;
  }
}

// ==================== LIQUIDITY POOL FUNCTIONALITY (NEW) ====================

// Generate liquidity pool contract
function generateLiquidityPoolContract(poolName, tokenA, tokenB) {
  const contractName = poolName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
  
  return `// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract ${contractName} {
    address public owner;
    IERC20 public tokenA; // First token
    IERC20 public tokenB; // Second token
    
    uint256 public reserveA;
    uint256 public reserveB;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        // Używamy konwersji string na adres, aby uniknąć problemów z checksumem
        tokenA = IERC20(${tokenA});
        tokenB = IERC20(${tokenB});
    }

    // Add liquidity (only owner)
    function addLiquidity(uint256 amountA, uint256 amountB) external onlyOwner {
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);
        reserveA += amountA;
        reserveB += amountB;
    }

    // Swap TokenA for TokenB
    function swapAforB(uint256 amountIn) external {
        require(amountIn > 0, "Amount must be greater than 0");
        
        uint256 amountOut = (reserveB * amountIn) / (reserveA + amountIn);
        
        tokenA.transferFrom(msg.sender, address(this), amountIn);
        tokenB.transfer(msg.sender, amountOut);
        
        reserveA += amountIn;
        reserveB -= amountOut;
    }

    // Swap TokenB for TokenA
    function swapBforA(uint256 amountIn) external {
        require(amountIn > 0, "Amount must be greater than 0");
        
        uint256 amountOut = (reserveA * amountIn) / (reserveB + amountIn);
        
        tokenB.transferFrom(msg.sender, address(this), amountIn);
        tokenA.transfer(msg.sender, amountOut);
        
        reserveB += amountIn;
        reserveA -= amountOut;
    }

    // Remove liquidity (only owner)
    function removeLiquidity(uint256 amountA, uint256 amountB) external onlyOwner {
        require(amountA <= reserveA && amountB <= reserveB, "Insufficient reserves");
        
        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);
        
        reserveA -= amountA;
        reserveB -= amountB;
    }
}`;
}

// ==================== API ENDPOINTS ====================

// 1. Istniejący endpoint do kompilacji tokenów
app.post('/compile', (req, res) => {
  try {
    const { tokenName, tokenSymbol, totalSupply, decimals, sourceCode } = req.body;
    
    // Jeśli podano kod źródłowy, skompiluj go bezpośrednio
    if (sourceCode) {
      // Wyciągnij nazwę kontraktu z kodu źródłowego
      const contractNameMatch = sourceCode.match(/contract\s+(\w+)/);
      const contractName = contractNameMatch ? contractNameMatch[1] : 'CustomContract';
      
      const compiledData = compileContract(sourceCode, contractName);
      
      return res.json({
        success: true,
        sourceCode,
        ...compiledData
      });
    }
    
    // W przeciwnym razie wygeneruj i skompiluj token na podstawie parametrów
    let finalTokenName = tokenName;
    let finalTokenSymbol = tokenSymbol;
    
    // Wygeneruj kod tokena
    const generatedSourceCode = generateTokenContract(
      finalTokenName,
      finalTokenSymbol,
      totalSupply || 1000000000,
      decimals || 18
    );
    
    // Wyciągnij nazwę kontraktu
    const contractName = finalTokenName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
    
    // Skompiluj
    const compiledData = compileContract(generatedSourceCode, contractName);
    
    // Zwróć dane
    res.json({
      success: true,
      tokenName: finalTokenName,
      tokenSymbol: finalTokenSymbol,
      sourceCode: generatedSourceCode,
      ...compiledData
    });
  } catch (error) {
    console.error('Error in /compile:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. NOWY ENDPOINT: Kompilacja kontraktu puli płynności
app.post('/compile-pool', (req, res) => {
  try {
    const { poolName, tokenA, tokenB, sourceCode } = req.body;
    
    // Jeśli podano kod źródłowy, skompiluj go bezpośrednio
    if (sourceCode) {
      // Wyciągnij nazwę kontraktu z kodu źródłowego
      const contractNameMatch = sourceCode.match(/contract\s+(\w+)/);
      const contractName = contractNameMatch ? contractNameMatch[1] : 'LiquidityPool';
      
      const compiledData = compileContract(sourceCode, contractName);
      
      return res.json({
        success: true,
        sourceCode,
        ...compiledData
      });
    }
    
    // Walidacja danych wejściowych
    if (!poolName) {
      return res.status(400).json({ 
        success: false, 
        error: "Pool name is required" 
      });
    }
    
    if (!tokenA || !tokenB) {
      return res.status(400).json({ 
        success: false, 
        error: "Both token addresses are required" 
      });
    }
    
    // Generowanie kodu kontraktu puli ze zweryfikowanym formatem adresów
    const contractName = poolName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
    
    // Stałe adresy bez checksumowania (dla bezpieczeństwa)
    const generatedSourceCode = `// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract ${contractName} {
    address public owner;
    IERC20 public tokenA; // First token
    IERC20 public tokenB; // Second token
    
    uint256 public reserveA;
    uint256 public reserveB;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        // Direct hexadecimal address literals
        tokenA = IERC20(address(uint160(0x${tokenA.substring(2)})));
        tokenB = IERC20(address(uint160(0x${tokenB.substring(2)})));
    }

    // Add liquidity (only owner)
    function addLiquidity(uint256 amountA, uint256 amountB) external onlyOwner {
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);
        reserveA += amountA;
        reserveB += amountB;
    }

    // Swap TokenA for TokenB
    function swapAforB(uint256 amountIn) external {
        require(amountIn > 0, "Amount must be greater than 0");
        
        uint256 amountOut = (reserveB * amountIn) / (reserveA + amountIn);
        
        tokenA.transferFrom(msg.sender, address(this), amountIn);
        tokenB.transfer(msg.sender, amountOut);
        
        reserveA += amountIn;
        reserveB -= amountOut;
    }

    // Swap TokenB for TokenA
    function swapBforA(uint256 amountIn) external {
        require(amountIn > 0, "Amount must be greater than 0");
        
        uint256 amountOut = (reserveA * amountIn) / (reserveB + amountIn);
        
        tokenB.transferFrom(msg.sender, address(this), amountIn);
        tokenA.transfer(msg.sender, amountOut);
        
        reserveB += amountIn;
        reserveA -= amountOut;
    }

    // Remove liquidity (only owner)
    function removeLiquidity(uint256 amountA, uint256 amountB) external onlyOwner {
        require(amountA <= reserveA && amountB <= reserveB, "Insufficient reserves");
        
        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);
        
        reserveA -= amountA;
        reserveB -= amountB;
    }
}`;
    
    // Kompilacja
    const compiledData = compileContract(generatedSourceCode, contractName);
    
    // Zwróć dane
    res.json({
      success: true,
      poolName,
      tokenA,
      tokenB,
      sourceCode: generatedSourceCode,
      ...compiledData
    });
  } catch (error) {
    console.error('Error in /compile-pool:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. NOWY ENDPOINT: Weryfikacja tokena
app.post('/verify-token', (req, res) => {
  try {
    const { tokenAddress } = req.body;
    
    if (!tokenAddress) {
      return res.status(400).json({ 
        success: false, 
        error: "Token address is required" 
      });
    }
    
    // W rzeczywistej implementacji, tutaj byłaby weryfikacja tokena on-chain
    // Tutaj dla demonstracji zwracamy sukces
    res.json({
      success: true,
      tokenAddress,
      verified: true,
      message: "Token verification would be performed here in a real implementation"
    });
  } catch (error) {
    console.error('Error in /verify-token:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. NOWY ENDPOINT: Generowanie kontraktu do zatwierdzania tokenów
app.post('/generate-approver', (req, res) => {
  try {
    const { tokenAddress, spenderAddress, amount, decimals = 18 } = req.body;
    
    if (!tokenAddress) {
      return res.status(400).json({ 
        success: false, 
        error: "Token address is required" 
      });
    }
    
    if (!spenderAddress) {
      return res.status(400).json({ 
        success: false, 
        error: "Spender address is required" 
      });
    }
    
    // Przekształć wartość z uwzględnieniem decimals
    const actualAmount = amount || '0';
    const amountWithDecimals = `${actualAmount} * (10 ** ${decimals})`;
    
    // Wygeneruj kod kontraktu TokenApprover
    const sourceCode = `// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract TokenApprover {
    IERC20 public token = IERC20(${tokenAddress});
    address public spender = ${spenderAddress};
    
    function approveToken() public {
        token.approve(spender, ${amountWithDecimals});
    }
    
    function checkAllowance() public view returns (uint256) {
        return token.allowance(address(this), spender);
    }
}`;
    
    // Skompiluj kontrakt
    const compiledData = compileContract(sourceCode, "TokenApprover");
    
    res.json({
      success: true,
      tokenAddress,
      spenderAddress,
      amount: actualAmount,
      decimals,
      sourceCode,
      ...compiledData
    });
  } catch (error) {
    console.error('Error in /generate-approver:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint statusu
app.get('/', (req, res) => {
  res.json({
    status: 'Solidity Compiler Service running',
    endpoints: {
      '/': 'Status endpoint',
      '/compile': 'POST endpoint to compile token contracts',
      '/compile-pool': 'POST endpoint to compile liquidity pool contracts',
      '/verify-token': 'POST endpoint to verify token addresses'
    }
  });
});

// Start serwera
app.listen(PORT, () => {
  console.log(`Solidity Compiler Service running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}`);
}); 