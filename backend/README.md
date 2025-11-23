# VPoR Backend (The Engine)

This directory contains the scripts responsible for generating liability proofs and submitting them to the VPoR Chain.

## 📂 Structure

-   `src/merkleSumTree.ts`: Custom Merkle Sum Tree implementation.
-   `src/encryption.ts`: ECIES encryption utilities.
-   `src/fisher.ts`: The "Fisher" script that acts as the Liability Publisher.
-   `data/users.json`: Dummy user data for testing.

## 🚀 Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Configure Environment:
    The scripts use the `.env` file from the `contracts/` directory (via `contracts/.env.example` or your local `.env`).
    Ensure `GLASS_VAULT_ADDRESS` is set if running against a deployed contract.

## 🛠️ Usage

### Run the Fisher (Submit Proofs)
This script reads `users.json`, builds the Merkle Tree, encrypts user proofs, and submits the root to the `GlassVaultEVVM` contract.

```bash
# Example running against local Anvil
GLASS_VAULT_ADDRESS=0x... npx ts-node src/fisher.ts
```

### Run Tests
Verify the Merkle Tree logic.

```bash
npx ts-node test/merkleTest.ts
```
