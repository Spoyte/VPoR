'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Navbar() {
    return (
        <nav className="glass sticky top-0 z-50 border-b border-white/10">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        VPoR
                    </div>
                    <span className="text-sm text-gray-400">Glass Vault</span>
                </div>

                <ConnectButton />
            </div>
        </nav>
    );
}
