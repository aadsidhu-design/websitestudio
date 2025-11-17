'use server';

import {
  generateStoryboard,
  GenerateStoryboardInput,
  GenerateStoryboardOutput,
} from '@/ai/flows/generate-storyboard-from-prompt';
import {
  generateAnimationFrames,
  GenerateAnimationFramesInput,
} from '@/ai/flows/ai-generate-animation-frames';
import {
  adjustAnimationFrame,
  AdjustAnimationFrameInput,
} from '@/ai/flows/ai-frame-editing-adjustments';
import {
  collaborativeAIAssistedEditing,
  CollaborativeAIAssistedEditingInput
} from '@/ai/flows/collaborative-ai-assisted-editing'

export async function handleGenerateStoryboard(
  prevState: any,
  formData: FormData
): Promise<{ storyboardOptions: GenerateStoryboardOutput['storyboardOptions'] | null; error: string | null }> {
  const prompt = formData.get('prompt') as string;
  if (!prompt) {
    return { storyboardOptions: null, error: 'Prompt is required.' };
  }

  try {
    const input: GenerateStoryboardInput = {
      prompt,
      numOptions: 2,
    };
    const result = await generateStoryboard(input);
    return { storyboardOptions: result.storyboardOptions, error: null };
  } catch (e: any) {
    console.error(e);
    return { storyboardOptions: null, error: e.message || 'Failed to generate storyboard.' };
  }
}

export async function handleGenerateFrames(
  input: GenerateAnimationFramesInput
): Promise<{ frames: string[] | null; error: string | null }> {
  try {
    const result = await generateAnimationFrames(input);
    return { frames: result.frames, error: null };
  } catch (e: any) {
    console.error(e);
    return { frames: null, error: e.message || 'Failed to generate frames.' };
  }
}

export async function handleAdjustFrame(
  prevState: any,
  formData: FormData
): Promise<{ adjustedFrame: {id: string, url: string} | null; error: string | null }> {
    const frameDataUri = formData.get('frameDataUri') as string;
    const adjustmentInstructions = formData.get('adjustmentInstructions') as string;
    const frameId = formData.get('frameId') as string;

    if (!frameDataUri || !adjustmentInstructions || !frameId) {
        return { adjustedFrame: null, error: 'Missing required fields.'};
    }

    try {
        const input: AdjustAnimationFrameInput = { frameDataUri, adjustmentInstructions };
        const result = await adjustAnimationFrame(input);
        return { adjustedFrame: { id: frameId, url: result.adjustedFrameDataUri }, error: null };
    } catch (e: any) {
        console.error(e);
        return { adjustedFrame: null, error: e.message || 'Failed to adjust frame.' };
    }
}

export async function handleCollaborate(
    prevState: any,
    formData: FormData
): Promise<{ editedFrame: {id: string, url: string} | null; error: string | null }> {
    const frameDataUri = formData.get('frameDataUri') as string;
    const comments = (formData.get('comments') as string).split('\n').filter(c => c.trim() !== '');
    const desiredChanges = formData.get('desiredChanges') as string;
    const frameId = formData.get('frameId') as string;

     if (!frameDataUri || !desiredChanges || !frameId) {
        return { editedFrame: null, error: 'Missing required fields.'};
    }

    try {
        const input: CollaborativeAIAssistedEditingInput = { frameDataUri, comments, desiredChanges };
        const result = await collaborativeAIAssistedEditing(input);
        return { editedFrame: { id: frameId, url: result.editedFrameDataUri }, error: null };
    } catch (e: any) {
        console.error(e);
        return { editedFrame: null, error: e.message || 'Failed to edit frame.' };
    }
}
