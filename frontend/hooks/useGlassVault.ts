import { useReadContract } from 'wagmi';
import { GlassVaultEVVMABI, getGlassVaultAddress } from '../contracts/GlassVaultEVVM';

export function useGlassVault() {
    const contractAddress = getGlassVaultAddress();

    const { data: liabilityRoot, error: liabilityRootError } = useReadContract({
        address: contractAddress,
        abi: GlassVaultEVVMABI,
        functionName: 'liabilityRoot',
    });

    const { data: totalLiabilities, error: totalLiabilitiesError } = useReadContract({
        address: contractAddress,
        abi: GlassVaultEVVMABI,
        functionName: 'totalLiabilities',
    });

    const { data: totalAssets, error: totalAssetsError } = useReadContract({
        address: contractAddress,
        abi: GlassVaultEVVMABI,
        functionName: 'totalAssets',
    });

    const { data: lastLiabilityUpdate, error: lastLiabilityUpdateError } = useReadContract({
        address: contractAddress,
        abi: GlassVaultEVVMABI,
        functionName: 'lastLiabilityUpdate',
    });

    const { data: lastAssetUpdate, error: lastAssetUpdateError } = useReadContract({
        address: contractAddress,
        abi: GlassVaultEVVMABI,
        functionName: 'lastAssetUpdate',
    });

    // Log errors for debugging
    if (liabilityRootError) console.error('liabilityRoot error:', liabilityRootError);
    if (totalLiabilitiesError) console.error('totalLiabilities error:', totalLiabilitiesError);
    if (totalAssetsError) console.error('totalAssets error:', totalAssetsError);
    if (lastLiabilityUpdateError) console.error('lastLiabilityUpdate error:', lastLiabilityUpdateError);
    if (lastAssetUpdateError) console.error('lastAssetUpdate error:', lastAssetUpdateError);

    // Calculate solvency metrics safely
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
        isError: !!(totalLiabilitiesError || totalAssetsError),
    };
}
