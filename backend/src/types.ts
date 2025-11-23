export interface User {
    id: string;
    address: string;
    balance: string; // BigInt as string
    nonce: number;
}

export interface MerkleNode {
    hash: string;
    sum: bigint;
}
