'use client';

import { useState } from 'react';
import type { StoryboardOption, AnimationFrame } from '@/app/types';
import Landing from '@/components/landing';
import StoryboardSelection from '@/components/storyboard-selection';
import Editor from '@/components/editor';
import Plan from '@/app/plan/page';
import { handleGenerateFrames } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import Loading from './loading';
import { GenerateAnimationPlanOutput } from '@/ai/flows/generate-animation-plan';

type ProjectState = 'PROMPT' | 'PLANNING' | 'STORYBOARD_SELECTION' | 'EDITING';

export default function Home() {
  const [projectState, setProjectState] = useState<ProjectState>('PROMPT');
  const [plan, setPlan] = useState<GenerateAnimationPlanOutput | null>(null);
  const [storyboardOptions, setStoryboardOptions] = useState<StoryboardOption[]>([]);
  const [selectedStoryboard, setSelectedStoryboard] = useState<StoryboardOption | null>(null);
  const [animationFrames, setAnimationFrames] = useState<AnimationFrame[]>([]);
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [history, setHistory] = useState<AnimationFrame[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePlanGenerated = (plan: GenerateAnimationPlanOutput) => {
    if (plan && plan.tasks.length > 0) {
      setPlan(plan);
      setProjectState('PLANNING');
    } else {
      toast({
        variant: 'destructive',
        title: 'Plan Generation Failed',
        description: 'The AI could not generate a plan. Please try a different prompt.',
      });
    }
    setIsLoading(false);
  };
  
  const handlePlanAccepted = (storyboardOptions: StoryboardOption[]) => {
    if (storyboardOptions && storyboardOptions.length > 0) {
      setStoryboardOptions(storyboardOptions);
      setProjectState('STORYBOARD_SELECTION');
    } else {
      toast({
        variant: 'destructive',
        title: 'Storyboard Generation Failed',
        description: 'The AI could not generate storyboards from the plan. Please try again.',
      });
    }
    setIsLoading(false);
  }

  const handleStoryboardSelected = async (storyboard: StoryboardOption) => {
    setIsLoading(true);
    setSelectedStoryboard(storyboard);

    const storyboardText = storyboard.frames.map(f => f.description).join('\n');
    const result = await handleGenerateFrames({
      storyboard: storyboardText,
      frameDescription: "A consistent, animated frame in a modern digital style.",
      numFrames: 5,
    });

    if (result.error || !result.frames) {
      toast({
        variant: 'destructive',
        title: 'Frame Generation Failed',
        description: result.error || 'Could not generate animation frames.',
      });
      setIsLoading(false);
      return;
    }
    
    const initialFrames = result.frames.map((url, index) => ({ id: `${Date.now()}-${index}`, url }));
    setAnimationFrames(initialFrames);
    setHistory([initialFrames]);
    setProjectState('EDITING');
    setIsLoading(false);
  };
  
  const handleFrameAdjusted = (adjustedFrame: AnimationFrame) => {
    const newFrames = [...animationFrames];
    newFrames[activeFrameIndex] = adjustedFrame;
    setAnimationFrames(newFrames);
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const previousFrames = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setAnimationFrames(previousFrames);
      setActiveFrameIndex(0);
       toast({
        title: "Reverted",
        description: "Returned to the previous version.",
      });
    } else {
       toast({
        variant: 'destructive',
        title: "Cannot Undo",
        description: "No previous versions available.",
      });
    }
  };

  const updateHistory = () => {
    setHistory(prev => [...prev, animationFrames]);
  }

  const renderState = () => {
    switch (projectState) {
      case 'PROMPT':
        return <Landing onPlanGenerated={handlePlanGenerated} setIsLoading={setIsLoading} />;
      case 'PLANNING':
        return plan ? <Plan initialTasks={plan.tasks} onAccept={handlePlanAccepted} setIsLoading={setIsLoading} /> : <Landing onPlanGenerated={handlePlanGenerated} setIsLoading={setIsLoading} />;
      case 'STORYBOARD_SELECTION':
        return <StoryboardSelection storyboardOptions={storyboardOptions} onSelect={handleStoryboardSelected} />;
      case 'EDITING':
        return (
          <Editor
            frames={animationFrames}
            activeFrameIndex={activeFrameIndex}
            setActiveFrameIndex={setActiveFrameIndex}
            onFrameAdjusted={handleFrameAdjusted}
            onUndo={handleUndo}
            canUndo={history.length > 1}
            updateHistory={updateHistory}
          />
        );
      default:
        return <Landing onPlanGenerated={handlePlanGenerated} setIsLoading={setIsLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {isLoading && <Loading />}
      {renderState()}
    </div>
  );
}
