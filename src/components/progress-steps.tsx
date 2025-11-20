import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type WorkflowStep = 'LANDING' | 'PLANNING' | 'STORYBOARD' | 'GENERATING' | 'EDITING';

interface ProgressStepsProps {
    currentStep: WorkflowStep;
    onStepClick?: (step: WorkflowStep) => void;
}

const steps = [
    { id: 'PLANNING' as const, label: 'Planning', order: 0 },
    { id: 'STORYBOARD' as const, label: 'Storyboard', order: 1 },
    { id: 'GENERATING' as const, label: 'Generating', order: 2 },
    { id: 'EDITING' as const, label: 'Complete', order: 3 },
];

export function ProgressSteps({ currentStep, onStepClick }: ProgressStepsProps) {
    const currentOrder = steps.find(s => s.id === currentStep)?.order ?? -1;

    return (
        <div className="w-full bg-background/95 backdrop-blur-sm border-b border-border/50 px-6 py-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between relative">
                    {/* Progress Line */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-neutral-200 dark:bg-neutral-800" />
                    <motion.div
                        className="absolute top-5 left-0 h-0.5 bg-primary"
                        initial={{ width: '0%' }}
                        animate={{
                            width: `${(currentOrder / (steps.length - 1)) * 100}%`,
                        }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />

                    {/* Steps */}
                    {steps.map((step, index) => {
                        const isCompleted = step.order < currentOrder;
                        const isCurrent = step.id === currentStep;
                        const isClickable = isCompleted && onStepClick;

                        return (
                            <motion.button
                                key={step.id}
                                onClick={() => isClickable && onStepClick(step.id)}
                                disabled={!isClickable}
                                className={cn(
                                    'relative z-10 flex flex-col items-center gap-2 group',
                                    isClickable && 'cursor-pointer',
                                    !isClickable && 'cursor-default'
                                )}
                                whileHover={isClickable ? { scale: 1.05 } : {}}
                                whileTap={isClickable ? { scale: 0.95 } : {}}
                            >
                                {/* Circle */}
                                <motion.div
                                    className={cn(
                                        'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors',
                                        isCompleted && 'bg-primary border-primary',
                                        isCurrent && 'bg-background border-primary',
                                        !isCompleted && !isCurrent && 'bg-background border-neutral-300 dark:border-neutral-700'
                                    )}
                                    animate={isCurrent ? {
                                        scale: [1, 1.1, 1],
                                    } : {}}
                                    transition={isCurrent ? {
                                        repeat: Infinity,
                                        duration: 2,
                                        ease: 'easeInOut',
                                    } : {}}
                                >
                                    {isCompleted ? (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        >
                                            <Check className="w-5 h-5 text-white" />
                                        </motion.div>
                                    ) : (
                                        <span className={cn(
                                            'text-sm font-medium',
                                            isCurrent && 'text-primary',
                                            !isCurrent && 'text-neutral-400 dark:text-neutral-600'
                                        )}>
                                            {index + 1}
                                        </span>
                                    )}
                                </motion.div>

                                {/* Label */}
                                <span className={cn(
                                    'text-xs font-medium transition-colors',
                                    isCurrent && 'text-foreground',
                                    isCompleted && 'text-muted-foreground',
                                    !isCompleted && !isCurrent && 'text-muted-foreground/50'
                                )}>
                                    {step.label}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
