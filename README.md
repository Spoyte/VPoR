# VPoR: Verifiable Proof of Reserves (Permissioned EVVM Chain)

**A sovereign, permissioned Virtual Blockchain for Transparent Crypto Custody.**

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
  3. The Chainlink Oracle calls the **EVVM Executor Adapter**.
  4. The Adapter (Whitelisted) executes the GlassVault.updateAssets() transaction on the Virtual Chain.

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

## 🚀 How to Run

### 1. Deploy the VPoR Chain (Custom EVVM)

```bash
# Deploy EVVM Core with whitelist enabled
npx evvm-deploy --network sepolia --name "VPoR Chain" --permissioned true
# Output: EVVM Core deployed at 0xMyCustomChain...
```

### 2. Whitelist the Executors

```bash
# Whitelist the Exchange Admin and the Chainlink Adapter
npx evvm-admin add-executor --chain 0xMyCustomChain --address $EXCHANGE_ADMIN
npx evvm-admin add-executor --chain 0xMyCustomChain --address $CHAINLINK_ADAPTER
```

### 3. Deploy Logic & Run Auditor

```bash
# Deploy the GlassVault contract to the custom chain
forge create --rpc-url $VPOR_CHAIN_RPC src/GlassVault.sol:GlassVault

# Run the Chainlink simulation to verify assets
npx hardhat functions-simulate --script ./verify_assets.js
```

### 4. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```
