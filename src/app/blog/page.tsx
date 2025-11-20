'use client';

import React from 'react';
import { SiteHeader } from '@/components/site-header';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function BlogPage() {
    // Use placeholder images for blog posts
    const posts = [
        {
            title: "Introducing Robin 2.0",
            excerpt: "The next generation of AI animation is here. Discover the new features and improvements.",
            date: "Nov 15, 2024",
            category: "Product",
            image: PlaceHolderImages[0]?.imageUrl || "/placeholder.png",
            author: "Sarah Chen"
        },
        {
            title: "How to Create Viral Animations",
            excerpt: "Tips and tricks from top creators on how to make your animations stand out.",
            date: "Nov 10, 2024",
            category: "Tutorial",
            image: PlaceHolderImages[1]?.imageUrl || "/placeholder.png",
            author: "Mike Ross"
        },
        {
            title: "The Future of Generative AI",
            excerpt: "Our thoughts on where the industry is heading and how Robin fits into the picture.",
            date: "Nov 5, 2024",
            category: "Industry",
            image: PlaceHolderImages[2]?.imageUrl || "/placeholder.png",
            author: "Alex Smith"
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
                            Blog
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Latest news, updates, and stories from the Robin team.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 flex flex-col group cursor-pointer">
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            unoptimized
                                        />
                                    </div>
                                    <CardHeader>
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                                            <span className="text-xs text-muted-foreground">{post.date}</span>
                                        </div>
                                        <CardTitle className="text-xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
                                        <CardDescription className="line-clamp-2 mt-2">
                                            {post.excerpt}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardFooter className="mt-auto pt-0">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                                                {post.author[0]}
                                            </div>
                                            {post.author}
                                        </div>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
