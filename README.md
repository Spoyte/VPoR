# VPoR: Verifiable Proof of Reserves & Solvency
A privacy-preserving, decentralized auditing layer for Centralized Exchanges.
💡 The Problem
Centralized Exchanges (CEXs) operate as black boxes. Users deposit funds and receive a database entry in return. While "Proof of Reserve" (PoR) has become popular, it often lacks:
 * Real-time granularity: Monthly audits are not enough.
 * User Verification: Users cannot easily verify their specific balance is included in the liability calculations without privacy leaks.
 * Standardization: Every exchange builds their own proprietary "transparency" page.
🛡️ The Solution: VPoR (Virtual Proof of Reserves)
VPoR is a Glass Vault architecture. It creates a "Shadow Ledger" on a Virtual Blockchain (EVVM) that mirrors the exchange's internal accounting in real-time, while using Chainlink to bridge real-world asset data on-chain.
Users can independently verify:
 * Solvency: Total Assets (Verified by Chainlink) >= Total Liabilities (Verified by EVVM).
 * Inclusion: Their specific account balance is included in the Total Liabilities, using encrypted on-chain proofs.
🏗️ Architecture
The system consists of two pillars: Liabilities (what the exchange owes) and Assets (what the exchange holds).
1. The Liability Ledger (Powered by EVVM)
We use the MATE Metaprotocol (EVVM) to create a high-speed, transparent ledger of all user deposits and withdrawals.
 * Why EVVM?
   * Cost & Scale: Tracking every user deposit on Ethereum Mainnet is prohibitively expensive. EVVM allows us to deploy a dedicated "Virtual Chain" on Sepolia that handles high-throughput accounting at a fraction of the cost.
   * Async Nonces: A critical feature for Exchanges. Unlike standard EVM chains where transactions must be ordered sequentially (nonce 1, 2, 3...), EVVM allows Async Nonces. This means the Exchange can push thousands of batch updates in parallel without worrying about one failed transaction blocking the queue.
 * How it works:
   * The Exchange deploys a GlassVault contract on MATE.
   * Daily (or hourly), the Exchange pushes a Merkle Sum Tree Root representing the current state of all user balances.
   * Privacy: Individual account updates are stored on-chain but encrypted using ECIES (Elliptic Curve Integrated Encryption Scheme). Only the specific user can decrypt their row to verify their balance.
2. The Asset Verifier (Powered by Chainlink)
We use Chainlink to act as the trusted bridge between the Exchange's physical vaults (Cold Wallets, Fiat Bank Accounts) and the EVVM Ledger.
 * Why Chainlink?
   * The EVVM contract cannot see how much Bitcoin is in a Cold Wallet or how much USD is in a Bank Account.
   * We need a decentralized, tamper-proof method to fetch this data so the "Total Assets" variable in our contract is trustworthy.
 * How it works:
   * Chainlink Functions: We deploy a Function that queries external APIs (e.g., Blockcypher for BTC balances, or a Banking API for Fiat).
   * The Function verifies the balance of the Exchange's known cold wallets.
   * It returns the uint256 total balance to the GlassVault contract on MATE.
   * This updates the totalAssets state variable, which the contract automatically compares against totalLiabilities to assert Solvency.
🔐 Privacy & User Verification
We believe in "Don't Trust, Verify", but also "Don't Dox Yourself".
 * Merkle Sum Tree:
   * The contract stores a Merkle Root of all liabilities.
   * Each node contains Hash(User_ID, Balance) and Sum(Child_Balances).
   * The Magic: This allows the contract to mathematically prove that Sum(All_Users) == Total_Liabilities without revealing any individual user's balance to the public.
 * Encrypted Metadata (ECIES):
   * When the exchange records a deposit, it emits an event with encrypted metadata.
   * Public View: Update: 0x7a9... (Random Hex)
   * User View: The user's wallet (Metamask) uses eth_decrypt to decode the hex. They see: "Deposit: $5,000 USDC - Included in Block #99912".
🚀 How to Run
Prerequisites
 * Node.js & Yarn
 * Foundry (for EVVM contracts)
 * Metamask (for local decryption)
1. Deploy the Ledger (EVVM)
cd contracts
forge install
# Deploy to MATE Testnet (Sepolia)
forge create --rpc-url $MATE_RPC_URL --private-key $PK src/GlassVault.sol:GlassVault

2. Run the Chainlink Function (Asset Check)
cd assets-verifier
npm install
# Simulates fetching the balance of a "Cold Wallet"
npx hardhat functions-simulate --script ./verify-btc-balance.js

3. Start the Frontend
cd frontend
yarn install
yarn dev

 * Connect Metamask.
 * Click "Decrypt My History" to verify your private inclusion in the public ledger.
🏆 Hackathon Tracks
 * EVVM / MATE: Utilizes the MATE Metaprotocol to build a high-volume custom service ("Shadow Ledger") that leverages Async Nonces for parallel batch processing of exchange data.
 * Chainlink: Implements Chainlink Functions to solve the "Off-Chain Asset Verification" problem, creating a decentralized bridge for Proof of Reserves.
 * 
