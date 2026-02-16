'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { useCartStore } from '@/store/cartStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types/product';
import Image from 'next/image';
import { Strings } from '@/lib/strings';

interface ProductDetailClientProps {
    product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((s) => s.addItem);
    const toggleFav = useFavoritesStore((s) => s.toggle);
    const isFavorite = useFavoritesStore((s) => s.ids.includes(product.id));

    const handleAddToCart = () => {
        addItem(product, quantity);
        router.push('/cart');
    };

    const hasDiscount = product.discount_price !== null;
    const price = hasDiscount ? product.discount_price! : product.price;
    const numericPrice = parseFloat(price.replace(/[^\d.]/g, '')) * quantity;

    return (
        <main className="min-h-screen">
            {/* Image area */}
            <div className="relative aspect-square bg-[var(--primary-light)]/30">
                {/* Nav overlay */}
                <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
                    <Link
                        href="/catalog"
                        className="w-10 h-10 rounded-full glass flex items-center justify-center backdrop-blur-md bg-white/30 hover:bg-white/50 transition-colors"
                        aria-label="Назад в каталог"
                    >
                        <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
                    </Link>
                    <motion.button
                        onClick={() => toggleFav(product.id)}
                        className="w-10 h-10 rounded-full glass flex items-center justify-center backdrop-blur-md bg-white/30 hover:bg-white/50 transition-colors"
                        whileTap={{ scale: 0.9 }}
                        aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
                    >
                        <Heart
                            className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-[var(--error)] text-[var(--error)]' : 'text-[var(--text-secondary)]'}`}
                        />
                    </motion.button>
                </div>

                {/* Image */}
                <div className="w-full h-full relative">
                    <Image
                        src={product.primary_image?.image || '/images/placeholder.jpg'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        priority
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOp6+t7AgADvAGkRMAcoAAAAABJRU5ErkJggg=="
                    />

                    {product.is_new && (
                        <span className="absolute top-4 left-4 bg-[var(--secondary)] text-white px-3 py-1 rounded-full text-sm font-bold z-10 animate-pulse">
                            {Strings.newLabel}
                        </span>
                    )}
                </div>
            </div>

            {/* Info */}
            <motion.div
                className="relative -mt-6 rounded-t-[var(--radius-xl)] bg-[var(--surface)] px-4 pt-6 pb-32 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
                {/* Name + Price */}
                <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    {product.name}
                </h1>

                <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-accent)' }}>
                        {price} {Strings.currency}
                    </span>
                    {hasDiscount && (
                        <span className="text-lg text-[var(--text-secondary)] line-through">
                            {product.price} {Strings.currency}
                        </span>
                    )}
                </div>

                {/* Badges */}
                <div className="flex gap-2 mb-6">
                    {product.is_new && (
                        <span className="bg-[var(--secondary)] text-white text-xs font-bold px-3 py-1 rounded-full">
                            {Strings.newLabel}
                        </span>
                    )}
                    {product.is_popular && (
                        <span className="bg-[var(--primary)] text-white text-xs font-bold px-3 py-1 rounded-full">
                            {Strings.hitLabel}
                        </span>
                    )}
                </div>

                {/* Description */}
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
                    {product.description || 'Описание отсутствует.'}
                </p>

                {/* Quantity */}
                <div className="flex items-center gap-4 mb-8">
                    <span className="text-sm font-medium">{Strings.quantity}</span>
                    <div className="flex items-center gap-3 rounded-full bg-[var(--background)] px-4 py-2">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="text-lg font-bold text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors p-1"
                            aria-label="Уменьшить"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="text-lg font-bold text-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors p-1"
                            aria-label="Увеличить"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Fixed bottom bar */}
            <div className="fixed bottom-16 left-0 right-0 z-40 glass p-4 border-t border-white/20">
                <div className="flex items-center gap-3 max-w-lg mx-auto">
                    <div className="flex-1">
                        <p className="text-xs text-[var(--text-secondary)]">{Strings.total}</p>
                        <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-accent)' }}>
                            {numericPrice.toLocaleString()} {Strings.currency}
                        </p>
                    </div>
                    <AnimatedButton size="lg" className="gap-2 px-8" onClick={handleAddToCart}>
                        <ShoppingBag className="w-5 h-5" />
                        {Strings.addToCart}
                    </AnimatedButton>
                </div>
            </div>
        </main>
    );
}
