'use client';

import { motion } from 'framer-motion';
import { BUILDER_STEPS, type BuilderStep } from '@/types/builder';

interface StepIndicatorProps {
    currentStep: BuilderStep;
    onStepClick?: (step: BuilderStep) => void;
}

export default function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
    const currentIndex = BUILDER_STEPS.findIndex((s) => s.key === currentStep);

    return (
        <div className="flex items-center justify-between px-1 py-2">
            {BUILDER_STEPS.map((step, i) => {
                const isActive = i === currentIndex;
                const isDone = i < currentIndex;
                const canClick = i <= currentIndex;

                return (
                    <button
                        key={step.key}
                        onClick={() => canClick && onStepClick?.(step.key)}
                        disabled={!canClick}
                        className="flex flex-col items-center gap-0.5 relative flex-1"
                    >
                        {/* Connector line */}
                        {i > 0 && (
                            <div
                                className={`absolute top-3.5 right-1/2 w-full h-0.5 -z-10 transition-colors duration-300 ${isDone || isActive ? 'bg-[var(--primary)]' : 'bg-[var(--background)]'
                                    }`}
                            />
                        )}

                        {/* Circle */}
                        <motion.div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${isActive
                                    ? 'bg-[var(--primary)] text-white shadow-md scale-110'
                                    : isDone
                                        ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                                        : 'bg-[var(--background)] text-[var(--text-secondary)]'
                                }`}
                            animate={isActive ? { scale: [1, 1.12, 1.08] } : {}}
                            transition={{ duration: 0.3 }}
                        >
                            {step.emoji}
                        </motion.div>

                        {/* Label */}
                        <span
                            className={`text-[8px] font-medium transition-colors ${isActive ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'
                                }`}
                        >
                            {step.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

