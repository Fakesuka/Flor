'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroBanner() {
    const prefersReducedMotion = useReducedMotion();

    return (
        <section
            className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
        >
            <div className="hero-bg" />

            <motion.div
                className="hero-grain"
                animate={prefersReducedMotion ? { x: 0, y: 0 } : { x: [0, 12, 0], y: [0, -8, 0] }}
                transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
            >
                <Image
                    src="/hero/grain.png"
                    alt=""
                    fill
                    priority
                    aria-hidden="true"
                    className="object-cover"
                />
            </motion.div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute inset-y-[-12%] right-[-12%] w-[58vw] min-w-[360px] max-w-[760px] hero-flower-wrap"
                    animate={prefersReducedMotion ? { scale: 1, x: 0, y: 0 } : { scale: [1, 1.03, 1], x: [0, -6, 0], y: [0, 4, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <Image
                        src="/hero/flower.png"
                        alt=""
                        fill
                        priority
                        aria-hidden="true"
                        className="hero-flower object-contain object-right"
                    />
                </motion.div>
            </div>

            <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
                <motion.h1
                    className="text-4xl md:text-5xl font-semibold mb-5 text-[var(--text-primary)] tracking-[0.01em]"
                    style={{
                        fontFamily: 'var(--font-heading)',
                        textShadow: '0 2px 20px rgba(196, 147, 122, 0.12)',
                    }}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                    Цветочная Лавка
                </motion.h1>

                <motion.p
                    className="text-lg mb-10 text-[var(--text-secondary)] tracking-wide"
                    style={{ fontFamily: 'var(--font-body)', lineHeight: 1.8 }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                    Свежие букеты с доставкой
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                    <Link href="/catalog">
                        <AnimatedButton size="lg" className="rounded-full px-12 text-base shadow-[var(--shadow-float)] tracking-wide">
                            Выбрать букет
                        </AnimatedButton>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
