% VPoR Architecture

## Overview

VPoR (Virtual Proof of Reserves) is a **privacy‑preserving, permissioned virtual blockchain** built on top of the MATE EVVM metaprotocol. It provides a **transparent, spam‑resistant solvency ledger** for centralized exchanges by separating:

- **Liabilities** – what the exchange owes users, tracked on a dedicated EVVM chain ("VPoR Chain").
- **Assets** – what the exchange actually holds, verified via Chainlink Functions and oracles.

At its core, VPoR offers:

- **Real‑time or near real‑time solvency proofs**, instead of ad‑hoc audits.
- **Per‑user inclusion proofs** without leaking user balances publicly.
- **Gasless verification** for end users; only the exchange and oracles pay to update state.

## High‑Level Architecture

### Logical Pillars

1. **Liability Ledger (VPoR Chain / EVVM)**
   - A **custom, permissioned EVVM chain** that mirrors the exchange’s internal accounting.
   - Stores:
     - The **Merkle Sum Tree root** of all user balances.
     - The **total liabilities** derived from that tree.
     - The **total assets** as last reported by Chainlink.
   - Exposes public, read‑only state so anyone can independently verify solvency.

2. **Asset Verifier (Chainlink + Adapter)**
   - A set of **Chainlink Functions** that query external data sources (e.g., BTC explorers, bank APIs).
   - A **ChainlinkEVVMBridge** contract on Sepolia that receives oracle results and forwards them to the VPoR Chain.
   - Ensures that on‑chain `totalAssets` accurately reflects off‑chain holdings.

3. **Exchange Backend & User Interface**
   - **Exchange backend**:
     - Maintains the internal ledger and periodically publishes liability snapshots to the VPoR Chain.
     - Encrypts per‑user proof payloads and submits them to the chain.
   - **User frontend/wallet**:
     - Fetches on‑chain encrypted proofs and Merkle data.
     - Decrypts user‑specific payloads locally using ECIES (e.g., via `eth_decrypt`).
     - Shows human‑readable inclusion proofs and solvency status.

## Core Components

### VPoR Chain (Permissioned EVVM Instance)

- **Host Chain:** Deployed as an EVVM "virtual chain" on Sepolia, inheriting its security.
- **Access Model:**
  - **Write access** is restricted via an **executor whitelist**:
    - Exchange backend (liability updates).
    - Chainlink adapter (asset updates).
  - **Read access** is fully public.
- **Execution Model:**
  - Uses **Async Nonces**, allowing thousands of independent updates in parallel.
  - Suited for high‑frequency accounting workloads that would be prohibitively expensive or slow on a public L1.

### `GlassVaultEVVM` Contract (Solvency Source of Truth)

Deployed on the VPoR Chain, `GlassVaultEVVM` (inheriting from `Evvm.sol`) is the canonical record of solvency.

**Key state:**

- `liabilityRoot`: Merkle root of all liabilities.
- `totalLiabilities`: Sum of all user balances from the Merkle Sum Tree.
- `totalAssets`: Aggregated assets as verified by Chainlink.
- `lastLiabilityUpdate`, `lastAssetUpdate`: Timestamps for recency guarantees.
- `isExecutor[address]`: Whitelisted executors (exchange, Chainlink adapter).

**Key behaviors:**

- `submitLiabilityProof(...)` (exchange only):
  - Updates `liabilityRoot` and `totalLiabilities`.
  - Updates `lastLiabilityUpdate`.
  - Emits a `LiabilitySnapshot` event.
  - Emits one or more `ProofOfInclusion` events carrying encrypted per‑user metadata.

- `updateVerifiedAssets(...)` (adapter only):
  - Updates `totalAssets` and `lastAssetUpdate`.
  - Emits `AssetVerification` events for auditability.

- View helpers:
  - `isSolvent()`: Returns `totalAssets >= totalLiabilities`.
  - `getReserveRatio()`: Returns the reserve ratio in basis points (e.g., 10000 = 100%).

### Merkle Sum Tree (Liability Model)

- **Leaves** contain a commitment of each user’s identity and balance:
  - `hash(User_ID, Balance)` plus the balance value.
- **Internal nodes** store:
  - A hash of child nodes.
  - The sum of their child balances.
- The **root** commits to:
  - Every individual balance (for inclusion proofs).
  - The **total sum of liabilities** (for solvency checks).
- This structure enables:
  - Privacy: Individual leaves are not revealed on‑chain.
  - Verifiability: Users can recompute the path from their leaf to the root.

### Chainlink Functions + `ChainlinkEVVMBridge`

**Chainlink Functions layer:**

- Off‑chain code (in the Chainlink DON) that:
  - Queries external APIs / blockchains (e.g., BTC cold wallet balances, bank accounts).
  - Aggregates balances across multiple sources if needed.
  - Produces a canonical `uint256` asset balance.

**`ChainlinkEVVMBridge` contract (Sepolia):**

- Receives callbacks from Chainlink via:
  - `fulfillRequest(bytes32 requestId, bytes response, bytes err)`.
