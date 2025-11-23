import GlassVaultABI from './GlassVaultEVVM.abi.json';
import { Abi } from 'viem';

export const GlassVaultEVVMABI = GlassVaultABI as unknown as Abi;

// Contract address - update via environment variable
export const getGlassVaultAddress = () => {
    const address = process.env.NEXT_PUBLIC_GLASS_VAULT_ADDRESS;
    if (!address) {
        console.warn('GLASS_VAULT_ADDRESS not set, using default');
        return '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'; // Default from deployment
    }
    return address as `0x${string}`;
};
