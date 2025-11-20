'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { SiteHeader } from '@/components/site-header';
import { motion } from 'framer-motion';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <SiteHeader />

      <main className="pt-32 pb-32 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-muted-foreground">
            Start for free, upgrade when you need more power.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-card border border-border/50 rounded-3xl p-8 flex flex-col hover:border-border transition-colors shadow-sm hover:shadow-md"
          >
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground mt-4 text-sm">Perfect for experimenting and personal projects.</p>
            </div>
            <Button className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground mb-8 rounded-xl h-12" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
            <ul className="space-y-4 text-sm text-muted-foreground flex-1">
              <li className="flex gap-3"><Check className="w-5 h-5 text-green-500" /> 3 Projects</li>
              <li className="flex gap-3"><Check className="w-5 h-5 text-green-500" /> Basic AI Generation</li>
              <li className="flex gap-3"><Check className="w-5 h-5 text-green-500" /> Community Support</li>
              <li className="flex gap-3"><Check className="w-5 h-5 text-green-500" /> Export to React</li>
            </ul>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-card border border-primary/50 rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-lg hover:shadow-primary/10 transition-all"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2 text-primary">Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$20</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground mt-4 text-sm">For creators and freelancers building real apps.</p>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mb-8 rounded-xl h-12" asChild>
              <Link href="/login">Upgrade to Pro</Link>
            </Button>
            <ul className="space-y-4 text-sm text-muted-foreground flex-1">
              <li className="flex gap-3"><Check className="w-5 h-5 text-primary" /> Unlimited Projects</li>
              <li className="flex gap-3"><Check className="w-5 h-5 text-primary" /> Advanced AI Models (Gemini Pro)</li>
              <li className="flex gap-3"><Check className="w-5 h-5 text-primary" /> Priority Support</li>
              <li className="flex gap-3"><Check className="w-5 h-5 text-primary" /> Custom Domains</li>
              <li className="flex gap-3"><Check className="w-5 h-5 text-primary" /> Remove Branding</li>
            </ul>
          </motion.div>

          {/* Team Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-card border border-border/50 rounded-3xl p-8 flex flex-col hover:border-border transition-colors shadow-sm hover:shadow-md"
          >
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Team</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$50</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground mt-4 text-sm">Collaborate with your team on advanced projects.</p>
            </div>
            <Button className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground mb-8 rounded-xl h-12" asChild>
              <Link href="/login">Contact Sales</Link>
            </Button>
            <ul className="space-y-4 text-sm text-muted-foreground flex-1">
              <li className="flex gap-3"><Check className="w-5 h-5 text-green-500" /> Everything in Pro</li>
              <li className="flex gap-3"><Check className="w-5 h-5 text-green-500" /> 5 Team Members</li>
              <li className="flex gap-3"><Check className="w-5 h-5 text-green-500" /> Shared Workspace</li>
              <li className="flex gap-3"><Check className="w-5 h-5 text-green-500" /> Role-based Access</li>
              <li className="flex gap-3"><Check className="w-5 h-5 text-green-500" /> Dedicated Success Manager</li>
            </ul>
          </motion.div>
        </div>
      </main>

      <footer className="border-t border-border/40 py-12 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-muted-foreground text-sm ml-4">© 2024 Robin AI</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
