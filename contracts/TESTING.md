# VPoR Smart Contract Testing Tutorial

This guide explains how to verify the functionality of the VPoR smart contracts (`GlassVault.sol` and `ChainlinkEVVMAdapter.sol`).

## Prerequisites

Ensure you have **Foundry** installed.
```bash
forge --version
```
If not, install it:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

## 1. Automated Unit Tests

We have a comprehensive test suite in `test/GlassVault.t.sol`.

### Run All Tests
Execute the following command in the `contracts/` directory:
```bash
forge test
```

**Expected Output:**
```text
[PASS] testAccessControl()
[PASS] testGetReserveRatio()
[PASS] testIsSolvent()
[PASS] testSubmitLiabilityProof()
[PASS] testUpdateVerifiedAssets()
Suite result: ok. 5 passed; 0 failed; 0 skipped;
```

### Run Specific Tests
To run a specific test case (e.g., checking solvency logic):
```bash
forge test --match-test testIsSolvent -vv
```
*`-vv` shows logs (events).*

### Check Test Coverage
To see which lines of code are covered by tests:
```bash
forge coverage
```

## 2. Manual Verification (Local Testnet)

You can spin up a local blockchain and interact with the contracts manually using `cast`.

### Step 1: Start Local Node
Open a new terminal and run:
```bash
anvil
```
*Keep this terminal open. It will show you a list of private keys and the RPC URL (http://127.0.0.1:8545).*

### Step 2: Deploy Contract
In your original terminal, deploy `GlassVault`:
```bash
# Use the first private key from Anvil output (default 0xac09...):
export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

forge create src/GlassVault.sol:GlassVault \
  --rpc-url http://127.0.0.1:8545 \
  --private-key $PRIVATE_KEY
```
*Copy the `Deployed to: 0x...` address.*

### Step 3: Interact

**1. Check Solvency (Should be true initially as 0 >= 0)**
```bash
export VAULT_ADDR=<PASTE_CONTRACT_ADDRESS>

cast call $VAULT_ADDR "isSolvent()(bool)" --rpc-url http://127.0.0.1:8545
```
*Result: `true`*

**2. Update Assets (Chainlink Simulation)**
```bash
# Update assets to 1000 (as if Chainlink reported it)
cast send $VAULT_ADDR "updateVerifiedAssets(uint256,string)" 1000 "BTC" \
  --rpc-url http://127.0.0.1:8545 \
  --private-key $PRIVATE_KEY
```

**3. Submit Liabilities (Exchange Simulation)**
```bash
# Submit liabilities of 500
# Params: root (bytes32), totalLiabilities (uint256), users (address[]), proofs (bytes[])
# We use empty arrays for users/proofs for simplicity here
cast send $VAULT_ADDR "submitLiabilityProof(bytes32,uint256,address[],bytes[])" \
  0x0000000000000000000000000000000000000000000000000000000000000001 500 "[]" "[]" \
  --rpc-url http://127.0.0.1:8545 \
  --private-key $PRIVATE_KEY
```

**4. Check Reserve Ratio**
```bash
# Should be (1000 * 10000) / 500 = 20000 (200%)
cast call $VAULT_ADDR "getReserveRatio()(uint256)" --rpc-url http://127.0.0.1:8545
```
*Result: `20000`*
