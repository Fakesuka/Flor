'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { BuilderSelection } from '@/types/builder';
import { componentEmoji } from '@/lib/builderMockData';

interface BouquetPreviewProps {
    selections: BuilderSelection[];
    total: number;
}

export default function BouquetPreview({ selections, total }: BouquetPreviewProps) {
    const flowers = selections.filter((s) => s.component.component_type === 'flower');
    const greenery = selections.filter((s) => s.component.component_type === 'greenery');
    const wrap = selections.find((s) => s.component.component_type === 'wrap');
    const ribbon = selections.find((s) => s.component.component_type === 'ribbon');

    return (
        <div className="space-y-4">
            {/* Visual bouquet representation */}
            <motion.div
                className="relative mx-auto w-56 h-56 rounded-full flex items-center justify-center overflow-hidden"
                style={{
                    background: wrap
                        ? `radial-gradient(circle, ${wrap.component.color}40 0%, ${wrap.component.color}20 70%, transparent 100%)`
                        : 'radial-gradient(circle, var(--primary-light) 0%, transparent 70%)',
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Flowers scattered */}
                <AnimatePresence>
                    {flowers.map((sel, i) => {
                        const total = flowers.reduce((acc, f) => acc + f.quantity, 0);
                        const emoji = componentEmoji[sel.component.name] || '🌼';
                        return Array.from({ length: Math.min(sel.quantity, 5) }).map((_, j) => {
                            const angle = ((i * 5 + j) / Math.max(total, 1)) * Math.PI * 2;
                            const r = 30 + j * 12;
                            return (
                                <motion.span
                                    key={`${sel.component.id}-${j}`}
                                    className="absolute text-2xl"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        scale: 1,
                                        opacity: 1,
                                        x: Math.cos(angle) * r,
                                        y: Math.sin(angle) * r,
                                    }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ delay: (i * 5 + j) * 0.05, type: 'spring' }}
                                >
                                    {emoji}
                                </motion.span>
                            );
                        });
                    })}
                </AnimatePresence>

                {/* Greenery around */}
                {greenery.map((sel, i) => {
                    const emoji = componentEmoji[sel.component.name] || '🌿';
                    return Array.from({ length: Math.min(sel.quantity, 3) }).map((_, j) => {
                        const angle = (((i * 3 + j) * 137.5) / 180) * Math.PI;
                        return (
                            <motion.span
                                key={`g-${sel.component.id}-${j}`}
                                className="absolute text-xl opacity-70"
                                initial={{ scale: 0 }}
                                animate={{
                                    scale: 1,
                                    x: Math.cos(angle) * 70,
                                    y: Math.sin(angle) * 70,
                                }}
                                transition={{ delay: 0.3 + j * 0.1 }}
                            >
                                {emoji}
                            </motion.span>
                        );
                    });
                })}

                {/* Ribbon */}
                {ribbon && (
                    <motion.div
                        className="absolute bottom-4 text-lg"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        {componentEmoji[ribbon.component.name] || '🎗️'}
                    </motion.div>
                )}
            </motion.div>

            {/* Item list */}
            <div className="rounded-[var(--radius-lg)] bg-white/60 p-4 space-y-2">
                <p className="text-sm font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    Состав букета
                </p>
                {selections.map((sel) => (
                    <div key={sel.component.id} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                            <span>{componentEmoji[sel.component.name] || '🌼'}</span>
                            <span>{sel.component.name}</span>
                            {sel.quantity > 1 && (
                                <span className="text-[var(--text-secondary)]">×{sel.quantity}</span>
                            )}
                        </span>
                        <span className="font-medium">
                            {parseFloat(sel.component.price) * sel.quantity} ₽
                        </span>
                    </div>
                ))}

                <div className="border-t pt-2 mt-2 flex justify-between">
                    <span className="font-bold">Итого</span>
                    <span className="text-xl font-bold text-[var(--primary)]" style={{ fontFamily: 'var(--font-accent)' }}>
                        {total} ₽
                    </span>
                </div>
            </div>
        </div>
    );
}
