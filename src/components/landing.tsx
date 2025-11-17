'use client';

import { useEffect } from 'react';
import { useActionState } from 'react';
import { handleGenerateStoryboard } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Globe, Twitter } from 'lucide-react';
import type { StoryboardOption } from '@/app/types';
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { AiInput } from './ai-input';

const initialState: { storyboardOptions: StoryboardOption[] | null; error: string | null } = {
  storyboardOptions: null,
  error: null,
};

function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 p-4 z-10">
        <div className="container mx-auto flex justify-between items-center">
            <Logo />
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Community</a>
              <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Pricing</a>
              <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Features</a>
              <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Learn</a>
            </nav>
            <nav className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <a href="/login">Log in</a>
                </Button>
                <Button className="bg-primary/90 hover:bg-primary rounded-full px-6 shadow-lg hover:shadow-primary/50 transition-all duration-300">Get Started</Button>
            </nav>
        </div>
    </header>
  );
}

function CommunityShowcase() {
  const categories = ["Popular", "Discover", "Internal Tools", "Website", "Personal", "Consumer App", "B2B App", "Prototype"];
  return (
    <section className="w-full py-24 sm:py-32">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold tracking-tighter mb-2">From the Community</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Explore what others are creating with Robin.</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {categories.map(cat => <Button key={cat} variant={cat === "Popular" ? "secondary" : "ghost"} className="rounded-full">{cat}</Button>)}
              <Button variant="outline" className="ml-auto rounded-full">View All</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {PlaceHolderImages.filter(img => img.id !== 'login-hero').map((image, index) => (
                    <Card key={image.id} className="group overflow-hidden bg-card/50 border-border/30 hover:shadow-primary/20 hover:shadow-lg transition-all duration-300 rounded-xl">
                        <CardContent className="p-0">
                            <div className="relative aspect-[4/3] w-full">
                                <Image 
                                    src={image.imageUrl}
                                    alt={image.description}
                                    fill
                                    data-ai-hint={image.imageHint}
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold">{image.description}</h3>
                                <Badge variant="outline" className="mt-2">Website</Badge>
                            </div>
                        </CardContent>
                    </Card>
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
      "Product": ["Features", "Integrations", "Pricing", "Changelog", "Docs"],
      "Company": ["About us", "Blog", "Careers", "Customers", "Contact us"],
      "Resources": ["Community", "Inspiration", "Support", "Experts", "YouTube"],
      "Legal": ["Privacy", "Terms", "Security"],
    };

    return (
      <footer className="py-16">
        <div className="container mx-auto px-8">
         <div className="bg-[#1C1C1C] p-12 rounded-3xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            <div className="col-span-full lg:col-span-1">
              <Logo />
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
             <p>&copy; {new Date().getFullYear()} Robin, Inc. All rights reserved.</p>
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
  onStoryboardGenerated,
  setIsLoading,
}: {
  onStoryboardGenerated: (options: StoryboardOption[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}) {
  const [state, formAction] = useActionState(handleGenerateStoryboard, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.storyboardOptions) {
      onStoryboardGenerated(state.storyboardOptions);
    }
    if (state.error) {
       toast({
        variant: "destructive",
        title: "Generation Failed",
        description: state.error,
      })
      setIsLoading(false);
    }
  }, [state, onStoryboardGenerated, setIsLoading, toast]);

  const handleSubmit = (formData: FormData) => {
    setIsLoading(true);
    formAction(formData);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start">
      <Header />
      <div className="flex flex-col items-center justify-center w-full min-h-screen pt-24 pb-12 px-4 text-center">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="z-0">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
              Build something <span className='text-primary'>amazing</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create apps and websites by chatting with AI. Robin handles the code, you focus on the idea.
          </p>
        </div>

        <div className="w-full max-w-2xl z-0">
           <AiInput onSubmit={handleSubmit} />
        </div>
      </div>
      <CommunityShowcase />
      <Footer />
    </div>
  );
}

// Re-exporting Card and CardContent as they are used in CommunityShowcase
import { Card, CardContent } from '@/components/ui/card';
