'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Product } from '@/types/product';
import { useCartStore } from '@/store/cartStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import Link from 'next/link';
import { Strings } from '@/lib/strings';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((s) => s.addItem);
    const toggle = useFavoritesStore((s) => s.toggle);
    const isFavorite = useFavoritesStore((s) => s.ids.includes(product.id));

    const imageUrl = product.primary_image?.image || '/images/placeholder.jpg';
    const hasDiscount = product.discount_price !== null;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product.id);
    };

    const categorySlug = typeof product.category === 'number' ? 'bouquets' : (product.category as any)?.slug || 'bouquets';

    return (
        <Link href={`/catalog/${categorySlug}/${product.slug}`}>
            <motion.div
                className="group relative rounded-[var(--radius-lg)] overflow-hidden bg-[var(--surface)] border border-[var(--primary)]/[0.06] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-[var(--duration-normal)] h-full flex flex-col"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
                whileHover={{ y: -3 }}
            >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-[var(--ivory)]">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[var(--duration-luxe)] group-hover:scale-105"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8eOL4fwAJRwPA/hFxdwAAAABJRU5ErkJggg=="
                    />

                    {product.is_new && (
                        <span className="absolute top-3 left-3 bg-[var(--secondary)] text-white text-[11px] font-medium px-3 py-1 rounded-full z-10 tracking-wide">
                            {Strings.newLabel}
                        </span>
                    )}

                    <motion.button
                        onClick={handleToggleFavorite}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[var(--surface)]/70 backdrop-blur-md flex items-center justify-center transition-colors hover:bg-[var(--surface)]/90 z-10"
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                    >
                        <Heart
                            className={`w-[18px] h-[18px] transition-colors duration-[var(--duration-normal)] ${isFavorite ? 'fill-[var(--error)] text-[var(--error)]' : 'text-[var(--text-secondary)]'}`}
                        />
                    </motion.button>
                </div>

                {/* Info */}
                <div className="p-3.5 flex flex-col flex-1">
                    <div className="flex-1">
                        <h3
                            className="text-[var(--text-primary)] font-medium mb-1.5 line-clamp-1 text-[14px] tracking-[0.005em]"
                            style={{ fontFamily: 'var(--font-heading)' }}
                        >
                            {product.name}
                        </h3>
                        <div className="flex items-baseline gap-2 mb-3">
                            <span
                                className="text-lg font-light text-[var(--text-primary)]"
                                style={{ fontFamily: 'var(--font-accent)', fontSize: '1.15rem' }}
                            >
                                {hasDiscount ? product.discount_price : product.price} {Strings.currency}
                            </span>
                            {hasDiscount && (
                                <span className="text-xs text-[var(--text-muted)] line-through">
                                    {product.price} {Strings.currency}
                                </span>
                            )}
                        </div>
                    </div>

                    <Button size="sm" className="w-full" onClick={handleAddToCart}>
                        {Strings.addToCart}
                    </Button>
                </div>
            </motion.div>
        </Link>
    );
}
