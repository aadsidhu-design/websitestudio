'use server';

/**
 * @fileOverview This file defines a Genkit flow for AI-powered frame editing and adjustments.
 *
 * It allows users to edit specific frames, adjust details, and correct inconsistencies in an animation project.
 *
 * @exports `adjustAnimationFrame` - An async function that takes an `AdjustAnimationFrameInput` and returns an `AdjustAnimationFrameOutput`.
 * @exports `AdjustAnimationFrameInput` - The input type for the `adjustAnimationFrame` function.
 * @exports `AdjustAnimationFrameOutput` - The output type for the `adjustAnimationFrame` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustAnimationFrameInputSchema = z.object({
  frameDataUri: z
    .string()
    .describe(
      "The frame to be adjusted, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  adjustmentInstructions: z
    .string()
    .describe(
      'Detailed instructions on how to adjust the frame. Be specific about the elements to modify and the desired changes.'
    ),
});

export type AdjustAnimationFrameInput = z.infer<
  typeof AdjustAnimationFrameInputSchema
>;

const AdjustAnimationFrameOutputSchema = z.object({
  adjustedFrameDataUri: z
    .string()
    .describe(
      'The adjusted frame, as a data URI that must include a MIME type and use Base64 encoding.'
    ),
  summary: z
    .string()
    .describe(
      'A summary of the adjustments made to the frame, including details on the changes and improvements.'
    ),
});

export type AdjustAnimationFrameOutput = z.infer<
  typeof AdjustAnimationFrameOutputSchema
>;

export async function adjustAnimationFrame(
  input: AdjustAnimationFrameInput
): Promise<AdjustAnimationFrameOutput> {
  return adjustAnimationFrameFlow(input);
}

const adjustAnimationFramePrompt = ai.definePrompt({
  name: 'adjustAnimationFramePrompt',
  input: {schema: AdjustAnimationFrameInputSchema},
  output: {schema: AdjustAnimationFrameOutputSchema},
  prompt: `You are an AI-powered frame adjustment tool. You will receive a frame and adjustment instructions.

  Your task is to adjust the frame according to the instructions, maintaining visual quality and consistency.

  Frame: {{media url=frameDataUri}}
  Adjustment Instructions: {{{adjustmentInstructions}}}

  Return the adjusted frame as a data URI and a summary of the adjustments made. The summary should include details on the changes and improvements.
  `,
});

const adjustAnimationFrameFlow = ai.defineFlow(
  {
    name: 'adjustAnimationFrameFlow',
    inputSchema: AdjustAnimationFrameInputSchema,
    outputSchema: AdjustAnimationFrameOutputSchema,
  },
  async input => {
    const {output} = await adjustAnimationFramePrompt(input);
    return output!;
  }
);
