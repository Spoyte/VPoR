'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Navbar() {
    const pathname = usePathname();

    const navLinks = [
        { name: 'Dashboard', href: '/' },
        { name: 'Assets', href: '/assets' },
        { name: 'Liabilities', href: '/liabilities' },
        { name: 'History', href: '/history' },
    ];

    return (
        <nav className="glass sticky top-0 z-50 border-b border-white/10">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            VPoR
                        </div>
                        <span className="text-sm text-gray-400 hidden sm:inline">Glass Vault</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                    pathname === link.href
                                        ? "bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <ConnectButton />
            </div>
        </nav>
    );
}
