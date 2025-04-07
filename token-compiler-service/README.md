# Mikrousługa Kompilatora Kontraktów Solidity

Prosta mikrousługa do kompilacji kontraktów Solidity (ERC-20) na podstawie podanych parametrów, takich jak nazwa i symbol tokena.

## Funkcjonalności

- Generowanie kodu źródłowego ERC-20 na podstawie parametrów
- Kompilacja kodu Solidity do bytecode i ABI
- API REST z endpointami do kompilacji
- Obsługa CORS

## Wymagania

- Node.js (v14+)
- npm

## Instalacja

```bash
# Instalacja zależności
npm install

# Uruchomienie usługi
npm start
```

Serwer będzie dostępny pod adresem `http://localhost:3003`.

## Endpointy API

### GET /

Zwraca status usługi.

### POST /compile

Kompiluje kontrakt ERC-20 na podstawie dostarczonych parametrów.

#### Parametry żądania (JSON):

```json
{
  "tokenName": "Nazwa tokena",
  "tokenSymbol": "Symbol",
  "totalSupply": 1000000000,  // opcjonalne, domyślnie 1000000000
  "decimals": 18              // opcjonalne, domyślnie 18
}
```

#### Odpowiedź (JSON):

```json
{
  "success": true,
  "sourceCode": "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n...",
  "bytecode": "0x...",
  "abi": [...]
}
```

## Przykład użycia

### Z curl:

```bash
curl -X POST http://localhost:3003/compile \
  -H "Content-Type: application/json" \
  -d '{"tokenName":"Zer0 Token","tokenSymbol":"ZER0"}'
```

### Z klienta JavaScript:

```javascript
const response = await fetch('http://localhost:3003/compile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    tokenName: 'Zer0 Token', 
    tokenSymbol: 'ZER0' 
  })
});

const data = await response.json();
console.log(data.bytecode); // Skompilowany bytecode
console.log(data.abi);      // ABI kontraktu
```

## Integracja z React

Aby zintegrować tę mikrousługę z aplikacją React, zaktualizuj funkcję `generateRandomContractDetails` w pliku `ContractDeployer.js`, aby korzystała z tej usługi:

```javascript
const generateRandomContractDetails = async () => {
  setIsCompiling(true);
  setError('');
  
  try {
    // Wybierz losową nazwę i symbol
    const randomName = memeNames[Math.floor(Math.random() * memeNames.length)];
    const randomSymbol = tokenSymbols[Math.floor(Math.random() * tokenSymbols.length)];
    
    setContractName(randomName);
    setContractSymbol(randomSymbol);
    
    // Wysyłamy żądanie do mikrousługi
    const response = await fetch('http://localhost:3003/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        tokenName: randomName, 
        tokenSymbol: randomSymbol,
        totalSupply: 1000000000,
        decimals: 18
      })
    });
    
    if (!response.ok) {
      throw new Error('Compilation failed');
    }
    
    const result = await response.json();
    
    // Aktualizujemy stan aplikacji
    setSourceCode(result.sourceCode);
    setBinaryCode(result.bytecode);
    setJsonAbi(JSON.stringify(result.abi, null, 2));
  } catch (error) {
    console.error('Error generating contract:', error);
    setError(`Error generating contract: ${error.message}`);
  } finally {
    setIsCompiling(false);
  }
}; 