'use client';

import { GlassCard } from './GlassCard';
import { useAccount } from 'wagmi';
import { useState } from 'react';

// Mock encrypted data - will be replaced with real on-chain data
const MOCK_ENCRYPTED_DATA = '0x7a9f2b8e3c1d4f6a8b9c2e1f3d5a7b9c4e6f8a1b3c5d7e9f1a3b5c7d9e1f3a5b7c';

export function UserVerification() {
    const { address, isConnected } = useAccount();
    const [decryptedData, setDecryptedData] = useState<string | null>(null);
    const [isDecrypting, setIsDecrypting] = useState(false);

    const handleDecrypt = async () => {
        if (!address || !window.ethereum) return;

        setIsDecrypting(true);

        // Simulate decryption for now - will use eth_decrypt in production
        setTimeout(() => {
            setDecryptedData(JSON.stringify({
                balance: '5.5 ETH',
                lastDeposit: '2024-11-20',
                verified: true,
                blockNumber: 12345678
            }, null, 2));
            setIsDecrypting(false);
        }, 1500);
    };

    if (!isConnected) {
        return (
            <GlassCard className="text-center">
                <div className="text-gray-400 mb-4">
                    Connect your wallet to verify your account balance
                </div>
                <div className="text-sm text-gray-500">
                    Your encrypted proof of inclusion will be fetched from the VPoR Chain
                </div>
            </GlassCard>
        );
    }

    return (
        <div className="space-y-4">
            <GlassCard>
                <div className="text-sm text-gray-400 mb-2">Your Address</div>
                <div className="text-lg font-mono text-gray-300 break-all">
                    {address}
                </div>
            </GlassCard>

            <GlassCard variant="strong">
                <div className="text-sm text-gray-400 mb-4">Encrypted Proof of Inclusion</div>
                <div className="bg-black/30 rounded p-3 mb-4 font-mono text-xs text-gray-500 break-all">
                    {MOCK_ENCRYPTED_DATA}
                </div>

                <button
                    onClick={handleDecrypt}
                    disabled={isDecrypting || !!decryptedData}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                >
                    {isDecrypting ? 'Decrypting...' : decryptedData ? 'Decrypted ✓' : 'Decrypt My Balance'}
                </button>
            </GlassCard>

            {decryptedData && (
                <GlassCard className="animate-fade-in">
                    <div className="text-sm text-green-400 mb-2 flex items-center gap-2">
                        <span className="text-2xl">✅</span>
                        <span>Verification Successful</span>
                    </div>
                    <pre className="bg-black/30 rounded p-4 text-sm text-gray-300 overflow-x-auto">
                        {decryptedData}
                    </pre>
                    <div className="text-xs text-gray-500 mt-2">
                        Your balance is cryptographically verified and included in the Merkle Sum Tree
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
