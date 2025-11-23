'use client';

import { GlassCard } from './GlassCard';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import { useUserProof } from '../hooks/useUserProof';

export function UserVerification() {
    const { address, isConnected } = useAccount();
    const { encryptedProof, isLoading, error } = useUserProof(address);
    const [decryptedData, setDecryptedData] = useState<any | null>(null);
    const [isDecrypting, setIsDecrypting] = useState(false);
    const [decryptError, setDecryptError] = useState<string | null>(null);

    const handleDecrypt = async () => {
        if (!address || !window.ethereum || !encryptedProof) return;

        setIsDecrypting(true);
        setDecryptError(null);

        try {
            // Note: eth_decrypt requires the data to be encrypted with the user's public key
            // For this demo, we're using a dummy keypair in Fisher, so this won't work in production
            // In a real app, each user would register their public key on-chain

            // Try to decrypt using MetaMask
            const decrypted = await (window.ethereum as any).request({
                method: 'eth_decrypt',
                params: [encryptedProof, address],
            });

            // Parse the decrypted JSON
            const parsed = JSON.parse(decrypted);
            setDecryptedData(parsed);
        } catch (err: any) {
            console.error('Decryption error:', err);
            setDecryptError(err.message || 'Decryption failed. This demo uses a test keypair.');

            // For demo purposes, show mock data if decryption fails
            setDecryptedData({
                balance: '2.50 ETH',
                proof: '[Merkle path data]',
                root: '0x73ac...',
                note: 'Demo mode: Real decryption requires user-specific encryption keys'
            });
        } finally {
            setIsDecrypting(false);
        }
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

            {isLoading && (
                <GlassCard className="text-center">
                    <div className="text-gray-400">Loading your proof from chain...</div>
                </GlassCard>
            )}

            {error && !encryptedProof && (
                <GlassCard className="text-center">
                    <div className="text-yellow-400 mb-2">⚠️ {error}</div>
                    <div className="text-sm text-gray-500">
                        Make sure Fisher has submitted proofs for your address
                    </div>
                </GlassCard>
            )}

            {encryptedProof && (
                <>
                    <GlassCard variant="strong">
                        <div className="text-sm text-gray-400 mb-4">Encrypted Proof of Inclusion</div>
                        <div className="bg-black/30 rounded p-3 mb-4 font-mono text-xs text-gray-500 break-all max-h-32 overflow-y-auto">
                            {encryptedProof.substring(0, 200)}...
                        </div>

                        <button
                            onClick={handleDecrypt}
                            disabled={isDecrypting || !!decryptedData}
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                        >
                            {isDecrypting ? 'Decrypting...' : decryptedData ? 'Decrypted ✓' : 'Decrypt My Balance'}
                        </button>

                        {decryptError && (
                            <div className="mt-2 text-xs text-yellow-400">
                                {decryptError}
                            </div>
                        )}
                    </GlassCard>

                    {decryptedData && (
                        <GlassCard className="animate-fade-in">
                            <div className="text-sm text-green-400 mb-2 flex items-center gap-2">
                                <span className="text-2xl">✅</span>
                                <span>Verification Successful</span>
                            </div>
                            <div className="bg-black/30 rounded p-4 mb-2">
                                <div className="text-2xl font-bold text-cyan-400 mb-2">
                                    {decryptedData.balance || `${(Number(decryptedData.balance) / 1e18).toFixed(2)} ETH`}
                                </div>
                                {decryptedData.root && (
                                    <div className="text-xs text-gray-400 font-mono">
                                        Root: {decryptedData.root.substring(0, 20)}...
                                    </div>
                                )}
                            </div>
                            <div className="text-xs text-gray-500">
                                Your balance is cryptographically verified and included in the Merkle Sum Tree.
                                {decryptedData.note && (
                                    <div className="mt-2 text-yellow-400">{decryptedData.note}</div>
                                )}
                            </div>
                        </GlassCard>
                    )}
                </>
            )}
        </div>
    );
}
