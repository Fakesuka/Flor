'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';
import Link from 'next/link';
import type { Category, Product } from '@/types/product';
import { FadeIn } from '@/components/ui/FadeIn';

interface CategoryClientProps {
    category: Category | undefined;
    initialProducts: Product[];
}

const sortOptions = [
    { label: 'Популярные', value: 'popular' },
    { label: 'Цена ↑', value: 'price_asc' },
    { label: 'Цена ↓', value: 'price_desc' },
    { label: 'Новинки', value: 'new' },
];

export default function CategoryClient({ category, initialProducts }: CategoryClientProps) {
    const [sortBy, setSortBy] = useState('popular');

    // Sort
    let products = [...initialProducts];
    if (sortBy === 'price_asc') products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    if (sortBy === 'price_desc') products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    if (sortBy === 'new') products.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));

    return (
        <main className="min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-40 glass px-4 py-3">
                <div className="flex items-center gap-3">
                    <Link href="/catalog" className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center hover:bg-white transition-colors">
                        <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
                    </Link>
                    <h1 className="text-xl font-bold flex-1" style={{ fontFamily: 'var(--font-heading)' }}>
                        {category?.name || 'Категория'}
                    </h1>
                </div>
            </div>

            {/* Sort pills */}
            <FadeIn delay={0.1}>
                <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
                    {sortOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setSortBy(opt.value)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${sortBy === opt.value
                                ? 'bg-[var(--primary)] text-white shadow-md'
                                : 'bg-white/50 text-[var(--text-secondary)] hover:bg-white'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </FadeIn>

            {/* Products */}
            {products.length > 0 ? (
                <ProductGrid products={products} />
            ) : (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    <p className="text-lg text-[var(--text-secondary)]">В этой категории пока нет товаров</p>
                </div>
            )}
        </main>
    );
}
