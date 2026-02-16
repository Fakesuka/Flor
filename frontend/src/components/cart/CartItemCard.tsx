'use client';

import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Trash2, Minus, Plus } from 'lucide-react';
import type { CartItem } from '@/store/cartStore';

interface CartItemCardProps {
    item: CartItem;
    onUpdateQuantity: (id: number, qty: number) => void;
    onRemove: (id: number) => void;
}

export default function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
    const x = useMotionValue(0);
    const bgOpacity = useTransform(x, [-120, -60, 0], [1, 0.5, 0]);
    const price = parseFloat(item.product.discount_price || item.product.price);

    const handleDragEnd = (_: any, info: PanInfo) => {
        if (info.offset.x < -100) {
            onRemove(item.product.id);
        }
    };

    return (
        <div className="relative overflow-hidden rounded-[var(--radius-lg)] mb-3">
            {/* Delete background */}
            <motion.div
                className="absolute inset-0 bg-[var(--error)] flex items-center justify-end pr-6 rounded-[var(--radius-lg)]"
                style={{ opacity: bgOpacity }}
            >
                <Trash2 className="w-6 h-6 text-white" />
            </motion.div>

            {/* Card */}
            <motion.div
                className="relative flex gap-3 p-3 bg-[var(--surface)] rounded-[var(--radius-lg)] shadow-sm cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: -120, right: 0 }}
                dragElastic={0.1}
                style={{ x }}
                onDragEnd={handleDragEnd}
            >
                {/* Image */}
                <div className="w-20 h-20 rounded-[var(--radius-md)] bg-[var(--primary-light)]/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">💐</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ fontFamily: 'var(--font-heading)' }}>
                        {item.product.name}
                    </p>
                    <p className="text-lg font-bold mt-1" style={{ fontFamily: 'var(--font-accent)' }}>
                        {price * item.quantity} ₽
                    </p>

                    {/* Stepper */}
                    <div className="flex items-center gap-2 mt-2">
                        <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full bg-[var(--background)] flex items-center justify-center transition-colors hover:bg-[var(--primary-light)]"
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full bg-[var(--background)] flex items-center justify-center transition-colors hover:bg-[var(--primary-light)]"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
