import { useReadContract } from 'wagmi';
import { GlassVaultEVVMABI, getGlassVaultAddress } from '../contracts/GlassVaultEVVM';

export function useGlassVault() {
    const contractAddress = getGlassVaultAddress();

    const { data: liabilityRoot } = useReadContract({
        address: contractAddress,
        abi: GlassVaultEVVMABI,
        functionName: 'liabilityRoot',
    });

    const { data: totalLiabilities } = useReadContract({
        address: contractAddress,
        abi: GlassVaultEVVMABI,
        functionName: 'totalLiabilities',
    });

    const { data: totalAssets } = useReadContract({
        address: contractAddress,
        abi: GlassVaultEVVMABI,
        functionName: 'totalAssets',
    });

    const { data: lastLiabilityUpdate } = useReadContract({
        address: contractAddress,
        abi: GlassVaultEVVMABI,
        functionName: 'lastLiabilityUpdate',
    });

    const { data: lastAssetUpdate } = useReadContract({
        address: contractAddress,
        abi: GlassVaultEVVMABI,
        functionName: 'lastAssetUpdate',
    });

    // Calculate solvency metrics
    const reserveRatio = totalAssets && totalLiabilities && totalLiabilities > 0n
        ? Number((totalAssets * 10000n) / totalLiabilities) / 100
        : 0;

    const isSolvent = totalAssets && totalLiabilities
        ? totalAssets >= totalLiabilities
        : false;

    return {
        liabilityRoot,
        totalLiabilities,
        totalAssets,
        lastLiabilityUpdate,
        lastAssetUpdate,
        reserveRatio,
        isSolvent,
    };
}
