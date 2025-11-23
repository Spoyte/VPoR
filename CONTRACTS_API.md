# VPoR Contracts API Reference

Reference documentation for interacting with deployed VPoR contracts.

## GlassVaultEVVM

Main contract for storing liability proofs and verifying solvency.

### Contract Address
- **Local Anvil:** `0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9` (example)
- **Sepolia:** TBD

### Read Functions

#### `liabilityRoot() → bytes32`
Returns the current Merkle root of all user liabilities.

```bash
cast call <ADDRESS> "liabilityRoot()(bytes32)" --rpc-url <RPC>
```

#### `totalLiabilities() → uint256`
Returns total liabilities in wei.

```bash
cast call <ADDRESS> "totalLiabilities()(uint256)" --rpc-url <RPC>
# Returns: 7500000000000000000 (7.5 ETH)
```

#### `totalAssets() → uint256`
Returns total verified assets in wei (set by Chainlink).

```bash
cast call <ADDRESS> "totalAssets()(uint256)" --rpc-url <RPC>
```

#### `lastLiabilityUpdate() → uint256`
Returns timestamp of last liability proof submission.

```bash
cast call <ADDRESS> "lastLiabilityUpdate()(uint256)" --rpc-url <RPC>
```

#### `lastAssetUpdate() → uint256`
Returns timestamp of last asset verification.

```bash
cast call <ADDRESS> "lastAssetUpdate()(uint256)" --rpc-url <RPC>
```

#### `isLiabilityPublisher(address) → bool`
Checks if an address is whitelisted to publish liabilities.

```bash
cast call <ADDRESS> "isLiabilityPublisher(address)(bool)" <PUBLISHER_ADDRESS> --rpc-url <RPC>
```

#### `getReserveRatio() → uint256`
Returns reserve ratio (assets/liabilities * 10000). Example: 10500 = 105%.

```bash
cast call <ADDRESS> "getReserveRatio()(uint256)" --rpc-url <RPC>
```

#### `isSolvent() → bool`
Returns true if totalAssets >= totalLiabilities.

```bash
cast call <ADDRESS> "isSolvent()(bool)" --rpc-url <RPC>
```

### Write Functions

#### `submitLiabilityProof(bytes32 _root, uint256 _totalBalance, bytes _encryptedData)`
Submit a new liability proof (whitelisted publishers only).

```bash
cast send <ADDRESS> \
  "submitLiabilityProof(bytes32,uint256,bytes)" \
  <ROOT> <TOTAL> <ENCRYPTED_DATA> \
  --private-key <KEY> \
  --rpc-url <RPC>
```

**Parameters:**
- `_root`: Merkle Sum Tree root
- `_totalBalance`: Sum of all liabilities
- `_encryptedData`: Encrypted proof blob

**Emits:** `LiabilitySnapshot(bytes32 root, uint256 totalBalance, bytes encryptedData, uint256 timestamp)`

#### `updateVerifiedAssets(uint256 _amount)`
Update total verified assets (Chainlink bridge only).

```bash
cast send <ADDRESS> \
  "updateVerifiedAssets(uint256)" \
  <AMOUNT_WEI> \
  --private-key <KEY> \
  --rpc-url <RPC>
```

**Emits:** `AssetVerification(uint256 amount, string source, uint256 timestamp)`

#### `setLiabilityPublisher(address _publisher, bool _status)`
Add/remove liability publisher (owner only).

```bash
cast send <ADDRESS> \
  "setLiabilityPublisher(address,bool)" \
  <PUBLISHER> true \
  --private-key <KEY> \
  --rpc-url <RPC>
```

### Events

#### `LiabilitySnapshot`
```solidity
event LiabilitySnapshot(
    bytes32 indexed root,
    uint256 totalBalance,
    bytes encryptedData,
    uint256 timestamp
);
```

#### `AssetVerification`
```solidity
event AssetVerification(
    uint256 indexed amount,
    string source,
    uint256 timestamp
);
```

#### `ProofOfInclusion`
```solidity
event ProofOfInclusion(
    address indexed user,
    bytes encryptedProof
);
```

## ChainlinkEVVMBridge

Bridge contract for Chainlink Functions to update assets.

### Contract Address
- **Sepolia:** TBD

### Read Functions

#### `owner() → address`
Returns contract owner.

### Write Functions

#### `fulfillRequest(bytes32 requestId, bytes response, bytes err)`
Chainlink callback to update verified assets.

**Used by:** Chainlink Functions DON only

## ABI Files

Full ABI files available in:
- `frontend/contracts/GlassVaultEVVM.abi.json`
- Generated via: `forge build` → extract from `out/` directory

## Usage Examples

### Web3.js
```javascript
const Web3 = require('web3');
const web3 = new Web3('http://127.0.0.1:8545');

const contract = new web3.eth.Contract(
  ABI,
  '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'
);

// Read total liabilities
const liabilities = await contract.methods.totalLiabilities().call();
console.log(`Liabilities: ${web3.utils.fromWei(liabilities, 'ether')} ETH`);
```

### Ethers.js
```javascript
const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
const contract = new ethers.Contract(ADDRESS, ABI, provider);

// Read reserve ratio
const ratio = await contract.getReserveRatio();
console.log(`Reserve Ratio: ${ratio / 100}%`);
```

### Wagmi (React)
```typescript
import { useReadContract } from 'wagmi';

const { data } = useReadContract({
  address: '0xDc64...',
  abi: GlassVaultABI,
  functionName: 'totalLiabilities',
});
```

## Security Considerations

- **Access Control:** Only whitelisted addresses can submit proofs
- **Read-Only:** Anyone can verify solvency without gas costs
- **Privacy:** Individual balances encrypted, only Merkle root public
- **Immutability:** Historical proofs stored on-chain permanently
