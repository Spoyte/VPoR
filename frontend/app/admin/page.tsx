'use client';

import { Navbar } from '@/components/Navbar';
import { GlassCard } from '@/components/GlassCard';
import { useState } from 'react';

export default function AdminPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [lastSubmission, setLastSubmission] = useState<string | null>(null);

    const handleSubmitRoot = async () => {
        setIsSubmitting(true);
        // Simulate contract interaction
        setTimeout(() => {
            setLastSubmission(new Date().toLocaleString());
            setIsSubmitting(false);
            alert('New Liability Root submitted to VPoR Chain!');
        }, 2000);
    };

    const handleTriggerUpdate = async () => {
        setIsUpdating(true);
        // Simulate Chainlink request
        setTimeout(() => {
            setIsUpdating(false);
            alert('Chainlink Functions request sent! Assets will be verified shortly.');
        }, 2000);
    };

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                        Admin Console
                    </h1>
                    <p className="text-gray-400">
                        Restricted access for Exchange Operators and Auditors.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Liability Management */}
                    <GlassCard className="space-y-6">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">Liability Management</h2>
                            <p className="text-sm text-gray-400">
                                Submit a new Merkle Sum Tree root to the VPoR Chain. This updates the total liabilities and enables user verification.
                            </p>
                        </div>

                        <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                            <div className="text-xs text-gray-500 uppercase mb-1">Current Root</div>
                            <div className="font-mono text-sm text-gray-300 break-all">
                                0x7a9f2b8e3c1d4f6a8b9c2e1f3d5a7b9c4e6f8a1b3c5d7e9f1a3b5c7d9e1f3a5
                            </div>
                        </div>

                        <button
                            onClick={handleSubmitRoot}
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit New Root'
                            )}
                        </button>

                        {lastSubmission && (
                            <div className="text-center text-xs text-green-400">
                                Last submitted: {lastSubmission}
                            </div>
                        )}
                    </GlassCard>

                    {/* Asset Verification */}
                    <GlassCard className="space-y-6">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">Asset Verification</h2>
                            <p className="text-sm text-gray-400">
                                Manually trigger a Chainlink Functions request to verify off-chain assets (Bitcoin, Ethereum, Bank APIs).
                            </p>
                        </div>

                        <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-500 uppercase">Oracle Status</span>
                                <span className="text-xs text-green-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    Online
                                </span>
                            </div>
                            <div className="text-sm text-gray-300">
                                Chainlink DON is ready to execute verification scripts.
                            </div>
                        </div>

                        <button
                            onClick={handleTriggerUpdate}
                            disabled={isUpdating}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isUpdating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Requesting...
                                </>
                            ) : (
                                'Trigger Verification'
                            )}
                        </button>
                    </GlassCard>
                </div>
            </main>
        </div>
    );
}
