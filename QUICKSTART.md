# VPoR Quickstart (5 Minutes)

Get the VPoR demo running locally in under 5 minutes.

## Prerequisites

- **Node.js 20+** ([Install via nvm](https://github.com/nvm-sh/nvm))
- **Foundry** ([Install](https://book.getfoundry.sh/getting-started/installation))

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/Spoyte/VPoR.git
cd VPoR

# Install dependencies
cd contracts && forge install && cd ..
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Start Local Blockchain

```bash
# Terminal 1
cd contracts
anvil
```

Keep this running. You'll see test accounts with funds.

### 3. Deploy Smart Contract

```bash
# Terminal 2
cd contracts
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  forge script script/DeployGlassVault.s.sol:DeployGlassVault \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast
```

**Copy the deployed address** from the output (`GlassVaultEVVM deployed at: 0x...`)

### 4. Submit Liability Proofs

```bash
# Terminal 2 (continued)
cd ../backend
GLASS_VAULT_ADDRESS=<PASTE_ADDRESS_HERE> npx ts-node src/fisher.ts
```

You should see: `Transaction confirmed!`

### 5. Start Frontend

```bash
# Terminal 3
cd frontend
nvm use 20  # Ensure Node 20+
rm -rf .next  # Clear cache
npm run dev
```

### 6. View Dashboard

Open [http://localhost:3000](http://localhost:3000)

## What You'll See

![VPoR Dashboard](/home/zodia-ubuntu/.gemini/antigravity/brain/0f67b18a-6d02-4b39-8223-74e54e31a89a/uploaded_image_1763889895328.png)

- **Total Liabilities:** 7.50 ETH (from Merkle Tree)
- **Reserve Ratio:** Live calculation
- **Sync Status:** Yellow/Green indicator
- **Glassmorphism UI:** Modern, transparent design

## What Just Happened?

1. **Anvil** created a local Ethereum chain
2. **GlassVaultEVVM** deployed to store proofs
3. **Fisher** generated Merkle Sum Tree and submitted encrypted proofs
4. **Frontend** reads contract state and displays solvency metrics

## Troubleshooting

**Frontend shows "Loading..."?**
- Check contract address in `.env.local` matches deployment
- Ensure Anvil is still running

**Deploy failed?**
- Run `forge clean` and try again
- Check Anvil is on port 8545

**Node version error?**
- Run `nvm use 20` before starting frontend

## Next Steps

- Connect your wallet to see encrypted proofs
- Deploy to Sepolia testnet (see [DEPLOYMENT.md](DEPLOYMENT.md))
- Read the [Architecture](architecture.md) to understand how it works
