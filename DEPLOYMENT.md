# VPoR Deployment Guide

Deploy VPoR to Sepolia testnet for public demonstration.

## Prerequisites

- Sepolia ETH (get from [faucet](https://sepoliafaucet.com/))
- WalletConnect Project ID ([get here](https://cloud.walletconnect.com/))
- Chainlink Functions Subscription ([setup guide](https://docs.chain.link/chainlink-functions/resources/subscriptions))

## Step 1: Configure Environment

### Contracts

Create `contracts/.env`:

```bash
# Sepolia RPC (get from Alchemy/Infura)
RPC_URL_SEPOLIA=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY

# Your deployer private key (fund with Sepolia ETH)
PRIVATE_KEY=0x...

# Chainlink Functions (optional for MVP)
CHAINLINK_ROUTER_SEPOLIA=0x...
CHAINLINK_DON_ID=fun-ethereum-sepolia-1
```

### Frontend

Create `frontend/.env.local`:

```bash
# Contract address (update after deployment)
NEXT_PUBLIC_GLASS_VAULT_ADDRESS=0x...

# Chain ID for Sepolia
NEXT_PUBLIC_CHAIN_ID=11155111

# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

## Step 2: Deploy Contracts

### Deploy GlassVaultEVVM

```bash
cd contracts

# Deploy to Sepolia
PRIVATE_KEY=$PRIVATE_KEY forge script script/DeployGlassVault.s.sol:DeployGlassVault \
  --rpc-url $RPC_URL_SEPOLIA \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

**Save the deployed address!** You'll need it for the next steps.

### Verify Deployment

```bash
# Check contract code
cast code <CONTRACT_ADDRESS> --rpc-url $RPC_URL_SEPOLIA

# Should return bytecode (not "0x")
```

### Set Liability Publisher

Whitelist your backend address:

```bash
cast send <CONTRACT_ADDRESS> \
  "setLiabilityPublisher(address,bool)" \
  <YOUR_BACKEND_ADDRESS> true \
  --private-key $PRIVATE_KEY \
  --rpc-url $RPC_URL_SEPOLIA
```

## Step 3: Deploy Backend (Optional)

For automated proof submissions, deploy Fisher to a server:

### Option A: AWS Lambda

```bash
cd backend
npm install
npm run build

# Deploy to AWS Lambda
# (Use Serverless Framework or AWS CLI)
```

### Option B: Heroku

```bash
# Create Procfile
echo "worker: node dist/fisher.js" > Procfile

# Deploy
git push heroku main
```

### Manual Submission

Or just run locally when needed:

```bash
cd backend
GLASS_VAULT_ADDRESS=<SEPOLIA_ADDRESS> \
RPC_URL=https://eth-sepolia.g.alchemy.com/... \
PRIVATE_KEY=<YOUR_KEY> \
npx ts-node src/fisher.ts
```

## Step 4: Deploy Frontend

### Vercel (Recommended)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_GLASS_VAULT_ADDRESS`
   - `NEXT_PUBLIC_CHAIN_ID=11155111`
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
5. Deploy!

### Manual Build

```bash
cd frontend
npm run build
npm start
```

## Step 5: Verify Deployment

### Test Contract Interaction

```bash
# Read liability root
cast call <CONTRACT_ADDRESS> "liabilityRoot()(bytes32)" \
  --rpc-url $RPC_URL_SEPOLIA

# Should return bytes32 after proof submission
```

### Test Frontend

1. Visit your Vercel URL
2. Click "Connect Wallet"
3. Switch to Sepolia network
4. View solvency dashboard

### Submit Test Proof

```bash
cd backend
GLASS_VAULT_ADDRESS=<SEPOLIA_ADDRESS> \
RPC_URL=$RPC_URL_SEPOLIA \
PRIVATE_KEY=$PRIVATE_KEY \
npx ts-node src/fisher.ts
```

Refresh frontend to see updated liabilities.

## Step 6: Configure Chainlink Functions (Optional)

For asset verification via Chainlink:

### Create Subscription

1. Go to [functions.chain.link](https://functions.chain.link)
2. Create subscription on Sepolia
3. Fund with LINK
4. Note subscription ID

### Deploy Bridge Contract

```bash
cd contracts
PRIVATE_KEY=$PRIVATE_KEY forge script script/DeployChainlinkBridge.s.sol \
  --rpc-url $RPC_URL_SEPOLIA \
  --broadcast
```

### Add Consumer

Add ChainlinkEVVMBridge as consumer to your subscription.

### Upload Source Code

```bash
cd contracts/chainlink
npx @chainlink/functions-toolkit deploy \
  --network sepolia \
  --contract <BRIDGE_ADDRESS>
```

## Troubleshooting

### Deployment Fails

**Error:** "Insufficient funds"
- Get Sepolia ETH from faucet
- Check your balance: `cast balance <ADDRESS> --rpc-url $RPC_URL_SEPOLIA`

**Error:** "Nonce too high"
- Wait a few blocks or reset: `cast nonce <ADDRESS> --rpc-url $RPC_URL_SEPOLIA`

### Frontend Issues

**Error:** "Unsupported chain"
- Ensure `NEXT_PUBLIC_CHAIN_ID=11155111`
- Check Wagmi config includes Sepolia

**Error:** "Contract not found"
- Verify contract address is correct
- Check Sepolia explorer: `https://sepolia.etherscan.io/address/<ADDRESS>`

### Backend Issues

**Error:** "Transaction reverted"
- Ensure your address is whitelisted: `isLiabilityPublisher()`
- Check you have Sepolia ETH

## Production Checklist

Before going live:

- [ ] Contract verified on Etherscan
- [ ] Liability publisher whitelisted
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set
- [ ] Test proof submission successful
- [ ] Frontend displays correct data
- [ ] Wallet connection working
- [ ] Analytics configured (optional)

## Monitoring

### On-Chain Monitoring

Watch for events:

```bash
cast logs --address <CONTRACT_ADDRESS> \
  --from-block latest \
  --rpc-url $RPC_URL_SEPOLIA
```

### Frontend Analytics

Add Vercel Analytics or Google Analytics to frontend for usage tracking.

### Uptime Monitoring

Use services like:
- [Uptime Robot](https://uptimerobot.com/) for frontend
- [Tenderly](https://tenderly.co/) for contract monitoring

## Costs

### Gas Estimates (Sepolia)
- Deploy GlassVaultEVVM: ~3.6M gas (~0.001 ETH)
- Submit liability proof: ~162K gas (~0.00005 ETH)
- Set publisher: ~50K gas (~0.00002 ETH)

### Ongoing Costs
- Vercel: Free tier sufficient
- Backend: Free (if manual) or ~$5/month (Lambda)
- Chainlink: Variable based on request frequency

## Support

Issues? Check:
- [GitHub Issues](https://github.com/Spoyte/VPoR/issues)
- Contract on [Sepolia Etherscan](https://sepolia.etherscan.io/)
- [TESTING.md](TESTING.md) for verification steps
