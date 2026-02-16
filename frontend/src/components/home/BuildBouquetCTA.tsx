'use client';

import { motion } from 'framer-motion';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { FadeIn } from '@/components/ui/FadeIn';
import { Flower2, Camera } from 'lucide-react';
import Link from 'next/link';

export default function BuildBouquetCTA() {
    return (
        <section className="px-5 py-10">
            <FadeIn>
                <div
                    className="relative rounded-[var(--radius-xl)] overflow-hidden p-8"
                    style={{
                        background: 'var(--gradient-cta)',
                    }}
                >
                    {/* Ambient orbs */}
                    <div className="ambient-orb ambient-orb--rose absolute -top-10 -right-10 w-40 h-40" style={{ opacity: 0.18 }} />
                    <div className="ambient-orb ambient-orb--lavender absolute -bottom-10 -left-10 w-32 h-32" style={{ opacity: 0.2 }} />
                    <div className="ambient-orb ambient-orb--sage absolute top-1/2 right-1/4 w-24 h-24" style={{ opacity: 0.12 }} />

                    <div className="relative z-10">
                        <h2
                            className="text-2xl font-semibold mb-3 text-[var(--text-primary)] tracking-[0.01em]"
                            style={{ fontFamily: 'var(--font-heading)' }}
                        >
                            Собери свой букет
                        </h2>
                        <p className="text-sm text-[var(--text-secondary)] mb-7 leading-relaxed">
                            Создайте уникальный букет в конструкторе или отправьте фото-пример
                        </p>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link href="/bouquet-builder" className="w-full sm:w-auto">
                                <AnimatedButton className="w-full gap-2">
                                    <Flower2 className="w-4 h-4" />
                                    Конструктор
                                </AnimatedButton>
                            </Link>
                            <Link href="/bouquet-builder/photo" className="w-full sm:w-auto">
                                <AnimatedButton variant="secondary" className="w-full gap-2 bg-[var(--surface)]/50 hover:bg-[var(--surface)]/80">
                                    <Camera className="w-4 h-4" />
                                    Прикрепить фото
                                </AnimatedButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </FadeIn>
        </section>
    );
}
