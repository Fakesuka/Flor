import * as React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    intensity?: 'light' | 'medium' | 'heavy';
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, intensity = 'medium', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-[var(--radius-lg)] border border-white/25 backdrop-blur-xl shadow-[var(--shadow-glass)] transition-all duration-[var(--duration-normal)]",
                    {
                        'bg-[var(--surface)]/25 backdrop-saturate-[1.2]': intensity === 'light',
                        'bg-[var(--surface)]/55 backdrop-saturate-[1.4]': intensity === 'medium',
                        'bg-[var(--surface)]/75 backdrop-saturate-[1.6]': intensity === 'heavy',
                    },
                    className
                )}
                style={{
                    boxShadow: `var(--shadow-glass), var(--shadow-inner)`,
                }}
                {...props}
            />
        );
    }
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
