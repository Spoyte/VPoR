import { ReactNode } from 'react';
import clsx from 'clsx';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'strong';
}

export function GlassCard({ children, className, variant = 'default' }: GlassCardProps) {
    return (
        <div
            className={clsx(
                variant === 'strong' ? 'glass-strong' : 'glass',
                'rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]',
                className
            )}
        >
            {children}
        </div>
    );
}
