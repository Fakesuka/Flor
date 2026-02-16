import { Skeleton } from "@/components/ui/Skeleton"
import { Strings } from "@/lib/strings"

export default function Loading() {
    return (
        <div className="min-h-screen container mx-auto px-4 py-8">
            {/* Header Skeleton */}
            <div className="flex items-center gap-4 mb-8">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-8 w-48" />
            </div>

            {/* Filter Skeleton */}
            <div className="flex gap-2 mb-8 overflow-hidden">
                <Skeleton className="h-9 w-24 rounded-full" />
                <Skeleton className="h-9 w-24 rounded-full" />
                <Skeleton className="h-9 w-24 rounded-full" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-2">
                        <Skeleton className="aspect-square w-full rounded-[var(--radius-lg)]" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-9 w-full rounded-md mt-2" />
                    </div>
                ))}
            </div>
        </div>
    )
}
