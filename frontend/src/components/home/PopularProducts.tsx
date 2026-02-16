'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import type { Product } from '@/types/product';
import Link from 'next/link';

interface ProductScrollSectionProps {
    title: string;
    linkHref: string;
    products: Product[];
}

export default function ProductScrollSection({
    title,
    linkHref,
    products,
}: ProductScrollSectionProps) {
    return (
        <section className="py-8">
            <div className="flex items-center justify-between px-5 mb-5">
                <h2
                    className="text-2xl font-semibold tracking-[0.01em] text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    {title}
                </h2>
                <Link
                    href={linkHref}
                    className="flex items-center gap-1 text-sm text-[var(--text-accent)] hover:text-[var(--primary-dark)] transition-colors duration-[var(--duration-normal)]"
                >
                    Все <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="flex gap-3.5 overflow-x-auto px-5 pb-3 snap-x snap-mandatory scrollbar-hide">
                {products.map((product, i) => (
                    <div
                        key={product.id}
                        className="min-w-[170px] max-w-[170px] snap-start"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: 16 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    </div>
                ))}
            </div>
        </section>
    );
}
