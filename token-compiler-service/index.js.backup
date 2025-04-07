const express = require('express');
const cors = require('cors');
const solc = require('solc');

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

// Endpoint do kompilacji kontraktu
app.post('/compile', (req, res) => {
    try {
        let { tokenName, tokenSymbol, totalSupply, decimals } = req.body;
        
        // Jeśli nie podano nazwy tokena, wygeneruj losową
        if (!tokenName) {
            tokenName = generateTokenName();
        }
        
        // Jeśli nie podano symbolu, wygeneruj losowy
        if (!tokenSymbol) {
            tokenSymbol = generateTokenSymbol();
        }
        
        // Wygeneruj kod źródłowy
        const contractName = tokenName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
        const sourceCode = generateTokenContract(
            tokenName,
            tokenSymbol,
            totalSupply || 1000000000,
            decimals || 18
        );
        
        // Skompiluj kontrakt
        const compiledData = compileContract(sourceCode, contractName);
        
        // Zwróć bytecode i ABI
        res.json({
            success: true,
            tokenName,
            tokenSymbol,
            sourceCode,
            ...compiledData
        });
    } catch (error) {
        console.error('Error in /compile:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint statusu
app.get('/', (req, res) => {
    res.json({
        status: 'Solidity Compiler Service running',
        availableTokenNames: {
            predefined: predefinedTokenNames.length,
            components: nameOptions.length,
            suffixes: suffixOptions.length,
            symbols: symbolOptions.length,
            totalPossibleCombinations: predefinedTokenNames.length + (nameOptions.length * (1 + suffixOptions.length))
        },
        endpoints: {
            '/': 'Status endpoint',
            '/compile': 'POST endpoint to compile contracts'
        }
    });
});

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Solidity Compiler Service running on port ${PORT}`);
  console.log(`Try it: curl -X POST http://localhost:${PORT}/compile -H "Content-Type: application/json" -d '{"tokenName":"Zer0 Token","tokenSymbol":"ZER0"}'`);
}); 