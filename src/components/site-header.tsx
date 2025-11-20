'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';

export function SiteHeader() {
    const pathname = usePathname();
    const isTransparent = pathname === '/';

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            isTransparent ? "bg-transparent backdrop-blur-none border-b-0" : "bg-background/80 backdrop-blur-md border-b border-border/40"
        )}>
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Logo />
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link
                        href="/features"
                        className={cn(
                            "transition-colors hover:text-primary",
                            pathname === '/features' ? "text-foreground" : "text-muted-foreground"
                        )}
                    >
                        Features
                    </Link>
                    <Link
                        href="/pricing"
                        className={cn(
                            "transition-colors hover:text-primary",
                            pathname === '/pricing' ? "text-foreground" : "text-muted-foreground"
                        )}
                    >
                        Pricing
                    </Link>
                    <Link
                        href="/learn"
                        className={cn(
                            "transition-colors hover:text-primary",
                            pathname === '/learn' ? "text-foreground" : "text-muted-foreground"
                        )}
                    >
                        Learn
                    </Link>
                    <Link
                        href="/blog"
                        className={cn(
                            "transition-colors hover:text-primary",
                            pathname === '/blog' ? "text-foreground" : "text-muted-foreground"
                        )}
                    >
                        Blog
                    </Link>
                    <Link
                        href="/community"
                        className={cn(
                            "transition-colors hover:text-primary",
                            pathname === '/community' ? "text-foreground" : "text-muted-foreground"
                        )}
                    >
                        Community
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                        <Link href="/login">Log in</Link>
                    </Button>
                    <Button size="sm" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all duration-300 rounded-full px-6">
                        <Link href="/login">Get Started</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
