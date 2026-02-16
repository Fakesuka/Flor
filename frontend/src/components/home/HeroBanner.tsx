'use client';

import { motion } from 'framer-motion';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import Link from 'next/link';

export default function HeroBanner() {
    return (
        <section
            className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
            style={{ background: 'var(--gradient-hero)' }}
        >
            {/* Ambient orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="ambient-orb ambient-orb--rose absolute -top-20 -right-20 w-[420px] h-[420px]" />
                <div className="ambient-orb ambient-orb--sage absolute -bottom-32 -left-20 w-[360px] h-[360px]" />
                <div
                    className="ambient-orb ambient-orb--lavender absolute top-1/3 left-1/2 -translate-x-1/2 w-[280px] h-[280px]"
                    style={{ opacity: 0.15 }}
                />
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
