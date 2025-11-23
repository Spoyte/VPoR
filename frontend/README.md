# VPoR Frontend

Glass Vault interface for Verifiable Proof of Reserves.

## Prerequisites

- **Node.js >= 20.9.0** (current: v18.20.8 - needs upgrade)
- npm or yarn

## Setup

### 1. Upgrade Node.js (Required)

The project uses Next.js 16 which requires Node.js >= 20.9.0.

**Using nvm (recommended):**
```bash
nvm install 20
nvm use 20
```

**Or download from:** https://nodejs.org/

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Configure WalletConnect

Get a project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/) and update `app/providers.tsx`:

```typescript
const config = getDefaultConfig({
  appName: 'VPoR - Glass Vault',
  projectId: 'YOUR_PROJECT_ID_HERE', // Replace this
  chains: [sepolia],
  ssr: true,
});
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Features

### ✅ Implemented (Mock Data)

- **Glassmorphism UI** - Modern, sleek design with glass effects
- **Wallet Connection** - RainbowKit integration for Ethereum wallets
- **Solvency Dashboard** - Public view of exchange assets vs liabilities
- **User Verification** - Private balance decryption (mock eth_decrypt)

### 🔄 Next Steps

- Connect to actual VPoR Chain (GlassVaultEVVM)
- Replace mock data with contract reads
- Implement real `eth_decrypt` for privacy
- Add Merkle proof verification

## Project Structure

```
frontend/
├── app/
│   ├── globals.css        # Glassmorphism styles
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx          # Main dashboard page
│   └── providers.tsx      # Web3 providers (Wagmi/RainbowKit)
├── components/
│   ├── GlassCard.tsx      # Reusable glass card component
│   ├── Navbar.tsx         # Top navigation with wallet button
│   ├── SolvencyDashboard.tsx # Public solvency metrics
│   └── UserVerification.tsx  # Private balance verification
```

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **RainbowKit** - Wallet connection
- **Wagmi** - Ethereum hooks
- **Viem** - Ethereum client
- **Framer Motion** - Animations

---

**Built for ETHGlobal Buenos Aires Hackathon**
