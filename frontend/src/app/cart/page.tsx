'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import CartItemCard from '@/components/cart/CartItemCard';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';

type DeliveryZone = 'pickup' | 'city' | 'remote';

const DELIVERY_PRICES = {
    pickup: 0,
    city: 250,
    remote: 350,
};

const DELIVERY_LABELS: Record<DeliveryZone, string> = {
    pickup: 'Самовывоз',
    city: 'Доставка (город)',
    remote: 'Доставка (отд. районы)',
};

export default function CartPage() {
    const { items, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCartStore();
    const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>('city');

    const subtotal = totalPrice();
    const deliveryFee = DELIVERY_PRICES[deliveryZone];
    const total = subtotal + deliveryFee;

    return (
        <main className="min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-40 glass px-4 py-3">
                <div className="flex items-center gap-3">
                    <Link href="/" className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
                    </Link>
                    <h1 className="text-xl font-bold flex-1" style={{ fontFamily: 'var(--font-heading)' }}>
                        Корзина
                    </h1>
                    {items.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="text-sm text-[var(--text-secondary)] hover:text-[var(--error)] transition-colors"
                        >
                            Очистить
                        </button>
                    )}
                </div>
            </div>

            {items.length > 0 ? (
                <>
                    {/* Items */}
                    <div className="px-4 pt-4">
                        <AnimatePresence mode="popLayout">
                            {items.map((item) => (
                                <motion.div
                                    key={item.product.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                                >
                                    <CartItemCard
                                        item={item}
                                        onUpdateQuantity={updateQuantity}
                                        onRemove={removeItem}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Delivery zone selector */}
                    <div className="px-4 mt-4">
                        <p className="text-sm font-medium mb-2">Способ получения</p>
                        <div className="flex flex-col gap-2">
                            {(Object.keys(DELIVERY_PRICES) as DeliveryZone[]).map((zone) => (
                                <button
                                    key={zone}
                                    onClick={() => setDeliveryZone(zone)}
                                    className={`flex items-center justify-between px-4 py-3 rounded-[var(--radius-lg)] border transition-all text-sm ${deliveryZone === zone
                                            ? 'border-[var(--primary)] bg-[var(--primary-light)]/20'
                                            : 'border-transparent bg-white/50'
                                        }`}
                                >
                                    <span className="font-medium">{DELIVERY_LABELS[zone]}</span>
                                    <span className={`font-bold ${DELIVERY_PRICES[zone] === 0 ? 'text-[var(--success)]' : ''}`}>
                                        {DELIVERY_PRICES[zone] === 0 ? 'Бесплатно' : `${DELIVERY_PRICES[zone]} ₽`}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Promo code */}
                    <div className="px-4 mt-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Промокод"
                                className="flex-1 h-12 rounded-2xl border border-input bg-white/50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            />
                            <Button variant="outline" size="default">Применить</Button>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="px-4 mt-6 mb-4">
                        <div className="rounded-[var(--radius-lg)] bg-white/50 p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--text-secondary)]">Товаров ({totalItems()})</span>
                                <span>{subtotal} ₽</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--text-secondary)]">{DELIVERY_LABELS[deliveryZone]}</span>
                                <span className={deliveryFee === 0 ? 'text-[var(--success)]' : ''}>
                                    {deliveryFee === 0 ? 'Бесплатно' : `${deliveryFee} ₽`}
                                </span>
                            </div>
                            <div className="border-t pt-2 flex justify-between">
                                <span className="font-bold">Итого</span>
                                <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-accent)' }}>
                                    {total} ₽
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Info about payment */}
                    <div className="px-4 mb-28">
                        <div className="rounded-[var(--radius-lg)] bg-[var(--info)]/10 p-3 text-xs text-[var(--text-secondary)] leading-relaxed">
                            💳 Оплата после подтверждения заказа флористом. Ссылка на оплату придёт вам в уведомлении.
                        </div>
                    </div>

                    {/* Fixed bottom */}
                    <div className="fixed bottom-16 left-0 right-0 z-40 glass p-4">
                        <Link href={`/checkout?delivery=${deliveryZone}&fee=${deliveryFee}`} className="block">
                            <Button size="lg" className="w-full gap-2">
                                <ShoppingBag className="w-5 h-5" />
                                Оформить заказ — {total} ₽
                            </Button>
                        </Link>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    <span className="text-5xl mb-4">🛒</span>
                    <p className="text-lg font-medium mb-2">Корзина пуста</p>
                    <p className="text-sm text-[var(--text-secondary)] mb-6">
                        Добавьте товары из каталога
                    </p>
                    <Link href="/catalog">
                        <Button>Перейти в каталог</Button>
                    </Link>
                </div>
            )}
        </main>
    );
}
