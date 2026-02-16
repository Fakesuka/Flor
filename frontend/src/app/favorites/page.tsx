'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useCartStore } from '@/store/cartStore';
import { getProducts } from '@/lib/api';
import type { Product } from '@/types/product';

export default function FavoritesPage() {
    const { ids, toggle, clear } = useFavoritesStore();
    const addItem = useCartStore((s) => s.addItem);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProducts()
            .then((data: Product[] | { results: Product[] }) => {
                const products = Array.isArray(data) ? data : data.results || [];
                setAllProducts(products);
            })
            .catch(() => setAllProducts([]))
            .finally(() => setLoading(false));
    }, []);

    const favoriteProducts = allProducts.filter((p) => ids.includes(p.id));

    return (
        <main className="min-h-screen pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 glass px-4 py-3">
                <div className="flex items-center gap-3">
                    <Link href="/profile" className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
                    </Link>
                    <h1 className="text-xl font-bold flex-1" style={{ fontFamily: 'var(--font-heading)' }}>
                        Избранное
                    </h1>
                    {ids.length > 0 && (
                        <span className="text-sm text-[var(--text-secondary)]">{ids.length} товаров</span>
                    )}
                </div>
            </div>

            {favoriteProducts.length === 0 ? (
                <div className="text-center py-20 px-6">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <span className="text-6xl block mb-4">💝</span>
                        <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                            Здесь пока пусто
                        </h2>
                        <p className="text-sm text-[var(--text-secondary)] mb-6">
                            Нажмите ❤️ на любом товаре, чтобы сохранить
                        </p>
                        <Link href="/">
                            <Button>Смотреть каталог</Button>
                        </Link>
                    </motion.div>
                </div>
            ) : (
                <div className="px-4 mt-4">
                    {/* Clear all */}
                    {ids.length > 2 && (
                        <motion.button
                            onClick={clear}
                            className="flex items-center gap-1 text-xs text-[var(--error)] mb-3 ml-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <Trash2 className="w-3 h-3" /> Очистить всё
                        </motion.button>
                    )}

                    {/* 2-col grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <AnimatePresence>
                            {favoriteProducts.map((product, i) => (
                                <motion.div
                                    key={product.id}
                                    className="rounded-[var(--radius-lg)] bg-white/60 overflow-hidden shadow-sm"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                    transition={{ delay: i * 0.05 }}
                                    layout
                                >
                                    {/* Image area */}
                                    <div className="relative aspect-square bg-gradient-to-br from-[var(--primary-light)]/40 to-[var(--secondary-light)]/20 flex items-center justify-center">
                                        <span className="text-4xl">💐</span>

                                        {/* Discount badge */}
                                        {product.discount_price && (
                                            <span className="absolute top-2 left-2 bg-[var(--error)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                                −{Math.round((1 - parseFloat(product.discount_price) / parseFloat(product.price)) * 100)}%
                                            </span>
                                        )}

                                        {/* Heart button */}
                                        <button
                                            onClick={() => toggle(product.id)}
                                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm"
                                        >
                                            <Heart className="w-4 h-4 text-[var(--error)] fill-[var(--error)]" />
                                        </button>
                                    </div>

                                    {/* Info */}
                                    <div className="p-3">
                                        <h3 className="text-sm font-medium mb-1 line-clamp-1">{product.name}</h3>
                                        <div className="flex items-baseline gap-2 mb-2">
                                            {product.discount_price ? (
                                                <>
                                                    <span className="text-sm font-bold text-[var(--primary)]" style={{ fontFamily: 'var(--font-accent)' }}>
                                                        {parseInt(product.discount_price).toLocaleString()} ₽
                                                    </span>
                                                    <span className="text-xs text-[var(--text-secondary)] line-through">
                                                        {parseInt(product.price).toLocaleString()} ₽
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-accent)' }}>
                                                    {parseInt(product.price).toLocaleString()} ₽
                                                </span>
                                            )}
                                        </div>

                                        {/* Add to cart */}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full gap-1.5 text-xs"
                                            onClick={() => addItem(product)}
                                        >
                                            <ShoppingBag className="w-3.5 h-3.5" />
                                            В корзину
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </main>
    );
}
