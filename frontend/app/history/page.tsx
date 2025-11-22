'use client';

import { Navbar } from '@/components/Navbar';
import { GlassCard } from '@/components/GlassCard';

const MOCK_HISTORY = [
    {
        id: 1,
        date: '2024-11-22 14:30',
        type: 'Verification',
        details: 'Verified balance inclusion in Merkle Root 0xAb1...',
        status: 'Success',
        txHash: '0x123...abc'
    },
    {
        id: 2,
        date: '2024-11-20 09:15',
        type: 'Deposit',
        details: 'Deposit of 5.5 ETH detected on-chain',
        status: 'Encrypted',
        txHash: '0x456...def'
    },
    {
        id: 3,
        date: '2024-11-15 18:45',
        type: 'Verification',
        details: 'Verified balance inclusion in Merkle Root 0xCd2...',
        status: 'Success',
        txHash: '0x789...ghi'
    }
];

export default function HistoryPage() {
    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        Verification History
                    </h1>
                    <p className="text-gray-400">
                        A record of all your cryptographic verifications and encrypted events.
                    </p>
                </div>

                <div className="space-y-4">
                    {MOCK_HISTORY.map((item) => (
                        <GlassCard key={item.id} className="flex items-center justify-between group hover:bg-white/5">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                  ${item.type === 'Verification' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}
                `}>
                                    {item.type === 'Verification' ? '🛡️' : '💰'}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-200">{item.type}</div>
                                    <div className="text-sm text-gray-400">{item.details}</div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-sm text-gray-300 mb-1">{item.date}</div>
                                <div className="flex items-center justify-end gap-2">
                                    <span className="text-xs font-mono text-gray-500">{item.txHash}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full border
                    ${item.status === 'Success'
                                            ? 'border-green-500/30 text-green-400 bg-green-500/10'
                                            : 'border-blue-500/30 text-blue-400 bg-blue-500/10'}
                  `}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </main>
        </div>
    );
}
