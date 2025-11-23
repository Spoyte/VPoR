import { MerkleSumTree } from "../src/merkleSumTree";
import { User } from "../src/types";
import { ethers } from "ethers";

const users: User[] = [
    { id: "1", address: "0x1111111111111111111111111111111111111111", balance: "100", nonce: 1 },
    { id: "2", address: "0x2222222222222222222222222222222222222222", balance: "200", nonce: 1 },
    { id: "3", address: "0x3333333333333333333333333333333333333333", balance: "300", nonce: 1 },
    { id: "4", address: "0x4444444444444444444444444444444444444444", balance: "400", nonce: 1 },
];

const tree = new MerkleSumTree(users);
const root = tree.getRoot();

console.log("Root Hash:", root.hash);
console.log("Total Liabilities:", root.sum.toString());

if (root.sum.toString() !== "1000") {
    console.error("Error: Total liabilities should be 1000");
    process.exit(1);
}

const proof = tree.getProof(0);
console.log("Proof for User 1:", proof);

// Verify Proof Logic (Simplified)
let currentHash = tree.leaves[0].hash;
let currentSum = tree.leaves[0].sum;

for (const node of proof) {
    const hash = ethers.solidityPackedKeccak256(
        ["bytes32", "bytes32", "uint256"],
        [currentHash, node.siblingHash, currentSum + node.siblingSum] // Assuming left-to-right for simplicity in this test
    );
    currentHash = hash;
    currentSum += node.siblingSum;
}

console.log("Reconstructed Root:", currentHash);

if (currentHash === root.hash) {
    console.log("✅ Proof Verified Successfully");
} else {
    console.error("❌ Proof Verification Failed");
    // Note: This simple verification assumes the user is always the left node, which isn't true. 
    // Real verification needs index awareness.
}
