import { useReadContract } from 'wagmi';
import { GlassVaultEVVMABI, getGlassVaultAddress } from '../contracts/GlassVaultEVVM';

export function useGlassVault() {
    const contractAddress = getGlassVaultAddress();

    const { data: liabilityRoot, error: liabilityRootError, isLoading: isLoadingRoot } = useReadContract({
        address: contractAddress,
        abi: GlassVaultEVVMABI,
        functionName: 'liabilityRoot',
        query: {
            retry: false,
        },
    });

    const { data: totalLiabilities, error: totalLiabilitiesError, isLoading: isLoadingLiabilities } = useReadContract({
        address: contractAddress,
        abi: GlassVaultEVVMABI,
        functionName: 'totalLiabilities',
        query: {
            retry: false,
        },
    });

    const { data: totalAssets, error: totalAssetsError, isLoading: isLoadingAssets } = useReadContract({
        address: contractAddress,
        abi: GlassVaultEVVMABI,
        functionName: 'totalAssets',
        query: {
            retry: false,
        },
    });

    const { data: lastLiabilityUpdate, error: lastLiabilityUpdateError } = useReadContract({
        address: contractAddress,
        abi: GlassVaultEVVMABI,
        functionName: 'lastLiabilityUpdate',
        query: {
            retry: false,
        },
    });

    const { data: lastAssetUpdate, error: lastAssetUpdateError } = useReadContract({
        address: contractAddress,
        abi: GlassVaultEVVMABI,
        functionName: 'lastAssetUpdate',
        query: {
            retry: false,
        },
    });

    // Calculate solvency metrics safely
    const reserveRatio = totalAssets && totalLiabilities && totalLiabilities > 0n
        ? Number((totalAssets * 10000n) / totalLiabilities) / 100
        : 0;

    const isSolvent = totalAssets && totalLiabilities
        ? totalAssets >= totalLiabilities
        : false;

    const isLoading = isLoadingRoot || isLoadingLiabilities || isLoadingAssets;
    const hasError = !!(totalLiabilitiesError || totalAssetsError);

    return {
        liabilityRoot,
        totalLiabilities,
        totalAssets,
        lastLiabilityUpdate,
        lastAssetUpdate,
        reserveRatio,
        isSolvent,
        isError: hasError,
        isLoading,
    };
}
