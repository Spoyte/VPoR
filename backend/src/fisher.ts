import { ethers } from "ethers";
import EthCrypto from "eth-crypto";
import { MerkleSumTree } from "./merkleSumTree";
import { encryptData } from "./encryption";
import { User } from "./types";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../contracts/.env.example") }); // Load .env.example for now

// ABI for GlassVaultEVVM (Partial)
const GLASS_VAULT_ABI = [
    "function submitLiabilityProof(bytes32 _root, uint256 _totalLiabilities, address[] calldata _users, bytes[] calldata _encryptedProofs) external",
    "function isLiabilityPublisher(address) view returns (bool)"
];

async function main() {
    // 1. Load Data
    const usersPath = path.join(__dirname, "../data/users.json");
    const users: User[] = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
    console.log(`Loaded ${users.length} users.`);

    // 2. Build Tree
    const tree = new MerkleSumTree(users);
    const root = tree.getRoot();
    console.log("Liability Root:", root.hash);
    console.log("Total Liabilities:", root.sum.toString());

    // 3. Encrypt Proofs
    // For the hackathon, we'll use a dummy public key for everyone or derive it if possible.
    // Realistically, we'd look up the user's registered public key.
    // Here we just use a placeholder encryption for demonstration if we don't have real keys.
    // Or we can generate a keypair for testing.

    const encryptedProofs: string[] = [];
    const userAddresses: string[] = [];

    // Generate a random identity for testing encryption
    const identity = EthCrypto.createIdentity();
    const dummyPublicKey = identity.publicKey;
    console.log("Using dummy public key:", dummyPublicKey);

    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const proof = tree.getProof(i);
        const payload = {
            balance: user.balance,
            proof: proof,
            root: root.hash
        };

        // In a real app, we'd use user's specific public key
        const encrypted = await encryptData(dummyPublicKey, payload);
        encryptedProofs.push(encrypted);
        userAddresses.push(user.address);
    }
    console.log("Proofs encrypted.");

    // 4. Submit to Chain
    // Connect to Anvil
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

    // Use the first Anvil account (Default Deployer)
    const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const wallet = new ethers.Wallet(privateKey, provider);

    // Address of GlassVaultEVVM (Must be deployed first!)
    // We will pass this as an argument or env var
    const glassVaultAddress = process.env.GLASS_VAULT_ADDRESS;
    if (!glassVaultAddress) {
        console.error("Please set GLASS_VAULT_ADDRESS env var");
        process.exit(1);
    }

    const glassVault = new ethers.Contract(glassVaultAddress, GLASS_VAULT_ABI, wallet);

    console.log(`Submitting proof to ${glassVaultAddress}...`);

    try {
        const tx = await glassVault.submitLiabilityProof(
            root.hash,
            root.sum,
            userAddresses,
            encryptedProofs.map(p => ethers.toUtf8Bytes(p)) // Convert string to bytes
        );
        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed!");
    } catch (error) {
        console.error("Transaction failed:", error);
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
