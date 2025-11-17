'use server';

/**
 * @fileOverview Flow to automatically generate individual frames and animate sequences based on the storyboard.
 *
 * - generateAnimationFrames - A function that handles the animation frame generation process.
 * - GenerateAnimationFramesInput - The input type for the generateAnimationFrames function.
 * - GenerateAnimationFramesOutput - The return type for the generateAnimationFrames function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAnimationFramesInputSchema = z.object({
  storyboard: z
    .string()
    .describe('The storyboard text to base the animation frames on.'),
  frameDescription: z
    .string()
    .describe('A description of the desired style and content of the animation frames.'),
  numFrames: z
    .number()
    .default(5)
    .describe('The number of frames to generate for the animation sequence.'),
});
export type GenerateAnimationFramesInput = z.infer<typeof GenerateAnimationFramesInputSchema>;

const GenerateAnimationFramesOutputSchema = z.object({
  frames: z.array(
    z.string().describe('Data URI of the generated animation frame image.')
  ).describe('Array of generated animation frame data URIs.'),
});
export type GenerateAnimationFramesOutput = z.infer<typeof GenerateAnimationFramesOutputSchema>;

export async function generateAnimationFrames(
  input: GenerateAnimationFramesInput
): Promise<GenerateAnimationFramesOutput> {
  return generateAnimationFramesFlow(input);
}

const generateAnimationFramesPrompt = ai.definePrompt({
  name: 'generateAnimationFramesPrompt',
  input: {schema: GenerateAnimationFramesInputSchema},
  output: {schema: GenerateAnimationFramesOutputSchema},
  prompt: `You are an AI animation assistant. Your task is to generate a sequence of animation frames based on a given storyboard and a description of the desired frame style.

Storyboard:
{{{storyboard}}}

Frame Description:
{{{frameDescription}}}

Generate {{{numFrames}}} frames that follow the storyboard and match the provided frame description. Ensure visual consistency between frames.

Output the frames as a JSON array of data URIs.

Example:
{
  "frames": [
    "data:image/png;base64,<base64 encoded image data>",
    "data:image/png;base64,<base64 encoded image data>",
    ...
  ]
}`,
});

const generateAnimationFramesFlow = ai.defineFlow(
  {
    name: 'generateAnimationFramesFlow',
    inputSchema: GenerateAnimationFramesInputSchema,
    outputSchema: GenerateAnimationFramesOutputSchema,
  },
  async input => {
    const {numFrames} = input;
    const frames: string[] = [];

    for (let i = 0; i < numFrames; i++) {
      const {media} = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `${input.frameDescription} Frame ${i + 1}: ${input.storyboard}`,
      });
      if (media?.url) {
        frames.push(media.url);
      }
    }

    return {frames};
  }
);
