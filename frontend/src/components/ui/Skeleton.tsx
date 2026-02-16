import { cn } from "@/lib/utils"

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("rounded-[var(--radius-md)] skeleton-warm", className)}
            {...props}
        />
    )
}

export { Skeleton }
