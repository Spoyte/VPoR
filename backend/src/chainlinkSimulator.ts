import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../contracts/.env.example") });

// ABI for updateVerifiedAssets
const GLASS_VAULT_ABI = [
    "function updateVerifiedAssets(uint256 _amount, string _assetType) external",
    "function totalAssets() view returns (uint256)",
    "function totalLiabilities() view returns (uint256)",
];

// Simulate Chainlink DON fetching and verifying assets
async function simulateChainlinkAssetVerification() {
    console.log("🔗 Chainlink Asset Verification Simulator");
    console.log("==========================================\n");

    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const wallet = new ethers.Wallet(privateKey, provider);

    const glassVaultAddress = process.env.GLASS_VAULT_ADDRESS;
    if (!glassVaultAddress) {
        console.error("Please set GLASS_VAULT_ADDRESS env var");
        process.exit(1);
    }

    const glassVault = new ethers.Contract(glassVaultAddress, GLASS_VAULT_ABI, wallet);

    // Get liabilities to base our assets on
    const liabilities = await glassVault.totalLiabilities();
    console.log(`Current Liabilities: ${ethers.formatEther(liabilities)} ETH\n`);

    // Simulate different solvency scenarios over time
    const scenarios = [
        { ratio: 1.05, description: "Healthy: 105% reserve" },
        { ratio: 1.10, description: "Excellent: 110% reserve" },
        { ratio: 0.98, description: "⚠️  Warning: 98% reserve (under-collateralized!)" },
        { ratio: 1.00, description: "Borderline: 100% reserve" },
        { ratio: 1.15, description: "Strong: 115% reserve" },
    ];

    let iteration = 0;

    // Update assets every 10 seconds
    const updateInterval = setInterval(async () => {
        const scenario = scenarios[iteration % scenarios.length];
        const assetAmount = (liabilities * BigInt(Math.floor(scenario.ratio * 100))) / 100n;

        console.log(`\n[${new Date().toLocaleTimeString()}] Simulating Chainlink Update:`);
        console.log(`  Scenario: ${scenario.description}`);
        console.log(`  Setting Assets: ${ethers.formatEther(assetAmount)} ETH`);

        try {
            const tx = await glassVault.updateVerifiedAssets(assetAmount, "Bitcoin Cold Wallet");
            console.log(`  Transaction: ${tx.hash}`);
            await tx.wait();
            console.log(`  ✅ Assets verified and updated on-chain`);

            const currentAssets = await glassVault.totalAssets();
            const currentLiabilities = await glassVault.totalLiabilities();
            const ratio = Number((currentAssets * 10000n) / currentLiabilities) / 100;
            console.log(`  Current Reserve Ratio: ${ratio.toFixed(2)}%`);
        } catch (error) {
            console.error(`  ❌ Update failed:`, error);
        }

        iteration++;

        // Stop after 5 iterations (50 seconds)
        if (iteration >= 5) {
            clearInterval(updateInterval);
            console.log("\n✅ Demo simulation complete!");
            console.log("Assets will continue to be available for verification.");
            process.exit(0);
        }
    }, 10000); // Every 10 seconds

    // Initial update immediately
    const initialScenario = scenarios[0];
    const initialAssets = (liabilities * BigInt(Math.floor(initialScenario.ratio * 100))) / 100n;

    console.log(`Initial Update: ${initialScenario.description}`);
    console.log(`Setting Assets: ${ethers.formatEther(initialAssets)} ETH\n`);

    const tx = await glassVault.updateVerifiedAssets(initialAssets, "Bitcoin Cold Wallet");
    await tx.wait();
    console.log(`✅ Initial assets set!\n`);
    console.log("Monitoring will update every 10 seconds...");
    console.log("Watch the frontend at http://localhost:3000\n");
}

simulateChainlinkAssetVerification().catch((error) => {
    console.error(error);
    process.exit(1);
});
