import { Navbar } from '@/components/Navbar';
import { AssetTable } from '@/components/AssetTable';

export default function AssetsPage() {
    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Verified Assets
                    </h1>
                    <p className="text-gray-400">
                        Real-time verification of on-chain assets via Chainlink Functions
                    </p>
                </div>

                <AssetTable />

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                        <h3 className="text-lg font-semibold mb-2 text-gray-200">How it works</h3>
                        <p className="text-sm text-gray-400">
                            Chainlink nodes independently query multiple APIs (Blockcypher, Etherscan) to verify wallet balances without trusting the exchange.
                        </p>
                    </div>
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                        <h3 className="text-lg font-semibold mb-2 text-gray-200">Frequency</h3>
                        <p className="text-sm text-gray-400">
                            Assets are verified every 10 minutes or whenever a significant liability change occurs.
                        </p>
                    </div>
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                        <h3 className="text-lg font-semibold mb-2 text-gray-200">Security</h3>
                        <p className="text-sm text-gray-400">
                            Data is cryptographically signed by the Chainlink DON and posted to the VPoR Chain.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
