'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
            {/* Decorative background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[var(--primary-light)] opacity-20 blur-3xl" />
                <div className="absolute -bottom-32 -left-20 w-64 h-64 rounded-full bg-[var(--secondary-light)] opacity-20 blur-3xl" />
            </div>

            <motion.div
                className="relative z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <motion.span
                    className="text-8xl block mb-6"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                >
                    🥀
                </motion.span>

                <h1
                    className="text-4xl font-bold mb-3 text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    Страница не найдена
                </h1>

                <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
                    К сожалению, запрашиваемая страница не существует или была перемещена.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/">
                        <Button size="lg" className="px-8">
                            На главную
                        </Button>
                    </Link>
                    <Link href="/catalog">
                        <Button variant="secondary" size="lg" className="px-8">
                            Каталог
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
