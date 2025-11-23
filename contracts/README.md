# VPoR Smart Contracts

This directory contains the core smart contracts for the **Verifiable Proof of Reserves (VPoR)** system.

## Contracts

### [GlassVault.sol](./src/GlassVault.sol)
The "Single Source of Truth" for the solvency of the exchange.
- **Liability Tracking:** Stores the Merkle Root of user liabilities (`liabilityRoot`) and the total sum (`totalLiabilities`).
- **Asset Verification:** Stores the total verified assets (`totalAssets`) updated by the Chainlink Adapter.
- **Solvency Check:** Provides `isSolvent()` and `getReserveRatio()` to transparently verify if assets cover liabilities.
- **Privacy:** Emits `ProofOfInclusion` events with encrypted payloads, allowing users to verify their balances privately.

### [ChainlinkEVVMAdapter.sol](./src/ChainlinkEVVMAdapter.sol)
A bridge contract that translates Chainlink Functions responses into VPoR state updates.
- **Role:** Receives data from the Chainlink Decentralized Oracle Network (DON).
- **Action:** Calls `GlassVault.updateVerifiedAssets()` to update the on-chain asset record.

## Setup

Ensure you have [Foundry](https://book.getfoundry.sh/getting-started/installation) installed.

```bash
forge install
```

## Testing

Run the test suite to verify core logic:

```bash
forge test
```

Expected output:
```text
[PASS] testAccessControl()
[PASS] testGetReserveRatio()
[PASS] testIsSolvent()
[PASS] testSubmitLiabilityProof()
[PASS] testUpdateVerifiedAssets()
```

## Deployment

### Sepolia / VPoR Chain

```bash
# Set up your .env file
cp .env.example .env

# Deploy GlassVault
forge create --rpc-url <RPC_URL> --private-key <PRIVATE_KEY> src/GlassVault.sol:GlassVault


## Chainlink Integration

### Scripts
Located in `contracts/chainlink/`.

- `source.js`: The JavaScript code executed by the Chainlink DON. Fetches BTC balance.
- `sim.js`: Local simulation script to verify `source.js`.

### Running Simulation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the simulation:
   ```bash
   node contracts/chainlink/sim.js
   ```

### Deployment (Bridge)
The `ChainlinkEVVMBridge` contract is deployed on Sepolia.

```bash
forge create --rpc-url $RPC_URL_SEPOLIA --private-key $PRIVATE_KEY src/ChainlinkEVVMBridge.sol:ChainlinkEVVMBridge --constructor-args <ROUTER_ADDRESS> <DON_ID> <GLASS_VAULT_ADDRESS>
```
