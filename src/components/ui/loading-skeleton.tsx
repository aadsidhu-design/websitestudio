import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
    className?: string;
    aspectRatio?: '16:9' | '1:1' | '4:3';
    rounded?: boolean;
}

export function LoadingSkeleton({
    className,
    aspectRatio = '16:9',
    rounded = true
}: LoadingSkeletonProps) {
    const aspectRatioClass = {
        '16:9': 'aspect-video',
        '1:1': 'aspect-square',
        '4:3': 'aspect-[4/3]',
    }[aspectRatio];

    return (
        <motion.div
            className={cn(
                'relative overflow-hidden bg-neutral-200 dark:bg-neutral-800',
                aspectRatioClass,
                rounded && 'rounded-lg',
                className
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
                animate={{
                    x: ['-100%', '100%'],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: 'linear',
                }}
            />
        </motion.div>
    );
}

interface SkeletonTextProps {
    lines?: number;
    className?: string;
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
    return (
        <div className={cn('space-y-2', className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <motion.div
                    key={i}
                    className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded"
                    style={{ width: i === lines - 1 ? '60%' : '100%' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <motion.div
                        className="h-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
                        animate={{
                            x: ['-100%', '100%'],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: 'linear',
                            delay: i * 0.1,
                        }}
                    />
                </motion.div>
            ))}
        </div>
    );
}

interface PulseLoaderProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function PulseLoader({ size = 'md', className }: PulseLoaderProps) {
    const sizeClasses = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4',
    };

    const dotSize = sizeClasses[size];

    return (
        <div className={cn('flex items-center gap-1', className)}>
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className={cn('rounded-full bg-primary', dotSize)}
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 1,
                        delay: i * 0.2,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
}
