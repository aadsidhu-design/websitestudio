'use client';

import React from 'react';
import { SiteHeader } from '@/components/site-header';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, Video, Code, Lightbulb } from 'lucide-react';

export default function LearnPage() {
    const resources = [
        {
            title: "Getting Started",
            description: "Learn the basics of Robin and how to create your first animation.",
            icon: <BookOpen className="w-6 h-6 text-primary" />,
            color: "bg-blue-500/10"
        },
        {
            title: "Video Tutorials",
            description: "Watch step-by-step guides on advanced features and techniques.",
            icon: <Video className="w-6 h-6 text-purple-500" />,
            color: "bg-purple-500/10"
        },
        {
            title: "API Documentation",
            description: "Integrate Robin into your own applications with our API.",
            icon: <Code className="w-6 h-6 text-green-500" />,
            color: "bg-green-500/10"
        },
        {
            title: "Tips & Tricks",
            description: "Discover hidden features and best practices for pro users.",
            icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
            color: "bg-yellow-500/10"
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
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Learn Robin
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Master the art of AI-powered animation with our comprehensive guides and resources.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {resources.map((resource, index) => (
                            <motion.div
                                key={resource.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm group cursor-pointer">
                                    <CardHeader>
                                        <div className={`w-12 h-12 rounded-xl ${resource.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            {resource.icon}
                                        </div>
                                        <CardTitle className="text-2xl">{resource.title}</CardTitle>
                                        <CardDescription className="text-base mt-2">
                                            {resource.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <span className="text-sm font-medium text-primary group-hover:underline">Read more &rarr;</span>
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
