import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PromptBox } from "@/components/ui/prompt-box";
import { TypewriterEffect } from "./ui/typewriter-effect";
import { ArrowRight, Globe, Twitter } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { motion } from 'framer-motion';
import { Logo } from '@/components/logo';

function CommunityShowcase() {
  const categories = ["Popular", "Discover", "Internal Tools", "Website", "Personal", "Consumer App", "B2B App", "Prototype"];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-20">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Built with Lovable</h2>
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            View all <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${i === 0
                ? "bg-white text-black font-medium"
                : "bg-[#1a1a1a] text-gray-400 hover:bg-[#252525] hover:text-white"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/5 hover:border-white/10 transition-all">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform z-20">
                <h3 className="text-white font-medium mb-1">Project Name {i}</h3>
                <p className="text-xs text-gray-400">By User {i}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const footerLinks = {
    "Product": ["Features", "Integrations", "Pricing", "Changelog", "Docs", "Download"],
    "Company": ["About us", "Blog", "Careers", "Customers", "Brand"],
    "Resources": ["Community", "Contact", "Dribbble", "GitHub", "Twitter"],
    "Legal": ["Terms of Use", "Privacy Policy", "Cookie Policy"],
  };

  return (
    <footer className="py-16">
      <div className="container mx-auto px-8">
        <div className="bg-[#1C1C1C] p-12 rounded-3xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            <div className="col-span-full lg:col-span-1">
              <Logo />
              <p className="text-sm text-muted-foreground mt-4">Create and animate with the power of AI.</p>
            </div>
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-semibold mb-4 text-sm text-foreground/90">{title}</h4>
                <ul className="space-y-3">
                  {links.map(link => <li key={link}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <Separator className="my-8 bg-border/20" />
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Robin AI, Inc. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <a href="#" className="hover:text-foreground transition-colors"><Globe className="w-5 h-5" /></a>
              <a href="#" className="hover:text-foreground transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Landing() {
  const router = useRouter();

  const handlePromptSubmit = (value: string) => {
    console.log("handlePromptSubmit called with:", value);
    if (!value.trim()) return;

    // Store the prompt in session storage to be picked up by the studio page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pendingPrompt', value);
    }

    console.log("Redirecting to /studio");
    // Redirect to the studio page
    router.push('/studio');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans selection:bg-white/20">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">

        {/* Hero Section */}
        <div className="w-full max-w-3xl mx-auto text-center space-y-12">

          {/* Title & Tagline */}
          <div className="space-y-6">
            <h1 className="text-7xl md:text-8xl font-bold tracking-tight text-white">
              Lovable
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
              Idea to <span className="text-white font-medium">Animation</span> in seconds.
            </p>
          </div>

          {/* Input Section */}
          <div className="w-full max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-[32px] blur opacity-0 group-hover:opacity-100 transition duration-500" />
            <PromptBox
              onSubmit={handlePromptSubmit}
              className="w-full bg-[#111111] border-white/10 focus-within:border-white/20 shadow-2xl"
              placeholder="Describe the animation you want to create..."
            />
          </div>

          {/* Example Prompts */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {[
              "Bouncing ball loop",
              "Character walk cycle",
              "Explosion effect",
              "Rainy city scene"
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handlePromptSubmit(prompt)}
                className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-sm text-gray-400 hover:text-white transition-all duration-300"
              >
                {prompt}
              </button>
            ))}
          </div>

        </div>
      </div>

      <CommunityShowcase />
      <Footer />
    </div>
  );
}
