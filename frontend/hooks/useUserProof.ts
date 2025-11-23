import { usePublicClient } from 'wagmi';
import { useState, useEffect } from 'react';
import { GlassVaultEVVMABI, getGlassVaultAddress } from '../contracts/GlassVaultEVVM';

export function useUserProof(userAddress: `0x${string}` | undefined) {
    const [encryptedProof, setEncryptedProof] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const publicClient = usePublicClient();
    const contractAddress = getGlassVaultAddress();

    useEffect(() => {
        if (!userAddress || !publicClient) {
            setIsLoading(false);
            return;
        }

        const fetchProof = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Query ProofOfInclusion events for this user
                const logs = await publicClient.getLogs({
                    address: contractAddress,
                    event: {
                        type: 'event',
                        name: 'ProofOfInclusion',
                        inputs: [
                            { name: 'user', type: 'address', indexed: true },
                            { name: 'encryptedPayload', type: 'bytes', indexed: false },
                        ],
                    },
                    args: {
                        user: userAddress,
                    },
                    fromBlock: 0n,
                    toBlock: 'latest',
                });

                if (logs.length > 0) {
                    // Get the most recent proof
                    const latestLog = logs[logs.length - 1];
                    const encryptedData = (latestLog.args as any).encryptedPayload;

                    // Convert bytes to string
                    if (encryptedData) {
                        setEncryptedProof(encryptedData as string);
                    } else {
                        setError('No encrypted proof found');
                    }
                } else {
                    setError('No proof found for this address');
                }
            } catch (err) {
                console.error('Error fetching proof:', err);
                setError('Failed to fetch proof from chain');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProof();
    }, [userAddress, publicClient, contractAddress]);

    return { encryptedProof, isLoading, error };
}
