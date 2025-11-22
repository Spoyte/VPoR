'use client';

import { GlassCard } from './GlassCard';

interface Asset {
    symbol: string;
    name: string;
    balance: number;
    price: number;
    value: number;
    source: string;
    lastVerified: string;
    status: 'Verified' | 'Pending' | 'Failed';
}

const MOCK_ASSETS: Asset[] = [
    {
        symbol: 'BTC',
        name: 'Bitcoin',
        balance: 15.5,
        price: 65000,
        value: 1007500,
        source: 'Chainlink (Blockcypher)',
        lastVerified: '10 mins ago',
        status: 'Verified',
    },
    {
        symbol: 'ETH',
        name: 'Ethereum',
        balance: 120.0,
        price: 3500,
        value: 420000,
        source: 'Chainlink (Etherscan)',
        lastVerified: '5 mins ago',
        status: 'Verified',
    },
    {
        symbol: 'USDC',
        name: 'USD Coin',
        balance: 50000,
        price: 1.0,
        value: 50000,
        source: 'Chainlink (Circle API)',
        lastVerified: '1 hour ago',
        status: 'Verified',
    },
];

export function AssetTable() {
    return (
        <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 text-gray-400 text-sm">
                            <th className="pb-4 pl-4">Asset</th>
                            <th className="pb-4">Balance</th>
                            <th className="pb-4">Price</th>
                            <th className="pb-4">Total Value</th>
                            <th className="pb-4">Source</th>
                            <th className="pb-4">Last Verified</th>
                            <th className="pb-4 pr-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        {MOCK_ASSETS.map((asset) => (
                            <tr key={asset.symbol} className="group hover:bg-white/5 transition-colors">
                                <td className="py-4 pl-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-xs">
                                            {asset.symbol[0]}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{asset.name}</div>
                                            <div className="text-xs text-gray-500">{asset.symbol}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 font-mono">{asset.balance.toLocaleString()}</td>
                                <td className="py-4 text-gray-400">${asset.price.toLocaleString()}</td>
                                <td className="py-4 font-semibold text-blue-400">${asset.value.toLocaleString()}</td>
                                <td className="py-4 text-sm text-gray-400">{asset.source}</td>
                                <td className="py-4 text-sm text-gray-500">{asset.lastVerified}</td>
                                <td className="py-4 pr-4 text-right">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                        {asset.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </GlassCard>
    );
}