- Decodes the response payload into an asset balance.
- Calls `GlassVaultEVVM.updateVerifiedAssets(assetBalance, "BTC")` on the VPoR Chain.

### Frontend & Wallet Integration (Conceptual)

Although this repository does not yet include the full frontend code, the intended UX is:

- Users connect with a wallet (e.g., MetaMask).
- The frontend:
  - Reads the latest `LiabilitySnapshot` and `AssetVerification` events.
  - Filters `ProofOfInclusion` events for the connected address.
  - Uses ECIES / `eth_decrypt` to decrypt the encrypted payloads.
  - Presents clear messages like:  
    “Your 5.5 ETH is included in the solvency proof for block #102.”
- A public dashboard can also surface:
  - Current `totalAssets`, `totalLiabilities`, and reserve ratio.
  - Time since last liability and asset updates.

## Data & Control Flows

### 1. Liability Update Flow

1. **Snapshot generation (off‑chain, exchange backend):**
   - The exchange computes the latest user balances.
   - Builds a **Merkle Sum Tree** over all (user, balance) pairs.
   - Derives:
     - `liabilityRoot`.
     - `totalLiabilities`.
     - Encrypted per‑user proofs (`encryptedProofs`).

2. **On‑chain update (VPoR Chain):**
   - Exchange submits `submitLiabilityProof(liabilityRoot, totalLiabilities, encryptedProofs)` via a whitelisted executor.
   - `GlassVault`:
     - Updates its state.
     - Emits `LiabilitySnapshot` and `ProofOfInclusion` events.

3. **User verification (frontend + wallet):**
   - Users fetch their encrypted proof events.
   - Decrypt locally and reconstruct the Merkle path.
   - Validate that:
     - Their leaf is part of the `liabilityRoot`.
     - The root stored in `GlassVault` matches the on‑chain state.

### 2. Asset Verification Flow

1. **Oracle job (Chainlink Functions):**
   - On a schedule or trigger:
     - Chainlink Functions call external APIs (e.g., BTC explorers, bank APIs).
     - Aggregate balances across whitelisted addresses/accounts.

2. **Callback to adapter:**
   - Chainlink sends the result to `ChainlinkEVVMAdapter.fulfillRequest(...)`.
   - The adapter decodes the response to `assetBalance`.

3. **Update VPoR Chain:**
   - The adapter, as a whitelisted executor, calls `GlassVault.updateVerifiedAssets(assetBalance, "BTC")` on the VPoR Chain.
   - `GlassVault` updates `totalAssets` and emits `AssetVerification`.

### 3. Solvency Check Flow

1. Anyone (user, auditor, regulator) reads:
   - `totalAssets`.
   - `totalLiabilities`.
   - `isSolvent()` and `getReserveRatio()`.

2. A public UI can:
   - Display whether `totalAssets >= totalLiabilities`.
   - Visualize the reserve ratio over time.

3. Users combine:
   - **Global solvency (`isSolvent`)** with
   - **Personal inclusion proofs**  
   to get end‑to‑end assurance: *“My balance is included, and the exchange is solvent.”*

## Deployment Topology

- **Host Chain (Sepolia):**
  - Runs the EVVM Core and may host the `ChainlinkEVVMAdapter` if the design favors messages from host → VPoR Chain.
- **VPoR Chain (EVVM Virtual Chain):**
  - Permissioned chain where:
    - `GlassVault` is deployed.
    - Only whitelisted executors can write.
  - Users query state via an RPC endpoint without paying gas.
- **Executors:**
  - **Exchange Admin / Backend:** Writes liabilities.
  - **Chainlink Adapter:** Writes asset updates.
  - The executor whitelist is administered by a secure owner (e.g., multisig).

## Security & Privacy Considerations

- **Access Control:**
  - All state‑changing methods are gated by `onlyExecutor`‑style checks.
  - The executor whitelist is managed by a privileged admin contract or multisig.

- **Replay Protection:**
  - Liability and asset updates include timestamps or nonces.
  - Off‑chain and on‑chain logic reject stale or replayed updates.

- **Data Availability:**
  - Liability and inclusion proofs are emitted as events on the VPoR Chain.
  - As long as the chain is available, users can always reconstruct their proofs.

- **Privacy:**
  - Individual balances are not stored in plaintext on‑chain.
  - Encrypted payloads use ECIES, so only the intended user can decrypt their own proofs.
  - Public observers see only aggregate metrics and anonymous commitments.

## Extensibility

The architecture is intentionally modular to support:

- **Multiple asset types:** Extend `AssetVerification` to track BTC, ETH, fiat, etc., with typed identifiers.
- **Multiple exchanges:** Deploy separate VPoR Chains or namespaces per exchange, or shard the Merkle trees.
- **Regulatory hooks:** Add read‑only APIs or specialized views for regulators and auditors.
- **Additional oracles:** Plug in alternative or redundant oracle sources for higher robustness.

This `architecture.md` should be read together with:

- `README.md` – for motivation and quickstart commands.
- `doc.md` – for a narrative of the problem/solution and hackathon framing.
- `.doc.gemini.contracts.md` – for low‑level `GlassVault` and `ChainlinkEVVMAdapter` specifications.


