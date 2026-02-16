'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Home, Package } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

/*
 * Animated order-success page.
 * Phase 1: Big animated scene — envelope flies into a flower shop icon.
 * Phase 2: "Ожидает подтверждения" with pulsing dot.
 * Phase 3: Florist confirms → "Оплатить заказ" button appears.
 *
 * Real-time: will come from WebSocket in production.
 * For now we simulate it with a 8-second timer.
 */

export default function OrderSuccessPage() {
    const [phase, setPhase] = useState<'animation' | 'waiting' | 'ready_to_pay'>('animation');
    const [paymentMessage, setPaymentMessage] = useState<string | null>(null);


    // Phase 1 → Phase 2 after animation completes
    useEffect(() => {
        const t1 = setTimeout(() => setPhase('waiting'), 2800);
        return () => clearTimeout(t1);
    }, []);

    // Simulated florist confirmation (replace with WebSocket in production)
    useEffect(() => {
        if (phase !== 'waiting') return;
        const t2 = setTimeout(() => setPhase('ready_to_pay'), 8000);
        return () => clearTimeout(t2);
    }, [phase]);

    const handlePayment = () => {
        setPaymentMessage('Переход к оплате... Интеграция с платёжной системой будет добавлена в следующем обновлении.');
        setTimeout(() => setPaymentMessage(null), 4000);
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
            {/* Payment toast notification */}
            <AnimatePresence>
                {paymentMessage && (
                    <motion.div
                        className="fixed top-6 left-4 right-4 z-50 bg-[var(--surface)] rounded-[var(--radius-lg)] shadow-lg p-4 border border-[var(--primary-light)] flex items-center gap-3"
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                    >
                        <CreditCard className="w-5 h-5 text-[var(--primary)] shrink-0" />
                        <p className="text-sm text-[var(--text-primary)]">{paymentMessage}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background decorative petals */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-2xl"
                        initial={{
                            x: Math.random() * 400 - 200,
                            y: -60,
                            rotate: 0,
                            opacity: 0.6,
                        }}
                        animate={{
                            y: 800,
                            rotate: 360,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 6 + Math.random() * 4,
                            delay: i * 0.7,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        style={{ left: `${Math.random() * 100}%` }}
                    >
                        🌸
                    </motion.div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* PHASE 1: Envelope → Flower Shop animation */}
                {phase === 'animation' && (
                    <motion.div
                        key="animation"
                        className="flex flex-col items-center"
                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.4 } }}
                    >
                        {/* Flower shop */}
                        <motion.div
                            className="relative"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                        >
                            <div className="w-28 h-28 rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--primary-light)] to-[var(--primary)] flex items-center justify-center shadow-lg">
                                <span className="text-5xl">🌺</span>
                            </div>
                            {/* Small roof / shop sign */}
                            <motion.div
                                className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--secondary)] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                Florare
                            </motion.div>
                        </motion.div>

                        {/* Flying envelope */}
                        <motion.div
                            className="text-5xl"
                            initial={{ y: 200, x: -120, opacity: 0, rotate: -20, scale: 0.5 }}
                            animate={{
                                y: [-100, -80, -20, 0],
                                x: [-120, -40, 10, 0],
                                opacity: [0, 1, 1, 0],
                                rotate: [-20, -5, 5, 0],
                                scale: [0.5, 1.2, 1, 0.3],
                            }}
                            transition={{
                                duration: 2,
                                delay: 0.5,
                                times: [0, 0.3, 0.7, 1],
                                ease: 'easeInOut',
                            }}
                            style={{ position: 'absolute' }}
                        >
                            ✉️
                        </motion.div>

                        {/* Burst effect when envelope "arrives" */}
                        <motion.div
                            className="absolute"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 1.5, 0], opacity: [0, 0.6, 0] }}
                            transition={{ delay: 2.2, duration: 0.6 }}
                        >
                            <div className="w-32 h-32 rounded-full bg-[var(--primary-light)]" />
                        </motion.div>

                        {/* Text below */}
                        <motion.p
                            className="mt-8 text-lg font-medium text-[var(--text-secondary)]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            Отправляем ваш заказ...
                        </motion.p>
                    </motion.div>
                )}

                {/* PHASE 2: Waiting for florist */}
                {phase === 'waiting' && (
                    <motion.div
                        key="waiting"
                        className="flex flex-col items-center text-center max-w-sm"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Checkmark */}
                        <motion.div
                            className="w-20 h-20 rounded-full bg-[var(--success)]/20 flex items-center justify-center mb-6"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                        >
                            <motion.span
                                className="text-4xl"
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                            >
                                💐
                            </motion.span>
                        </motion.div>

                        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                            Заказ оформлен!
                        </h1>
                        <p className="text-sm text-[var(--text-secondary)] mb-6">
                            Заказ отправлен нашему флористу. Как только он подтвердит заказ, вам придёт ссылка на оплату.
                        </p>

                        {/* Waiting indicator */}
                        <div className="flex items-center gap-3 bg-[var(--warning)]/15 rounded-[var(--radius-lg)] px-5 py-3 mb-8">
                            <motion.div
                                className="w-3 h-3 rounded-full bg-[var(--warning)]"
                                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            />
                            <span className="text-sm font-medium">Ожидает подтверждения флористом</span>
                        </div>

                        {/* Animated progress dots */}
                        <div className="flex gap-2 mb-8">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 h-2 rounded-full bg-[var(--primary)]"
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                                />
                            ))}
                        </div>

                        <div className="space-y-3 w-full">
                            <Link href="/" className="block">
                                <Button variant="outline" size="lg" className="w-full gap-2">
                                    <Home className="w-5 h-5" />
                                    На главную
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}

                {/* PHASE 3: Florist confirmed → Pay now */}
                {phase === 'ready_to_pay' && (
                    <motion.div
                        key="ready_to_pay"
                        className="flex flex-col items-center text-center max-w-sm"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Success animation */}
                        <motion.div
                            className="w-24 h-24 rounded-full bg-[var(--success)]/20 flex items-center justify-center mb-6"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                        >
                            <motion.span
                                className="text-5xl"
                                initial={{ rotate: -180, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
                            >
                                ✅
                            </motion.span>
                        </motion.div>

                        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                            Флорист подтвердил заказ!
                        </h1>
                        <p className="text-sm text-[var(--text-secondary)] mb-8">
                            Ваш букет будет собран с любовью 💕 Осталось только оплатить.
                        </p>

                        {/* Order summary mini card */}
                        <motion.div
                            className="w-full rounded-[var(--radius-lg)] bg-white/60 border border-[var(--primary-light)] p-4 mb-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Package className="w-4 h-4 text-[var(--primary)]" />
                                <span className="text-sm font-medium">Заказ #1042</span>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)]">
                                Нажмите кнопку ниже, чтобы перейти к оплате
                            </p>
                        </motion.div>

                        <div className="space-y-3 w-full">
                            {/* Payment button — in production this opens payment_url */}
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: [0.9, 1.03, 1] }}
                                transition={{ delay: 0.5, duration: 0.4 }}
                            >
                                <Button
                                    size="lg"
                                    className="w-full gap-2"
                                    onClick={handlePayment}
                                >
                                    <CreditCard className="w-5 h-5" />
                                    Оплатить заказ
                                </Button>
                            </motion.div>

                            <Link href="/" className="block">
                                <Button variant="outline" size="lg" className="w-full">
                                    Оплачу позже
                                </Button>
                            </Link>
                            <p className="text-xs text-[var(--text-secondary)]">
                                Ссылка на оплату также доступна в разделе «Мои заказы»
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
