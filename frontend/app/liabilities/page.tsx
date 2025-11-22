import { Navbar } from '@/components/Navbar';
import { MerkleTreeVisualizer } from '@/components/MerkleTreeVisualizer';

export default function LiabilitiesPage() {
    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Liability Explorer
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Visualize the Merkle Sum Tree that aggregates all user liabilities.
                        Each leaf represents a user's balance, and the root represents the total exchange liability.
                    </p>
                </div>

                <div className="bg-black/20 rounded-3xl border border-white/5 p-4 backdrop-blur-sm">
                    <MerkleTreeVisualizer />
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">How Verification Works</h3>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">1</span>
                                <span>The exchange generates a <strong>Merkle Sum Tree</strong> containing all user balances.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">2</span>
                                <span>The <strong>Root Hash</strong> and <strong>Total Sum</strong> are committed to the VPoR Chain.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">3</span>
                                <span>Users can verify their inclusion by checking if their leaf node is part of the tree that sums to the root.</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">Privacy by Design</h3>
                        <p className="text-gray-400 mb-4">
                            Unlike a standard public ledger, the Merkle Sum Tree structure allows us to prove solvency
                            (Total Assets ≥ Total Liabilities) without revealing individual user balances to the public.
                        </p>
                        <p className="text-gray-400">
                            Your data is encrypted and only visible to you, while the mathematical proof of your inclusion
                            is publicly verifiable.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
