# Chainlink Asset Simulator

Simulates Chainlink DON verifying and updating assets on-chain in real-time.

## What It Does

This script simulates a Chainlink Decentralized Oracle Network (DON) periodically fetching off-chain asset data (e.g., Bitcoin cold wallet balances, bank API balances) and updating the verified assets on the GlassVaultEVVM contract.

## Demo Scenarios

The simulator cycles through different solvency scenarios:

1. **105% Reserve** - Healthy collateralization
2. **110% Reserve** - Excellent reserves
3. **98% Reserve** - ⚠️ Under-collateralized (shows insolvency alert)
4. **100% Reserve** - Borderline solvency
5. **115% Reserve** - Strong reserves

Each update happens every **10 seconds**, and you can watch the frontend reflect changes in real-time with the **LIVE** indicator.

## Usage

### Basic Run

```bash
cd backend
GLASS_VAULT_ADDRESS=<CONTRACT_ADDRESS> npm run simulate
```

### With Setup Script

The simulator is automatically configured when you run:

```bash
./setup-demo.sh
```

Then in a separate terminal:

```bash
cd backend
npm run simulate
```

## What You'll See

**Terminal Output:**
```
🔗 Chainlink Asset Verification Simulator
==========================================

Current Liabilities: 7.5 ETH

[10:30:15] Simulating Chainlink Update:
  Scenario: Healthy: 105% reserve
  Setting Assets: 7.875 ETH
  Transaction: 0x123...
  ✅ Assets verified and updated on-chain
  Current Reserve Ratio: 105.00%
```

**Frontend Changes:**
- Reserve ratio updates from 0% → 105%
- "LIVE" indicator pulses
- Transitions smooth with animations
- Solvency status changes (INSOLVENT ↔ SOLVENT)

## Architecture

This simulates what would happen in production:

1. **Chainlink Functions** queries external APIs (Bitcoin blockchain, bank APIs)
2. **Decentralized computation** verifies the data across multiple nodes
3. **ChainlinkEVVMBridge** calls `updateVerifiedAssets()`on the VPoR chain
4. **Frontend** reads updated state and displays new reserve ratio

## For Production

In production, replace this simulator with:
- Actual Chainlink Functions deployment
- Real external data sources (Bitcoin RPC, BankAPI, etc.)
- Proper oracle security and redundancy

See [DEPLOYMENT.md](../DEPLOYMENT.md) for Sepolia deployment instructions.
