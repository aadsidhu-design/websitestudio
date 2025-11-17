'use server';

/**
 * @fileOverview This file defines a Genkit flow for determining appropriate scene lengths for an animation based on user prompts and context.
 *
 * - generateSceneLength - A function that takes user input and returns a scene length suggestion.
 * - SceneLengthInput - The input type for the generateSceneLength function.
 * - SceneLengthOutput - The return type for the generateSceneLength function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SceneLengthInputSchema = z.object({
  prompt: z
    .string()
    .describe("A description of the scene, its context within the overall animation, and any specific pacing requirements."),
});
export type SceneLengthInput = z.infer<typeof SceneLengthInputSchema>;

const SceneLengthOutputSchema = z.object({
  sceneLengthSeconds: z
    .number()
    .int()
    .min(10)
    .max(900)
    .describe("The suggested scene length in seconds, between 10 seconds (inclusive) and 900 seconds (15 minutes, inclusive)."),
  reasoning: z
    .string()
    .describe("The AI's reasoning for suggesting the scene length, based on the prompt."),
});
export type SceneLengthOutput = z.infer<typeof SceneLengthOutputSchema>;

export async function generateSceneLength(input: SceneLengthInput): Promise<SceneLengthOutput> {
  return generateSceneLengthFlow(input);
}

const sceneLengthPrompt = ai.definePrompt({
  name: 'sceneLengthPrompt',
  input: {schema: SceneLengthInputSchema},
  output: {schema: SceneLengthOutputSchema},
  prompt: `You are an expert animation scene length advisor.  A user will provide a description of a scene, its context within the overall animation, and any specific pacing requirements. Based on this, you will suggest an appropriate scene length in seconds, and provide a brief explanation of your reasoning.

  The scene length should be a whole number of seconds between 10 seconds (inclusive) and 900 seconds (15 minutes, inclusive).

  Description: {{{prompt}}}
  `,
});

const generateSceneLengthFlow = ai.defineFlow(
  {
    name: 'generateSceneLengthFlow',
    inputSchema: SceneLengthInputSchema,
    outputSchema: SceneLengthOutputSchema,
  },
  async input => {
    const {output} = await sceneLengthPrompt(input);
    return output!;
  }
);
