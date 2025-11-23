import { ethers } from "ethers";
import { User, MerkleNode } from "./types";

export class MerkleSumTree {
    leaves: MerkleNode[];
    layers: MerkleNode[][];

    constructor(users: User[]) {
        this.leaves = users.map((user) => this.createLeaf(user));
        this.layers = [this.leaves];
        this.buildTree();
    }

    createLeaf(user: User): MerkleNode {
        const balance = BigInt(user.balance);
        const hash = ethers.solidityPackedKeccak256(
            ["address", "uint256", "uint256"],
            [user.address, balance, user.nonce]
        );
        return { hash, sum: balance };
    }

    buildTree() {
        let currentLayer = this.leaves;
        while (currentLayer.length > 1) {
            const nextLayer: MerkleNode[] = [];
            for (let i = 0; i < currentLayer.length; i += 2) {
                const left = currentLayer[i];
                const right = i + 1 < currentLayer.length ? currentLayer[i + 1] : null;

                if (right) {
                    const sum = left.sum + right.sum;
                    const hash = ethers.solidityPackedKeccak256(
                        ["bytes32", "bytes32", "uint256"],
                        [left.hash, right.hash, sum]
                    );
                    nextLayer.push({ hash, sum });
                } else {
                    // Odd number of nodes, promote the last one
                    nextLayer.push(left);
                }
            }
            this.layers.push(nextLayer);
            currentLayer = nextLayer;
        }
    }

    getRoot(): MerkleNode {
        return this.layers[this.layers.length - 1][0];
    }

    getProof(index: number): { siblingHash: string; siblingSum: bigint }[] {
        const proof = [];
        let currentIndex = index;

        for (let i = 0; i < this.layers.length - 1; i++) {
            const layer = this.layers[i];
            const isRightNode = currentIndex % 2 === 1;
            const siblingIndex = isRightNode ? currentIndex - 1 : currentIndex + 1;

            if (siblingIndex < layer.length) {
                proof.push({
                    siblingHash: layer[siblingIndex].hash,
                    siblingSum: layer[siblingIndex].sum,
                });
            }

            currentIndex = Math.floor(currentIndex / 2);
        }

        return proof;
    }
}
