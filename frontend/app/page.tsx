import { Navbar } from '@/components/Navbar';
import { SolvencyDashboard } from '@/components/SolvencyDashboard';
import { UserVerification } from '@/components/UserVerification';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-12 space-y-12 max-w-6xl">
        {/* Public Solvency Section */}
        <section>
          <SolvencyDashboard />
        </section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Private Verification Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Your Personal Verification
            </h2>
            <p className="text-gray-400">Decrypt your encrypted proof of inclusion</p>
          </div>
          <UserVerification />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-white/10 text-center text-gray-500 text-sm">
        <p>VPoR - Glass Vault Protocol</p>
        <p className="mt-1">Powered by EVVM & Chainlink</p>
      </footer>
    </div>
  );
}
