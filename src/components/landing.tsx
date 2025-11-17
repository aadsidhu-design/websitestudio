'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleGenerateStoryboard } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { Sparkles, Film } from 'lucide-react';
import type { StoryboardOption } from '@/app/types';
import { useToast } from "@/hooks/use-toast"

const initialState: { storyboardOptions: StoryboardOption[] | null; error: string | null } = {
  storyboardOptions: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto" size="lg">
      <Sparkles className="mr-2 h-5 w-5" />
      {pending ? 'Generating...' : 'Generate Storyboard'}
    </Button>
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
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
       <div className="absolute top-8 left-8">
        <Logo />
      </div>
      <div className="w-full max-w-3xl text-center">
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-headline">
          Bring Your Stories to Life with AI
        </h2>
        <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground sm:text-xl">
          Describe your vision, and let our AI co-pilot create stunning storyboards and animations for you. From script to screen in minutes.
        </p>
      </div>

      <Card className="w-full max-w-3xl mt-10 shadow-2xl bg-card/50 backdrop-blur-sm border-border/50">
        <form action={handleSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Film className="h-6 w-6 text-accent" />
              Start Your Animation
            </CardTitle>
            <CardDescription>Enter a prompt to describe your scene, characters, or story idea.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              name="prompt"
              placeholder="e.g., A robot exploring a lush, alien jungle at sunset."
              className="min-h-[120px] text-base resize-none focus:ring-accent"
              required
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
