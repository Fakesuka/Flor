import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
    {
        variants: {
            variant: {
                default:
                    "bg-[var(--gradient-button)] bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-float)] hover:brightness-[1.04] duration-[var(--duration-normal)]",
                destructive:
                    "bg-[var(--error)] text-white hover:bg-[var(--error)]/90 duration-[var(--duration-normal)]",
                outline:
                    "border border-[var(--primary)]/20 bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--primary-light)]/30 hover:border-[var(--primary)]/30 duration-[var(--duration-normal)]",
                secondary:
                    "border border-[var(--primary)]/30 text-[var(--primary-dark)] bg-transparent hover:bg-[var(--primary-light)]/20 hover:border-[var(--primary)]/40 duration-[var(--duration-normal)]",
                ghost:
                    "hover:bg-[var(--primary-light)]/20 text-[var(--text-accent)] duration-[var(--duration-fast)]",
                link:
                    "text-[var(--primary)] underline-offset-4 hover:underline duration-[var(--duration-fast)]",
                fab:
                    "bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white shadow-[var(--shadow-float)] w-[60px] h-[60px] rounded-full p-0 flex items-center justify-center hover:scale-105 duration-[var(--duration-normal)]",
            },
            size: {
                default: "h-11 px-8 py-2",
                sm: "h-9 rounded-full px-5 text-[13px]",
                lg: "h-14 rounded-full px-10 text-base tracking-wide",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, isLoading, children, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </Comp>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
