# Testing VPoR Backend Integration

This guide explains how to test the full "Engine" flow: generating liability proofs and submitting them to the `GlassVaultEVVM` contract on a local testnet.

## Prerequisites

-   **Foundry**: For running Anvil and deploying contracts.
-   **Node.js**: For running the backend scripts.

## Step 1: Start Local Blockchain

Open a terminal and start Anvil. This simulates the EVVM Chain.

```bash
# Terminal 1
cd contracts
anvil
```

Keep this terminal open. You will see transaction logs here.

## Step 2: Deploy GlassVaultEVVM

Open a **new terminal** to deploy the contract.

```bash
# Terminal 2
cd contracts

# Deploy using the script
PRIVATE_KEY=<PRIVATE_KEY> forge script script/DeployGlassVault.s.sol:DeployGlassVault --rpc-url http://127.0.0.1:8545 --broadcast
```

**Copy the Deployed Address** from the output. It will look like this:
`GlassVaultEVVM deployed at: 0x...`

## Step 3: Run the Fisher (Liability Publisher)

Now, go to the backend directory and run the script using the address you just copied.

```bash
# Terminal 2 (continued)
cd ../backend
npm install

# Replace <ADDRESS> with your actual deployed address
GLASS_VAULT_ADDRESS=<ADDRESS> npx ts-node src/fisher.ts
```

## Step 4: Verify Success

### In the Backend Terminal
You should see:
```text
Loaded 3 users.
Liability Root: 0x...
Total Liabilities: 7500000000000000000
Using dummy public key: ...
Proofs encrypted.
Submitting proof to 0x...
Transaction sent: 0x...
Transaction confirmed!
```

### In the Anvil Terminal
You should see a transaction confirmation block similar to this:
```text
    Transaction: 0x...
    Contract created: ... (or ContractCall)
    Gas used: ...
    Block Number: ...
```
If you see the **Transaction Hash** and **Gas used**, the transaction was mined successfully.


## Troubleshooting

-   **"Transaction failed"**: Ensure Anvil is running and you are using the correct `GLASS_VAULT_ADDRESS`.
-   **"Nonce too low"**: If you restarted Anvil, make sure to reset your Metamask or script state if applicable (though `fisher.ts` uses a fresh provider connection each time).
