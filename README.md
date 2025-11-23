# VPoR: Verifiable Proof of Reserves (Permissioned EVVM Chain)

**A sovereign, permissioned Virtual Blockchain for Transparent Crypto Custody.**

> 🚀 **Hackathon MVP Status:** Functional demo running! See [QUICKSTART.md](QUICKSTART.md) to run it locally in 5 minutes.

![VPoR Dashboard](/home/zodia-ubuntu/.gemini/antigravity/brain/0f67b18a-6d02-4b39-8223-74e54e31a89a/uploaded_image_1763889895328.png)

## 💡 The Problem

Centralized Exchanges (CEXs) operate as black boxes. "Proof of Reserve" (PoR) snapshots are often outdated, opaque, and rely on the exchange's own website for verification. Users cannot easily verify their specific inclusion in the liability set without privacy leaks.

## 🛡️ The Solution: The VPoR Chain

VPoR is a **Custom Virtual Blockchain (EVVM)** dedicated solely to transparent accounting.

Unlike a standard dApp, our chain is **Permissioned**.

* **Write Access:** Restricted to the Exchange (for liabilities) and Chainlink Oracles (for assets).
* **Read Access:** Public. Anyone can verify the state, but no one can spam the chain.

By deploying a custom EVVM instance, we achieve:

1. **Spam-Proof Ledger:** Only authorized entities can execute transactions, ensuring the ledger remains a pure, immutable record of solvency.
2. **Gasless Verification:** Users verify their balances for free by querying the chain state; they never need to pay gas to "check" their status.
3. **High Throughput:** We utilize **Async Nonces** to process thousands of liability updates in parallel, unblocked by mainnet sequence constraints.

## 🏗️ Architecture

### 1. The Ledger: Permissioned VPoR Chain (EVVM)

We deployed a custom EVVM instance on Sepolia. This "Blockchain-within-a-Blockchain" acts as the immutable public bulletin board.

* **Host Chain:** Sepolia (inherits security).
* **Access Control:** We configure the **Executor Whitelist** on the EVVM Core contract.
  * Executor A: Exchange Backend (Updates Liabilities).
  * Executor B: Chainlink Adapter (Updates Assets).
  * *All other write attempts revert.*

### 2. The Verifier: Chainlink Functions

We use Chainlink to bridge "Real World Assets" (BTC Cold Wallets, Bank APIs) to our Virtual Chain.

* **The Flow:**
  1. **Chainlink Function** queries the Bitcoin Blockchain/Bank API.
  2. It verifies the balance of the Exchange's Cold Wallet.
  3. The Chainlink Oracle calls the **ChainlinkEVVMBridge** on Sepolia.
  4. The Bridge (Whitelisted) calls `GlassVaultEVVM.updateVerifiedAssets()` on the Virtual Chain.

### 3. Privacy: ECIES Encryption

* **Public State:** The chain shows a Merkle Root of all liabilities.
* **Private State:** The chain emits encrypted event logs.
* **User Experience:** Users connect their wallet. The frontend decrypts the event logs locally to reveal: *"Your 5.5 ETH is included in the solvency proof of Block #102."*

## 🏆 Hackathon Tracks

### EVVM / MATE

* **Prize:** "Your custom Service or EVVM Chain"
* **Implementation:** We instantiated a **Permissioned EVVM** specifically designed for high-frequency liability tracking. We leverage **Async Nonces** to batch update user balances in parallel, solving the bottleneck of sequential nonce auditing.

### Chainlink

* **Prize:** "Connect the World with Chainlink"
* **Implementation:** We use **Chainlink Functions** to fetch off-chain asset data and act as a **Whitelisted Executor** on our custom chain, bringing trusted external truth to the internal ledger.

## ✅ What We Built (Hackathon MVP)

 This hackathon demo showcases the core VPoR concept with:

- ✅ **Smart Contracts:** `GlassVaultEVVM` deployed and working
- ✅ **Backend Engine:** Merkle Sum Tree generation + proof submission
- ✅ **Frontend:** Glassmorphism UI displaying live solvency data
- ✅ **Local Testing:** Full E2E flow on Anvil

### Demo Features
- **Public Dashboard:** View total liabilities (7.50 ETH from Merkle Tree)
- **Sync Status:** Real-time indicator (green/yellow/red)
- **Modern UI:** Beautiful glassmorphism design
- **Contract Integration:** Live reads from deployed `GlassVaultEVVM`

### Known Limitations (Hackathon Scope)
- Assets verification via Chainlink Functions not yet integrated
- User-specific proof decryption (eth_decrypt) not implemented
- Currently running on local Anvil (Sepolia deployment guide provided)

## 🚀 Quick Start

**Want to run it yourself? See [QUICKSTART.md](QUICKSTART.md) for a 5-minute setup guide.**

###OR Use the Automated Setup Script:

```bash
# One command to set everything up!
./setup-demo.sh
```

This script will:
1. Check if Anvil is running
2. Deploy GlassVaultEVVM
3. Submit liability proofs via Fisher
4. Configure frontend environment
5. Ready to run!

### Or follow these steps manually:

1. **Start Anvil** - `cd contracts && anvil`
2. **Deploy Contract** - `forge script script/DeployGlassVault.s.sol --broadcast`
3. **Submit Proofs** - `cd backend && GLASS_VAULT_ADDRESS=<addr> npx ts-node src/fisher.ts`
4. **Start Frontend** - `cd frontend && npm run dev`
5. **Open Browser** - http://localhost:3000

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get running in 5 minutes
- **[architecture.md](architecture.md)** - System architecture deep dive
- **[contracts/README.md](contracts/README.md)** - Smart contract details
- **[backend/README.md](backend/README.md)** - Backend scripts and Merkle logic
- **[backend/TESTING.md](backend/TESTING.md)** - Testing instructions
