## VPoR Frontend – Enhancement Proposals

This document proposes concrete improvements to the `frontend` app to move from a polished mock-driven demo to a production-ready interface.

---

## 1. Architecture & Data Flow

- **Introduce a clear data layer**
  - Add a `services/` or `data/` folder under `frontend` (e.g. `frontend/services/solvency.ts`) for:
    - Contract reads (assets, liabilities, Merkle root) via `viem`/`wagmi`.
    - Off-chain API calls (if any) for auxiliary data.
  - Keep React components dumb where possible by consuming typed helpers/hooks instead of calling web3 primitives directly.

- **Leverage React Query end-to-end**
  - Wrap all asynchronous reads (assets list, liabilities tree, user-proof, history) in `useQuery` hooks, for example:
    - `useSolvencyMetrics()`
    - `useAssets()`
    - `useLiabilitiesTree()`
    - `useUserVerificationProof(address)`
  - Benefits:
    - Built‑in caching and background refresh.
    - Centralized loading/error states.
    - Easier testing and mocking of data.

- **Replace mock data with typed models**
  - Define shared TypeScript types in `frontend/lib/types.ts`:
    - `SolvencySnapshot`, `Asset`, `LiabilityNode`, `VerificationEvent`, `UserProof`, etc.
  - Replace hard-coded mock objects in:
    - `SolvencyDashboard`
    - `AssetTable`
    - `MerkleTreeVisualizer`
    - `HistoryPage`
    - `UserVerification`
  - Use generics and strict types for hooks to avoid `any` and keep the UI aligned with the on-chain schema.

- **Thin page components, richer feature modules**
  - Keep `app/*/page.tsx` focused on layout and composition only.
  - Move feature logic and view components into `/components` or `/features/<area>`:
    - `features/solvency/SolvencyDashboard`
    - `features/assets/AssetTable`
    - `features/liabilities/MerkleTreeSection`
    - `features/history/VerificationHistoryList`
  - This makes it easier to evolve single features without bloating `page.tsx`.

---

## 2. Web3 & Configuration Hardening

- **Externalize WalletConnect config**
  - Replace the literal `projectId: 'YOUR_PROJECT_ID'` in `app/providers.tsx` with env-driven configuration:
    - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
    - `NEXT_PUBLIC_CHAIN_ID` (default to Sepolia, allow environment override).
  - Add validation on startup (e.g. simple runtime checks) to fail fast in misconfigured environments.

- **Network & account UX**
  - Surface explicit messaging when:
    - The user is connected to the wrong network (e.g. mainnet instead of Sepolia).
    - No account is connected but a protected view is opened.
  - Add small non-blocking banners or inline hints in:
    - `UserVerification`
    - `SolvencyDashboard` (when data requires wallet or specific chain).

- **Security & privacy messaging**
  - In `UserVerification`, add:
    - Clear explanation of what is being decrypted and stored locally vs on-chain.
    - A short notice that private decrypted data never leaves the browser.
  - Make link‑outs to documentation or audits easily discoverable from the UI.

---

## 3. UI & UX Improvements

- **Global loading & skeleton states**
  - Replace simple spinners or empty screens with:
    - Skeleton rows for `AssetTable` while data is loading.
    - Placeholder blocks for `SolvencyDashboard` metrics.
    - Skeleton cards in `HistoryPage`.
  - Leverage React Query’s `isLoading` / `isFetching` flags in all pages.

- **Responsive navigation**
  - `Navbar` currently hides nav links on small screens.
  - Proposed:
    - Add a mobile menu / sheet triggered by a hamburger icon.
    - Keep the wallet `ConnectButton` visible on all breakpoints.
    - Ensure the sticky nav does not overlap route content on very small devices.

- **Accessibility**
  - Ensure all interactive elements (buttons, nav links, rows with click handlers) have:
    - Keyboard focus styles and `tabIndex` where relevant.
    - Proper ARIA labels for icons and non-text affordances.
  - Check color contrast of gradients (especially text over glass backgrounds) to exceed WCAG AA.
  - Use semantic HTML where possible (e.g. `<header>`, `<main>`, `<section>`, `<nav>`).

- **Microcopy & explainers**
  - Add short tooltips or “Learn more” links for technical concepts:
    - “Merkle Sum Tree”
    - “Encrypted proof of inclusion”
    - “Solvency ratio”
  - Ensure section headers in Assets, Liabilities, and History clearly answer:
    - What am I looking at?
    - How often is this updated?
    - How does it affect my safety?

- **History view enhancements**
  - Add basic controls:
    - Filter by type (`Verification`, `Deposit`, `Withdrawal`).
    - Sort by date (newest/oldest).
    - Search by tx hash.
  - Make each history item expandable to show:
    - Complete tx hash with a copy button.
    - Link out to a block explorer.

---

## 4. Performance & DX

- **Avoid unnecessary recalculations**
  - Replace `new Date().toLocaleString()` in render paths with:
    - Server-provided timestamps from the backend/chain.
    - Pre-formatted strings or memoized formatters.
  - For mock mode, precompute timestamps in a small helper function outside the React component.

- **Environment-aware mock vs live mode**
  - Introduce a simple feature flag, e.g. `NEXT_PUBLIC_USE_MOCK_DATA`:
    - When `true`, use existing mock structures.
    - When `false`, call real services/hooks.
  - This allows quick demoing while avoiding accidental mock data in staging/production.

- **Developer ergonomics**
  - Add ESLint rules for:
    - Import order.
    - React hooks best practices.
    - No unused vars/imports.
  - Add a few targeted tests (e.g. using `@testing-library/react`) for:
    - `SolvencyDashboard` rendering states (loading / solvent / insolvent).
    - `UserVerification` state transitions (disconnected, decrypting, decrypted).
  - Consider Storybook or similar for iterating on complex components like `MerkleTreeVisualizer`.

---

## 5. Roadmap Alignment (from README “Next Steps”)

The existing `README.md` already lists key functional next steps. The enhancements above help implement them cleanly:

- **Connect to actual VPoR Chain**
  - Implement typed contract read helpers in `services/`.
  - Map those into React Query hooks consumed by the dashboard components.

- **Replace mock data with contract reads**
  - Use shared TS types and feature flags for a smooth transition.

- **Implement real `eth_decrypt`**
  - Encapsulate encryption/decryption in a dedicated utility module.
  - Keep UI components agnostic to the underlying crypto.

- **Add Merkle proof verification**
  - Extend `MerkleTreeVisualizer` to optionally display the proof path for the connected user.
  - Provide a separate hook to fetch and verify proofs (local verification) before rendering “Verified” states.

These changes should preserve the current “glass” aesthetic while making the frontend robust, maintainable, and ready to integrate with the live VPoR stack.


