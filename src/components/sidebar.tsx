'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Folder, Settings, HelpCircle, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const navItems = [
        { icon: Home, label: 'Home', href: '/' },
        { icon: Folder, label: 'Studio', href: '/studio' },
        { icon: Settings, label: 'Settings', href: '/settings' },
    ];

    return (
        <div className={cn("flex flex-col h-full w-64 bg-background border-r border-border/40", className)}>
            <div className="p-6">
                <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">R</span>
                    Robin
                </h1>
            </div>

            <div className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            pathname === item.href
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <item.icon size={18} />
                        {item.label}
                    </Link>
                ))}
            </div>

            <div className="p-4 border-t border-border/40 space-y-4">
                <Link
                    href="/help"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                    <HelpCircle size={18} />
                    Help & Support
                </Link>

                {user && (
                    <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-muted/30 border border-border/40">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <User size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.email}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => logout()}>
                            <LogOut size={16} />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
