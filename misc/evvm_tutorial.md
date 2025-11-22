# Creating Your First EVVM

This tutorial guides you through the process of deploying your own EVVM (Ethereum Virtual Virtual Machine) - a virtual blockchain infrastructure that runs on top of existing EVM chains.

## Prerequisites

Before starting, ensure you have the following installed:

- **Foundry**: Solidity development toolkit (includes `forge` and `cast`). [Install Foundry](https://getfoundry.sh/introduction/installation/)
- **Node.js** (>= 18.0): For npm dependency management. [Install Node.js](https://nodejs.org/en/download/)
- **Git**: Version control system. [Install Git](https://git-scm.com/downloads)

## Part 1: Deploying the Infrastructure

We will use the **Interactive Deployment Wizard** which is the easiest way to deploy a complete EVVM instance.

### 1. Clone the Repository

```bash
git clone https://github.com/EVVM-org/Testnet-Contracts
cd Testnet-Contracts
make install
```

This command installs dependencies, initializes submodules, and compiles the contracts.

### 2. Environment Setup

Create your `.env` file from the example:

```bash
cp .env.example .env
```

Edit the `.env` file to add your RPC URLs and Etherscan API key. **Do NOT add private keys here.**

```env
RPC_URL_ETH_SEPOLIA="https://0xrpc.io/sep"
RPC_URL_ARB_SEPOLIA="https://arbitrum-sepolia.therpc.io"
ETHERSCAN_API=your_etherscan_api_key
```

### 3. Secure Key Management

**Important**: If you already have a `defaultKey` that is compromised, delete it first:
```bash
rm -f ~/.foundry/keystores/defaultKey
```

Now, generate a **fresh, secure wallet** and import it:

1.  **Generate a new key**:
    ```bash
    cast wallet new
    ```
    *Copy the `Private Key` from the output. Save it somewhere safe (like a password manager).*

2.  **Import the key**:
    ```bash
    cast wallet import defaultKey --interactive
    ```
    *Paste the private key you just copied and set a secure password.*

> [!TIP]
> **Forgot to set a password?**
> You can change the password of your keystore at any time:
> ```bash
> cast wallet change-password defaultKey
> ```

### 4. Fund Your Wallet (CRITICAL)

**You must have testnet ETH to deploy.**
The error `insufficient funds` means your wallet is empty.

1.  **Check your address**: Run `cast wallet address --account defaultKey` to see your address.
2.  **Get Funds**: Visit a faucet to get Sepolia ETH:
    *   [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
    *   [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
    *   [Infura Faucet](https://www.infura.io/zh/faucet/sepolia)

### 5. Run the Deployment Wizard

Start the interactive wizard:

```bash
npm run wizard
```

The wizard will guide you through:
1.  **Network Selection**: Choose Ethereum Sepolia or Arbitrum Sepolia.
2.  **Wallet Selection**: Select the `defaultKey` you imported.
3.  **Configuration**:
    *   **Admin Address**: The address that will control the EVVM.
    *   **Golden Fisher**: A special "sudo" account for the staking system.
    *   **EVVM Metadata**: Name your chain and token (e.g., "MyEVVM", "MATE").
    *   **Advanced Metadata**: Select **'N'** (No) to use standard defaults.
        *   *If you select 'y', you can customize Total Supply, Staking Rewards pool, and Per-Transaction Rewards.*

### Understanding Configuration Parameters

Here is a detailed breakdown of the parameters you configured:

*   **Admin Address**: The "superuser" of your EVVM. This account has the power to upgrade contracts, change system settings, and manage governance.
*   **Golden Fisher Address**: A special administrative account for the staking system. It can stake and unstake immediately without the usual cooldown periods or limits. Useful for initial setup and emergencies.
*   **Activator Address**: Controls specific feature flags, such as enabling or disabling public staking.
*   **EVVM Name**: The display name of your virtual blockchain (e.g., "EVVM-TESTOOOR").
*   **Principal Token Name/Symbol**: The name and ticker for your EVVM's native token (e.g., "EVVMTESTTKN" / "VMTKN").
*   **Total Supply**: The total number of tokens that will ever exist. Default is ~2 billion.
*   **Era Tokens**: The portion of the total supply reserved specifically for staking rewards (approx. 50%).
*   **Reward**: The base amount of tokens paid to a fisher/staker for successfully processing a transaction (Default: 5 tokens).

### 5. Verification

After deployment, the wizard will attempt to verify contracts on Etherscan/Arbiscan. You can find the deployed addresses in the `broadcast/` directory.

## Part 2: Registration

To make your EVVM discoverable, you must register it in the official **Registry EVVM Contract**.

### 1. Find Your EVVM Address
Run this command to find your deployed contract address:
```bash
grep -A 2 '"contractName": "Evvm"' broadcast/DeployTestnet.s.sol/11155111/run-latest.json
```
*Copy the `contractAddress` (e.g., `0x...`).*

### 2. Register on Sepolia
You need to call the Registry contract on **Ethereum Sepolia**.

*   **Registry Address**: `0x389dC8fb09211bbDA841D59f4a51160dA2377832`
*   **Chain ID**: `11155111` (Sepolia)

Run this command (replace `YOUR_EVVM_ADDRESS`):

```bash
cast send 0x389dC8fb09211bbDA841D59f4a51160dA2377832 "registerEvvm(uint256,address)" 11155111 YOUR_EVVM_ADDRESS --rpc-url $RPC_URL_ETH_SEPOLIA --account defaultKey
```

### 3. Get Your EVVM ID
Check the logs of the transaction or call the registry to see your ID.
*(Usually it will be the next available ID, e.g., 1000, 1001...)*

### 4. Set the ID in Your EVVM
Once you have your ID (let's say `1001`), set it in your contract:

```bash
cast send YOUR_EVVM_ADDRESS "setEvvmID(uint256)" 1001 --rpc-url $RPC_URL_ETH_SEPOLIA --account defaultKey
```

## Part 3: Building on EVVM

Now that your virtual blockchain is running, you can build services on top of it.

### Installation

To interact with your EVVM from a TypeScript application, install the signature library:

```bash
npm install @evvm/viem-signature-library
```

### Basic Usage

Here is how to construct a payment transaction for your EVVM:

```typescript
import { 
  EvvmABI, 
  buildMessageSignedForPay 
} from '@evvm/viem-signature-library';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// Setup client
const account = privateKeyToAccount('0x...');
const client = createWalletClient({
  account,
  transport: http()
});

// 1. Create the message to sign
const message = buildMessageSignedForPay(
  evvmID,           // Your EVVM ID
  toAddress,        // Recipient
  tokenAddress,     // Token (e.g., MATE)
  amount,           // Amount in wei
  priorityFee,      // Fee for fishers
  nonce,            // User nonce
  false,            // priorityFlag (false for sync nonce)
  executorAddress   // Optional executor restriction
);

// 2. Sign the message (EIP-191)
const signature = await account.signMessage({ message });

// 3. Broadcast or Execute
// You can now send this payload to a fisher or execute it directly via the 'pay' function on the EVVM contract.
```

## Next Steps

- Explore **Staking**: Configure staking parameters to incentivize fishers.
- Setup **Name Service**: Allow users to register usernames on your EVVM.
- Build a **Frontend**: Create a dApp that lets users interact with your EVVM.
