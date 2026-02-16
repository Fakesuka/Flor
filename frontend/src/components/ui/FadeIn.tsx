'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface FadeInProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
}

export const FadeIn = ({ children, className, delay = 0, direction = 'up' }: FadeInProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    const directionOffset = {
        up: { y: 24, x: 0 },
        down: { y: -24, x: 0 },
        left: { x: 24, y: 0 },
        right: { x: -24, y: 0 },
    };

    return (
        <motion.div
            ref={ref}
            initial={{
                opacity: 0,
                ...directionOffset[direction]
            }}
            animate={isInView ? {
                opacity: 1,
                x: 0,
                y: 0
            } : {}}
            transition={{
                duration: 0.8,
                delay: delay,
                ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
};
