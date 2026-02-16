'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, Package, ChevronDown, Check, X,
    PhoneCall, MessageCircle, Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

/* ================================================
   TYPES
   ================================================ */

interface OrderItem {
    name: string;
    qty: number;
    price: number;
}

interface NewOrder {
    id: number;
    customer: string;
    phone: string;
    total: number;
    delivery_type: 'delivery_city' | 'pickup';
    delivery_date: string;
    delivery_time: string;
    address: string;
    card_text: string;
    card_image?: string | null;
    reference_photo?: string | null;
    items: OrderItem[];
    created_ago: string;
}

interface CurrentOrder {
    id: number;
    customer: string;
    phone: string;
    total: number;
    status: string;
    delivery_type: string;
    delivery_time: string;
    items_summary: string;
    reference_photo?: string | null;
}

interface FloristTask {
    id: number;
    title: string;
    priority: 'high' | 'medium' | 'low';
    is_completed: boolean;
}

/* ================================================
   STORE DATA
   ================================================ */

interface StoreConfig {
    id: number;
    name: string;
    address: string;
    newOrders: NewOrder[];
    currentOrders: CurrentOrder[];
    tasks: FloristTask[];
}

const store1Config: StoreConfig = {
    id: 1,
    name: 'Центральная',
    address: 'ул. Ленина, 25',
    newOrders: [
        {
            id: 1043,
            customer: 'Мария К.',
            phone: '+79998887766',
            total: 3750,
            delivery_type: 'delivery_city',
            delivery_date: '16 фев',
            delivery_time: '14:00',
            address: 'ул. Пушкина 15, кв. 42',
            card_text: 'С Днём Рождения! 🎉',
            card_image: null,
            reference_photo: '/uploads/ref_bouquet_1.jpg',
            items: [
                { name: 'Нежность', qty: 1, price: 3500 },
                { name: 'Открытка', qty: 1, price: 250 },
            ],
            created_ago: '2 мин. назад',
        },
        {
            id: 1044,
            customer: 'Елена С.',
            phone: '+79995553322',
            total: 5500,
            delivery_type: 'pickup',
            delivery_date: '16 фев',
            delivery_time: '16:00',
            address: '',
            card_text: '',
            reference_photo: null,
            items: [{ name: 'Романтика', qty: 1, price: 5500 }],
            created_ago: '5 мин. назад',
        },
    ],
    currentOrders: [
        { id: 1041, customer: 'Анна И.', phone: '+79991234567', total: 4200, status: 'in_progress', delivery_type: 'pickup', delivery_time: '12:00', items_summary: 'Весенний рассвет, Хлопок', reference_photo: null },
        { id: 1040, customer: 'Ольга Р.', phone: '+79993334455', total: 7500, status: 'paid', delivery_type: 'delivery_city', delivery_time: '18:00', items_summary: 'Пион микс', reference_photo: '/uploads/ref_bouquet_2.jpg' },
        { id: 1038, customer: 'Дмитрий В.', phone: '+79997778899', total: 3200, status: 'ready', delivery_type: 'pickup', delivery_time: '14:00', items_summary: 'Утренняя дымка', reference_photo: null },
        { id: 1036, customer: 'Светлана М.', phone: '+79991112233', total: 6200, status: 'completed', delivery_type: 'delivery_city', delivery_time: '10:00', items_summary: 'Весна в Париже', reference_photo: null },
        { id: 1034, customer: 'Иван П.', phone: '+79994445566', total: 4800, status: 'completed', delivery_type: 'pickup', delivery_time: '15:00', items_summary: 'Лавандовый сон', reference_photo: null },
    ],
    tasks: [
        { id: 1, title: 'Проверить свежесть роз', priority: 'high', is_completed: false },
        { id: 2, title: 'Заказать ленты у поставщика', priority: 'medium', is_completed: false },
        { id: 3, title: 'Протереть витрину', priority: 'low', is_completed: true },
        { id: 4, title: 'Пересадить орхидеи', priority: 'medium', is_completed: false },
        { id: 5, title: 'Обновить ценники', priority: 'high', is_completed: false },
    ],
};

