import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Image as ImageIcon, RotateCw, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { cn } from '@/lib/utils';

interface StoryboardFrame {
    id: string;
    description: string;
    imageUrl?: string;
    isGenerating?: boolean;
    error?: string;
}

interface StoryboardViewProps {
    frames: StoryboardFrame[];
    onApprove: () => void;
    onRegenerateFrame?: (frameId: string, feedback?: string) => void;
    onEditFrame?: (frameId: string) => void;
}

export function StoryboardView({ frames, onApprove, onRegenerateFrame, onEditFrame }: StoryboardViewProps) {
    const [hoveredFrame, setHoveredFrame] = useState<string | null>(null);
    const completedFrames = frames.filter(f => f.imageUrl && !f.isGenerating).length;
    const totalFrames = frames.length;
    const allFramesReady = completedFrames === totalFrames && totalFrames > 0;

    return (
        <div className="w-full h-full flex flex-col items-center p-8 bg-background/50 overflow-y-auto">
            <motion.div
                className="max-w-6xl w-full space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">Storyboard Review</h2>
                    <p className="text-muted-foreground max-w-lg">
                        Review the visual flow of your animation. You can regenerate specific frames or approve the entire sequence.
                    </p>
                </div>

                {/* Progress Bar */}
                {totalFrames > 0 && (
                    <div className="max-w-md mx-auto w-full space-y-2 bg-card/50 p-4 rounded-xl border border-border/50 backdrop-blur-sm">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Generation Progress</span>
                            <span className="font-medium">{completedFrames} / {totalFrames}</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${(completedFrames / totalFrames) * 100}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            />
                        </div>
                    </div>
                )}

                {/* Frames Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {frames.map((frame, index) => (
                            <motion.div
                                key={frame.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.1 }}
                                onHoverStart={() => setHoveredFrame(frame.id)}
                                onHoverEnd={() => setHoveredFrame(null)}
                            >
                                <Card className={cn(
                                    "overflow-hidden border transition-all duration-300 group h-full flex flex-col",
                                    frame.error ? "border-destructive/50" : "border-border/50 hover:border-primary/50 hover:shadow-lg"
                                )}>
                                    <div className="aspect-video bg-muted relative flex items-center justify-center overflow-hidden">
                                        {/* Loading State */}
                                        {frame.isGenerating && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                                                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                                                <span className="text-xs font-medium text-muted-foreground">Generating...</span>
                                            </div>
                                        )}

                                        {/* Generated Image */}
                                        {frame.imageUrl && !frame.isGenerating && (
                                            <>
                                                <Image
                                                    src={frame.imageUrl}
                                                    alt={frame.description}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    unoptimized
                                                />

                                                {/* Overlay on Hover */}
                                                <div className={cn(
                                                    "absolute inset-0 bg-black/60 flex items-center justify-center gap-2 transition-opacity duration-200",
                                                    hoveredFrame === frame.id ? "opacity-100" : "opacity-0"
                                                )}>
                                                    {onEditFrame && (
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            className="gap-2"
                                                            onClick={() => onEditFrame(frame.id)}
                                                        >
                                                            <MessageSquare className="w-4 h-4" />
                                                            Edit
                                                        </Button>
                                                    )}
                                                    {onRegenerateFrame && (
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            className="gap-2"
                                                            onClick={() => onRegenerateFrame(frame.id)}
                                                        >
                                                            <RotateCw className="w-4 h-4" />
                                                            Retry
                                                        </Button>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {/* Error State */}
                                        {frame.error && !frame.isGenerating && (
                                            <div className="flex flex-col items-center gap-2 text-destructive p-4 text-center">
                                                <ImageIcon className="w-10 h-10 opacity-50" />
                                                <span className="text-sm font-medium">Generation failed</span>
                                                {onRegenerateFrame && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="gap-2 mt-2"
                                                        onClick={() => onRegenerateFrame(frame.id)}
                                                    >
                                                        <RotateCw className="w-4 h-4" />
                                                        Retry
                                                    </Button>
                                                )}
                                            </div>
                                        )}

                                        {/* Placeholder */}
                                        {!frame.imageUrl && !frame.isGenerating && !frame.error && (
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
                                                <ImageIcon className="w-12 h-12" />
                                                <span className="text-lg font-medium">Frame {index + 1}</span>
                                            </div>
                                        )}

                                        {/* Frame Number Badge */}
                                        <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md text-foreground text-xs font-bold px-2.5 py-1 rounded-md shadow-sm border border-border/50">
                                            #{index + 1}
                                        </div>
                                    </div>

                                    <CardContent className="p-4 flex-1 bg-card/50">
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {frame.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Approve Button */}
                <div className="sticky bottom-8 flex justify-center pt-4">
                    <div className="bg-background/80 backdrop-blur-md p-2 rounded-full border border-border/50 shadow-2xl">
                        <Button
                            size="lg"
                            onClick={onApprove}
                            disabled={!allFramesReady}
                            className={cn(
                                "gap-2 rounded-full px-8 transition-all duration-300",
                                allFramesReady ? "shadow-lg shadow-primary/25 hover:shadow-primary/40" : "opacity-50"
                            )}
                        >
                            <Check className="w-4 h-4" />
                            {allFramesReady ? 'Approve Storyboard' : 'Waiting for frames...'}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
