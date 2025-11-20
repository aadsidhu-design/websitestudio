'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import { useActionState } from 'react';
import { handleGeneratePlan } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { Globe, Twitter } from 'lucide-react';
import { GenerateAnimationPlanOutput } from '@/ai/flows/generate-animation-plan';
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { AiInput } from './ai-input';
import Link from 'next/link';
import { SiteHeader } from './site-header';
import { TypewriterEffect } from './ui/typewriter-effect';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

const initialState: { plan: GenerateAnimationPlanOutput | null; error: string | null } = {
  plan: null,
  error: null,
};

function CommunityShowcase() {
  const categories = ["Popular", "Discover", "Internal Tools", "Website", "Personal", "Consumer App", "B2B App", "Prototype"];
  return (
    <section className="w-full py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold tracking-tighter mb-2">From the Community</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Explore what others are creating with Robin.</p>
        </motion.div>
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Button variant={cat === "Popular" ? "secondary" : "ghost"} className="rounded-full">{cat}</Button>
            </motion.div>
          ))}
          <Button variant="outline" className="ml-auto rounded-full">View All</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {PlaceHolderImages.filter(img => img.id !== 'login-hero').map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden bg-card/50 border-border/30 hover:shadow-primary/20 hover:shadow-lg transition-all duration-300 rounded-xl h-full">
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      data-ai-hint={image.imageHint}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="font-semibold truncate">{image.description}</h3>
                    <Badge variant="outline" className="mt-2">Website</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="rounded-full px-8">Show More</Button>
        </div>
      </div>
    </section>
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

export default function Landing({
  onPlanGenerated,
  setIsLoading,
}: {
  onPlanGenerated: (message: string, images?: string[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}) {
  const [state, formAction] = useActionState(handleGeneratePlan, initialState);
  const { toast } = useToast();

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (state.plan) {
      onPlanGenerated("Generate animation plan based on my request.");
    }
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: state.error,
      })
      setIsLoading(false);
    }
  }, [state, onPlanGenerated, setIsLoading, toast]);

  const handleSubmit = (formData: FormData) => {
    const prompt = formData.get('prompt') as string;
    const attachment = formData.get('attachment') as File | null;

    if (!prompt?.trim()) return;

    // Check if user is authenticated
    if (!user && !loading) {
      // Store prompt and image in sessionStorage
      sessionStorage.setItem('pendingPrompt', prompt);
      if (attachment) {
        const reader = new FileReader();
        reader.onloadend = () => {
          sessionStorage.setItem('pendingImage', reader.result as string);
          router.push('/login');
        };
        reader.readAsDataURL(attachment);
      } else {
        router.push('/login');
      }
      return;
    }

    // User is authenticated, proceed
    setIsLoading(true);

    if (attachment) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onPlanGenerated(prompt, [reader.result as string]);
      };
      reader.readAsDataURL(attachment);
    } else {
      onPlanGenerated(prompt);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-background">
      <SiteHeader />
      <div className="flex flex-col items-center justify-center w-full min-h-screen pt-24 pb-12 px-4 text-center relative overflow-hidden">

        {/* Background Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        <div className="z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">
              Build <br />
              <span className='text-primary'>
                <TypewriterEffect
                  words={["websites", "apps", "dashboards", "landing pages", "portfolios"]}
                  speed={100}
                  deleteSpeed={50}
                  pause={2000}
                />
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Turn your ideas into reality with Robin. Just chat, and watch your vision come to life instantly.
            </p>

            <div className="w-full max-w-md">
              <AiInput onSubmit={handleSubmit} />
            </div>

            <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p>Trusted by 10,000+ builders</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-xl overflow-hidden border border-border/50 shadow-2xl bg-background/50 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
              {/* Abstract UI Representation */}
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2 border-b border-border/50 pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  <div className="ml-4 h-4 w-64 bg-muted/50 rounded-full" />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1 space-y-3">
                    <div className="h-8 w-full bg-primary/10 rounded-md" />
                    <div className="h-4 w-3/4 bg-muted/50 rounded-md" />
                    <div className="h-4 w-1/2 bg-muted/50 rounded-md" />
                  </div>
                  <div className="col-span-3 space-y-4">
                    <div className="h-32 w-full bg-muted/20 rounded-lg border border-border/50" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 bg-muted/20 rounded-lg" />
                      <div className="h-24 bg-muted/20 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>


      {/* Features Section */}
      <section className="w-full py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-50 [mask-image:linear-gradient(180deg,rgba(255,255,255,0),white,rgba(255,255,255,0))]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">Everything you need to build</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">From idea to deployment, Robin handles the complex parts so you can focus on creativity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Natural Language", desc: "Describe your app in plain English. Robin understands context, nuance, and design intent.", icon: "💬" },
              { title: "Modern Stack", desc: "Generated code uses the latest tech: Next.js, Tailwind, Shadcn UI, and Framer Motion.", icon: "⚡" },
              { title: "Visual Editing", desc: "Click to edit any element. Ask for changes visually without touching code.", icon: "🎨" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CommunityShowcase />
      <Footer />
    </div >
  );
}

