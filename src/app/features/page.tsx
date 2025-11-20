'use client';

import React from 'react';
import { SiteHeader } from '@/components/site-header';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Wand2, Layers, Zap, Share2, MessageSquare, Layout } from 'lucide-react';

export default function FeaturesPage() {
    const features = [
        {
            title: "AI-Powered Generation",
            description: "Describe your idea in plain English and watch as Robin generates complex animations in seconds.",
            icon: <Wand2 className="w-8 h-8 text-primary" />
        },
        {
            title: "Visual Storyboarding",
            description: "Review and edit generated storyboards frame by frame to ensure your vision is perfectly captured.",
            icon: <Layout className="w-8 h-8 text-blue-500" />
        },
        {
            title: "Smart Iteration",
            description: "Chat with the AI to make specific adjustments, change colors, or refine movements instantly.",
            icon: <MessageSquare className="w-8 h-8 text-purple-500" />
        },
        {
            title: "Layer Control",
            description: "Get granular control over every element with a familiar layer-based editing interface.",
            icon: <Layers className="w-8 h-8 text-green-500" />
        },
        {
            title: "Real-time Preview",
            description: "See your changes instantly with our high-performance rendering engine.",
            icon: <Zap className="w-8 h-8 text-yellow-500" />
        },
        {
            title: "Easy Export",
            description: "Export your animations to React code, MP4, GIF, or Lottie files for use anywhere.",
            icon: <Share2 className="w-8 h-8 text-pink-500" />
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <SiteHeader />

            <main className="pt-32 pb-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-20"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Powerful Features
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to create stunning animations without writing a single line of code.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <Card className="h-full border-border/50 bg-card/50 hover:bg-card/80 transition-colors">
                                    <CardContent className="p-8 flex flex-col items-start gap-4">
                                        <div className="p-3 rounded-xl bg-background border border-border shadow-sm">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-bold">{feature.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
