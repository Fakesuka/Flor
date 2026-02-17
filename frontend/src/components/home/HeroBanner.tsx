'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroBanner() {
    const prefersReducedMotion = useReducedMotion();

    return (
        <section
            className="relative min-h-[460px] md:min-h-[70vh] flex items-center justify-center overflow-hidden"
        >
            <div className="hero-bg" />
            <div className="hero-frame" />

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

            <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
                <motion.h1
                    className="text-4xl md:text-5xl font-semibold mb-5 text-[#2a2623] tracking-[0.01em]"
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
                    className="text-lg mb-10 text-[#6b635c] tracking-wide"
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
