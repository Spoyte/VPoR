# VPoR Testing Guide

Complete testing documentation for all VPoR components.

## Quick Test (E2E Flow)

Run the full stack locally to verify everything works:

```bash
# Terminal 1: Start Anvil
cd contracts && anvil

# Terminal 2: Deploy & Test
cd contracts
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  forge script script/DeployGlassVault.s.sol:DeployGlassVault \
  --rpc-url http://127.0.0.1:8545 --broadcast

# Submit proof (replace <ADDRESS> with deployed address)
cd ../backend
GLASS_VAULT_ADDRESS=<ADDRESS> npm test
GLASS_VAULT_ADDRESS=<ADDRESS> npx ts-node src/fisher.ts

# Terminal 3: Start frontend
cd frontend
npm run dev
```

**Expected Results:**
- Contract deploys successfully
- Fisher submits proof and shows "Transaction confirmed!"
- Frontend at http://localhost:3000 shows 7.50 ETH liabilities

## Component Testing

### 1. Smart Contracts

```bash
cd contracts
forge test -vv
```

**What's Tested:**
- Merkle root updates
- Access control (only whitelisted publishers)
- Liability proof submission
- Event emissions

**Key Test Files:**
- `test/GlassVaultEVVM.t.sol` - Main contract tests

### 2. Backend (Merkle Tree)

```bash
cd backend
npm test
```

**What's Tested:**
- Merkle Sum Tree construction
- Leaf hashing matches Solidity
- Proof generation
- Sum aggregation correctness

**Expected Output:**
```
Merkle Sum Tree Test
  ✓ Builds tree correctly
  ✓ Generates valid proofs
  ✓ Calculates correct root
```

### 3. Frontend (Build)

```bash
cd frontend
npm run build
```

**What's Tested:**
- TypeScript type checking
- Build succeeds without errors
- All imports resolve

## Verification Tests

### Verify Contract Deployment

```bash
# Check if contract exists
cast code <CONTRACT_ADDRESS> --rpc-url http://127.0.0.1:8545

# Should return bytecode (not "0x")
```

### Verify Liability Root

```bash
# Read liability root from contract
cast call <CONTRACT_ADDRESS> "liabilityRoot()(bytes32)" \
  --rpc-url http://127.0.0.1:8545

# Should return non-zero bytes32 after Fisher runs
```

### Verify Total Liabilities

```bash
# Read total liabilities
cast call <CONTRACT_ADDRESS> "totalLiabilities()(uint256)" \
  --rpc-url http://127.0.0.1:8545

# Should return 7500000000000000000 (7.5 ETH)
```

## CI/CD Testing

GitHub Actions runs automatically on push:

```yaml
# .github/workflows/test.yml
- Contracts: forge test
- Backend: npm test
- Frontend: npm run build
```

**View Results:** https://github.com/Spoyte/VPoR/actions

## Troubleshooting

### Contract Tests Fail

**Error:** "Stack too deep"
- **Fix:** Already handled via `viaIR` in `foundry.toml`

**Error:** "Contract size exceeds limit"
- **Fix:** Already handled via optimizer in `foundry.toml`

### Backend Test Fails

**Error:** "Cannot find module"
- **Fix:** Run `npm install` in backend directory

**Error:** "BigInt not supported"
- **Fix:** Ensure Node.js >= 16

### Frontend Build Fails

**Error:** "Node.js version required >= 20.9.0"
- **Fix:** `nvm use 20`

**Error:** "Invalid JSON in ABI"
- **Fix:** Regenerate ABI with:
  ```bash
  cd contracts && forge build
  python3 -c "import json; ..." # As per script
  ```

## Manual Verification Checklist

Before demo/deployment:

- [ ] Anvil running on port 8545
- [ ] Contract deployed (get address from output)
- [ ] Fisher script runs without errors
- [ ] Frontend shows 7.50 ETH
- [ ] No console errors in browser
- [ ] Sync status indicator visible
- [ ] Last update timestamp shows recent time

## Performance Benchmarks

### Contract Gas Costs
- Deploy GlassVaultEVVM: ~3.6M gas
- submitLiabilityProof: ~162K gas
- Read operations: ~24K gas

### Backend Performance
- Merkle tree (3 users): <100ms
- Encryption (3 proofs): <50ms
- Total Fisher runtime: <2s

### Frontend Load Time
- Initial page load: <1s
- Contract reads: <500ms
- UI render: <100ms
