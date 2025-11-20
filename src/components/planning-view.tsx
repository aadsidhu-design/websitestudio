import React from 'react';
import { CheckCircle2, Circle, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface PlanStep {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
}

interface PlanningViewProps {
    steps: PlanStep[];
    onApprove: () => void;
}

export function PlanningView({ steps, onApprove }: PlanningViewProps) {
    return (
        <div className="flex items-center justify-center h-full bg-background/50 p-8 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl"
            >
                <Card className="shadow-xl border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-border/50 pb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <Layers className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold">Implementation Plan</CardTitle>
                                <CardDescription>Here's how I'll build your animation</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="space-y-4">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex gap-4 group"
                                >
                                    <div className="mt-1 flex-shrink-0">
                                        <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center group-hover:border-primary/50 transition-colors bg-background">
                                            <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">{index + 1}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 pb-4 border-b border-border/40 last:border-0 last:pb-0">
                                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{step.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center pt-6 border-t border-border/50 bg-muted/20">
                        <p className="text-xs text-muted-foreground">
                            Review the steps above before proceeding.
                        </p>
                        <div className="flex gap-3">
                            <Button variant="ghost" size="sm">
                                Modify Plan
                            </Button>
                            <Button onClick={onApprove} className="gap-2 shadow-lg shadow-primary/20">
                                <Sparkles className="w-4 h-4" />
                                Approve & Build
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
