'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import StepIndicator from '@/components/builder/StepIndicator';
import ComponentCard from '@/components/builder/ComponentCard';
import BouquetPreview from '@/components/builder/BouquetPreview';
import { useCartStore } from '@/store/cartStore';
import {
    mockFlowers, mockGreenery, mockWraps, mockRibbons, mockColorPalettes, mockPapers,
} from '@/lib/builderMockData';
import type { BouquetComponent, BuilderStep, BuilderSelection, ColorPalette } from '@/types/builder';
import { BUILDER_STEPS } from '@/types/builder';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BouquetBuilderPage() {
    const router = useRouter();
    const addItem = useCartStore((s) => s.addItem);
    const [step, setStep] = useState<BuilderStep>('flowers');
    const [selections, setSelections] = useState<Map<number, BuilderSelection>>(new Map());
    const [selectedPalette, setSelectedPalette] = useState<ColorPalette | null>(null);

    const stepIndex = BUILDER_STEPS.findIndex((s) => s.key === step);

    // Helpers
    const getQty = (id: number) => selections.get(id)?.quantity || 0;

    const addComponent = (c: BouquetComponent) => {
        setSelections((prev) => {
            const next = new Map(prev);
            const existing = next.get(c.id);
            next.set(c.id, { component: c, quantity: (existing?.quantity || 0) + 1 });
            return next;
        });
    };

    const removeComponent = (id: number) => {
        setSelections((prev) => {
            const next = new Map(prev);
            const existing = next.get(id);
            if (existing && existing.quantity > 1) {
                next.set(id, { ...existing, quantity: existing.quantity - 1 });
            } else {
                next.delete(id);
            }
            return next;
        });
    };

    const selectSingle = (c: BouquetComponent) => {
        setSelections((prev) => {
            const next = new Map(prev);
            // Remove any existing of same type
            for (const [id, sel] of next) {
                if (sel.component.component_type === c.component_type) {
                    next.delete(id);
                }
            }
            next.set(c.id, { component: c, quantity: 1 });
            return next;
        });
    };

    const allSelections = useMemo(() => Array.from(selections.values()), [selections]);
    const total = useMemo(
        () => allSelections.reduce((sum, s) => sum + parseFloat(s.component.price) * s.quantity, 0),
        [allSelections],
    );
    const flowerCount = allSelections
        .filter((s) => s.component.component_type === 'flower')
        .reduce((acc, s) => acc + s.quantity, 0);

    const goNext = () => {
        const nextIndex = stepIndex + 1;
        if (nextIndex < BUILDER_STEPS.length) {
            setStep(BUILDER_STEPS[nextIndex].key);
        }
    };
    const goBack = () => {
        const prevIndex = stepIndex - 1;
        if (prevIndex >= 0) {
            setStep(BUILDER_STEPS[prevIndex].key);
        }
    };

    const handleAddToCart = () => {
        // Create a virtual product for the custom bouquet
        const customProduct = {
            id: Date.now(), // unique ID
            name: `Букет на заказ (${flowerCount} цветов)`,
            slug: `custom-${Date.now()}`,
            description: allSelections.map((s) => `${s.component.name} ×${s.quantity}`).join(', '),
            price: total.toString(),
            discount_price: null,
            is_popular: false,
            is_new: false,
            is_active: true,
            category: 0,
            primary_image: null,
        };
        addItem(customProduct as any);
        router.push('/cart');
    };

    const renderStepContent = () => {
        switch (step) {
            case 'flowers':
                return (
                    <StepContent
                        title="Выберите цветы"
                        subtitle={`Выбрано: ${flowerCount} шт.`}
                        items={mockFlowers}
                        getQty={getQty}
                        onAdd={addComponent}
                        onRemove={removeComponent}
                        mode="multi"
                    />
                );
            case 'greenery':
                return (
                    <StepContent
                        title="Добавьте зелень"
                        subtitle="Необязательно"
                        items={mockGreenery}
                        getQty={getQty}
                        onAdd={addComponent}
                        onRemove={removeComponent}
                        mode="multi"
                    />
                );
            case 'wrap':
                return (
                    <StepContent
                        title="Обёртка"
                        subtitle="Выберите одну"
                        items={mockWraps}
                        getQty={getQty}
                        onAdd={() => { }}
                        onRemove={() => { }}
                        mode="single"
                        selectedId={allSelections.find((s) => s.component.component_type === 'wrap')?.component.id}
                        onSelect={selectSingle}
                    />
                );
            case 'ribbon':
                return (
                    <StepContent
                        title="Лента"
                        subtitle="Выберите одну"
                        items={mockRibbons}
                        getQty={getQty}
                        onAdd={() => { }}
                        onRemove={() => { }}
                        mode="single"
                        selectedId={allSelections.find((s) => s.component.component_type === 'ribbon')?.component.id}
                        onSelect={selectSingle}
                    />
                );
            case 'color':
                return (
                    <div>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Цветовая гамма</h2>
                            <p className="text-sm text-[var(--text-secondary)]">Подскажем флористу настроение букета</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {mockColorPalettes.map((palette) => {
                                const isActive = selectedPalette?.id === palette.id;
                                return (
                                    <motion.button
                                        key={palette.id}
                                        onClick={() => setSelectedPalette(palette)}
                                        className={`relative rounded-[var(--radius-lg)] p-3 text-left transition-all ${isActive
                                                ? 'border-2 border-[var(--primary)] shadow-md bg-[var(--primary-light)]/30'
                                                : 'border-2 border-transparent bg-white/60'
                                            }`}
                                        whileTap={{ scale: 0.97 }}
                                        layout
                                    >
                                        {/* Color swatches */}
                                        <div className="flex gap-1 mb-2">
                                            {palette.colors.map((c, i) => (
                                                <div
                                                    key={i}
                                                    className="flex-1 h-8 rounded-md first:rounded-l-lg last:rounded-r-lg border border-white/50"
                                                    style={{ backgroundColor: c }}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs font-medium truncate">{palette.name}</p>

                                        {isActive && (
                                            <motion.div
                                                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: 'spring', stiffness: 300 }}
                                            >
                                                <Check className="w-3 h-3" />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                );
            case 'paper':
                return (
                    <StepContent
                        title="Бумага"
                        subtitle="Внутренняя упаковка"
                        items={mockPapers}
                        getQty={getQty}
                        onAdd={() => { }}
                        onRemove={() => { }}
                        mode="single"
                        selectedId={allSelections.find((s) => s.component.component_type === 'paper')?.component.id}
                        onSelect={selectSingle}
                    />
                );
            case 'preview':
                return (
                    <div>
                        <h2 className="text-lg font-bold mb-4 px-1" style={{ fontFamily: 'var(--font-heading)' }}>
                            Ваш букет
                        </h2>
                        <BouquetPreview selections={allSelections} total={total} />
                    </div>
                );
            case 'done':
                return (
                    <motion.div
                        className="text-center py-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                        >
                            <Sparkles className="w-16 h-16 text-[var(--primary)] mx-auto mb-4" />
                        </motion.div>
                        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                            Букет готов!
                        </h2>
                        <p className="text-sm text-[var(--text-secondary)] mb-2">
                            {allSelections.length} компонентов
                        </p>
                        <p className="text-3xl font-bold text-[var(--primary)] mb-6" style={{ fontFamily: 'var(--font-accent)' }}>
                            {total} ₽
                        </p>

                        <div className="space-y-3 px-4">
                            <Button size="lg" className="w-full gap-2" onClick={handleAddToCart}>
                                <ShoppingBag className="w-5 h-5" />
                                В корзину
                            </Button>
                            <Button variant="outline" size="lg" className="w-full" onClick={() => setStep('preview')}>
                                Назад к превью
                            </Button>
                        </div>
                    </motion.div>
                );
        }
    };

    return (
        <main className="min-h-screen pb-28">
            {/* Header */}
            <div className="sticky top-0 z-40 glass px-4 py-3">
                <div className="flex items-center gap-3">
                    {stepIndex > 0 ? (
                        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
                            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
                        </button>
                    ) : (
                        <Link href="/" className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
                            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
                        </Link>
                    )}
                    <h1 className="text-lg font-bold flex-1" style={{ fontFamily: 'var(--font-heading)' }}>
                        Конструктор букета
                    </h1>
                    {total > 0 && (
                        <span className="text-sm font-bold text-[var(--primary)]" style={{ fontFamily: 'var(--font-accent)' }}>
                            {total} ₽
                        </span>
                    )}
                </div>
            </div>

            {/* Step indicator */}
            <div className="px-2">
                <StepIndicator currentStep={step} onStepClick={setStep} />
            </div>

            {/* Step content */}
            <div className="px-4 mt-2">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.25 }}
                    >
                        {renderStepContent()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom bar (not on done step) */}
            {step !== 'done' && (
                <div className="fixed bottom-16 left-0 right-0 z-40 glass p-4">
                    <div className="flex gap-3 max-w-lg mx-auto">
                        {stepIndex > 0 && (
                            <Button variant="outline" size="lg" className="flex-1" onClick={goBack}>
                                Назад
                            </Button>
                        )}
                        <Button
                            size="lg"
                            className="flex-1"
                            onClick={goNext}
                            disabled={step === 'flowers' && flowerCount === 0}
                        >
                            {step === 'preview' ? 'Подтвердить' : 'Далее'}
                        </Button>
                    </div>
                </div>
            )}
        </main>
    );
}

/* ---- Sub-component for step content grids ---- */

interface StepContentProps {
    title: string;
    subtitle: string;
    items: BouquetComponent[];
    getQty: (id: number) => number;
    onAdd: (c: BouquetComponent) => void;
    onRemove: (id: number) => void;
    mode: 'multi' | 'single';
    selectedId?: number;
    onSelect?: (c: BouquetComponent) => void;
}

function StepContent({ title, subtitle, items, getQty, onAdd, onRemove, mode, selectedId, onSelect }: StepContentProps) {
    return (
        <div>
            <div className="mb-4">
                <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h2>
                <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {items.map((item) => (
                    <ComponentCard
                        key={item.id}
                        component={item}
                        quantity={getQty(item.id)}
                        onAdd={() => onAdd(item)}
                        onRemove={() => onRemove(item.id)}
                        mode={mode}
                        isSelected={selectedId === item.id}
                        onSelect={() => onSelect?.(item)}
                    />
                ))}
            </div>
        </div>
    );
}

