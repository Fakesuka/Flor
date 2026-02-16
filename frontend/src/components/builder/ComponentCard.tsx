'use client';

import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import type { BouquetComponent } from '@/types/builder';
import { componentEmoji } from '@/lib/builderMockData';

interface ComponentCardProps {
    component: BouquetComponent;
    quantity: number;
    onAdd: () => void;
    onRemove: () => void;
    mode?: 'multi' | 'single';  // multi = counter, single = select/deselect
    isSelected?: boolean;
    onSelect?: () => void;
}

export default function ComponentCard({
    component,
    quantity,
    onAdd,
    onRemove,
    mode = 'multi',
    isSelected,
    onSelect,
}: ComponentCardProps) {
    const emoji = componentEmoji[component.name] || '🌼';
    const isActive = mode === 'single' ? isSelected : quantity > 0;

    return (
        <motion.div
            className={`relative rounded-[var(--radius-lg)] p-3 transition-all cursor-pointer ${isActive
                    ? 'bg-[var(--primary-light)]/40 border-2 border-[var(--primary)] shadow-md'
                    : 'bg-white/60 border-2 border-transparent'
                }`}
            whileTap={{ scale: 0.97 }}
            onClick={mode === 'single' ? onSelect : onAdd}
            layout
        >
            {/* Color dot */}
            <div
                className="w-4 h-4 rounded-full absolute top-2 right-2 border border-white shadow-sm"
                style={{ backgroundColor: component.color }}
            />

            {/* Emoji / Image */}
            <div className="text-center mb-2">
                <span className="text-3xl">{emoji}</span>
            </div>

            {/* Name */}
            <p className="text-xs font-medium text-center truncate mb-1">{component.name}</p>

            {/* Price */}
            <p className="text-xs text-[var(--text-accent)] text-center font-bold" style={{ fontFamily: 'var(--font-accent)' }}>
                {component.price} ₽
            </p>

            {/* Counter for multi mode */}
            {mode === 'multi' && quantity > 0 && (
                <motion.div
                    className="flex items-center justify-center gap-2 mt-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                    >
                        <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                    <button
                        onClick={(e) => { e.stopPropagation(); onAdd(); }}
                        className="w-7 h-7 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                </motion.div>
            )}

            {/* Badge for multi mode */}
            {mode === 'multi' && quantity > 0 && (
                <motion.span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--primary)] text-white text-[10px] flex items-center justify-center font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    {quantity}
                </motion.span>
            )}

            {/* Check for single mode */}
            {mode === 'single' && isSelected && (
                <motion.div
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    ✓
                </motion.div>
            )}
        </motion.div>
    );
}
