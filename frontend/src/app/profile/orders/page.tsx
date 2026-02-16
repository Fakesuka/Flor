'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, CreditCard, Package, Clock, CheckCircle2,
    ChevronDown, Truck, MapPin, MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import type { Order } from '@/types/order';

// Extended mock orders
const mockOrders: (Order & { status_emoji: string })[] = [
    {
        id: 1042,
        status: 'awaiting_payment',
        status_emoji: '💳',
        delivery_type: 'delivery_city',
        subtotal: '3500',
        delivery_fee: '250',
        total: '3750',
        recipient_name: 'Мария',
        recipient_phone: '+7 (999) 888-77-66',
        delivery_address: 'ул. Пушкина, д. 15, кв. 42',
        delivery_date: '16 февраля',
        delivery_time: '14:00-16:00',
        card_text: 'С Днём Рождения! 🎉',
        payment_url: '#',
        is_paid: false,
        created_at: '15 фев 2026, 18:30',
        items: [
            { id: 1, product_id: 1, product_name: 'Нежность', quantity: 1, price: '3500' },
        ],
    },
    {
        id: 1041,
        status: 'in_progress',
        status_emoji: '💐',
        delivery_type: 'pickup',
        subtotal: '4200',
        delivery_fee: '0',
        total: '4200',
        recipient_name: 'Анна',
        recipient_phone: '+7 (999) 123-45-67',
        delivery_date: '15 февраля',
        delivery_time: '12:00-14:00',
        is_paid: true,
        created_at: '14 фев 2026, 10:15',
        items: [
            { id: 2, product_id: 2, product_name: 'Весенний рассвет', quantity: 1, price: '3800' },
            { id: 3, product_id: 9, product_name: 'Хлопок и эвкалипт', quantity: 1, price: '400' },
        ],
    },
    {
        id: 1039,
        status: 'completed',
        status_emoji: '✅',
        delivery_type: 'delivery_city',
        subtotal: '5500',
        delivery_fee: '0',
        total: '5500',
        recipient_name: 'Елена',
        recipient_phone: '+7 (999) 555-33-22',
        delivery_address: 'пр. Ленина, д. 88',
        delivery_date: '10 февраля',
        delivery_time: '10:00-12:00',
        is_paid: true,
        created_at: '9 фев 2026, 20:00',
        items: [
            { id: 4, product_id: 4, product_name: 'Романтика', quantity: 1, price: '5500' },
        ],
    },
    {
        id: 1035,
        status: 'cancelled',
        status_emoji: '❌',
        delivery_type: 'pickup',
        subtotal: '2800',
        delivery_fee: '0',
        total: '2800',
        recipient_name: 'Анна',
        recipient_phone: '+7 (999) 123-45-67',
        delivery_date: '5 февраля',
        delivery_time: '16:00-18:00',
        is_paid: false,
        created_at: '4 фев 2026, 14:30',
        items: [
            { id: 5, product_id: 3, product_name: 'Солнечный день', quantity: 1, price: '2800' },
        ],
    },
];

const statusConfig: Record<string, { label: string; color: string; pulse: boolean }> = {
    pending: { label: 'Ожидает подтверждения', color: 'var(--info)', pulse: true },
    awaiting_payment: { label: 'Не оплачен', color: 'var(--warning)', pulse: true },
    paid: { label: 'Оплачен', color: 'var(--success)', pulse: false },
    in_progress: { label: 'Собирается', color: 'var(--primary)', pulse: true },
    ready: { label: 'Готов к выдаче', color: 'var(--secondary)', pulse: false },
    delivering: { label: 'Доставляется', color: 'var(--primary)', pulse: true },
    completed: { label: 'Завершён', color: 'var(--success)', pulse: false },
    cancelled: { label: 'Отменён', color: 'var(--error)', pulse: false },
};

