import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-sm font-medium leading-none text-[var(--text-primary)] tracking-wide">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-12 w-full rounded-[var(--radius-md)] border border-[var(--primary)]/10 bg-[var(--surface)]/60 px-4 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40 focus-visible:border-[var(--primary)]/30 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-[var(--duration-normal)] backdrop-blur-sm",
                        error && "border-[var(--error)] focus-visible:ring-[var(--error)]/40",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && <span className="text-xs text-[var(--error)]">{error}</span>}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