const store2Config: StoreConfig = {
    id: 2,
    name: 'Розмарин',
    address: 'пр. Мира, 14',
    newOrders: [
        {
            id: 2058,
            customer: 'Наталья Д.',
            phone: '+79996667788',
            total: 4100,
            delivery_type: 'delivery_city',
            delivery_date: '16 фев',
            delivery_time: '11:00',
            address: 'пр. Победы 22, кв. 8',
            card_text: 'Любимой маме!',
            card_image: null,
            reference_photo: '/uploads/ref_bouquet_3.jpg',
            items: [
                { name: 'Хлопок и эвкалипт', qty: 1, price: 4100 },
            ],
            created_ago: '1 мин. назад',
        },
    ],
    currentOrders: [
        { id: 2055, customer: 'Алексей К.', phone: '+79991119988', total: 3900, status: 'in_progress', delivery_type: 'pickup', delivery_time: '13:00', items_summary: 'Монстера', reference_photo: null },
        { id: 2053, customer: 'Юлия В.', phone: '+79993337788', total: 1800, status: 'paid', delivery_type: 'delivery_city', delivery_time: '17:00', items_summary: 'Сукулент микс', reference_photo: null },
        { id: 2051, customer: 'Татьяна Л.', phone: '+79998889977', total: 5500, status: 'completed', delivery_type: 'pickup', delivery_time: '12:00', items_summary: 'Романтика', reference_photo: null },
    ],
    tasks: [
        { id: 10, title: 'Полить все растения', priority: 'high', is_completed: false },
        { id: 11, title: 'Обновить витрину', priority: 'medium', is_completed: true },
        { id: 12, title: 'Оформить новую коллекцию', priority: 'high', is_completed: false },
    ],
};

export { store1Config, store2Config };
export type { StoreConfig, NewOrder, CurrentOrder, FloristTask };

/* ================================================
   STATUS CONFIG
   ================================================ */

const statusConfig: Record<string, { label: string; color: string; emoji: string; next?: { label: string } }> = {
    paid: { label: 'Оплачен', color: 'var(--success)', emoji: '💰', next: { label: '▶ Начать сборку' } },
    in_progress: { label: 'Собирается', color: 'var(--primary)', emoji: '💐', next: { label: '✅ Готов' } },
    ready: { label: 'Готов', color: 'var(--secondary)', emoji: '📦', next: { label: '🚗 Передать' } },
    delivering: { label: 'Доставляется', color: 'var(--info)', emoji: '🚗', next: { label: '🎉 Завершить' } },
    completed: { label: 'Завершён', color: 'var(--success)', emoji: '✅' },
};

const priorityConfig = {
    high: { emoji: '🔴' },
    medium: { emoji: '🟡' },
    low: { emoji: '⚪' },
};

/* ================================================
   MAIN COMPONENT
   ================================================ */

type Tab = 'new' | 'current' | 'tasks';

