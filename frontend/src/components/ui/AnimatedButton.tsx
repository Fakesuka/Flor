'use client';

import { motion } from 'framer-motion';
import { Button, ButtonProps } from './Button';

export const AnimatedButton = (props: ButtonProps) => {
    return (
        <motion.div
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
            <Button {...props} />
        </motion.div>
    );
};
