'use client';

import { useState, useEffect } from 'react';
import type { StoryboardOption, AnimationFrame } from '@/app/types';
import Landing from '@/components/landing';
import StoryboardSelection from '@/components/storyboard-selection';
import Editor from '@/components/editor';
import { handleGenerateFrames } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import Loading from './loading';

type ProjectState = 'PROMPT' | 'STORYBOARD_SELECTION' | 'EDITING';

export default function Home() {
  const [projectState, setProjectState] = useState<ProjectState>('PROMPT');
  const [storyboardOptions, setStoryboardOptions] = useState<StoryboardOption[]>([]);
  const [selectedStoryboard, setSelectedStoryboard] = useState<StoryboardOption | null>(null);
  const [animationFrames, setAnimationFrames] = useState<AnimationFrame[]>([]);
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [history, setHistory] = useState<AnimationFrame[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStoryboardGenerated = (options: StoryboardOption[]) => {
    if (options && options.length > 0) {
      setStoryboardOptions(options);
      setProjectState('STORYBOARD_SELECTION');
    } else {
      toast({
        variant: 'destructive',
        title: 'Storyboard Generation Failed',
        description: 'The AI could not generate storyboards. Please try a different prompt.',
      });
    }
    setIsLoading(false);
  };

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
        return <Landing onStoryboardGenerated={handleStoryboardGenerated} setIsLoading={setIsLoading} />;
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
        return <Landing onStoryboardGenerated={handleStoryboardGenerated} setIsLoading={setIsLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {isLoading && <Loading />}
      {renderState()}
    </div>
  );
}
