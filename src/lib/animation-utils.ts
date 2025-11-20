import { Variants } from 'framer-motion';

/**
 * Reusable animation variants for consistent micro-interactions
 * Based on lovable.dev's smooth animation patterns
 */

// Fade animations
export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export const fadeInUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

export const fadeInDown: Variants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
};

// Scale animations
export const scaleIn: Variants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
};

export const scaleUp: Variants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.1, opacity: 0 },
};

// Slide animations
export const slideInFromRight: Variants = {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
};

export const slideInFromLeft: Variants = {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
};

// Stagger children
export const staggerContainer: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const staggerItem: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

// Shimmer effect for loading states
export const shimmer: Variants = {
    initial: { backgroundPosition: '-200% 0' },
    animate: {
        backgroundPosition: '200% 0',
        transition: {
            repeat: Infinity,
            duration: 2,
            ease: 'linear',
        },
    },
};

// Button interactions
export const buttonHover = {
    scale: 1.02,
    transition: { duration: 0.2 },
};

export const buttonTap = {
    scale: 0.98,
    transition: { duration: 0.1 },
};

// Card interactions
export const cardHover = {
    y: -4,
    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
    transition: { duration: 0.3 },
};

// Timing functions
export const easing = {
    easeInOut: [0.4, 0, 0.2, 1],
    easeOut: [0, 0, 0.2, 1],
    easeIn: [0.4, 0, 1, 1],
    spring: { type: 'spring' as const, stiffness: 300, damping: 30 },
    bouncy: { type: 'spring' as const, stiffness: 400, damping: 10 },
};

// Duration presets (in seconds)
export const duration = {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
};

// Preset configurations for common use cases
export const presets = {
    modalBackdrop: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: duration.fast },
    },
    modalContent: {
        initial: { opacity: 0, scale: 0.95, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 20 },
        transition: { duration: duration.normal, ease: easing.easeOut },
    },
    toast: {
        initial: { opacity: 0, y: 50, scale: 0.3 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
    },
    tooltip: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
    },
};

// Helper function to create custom stagger
export function createStagger(delay: number = 0.1, staggerChildren: number = 0.05) {
    return {
        animate: {
            transition: {
                delayChildren: delay,
                staggerChildren,
            },
        },
    };
}
