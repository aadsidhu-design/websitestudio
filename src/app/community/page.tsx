'use client';

import React from 'react';
import { SiteHeader } from '@/components/site-header';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle } from 'lucide-react';

export default function CommunityPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <SiteHeader />

            <main className="pt-32 pb-20 px-4">
                <div className="container mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Community Showcase
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                            Explore amazing animations created by the Robin community.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button size="lg" className="rounded-full">Join Discord</Button>
                            <Button size="lg" variant="outline" className="rounded-full">Submit Project</Button>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {PlaceHolderImages.map((image, index) => (
                            <motion.div
                                key={image.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05, duration: 0.5 }}
                            >
                                <Card className="group overflow-hidden bg-card/50 border-border/30 hover:shadow-lg transition-all duration-300 rounded-xl h-full cursor-pointer">
                                    <CardContent className="p-0 h-full flex flex-col">
                                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                                            <Image
                                                src={image.imageUrl}
                                                alt={image.description}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                unoptimized
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                                <Button size="icon" variant="secondary" className="rounded-full w-10 h-10">
                                                    <Heart className="w-5 h-5" />
                                                </Button>
                                                <Button size="icon" variant="secondary" className="rounded-full w-10 h-10">
                                                    <MessageCircle className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="p-4 flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold truncate flex-1 mr-2">{image.description}</h3>
                                                <Badge variant="outline" className="text-xs">Animation</Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                                <div className="w-5 h-5 rounded-full bg-primary/20" />
                                                <span>User {index + 1}</span>
                                            </div>
                                        </div>
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
