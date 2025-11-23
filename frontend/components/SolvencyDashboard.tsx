'use client';

import { GlassCard } from './GlassCard';
import { useGlassVault } from '../hooks/useGlassVault';
import { formatEther } from 'viem';

export function SolvencyDashboard() {
    const {
        totalAssets,
        totalLiabilities,
        reserveRatio,
        isSolvent,
        lastLiabilityUpdate,
        lastAssetUpdate,
    } = useGlassVault();

    // Calculate sync status
    const getSyncStatus = () => {
        if (!lastLiabilityUpdate || !lastAssetUpdate) return 'yellow';

        const now = Math.floor(Date.now() / 1000);
        const liabilityAge = now - Number(lastLiabilityUpdate);
        const assetAge = now - Number(lastAssetUpdate);

        // Red if assets > liabilities (insolvent)
        if (!isSolvent) return 'red';
        // Yellow if either update is > 1 hour old
        if (liabilityAge > 3600 || assetAge > 3600) return 'yellow';
        // Green otherwise
        return 'green';
    };

    const syncStatus = getSyncStatus();
    const syncColors = {
        green: 'bg-green-400',
        yellow: 'bg-yellow-400',
        red: 'bg-red-400',
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                    Exchange Solvency Monitor
                </h1>
                <p className="text-gray-400">Real-time verification powered by EVVM & Chainlink</p>

                {/* Sync Indicator */}
                <div className="mt-4 flex items-center justify-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${syncColors[syncStatus]} animate-pulse`} />
                    <span className="text-sm text-gray-400">
                        {syncStatus === 'green' && 'Synced'}
                        {syncStatus === 'yellow' && 'Stale Data'}
                        {syncStatus === 'red' && 'Insolvent'}
                    </span>
                </div>
            </div>

            {/* Reserve Ratio */}
            <GlassCard variant="strong" className="text-center">
                <div className="text-sm text-gray-400 mb-2">Reserve Ratio</div>
                <div className={`text-6xl font-bold mb-2 ${isSolvent ? 'text-green-400' : 'text-red-400'}`}>
                    {reserveRatio.toFixed(2)}%
                </div>
                <div className="flex items-center justify-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isSolvent ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
                    <span className={isSolvent ? 'text-green-400' : 'text-red-400'}>
                        {isSolvent ? 'SOLVENT' : 'INSOLVENT'}
                    </span>
                </div>
            </GlassCard>

            {/* Assets vs Liabilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard>
                    <div className="text-sm text-gray-400 mb-2">Total Assets (Verified)</div>
                    <div className="text-3xl font-bold text-blue-400 mb-1">
                        {totalAssets ? `${parseFloat(formatEther(totalAssets)).toFixed(2)} ETH` : 'Loading...'}
                    </div>
                    <div className="text-xs text-gray-500">Verified by Chainlink DON</div>
                </GlassCard>

                <GlassCard>
                    <div className="text-sm text-gray-400 mb-2">Total Liabilities</div>
                    <div className="text-3xl font-bold text-cyan-400 mb-1">
                        {totalLiabilities ? `${parseFloat(formatEther(totalLiabilities)).toFixed(2)} ETH` : 'Loading...'}
                    </div>
                    <div className="text-xs text-gray-500">From Merkle Sum Tree</div>
                </GlassCard>
            </div>

            {/* Last Update */}
            <GlassCard className="text-center">
                <div className="text-sm text-gray-400">
                    Last updated: <span className="text-gray-300">
                        {lastLiabilityUpdate ? new Date(Number(lastLiabilityUpdate) * 1000).toLocaleString() : 'Never'}
                    </span>
                </div>
            </GlassCard>
        </div>
    );
}
