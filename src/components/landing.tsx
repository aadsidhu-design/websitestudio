'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleGenerateStoryboard } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { Sparkles, ArrowUp } from 'lucide-react';
import type { StoryboardOption } from '@/app/types';
import { useToast } from "@/hooks/use-toast";

const initialState: { storyboardOptions: StoryboardOption[] | null; error: string | null } = {
  storyboardOptions: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="icon" className="rounded-full flex-shrink-0">
      {pending ? <Sparkles className="animate-spin" /> : <ArrowUp />}
    </Button>
  );
}

function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 p-4">
        <div className="container mx-auto flex justify-between items-center">
            <Logo />
            <nav className="flex items-center gap-4">
                <Button variant="ghost">Log in</Button>
                <Button>Get Started</Button>
            </nav>
        </div>
    </header>
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
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-[#111] to-[#222]">
       <Header />
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
            Build something <span className='text-primary'>Lovable</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
            Create apps and websites by chatting with AI
        </p>

        <form action={handleSubmit}>
            <Card className="bg-card/50 border-border/30 shadow-2xl rounded-2xl">
                <CardContent className="p-2 flex items-center gap-2">
                     <Textarea
                        name="prompt"
                        placeholder="Ask Lovable to create a dashboard to..."
                        className="text-base resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                        required
                    />
                    <SubmitButton />
                </CardContent>
            </Card>
        </form>
      </div>
    </div>
  );
}