export default function OrdersPage() {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const activeOrders = mockOrders.filter((o) => !['completed', 'cancelled'].includes(o.status));
    const pastOrders = mockOrders.filter((o) => ['completed', 'cancelled'].includes(o.status));

    return (
        <main className="min-h-screen pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 glass px-4 py-3">
                <div className="flex items-center gap-3">
                    <Link href="/profile" className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
                    </Link>
                    <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                        Мои заказы
                    </h1>
                </div>
            </div>

            <div className="px-4 mt-4 space-y-6">
                {/* Active orders */}
                {activeOrders.length > 0 && (
                    <div>
                        <h2 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                            Активные
                        </h2>
                        <div className="space-y-3">
                            {activeOrders.map((order, i) => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    index={i}
                                    isExpanded={expandedId === order.id}
                                    onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Past orders */}
                {pastOrders.length > 0 && (
                    <div>
                        <h2 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                            Завершённые
                        </h2>
                        <div className="space-y-3">
                            {pastOrders.map((order, i) => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    index={i + activeOrders.length}
                                    isExpanded={expandedId === order.id}
                                    onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {mockOrders.length === 0 && (
                    <div className="text-center py-16">
                        <span className="text-5xl mb-4 block">📦</span>
                        <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Пока пусто</h2>
                        <p className="text-sm text-[var(--text-secondary)] mb-6">Ваши заказы появятся здесь</p>
                        <Link href="/">
                            <Button>Выбрать букет</Button>
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}

/* ---- Order Card ---- */

function OrderCard({
    order,
    index,
    isExpanded,
    onToggle,
}: {
    order: (typeof mockOrders)[0];
    index: number;
    isExpanded: boolean;
    onToggle: () => void;
}) {
    const config = statusConfig[order.status];
    const needsPayment = order.status === 'awaiting_payment';

    return (
        <motion.div
            className={`rounded-[var(--radius-lg)] bg-white/60 overflow-hidden transition-all ${needsPayment ? 'ring-2 ring-[var(--warning)]/50' : ''
                }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            {/* Card header — always visible */}
            <button
                onClick={onToggle}
                className="w-full px-4 py-3.5 flex items-center gap-3 text-left active:bg-[var(--primary-light)]/10 transition-colors"
            >
                <span className="text-2xl">{order.status_emoji}</span>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-sm">Заказ #{order.id}</span>
                        {/* Status badge */}
                        <div className="flex items-center gap-1">
                            {config.pulse && (
                                <motion.div
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: config.color }}
                                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.2 }}
                                />
                            )}
                            <span
                                className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                                style={{
                                    backgroundColor: `color-mix(in srgb, ${config.color} 15%, transparent)`,
                                    color: config.color,
                                }}
                            >
                                {config.label}
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">{order.created_at}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-accent)' }}>
                        {parseInt(order.total).toLocaleString()} ₽
                    </p>
                    <ChevronDown
                        className={`w-4 h-4 text-[var(--text-secondary)] mx-auto mt-0.5 transition-transform ${isExpanded ? 'rotate-180' : ''
                            }`}
                    />
                </div>
            </button>

            {/* Expanded details */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 border-t border-[var(--background)] pt-3 space-y-3">
                            {/* Items */}
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-2">Состав</p>
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between text-sm mb-1.5">
                                        <span>{item.product_name} × {item.quantity}</span>
                                        <span className="font-medium">{parseInt(item.price).toLocaleString()} ₽</span>
                                    </div>
                                ))}
                                {parseInt(order.delivery_fee) > 0 && (
                                    <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
                                        <span>Доставка</span>
                                        <span>{parseInt(order.delivery_fee).toLocaleString()} ₽</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-sm font-bold border-t border-dashed border-[var(--text-secondary)]/20 pt-1.5 mt-1.5">
                                    <span>Итого</span>
                                    <span style={{ fontFamily: 'var(--font-accent)' }}>{parseInt(order.total).toLocaleString()} ₽</span>
                                </div>
                            </div>

                            {/* Delivery info */}
                            <div className="space-y-1.5">
                                <div className="flex items-start gap-2 text-xs">
                                    <MapPin className="w-3.5 h-3.5 text-[var(--text-secondary)] mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium">{order.delivery_type === 'pickup' ? 'Самовывоз' : order.delivery_address}</p>
                                        <p className="text-[var(--text-secondary)]">{order.delivery_date}, {order.delivery_time}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 text-xs">
                                    <Truck className="w-3.5 h-3.5 text-[var(--text-secondary)] mt-0.5 shrink-0" />
                                    <p>Получатель: <span className="font-medium">{order.recipient_name}</span>, {order.recipient_phone}</p>
                                </div>
                                {order.card_text && (
                                    <div className="flex items-start gap-2 text-xs">
                                        <MessageSquare className="w-3.5 h-3.5 text-[var(--text-secondary)] mt-0.5 shrink-0" />
                                        <p className="italic">&ldquo;{order.card_text}&rdquo;</p>
                                    </div>
                                )}
                            </div>

                            {/* Pay button */}
                            {needsPayment && (
                                <motion.div
                                    animate={{ scale: [1, 1.01, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    <Button size="sm" className="w-full gap-2" onClick={() => alert('Переход к оплате...')}>
                                        <CreditCard className="w-4 h-4" />
                                        Оплатить {parseInt(order.total).toLocaleString()} ₽
                                    </Button>
                                </motion.div>
                            )}

                            {/* Repeat order */}
                            {order.status === 'completed' && (
                                <Button variant="outline" size="sm" className="w-full gap-2">
                                    <Package className="w-4 h-4" />
                                    Повторить заказ
                                </Button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
