'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleGenerateStoryboard } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { Sparkles, Bot, Palette, DraftingCompass } from 'lucide-react';
import type { StoryboardOption } from '@/app/types';
import { useToast } from "@/hooks/use-toast";

const initialState: { storyboardOptions: StoryboardOption[] | null; error: string | null } = {
  storyboardOptions: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      <Sparkles className="mr-2 h-5 w-5" />
      {pending ? 'Generating...' : 'Get Started'}
    </Button>
  );
}

const features = [
    {
        icon: <Bot size={28} className="text-primary" />,
        title: 'Smart Storyboarding',
        description: 'AI-assisted scene planning and narrative generation to quickly visualize your story.'
    },
    {
        icon: <Palette size={28} className="text-primary" />,
        title: 'Frame-by-Frame Control',
        description: 'Select, comment, and refine individual frames with precision, ensuring every detail is perfect.'
    },
    {
        icon: <DraftingCompass size={28} className="text-primary" />,
        title: 'Adaptive AI Generation',
        description: 'Multiple AI models including Nano Banana for versatile and high-quality asset creation.'
    }
]

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
      <div className="w-full max-w-5xl">
        <div className="text-center space-y-4 mb-16">
            <Logo />
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-headline text-foreground">
                AI-Powered Animation Creation Platform
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl">
              Create professional animations with contextual AI assistance. From concept to completion, collaborate with AI to bring your vision to life frame by frame.
            </p>
        </div>

        <form action={handleSubmit}>
            <Card className="bg-transparent border-border/30 shadow-2xl">
                <CardContent className="p-4">
                     <Textarea
                        name="prompt"
                        placeholder="Ask Lovable... e.g., A robot exploring a lush, alien jungle at sunset."
                        className="min-h-[60px] text-base resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                        required
                    />
                    <div className="flex justify-end mt-2">
                        <SubmitButton />
                    </div>
                </CardContent>
            </Card>
        </form>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center space-y-3">
                    <div className="p-3 bg-card rounded-full">
                        {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
