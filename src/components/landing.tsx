'use client';

import { useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleGenerateStoryboard } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { Sparkles, ArrowUp, Globe, Settings2, Twitter } from 'lucide-react';
import type { StoryboardOption } from '@/app/types';
import { useToast } from "@/hooks/use-toast";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

const initialState: { storyboardOptions: StoryboardOption[] | null; error: string | null } = {
  storyboardOptions: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="rounded-full w-14 h-14 flex-shrink-0 bg-primary/80 hover:bg-primary shadow-lg hover:shadow-primary/50 transition-all duration-300">
      {pending ? <Sparkles className="animate-spin" /> : <ArrowUp />}
    </Button>
  );
}

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
                <Button variant="ghost">Log in</Button>
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
                {PlaceHolderImages.map((image, index) => (
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
      "Company": ["Careers", "Press & media", "Enterprise", "Security", "Trust center", "Partnerships"],
      "Product": ["Pricing", "Student discount", "Solutions", "Connections", "Import from Figma", "Changelog", "Status"],
      "Resources": ["Learn", "How-to guides", "Videos", "Blog", "Launched", "Support"],
      "Legal": ["Privacy policy", "Cookie settings", "Terms of Service", "Platform rules", "Report abuse", "Report security concerns"],
      "Community": ["Become a partner", "Hire a partner", "Affiliates", "Discord", "X / Twitter", "YouTube", "LinkedIn"],
    };

    return (
      <footer className="py-16">
        <div className="container mx-auto px-8">
         <div className="bg-[#1C1C1C] p-12 rounded-3xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            <div className="col-span-2 md:col-span-3 lg:col-span-1">
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
          <div className="mt-12 flex justify-start items-center text-sm text-muted-foreground">
             <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                <Globe className="w-4 h-4 mr-2" />
                <span>EN</span>
             </Button>
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

        <form action={handleSubmit} className="w-full max-w-2xl z-0">
            <Card className="bg-card/50 border-border/30 shadow-2xl rounded-2xl backdrop-blur-sm">
                <CardContent className="p-2 flex items-center">
                     <Textarea
                        name="prompt"
                        placeholder="Ask Robin to create a dashboard to..."
                        className="text-base resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground flex-grow"
                        required
                        rows={1}
                    />
                    <div className="flex items-center gap-2 pl-2">
                       <div className='hidden sm:flex items-center gap-4'>
                         <div className="flex items-center space-x-2">
                            <Switch id="public-switch" />
                            <Label htmlFor="public-switch" className="text-muted-foreground">Public</Label>
                         </div>
                         <Button variant="ghost" size="sm" className="text-muted-foreground"><Settings2 className="w-4 h-4 mr-2" />Options</Button>
                       </div>
                       <SubmitButton />
                    </div>
                </CardContent>
            </Card>
        </form>
      </div>
      <CommunityShowcase />
      <Footer />
    </div>
  );
}
