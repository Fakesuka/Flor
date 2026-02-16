import Image from 'next/image';
import { FadeIn } from '@/components/ui/FadeIn';
import Link from 'next/link';
import type { Category } from '@/types/product';

interface CategoryCardProps {
    category: Category;
    index: number;
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
    return (
        <Link href={`/catalog/${category.slug}`}>
            <FadeIn delay={index * 0.08} className="h-full">
                <div className="group relative rounded-[var(--radius-lg)] overflow-hidden bg-[var(--surface)] border border-[var(--primary)]/[0.06] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-[var(--duration-normal)] h-full flex flex-col">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-[var(--ivory)]">
                        <Image
                            src={category.image || '/images/placeholder.jpg'}
                            alt={category.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 33vw"
                            className="object-cover transition-transform duration-[var(--duration-luxe)] group-hover:scale-105"
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8eOL4fwAJRwPA/hFxdwAAAABJRU5ErkJggg=="
                        />

                        {/* Soft overlay for text contrast */}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--text-primary)]/10 to-transparent pointer-events-none" />
                    </div>

                    {/* Content */}
                    <div className="p-3.5 text-center">
                        <p
                            className="text-[var(--text-primary)] font-medium text-[15px] tracking-[0.01em]"
                            style={{ fontFamily: 'var(--font-heading)' }}
                        >
                            {category.name}
                        </p>
                    </div>
                </div>
            </FadeIn>
        </Link>
    );
}
