'use client';

import { GlassCard } from './GlassCard';

// Mock data - will be replaced with real contract data later
const MOCK_DATA = {
    totalAssets: 1_250_000,
    totalLiabilities: 1_180_000,
    lastUpdate: new Date().toLocaleString(),
};

export function SolvencyDashboard() {
    const reserveRatio = (MOCK_DATA.totalAssets / MOCK_DATA.totalLiabilities) * 100;
    const isSolvent = reserveRatio >= 100;

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                    Exchange Solvency Monitor
                </h1>
                <p className="text-gray-400">Real-time verification powered by EVVM & Chainlink</p>
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
                        ${MOCK_DATA.totalAssets.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Verified by Chainlink DON</div>
                </GlassCard>

                <GlassCard>
                    <div className="text-sm text-gray-400 mb-2">Total Liabilities</div>
                    <div className="text-3xl font-bold text-cyan-400 mb-1">
                        ${MOCK_DATA.totalLiabilities.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">From Merkle Sum Tree</div>
                </GlassCard>
            </div>

            {/* Last Update */}
            <GlassCard className="text-center">
                <div className="text-sm text-gray-400">
                    Last updated: <span className="text-gray-300">{MOCK_DATA.lastUpdate}</span>
                </div>
            </GlassCard>
        </div>
    );
}