export default function FloristPanel({ store }: { store: StoreConfig }) {
    const [tab, setTab] = useState<Tab>('new');
    const [wsConnected, setWsConnected] = useState(false);
    const [newOrders, setNewOrders] = useState(store.newOrders);
    const [currentOrders, setCurrentOrders] = useState(store.currentOrders);
    const [tasks, setTasks] = useState(store.tasks);
    const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setWsConnected(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleAccept = (orderId: number) => {
        const order = newOrders.find((o) => o.id === orderId);
        if (!order) return;
        setNewOrders((prev) => prev.filter((o) => o.id !== orderId));
        setCurrentOrders((prev) => [
            {
                id: order.id, customer: order.customer, phone: order.phone, total: order.total,
                status: 'paid', delivery_type: order.delivery_type, delivery_time: order.delivery_time,
                items_summary: order.items.map((i) => i.name).join(', '),
                reference_photo: order.reference_photo,
            },
            ...prev,
        ]);
    };

    const handleReject = (orderId: number) => {
        setNewOrders((prev) => prev.filter((o) => o.id !== orderId));
    };

    const handleStatusChange = (orderId: number) => {
        setCurrentOrders((prev) =>
            prev.map((o) => {
                if (o.id !== orderId) return o;
                const flow = ['paid', 'in_progress', 'ready', 'delivering', 'completed'];
                const idx = flow.indexOf(o.status);
                return idx < flow.length - 1 ? { ...o, status: flow[idx + 1] } : o;
            }),
        );
    };

    const handleToggleTask = (taskId: number) => {
        setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, is_completed: !t.is_completed } : t)));
    };

    const activeOrders = currentOrders.filter((o) => o.status !== 'completed');
    const doneOrders = currentOrders.filter((o) => o.status === 'completed');

    const tabs: { key: Tab; label: string; badge?: number }[] = [
        { key: 'new', label: '🔔 Новые', badge: newOrders.length },
        { key: 'current', label: '📋 Текущие', badge: activeOrders.length },
        { key: 'tasks', label: '✅ Задачи', badge: tasks.filter((t) => !t.is_completed).length },
    ];

    return (
        <main className="min-h-screen pb-6">
            {/* Photo preview overlay */}
            <AnimatePresence>
                {photoPreview && (
                    <motion.div
                        className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setPhotoPreview(null)}
                    >
                        <motion.div
                            className="relative max-w-sm w-full"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                        >
                            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--primary-light)]/60 to-[var(--secondary-light)]/40 aspect-[3/4] flex items-center justify-center">
                                <div className="text-center">
                                    <span className="text-6xl block mb-2">📸</span>
                                    <p className="text-sm text-white/70">Фото-пример от клиента</p>
                                    <p className="text-xs text-white/50 mt-1">{photoPreview}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setPhotoPreview(null)}
                                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div
                className="px-4 pt-10 pb-4"
                style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)' }}
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                            Панель флориста
                        </h1>
                        <p className="text-xs text-white/50">точка «{store.name}» · {store.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* WebSocket indicator */}
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${wsConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                            <motion.div
                                className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-400' : 'bg-red-400'}`}
                                animate={wsConnected ? { scale: [1, 1.3, 1] } : {}}
                                transition={{ repeat: Infinity, duration: 2 }}
                            />
                            {wsConnected ? 'Live' : '...'}
                        </div>
                        {/* Avatar → main app */}
                        <Link href="/" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <span className="text-lg">🏠</span>
                        </Link>
                    </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { label: 'Новых', value: newOrders.length, color: 'text-yellow-400' },
                        { label: 'В работе', value: activeOrders.length, color: 'text-blue-400' },
                        { label: 'Выполнено', value: doneOrders.length, color: 'text-green-400' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white/5 rounded-xl p-2.5 text-center">
                            <p className={`text-xl font-bold ${stat.color}`} style={{ fontFamily: 'var(--font-accent)' }}>{stat.value}</p>
                            <p className="text-[10px] text-white/40">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tab bar */}
            <div className="sticky top-0 z-40 glass px-2 py-2 flex gap-1">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all relative ${tab === t.key ? 'bg-[var(--primary)] text-white shadow-md' : 'text-[var(--text-secondary)]'
                            }`}
                    >
                        {t.label}
                        {t.badge !== undefined && t.badge > 0 && (
                            <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${tab === t.key ? 'bg-white text-[var(--primary)]' : 'bg-[var(--primary)] text-white'
                                }`}>{t.badge}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="px-4 mt-4">
                <AnimatePresence mode="wait">
                    {/* ======= NEW ORDERS ======= */}
                    {tab === 'new' && (
                        <motion.div key="new" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            {newOrders.length === 0 ? (
                                <div className="text-center py-16">
                                    <span className="text-5xl block mb-4">☕</span>
                                    <h2 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Нет новых заказов</h2>
                                    <p className="text-sm text-[var(--text-secondary)]">Отдохните или займитесь задачами</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {newOrders.map((order, i) => {
                                        const isExpanded = expandedOrder === order.id;
                                        return (
                                            <motion.div
                                                key={order.id}
                                                className="rounded-[var(--radius-lg)] bg-white/70 overflow-hidden border-l-4 border-[var(--warning)] shadow-sm"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                            >
                                                <button onClick={() => setExpandedOrder(isExpanded ? null : order.id)} className="w-full px-4 py-3.5 flex items-center gap-3 text-left">
                                                    <div className="w-10 h-10 rounded-full bg-[var(--warning)]/20 flex items-center justify-center shrink-0">
                                                        <Bell className="w-5 h-5 text-[var(--warning)]" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-sm">#{order.id}</span>
                                                            <span className="text-xs text-[var(--text-secondary)]">{order.created_ago}</span>
                                                            {order.reference_photo && <span className="text-xs">📸</span>}
                                                        </div>
                                                        <p className="text-xs text-[var(--text-secondary)] truncate">{order.customer} · {order.items.map((it) => it.name).join(', ')}</p>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="font-bold text-sm" style={{ fontFamily: 'var(--font-accent)' }}>{order.total.toLocaleString()} ₽</p>
                                                        <p className="text-[10px] text-[var(--text-secondary)]">{order.delivery_type === 'pickup' ? '🏪 Самовывоз' : '🚗 Доставка'}</p>
                                                    </div>
                                                    <ChevronDown className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                </button>

                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                            <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                                                                {/* Items */}
                                                                <div>
                                                                    {order.items.map((item, ii) => (
                                                                        <div key={ii} className="flex justify-between text-sm mb-1">
                                                                            <span>{item.name} × {item.qty}</span>
                                                                            <span className="font-medium">{item.price.toLocaleString()} ₽</span>
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                                {/* Delivery info */}
                                                                <div className="text-xs space-y-1 text-[var(--text-secondary)]">
                                                                    <p>📅 {order.delivery_date}, {order.delivery_time}</p>
                                                                    {order.address && <p>📍 {order.address}</p>}
                                                                    {order.card_text && <p>💌 «{order.card_text}»</p>}
                                                                </div>

                                                                {/* Reference photo */}
                                                                {order.reference_photo && (
                                                                    <button
                                                                        onClick={() => setPhotoPreview(order.reference_photo!)}
                                                                        className="flex items-center gap-2 w-full rounded-xl bg-blue-50 p-3 text-left"
                                                                    >
                                                                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[var(--primary-light)]/50 to-[var(--secondary-light)]/30 flex items-center justify-center shrink-0">
                                                                            <span className="text-2xl">📸</span>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs font-medium text-[var(--primary)]">Фото-пример от клиента</p>
                                                                            <p className="text-[10px] text-[var(--text-secondary)]">Нажмите, чтобы посмотреть</p>
                                                                        </div>
                                                                    </button>
                                                                )}

                                                                {/* Card/postcard placeholder */}
                                                                {order.card_text && (
                                                                    <div className="flex items-center gap-2 rounded-xl bg-pink-50 p-3">
                                                                        <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center shrink-0">
                                                                            <ImageIcon className="w-5 h-5 text-pink-400" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs font-medium text-pink-600">Открытка</p>
                                                                            <p className="text-[10px] text-pink-400">Изображение будет добавлено позже</p>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Actions */}
                                                                <div className="flex gap-2">
                                                                    <Button size="sm" className="flex-1 gap-1" onClick={() => handleAccept(order.id)}>
                                                                        <Check className="w-4 h-4" /> Принять
                                                                    </Button>
                                                                    <Button variant="outline" size="sm" className="gap-1" onClick={() => window.open(`tel:${order.phone}`)}>
                                                                        <PhoneCall className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button variant="outline" size="sm" className="gap-1" onClick={() => window.open(`sms:${order.phone}`)}>
                                                                        <MessageCircle className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button variant="outline" size="sm" className="gap-1 text-[var(--error)]" onClick={() => handleReject(order.id)}>
                                                                        <X className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ======= CURRENT ORDERS ======= */}
                    {tab === 'current' && (
                        <motion.div key="current" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            {activeOrders.length === 0 && doneOrders.length === 0 ? (
                                <div className="text-center py-16">
                                    <span className="text-5xl block mb-4">📋</span>
                                    <h2 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Нет текущих заказов</h2>
                                    <p className="text-sm text-[var(--text-secondary)]">Примите новый заказ</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {activeOrders.length > 0 && (
                                        <div className="space-y-2">
                                            {activeOrders.map((order, i) => {
                                                const config = statusConfig[order.status];
                                                return (
                                                    <motion.div
                                                        key={order.id}
                                                        className="rounded-[var(--radius-lg)] bg-white/70 p-4 shadow-sm"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.05 }}
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-lg">{config?.emoji}</span>
                                                                <div>
                                                                    <span className="font-bold text-sm">#{order.id}</span>
                                                                    <span className="text-xs text-[var(--text-secondary)] ml-2">{order.customer}</span>
                                                                </div>
                                                            </div>
                                                            <span
                                                                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                                                                style={{
                                                                    backgroundColor: `color-mix(in srgb, ${config?.color || '#999'} 15%, transparent)`,
                                                                    color: config?.color,
                                                                }}
                                                            >
                                                                {config?.label}
                                                            </span>
                                                        </div>

                                                        <p className="text-xs text-[var(--text-secondary)] mb-2">
                                                            {order.items_summary} · {order.delivery_type === 'pickup' ? '🏪' : '🚗'} {order.delivery_time}
                                                        </p>

                                                        {/* Reference photo indicator */}
                                                        {order.reference_photo && (
                                                            <button
                                                                onClick={() => setPhotoPreview(order.reference_photo!)}
                                                                className="flex items-center gap-1.5 text-xs text-[var(--primary)] mb-2"
                                                            >
                                                                <span>📸</span> Фото-пример от клиента
                                                            </button>
                                                        )}

                                                        <div className="flex items-center justify-between">
                                                            <span className="font-bold text-sm" style={{ fontFamily: 'var(--font-accent)' }}>
                                                                {order.total.toLocaleString()} ₽
                                                            </span>

                                                            <div className="flex items-center gap-1.5">
                                                                {/* Contact buttons */}
                                                                <button
                                                                    onClick={() => window.open(`tel:${order.phone}`)}
                                                                    className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center"
                                                                    title="Позвонить"
                                                                >
                                                                    <PhoneCall className="w-3.5 h-3.5 text-green-600" />
                                                                </button>
                                                                <button
                                                                    onClick={() => window.open(`sms:${order.phone}`)}
                                                                    className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center"
                                                                    title="Написать"
                                                                >
                                                                    <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
                                                                </button>

                                                                {/* Status action */}
                                                                {config?.next && (
                                                                    <Button size="sm" className="gap-1 text-xs ml-1" onClick={() => handleStatusChange(order.id)}>
                                                                        {config.next.label}
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Completed orders */}
                                    {doneOrders.length > 0 && (
                                        <div>
                                            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Завершённые сегодня ({doneOrders.length})</p>
                                            <div className="space-y-1.5">
                                                {doneOrders.map((order) => (
                                                    <div key={order.id} className="flex items-center gap-3 rounded-xl bg-white/40 px-3 py-2.5">
                                                        <span>✅</span>
                                                        <div className="flex-1 min-w-0">
                                                            <span className="text-sm font-medium">#{order.id} · {order.customer}</span>
                                                            <p className="text-[10px] text-[var(--text-secondary)] truncate">{order.items_summary}</p>
                                                        </div>
                                                        <span className="text-xs font-bold" style={{ fontFamily: 'var(--font-accent)' }}>{order.total.toLocaleString()} ₽</span>
                                                        <button
                                                            onClick={() => window.open(`tel:${order.phone}`)}
                                                            className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center shrink-0"
                                                        >
                                                            <PhoneCall className="w-3 h-3 text-green-600" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ======= TASKS ======= */}
                    {tab === 'tasks' && (
                        <motion.div key="tasks" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="space-y-4">
                                {/* Progress bar */}
                                <div className="rounded-[var(--radius-lg)] bg-white/70 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Прогресс на сегодня</span>
                                        <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-accent)' }}>
                                            {tasks.length > 0 ? Math.round((tasks.filter((t) => t.is_completed).length / tasks.length) * 100) : 0}%
                                        </span>
                                    </div>
                                    <div className="h-2.5 rounded-full bg-gray-200 overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${tasks.length > 0 ? (tasks.filter((t) => t.is_completed).length / tasks.length) * 100 : 0}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-[var(--text-secondary)] mt-1.5">
                                        {tasks.filter((t) => t.is_completed).length} из {tasks.length} задач
                                    </p>
                                </div>

                                {/* Pending */}
                                {tasks.filter((t) => !t.is_completed).map((task, i) => (
                                    <motion.button
                                        key={task.id}
                                        className="w-full flex items-center gap-3 rounded-[var(--radius-lg)] bg-white/70 px-4 py-3.5 text-left active:scale-[0.99] transition-transform"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => handleToggleTask(task.id)}
                                    >
                                        <div className="w-6 h-6 rounded-md border-2 border-[var(--primary)] flex items-center justify-center shrink-0" />
                                        <span className="flex-1 text-sm font-medium">{task.title}</span>
                                        <span className="text-xs">{priorityConfig[task.priority].emoji}</span>
                                    </motion.button>
                                ))}

                                {/* Done */}
                                {tasks.filter((t) => t.is_completed).length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Выполнено</p>
                                        {tasks.filter((t) => t.is_completed).map((task) => (
                                            <motion.button
                                                key={task.id}
                                                className="w-full flex items-center gap-3 rounded-xl bg-white/40 px-3 py-2.5 text-left opacity-60 mb-1.5"
                                                onClick={() => handleToggleTask(task.id)}
                                                layout
                                            >
                                                <div className="w-6 h-6 rounded-md bg-[var(--primary)] flex items-center justify-center shrink-0">
                                                    <Check className="w-3.5 h-3.5 text-white" />
                                                </div>
                                                <span className="text-sm line-through flex-1">{task.title}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
