'use server';
/**
 * @fileOverview Implements collaborative AI-assisted editing of storyboard frames and animation sequences.
 *
 * - collaborativeAIAssistedEditing - A function that handles the collaborative editing process, using AI to interpret comments and annotations.
 * - CollaborativeAIAssistedEditingInput - The input type for the collaborativeAIAssistedEditing function.
 * - CollaborativeAIAssistedEditingOutput - The return type for the collaborativeAIAssistedEditing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CollaborativeAIAssistedEditingInputSchema = z.object({
  frameDataUri: z
    .string()
    .describe(
      "A frame of the storyboard or animation sequence, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  comments: z
    .array(z.string())
    .describe('An array of comments and annotations on the frame.'),
  desiredChanges: z
    .string()
    .describe(
      'A description of the desired changes to the frame based on the comments.'
    ),
});

export type CollaborativeAIAssistedEditingInput = z.infer<
  typeof CollaborativeAIAssistedEditingInputSchema
>;

const CollaborativeAIAssistedEditingOutputSchema = z.object({
  editedFrameDataUri: z
    .string()
    .describe(
      'The edited frame as a data URI, incorporating the changes based on the comments and desired changes.'
    ),
  summary: z.string().describe('A summary of the changes made to the frame.'),
});

export type CollaborativeAIAssistedEditingOutput = z.infer<
  typeof CollaborativeAIAssistedEditingOutputSchema
>;

export async function collaborativeAIAssistedEditing(
  input: CollaborativeAIAssistedEditingInput
): Promise<CollaborativeAIAssistedEditingOutput> {
  return collaborativeAIAssistedEditingFlow(input);
}

const collaborativeAIAssistedEditingPrompt = ai.definePrompt({
  name: 'collaborativeAIAssistedEditingPrompt',
  input: {schema: CollaborativeAIAssistedEditingInputSchema},
  output: {schema: CollaborativeAIAssistedEditingOutputSchema},
  prompt: `You are an AI assistant that helps with collaborative editing of animation frames.

  You will receive a frame, a list of comments, and a description of desired changes.
  Your task is to edit the frame based on the comments and desired changes and return the edited frame as a data URI.
  Also, provide a summary of the changes made.

  Frame: {{media url=frameDataUri}}
  Comments:
  {{#each comments}}
  - {{{this}}}
  {{/each}}
  Desired Changes: {{{desiredChanges}}}
  `,
});

const collaborativeAIAssistedEditingFlow = ai.defineFlow(
  {
    name: 'collaborativeAIAssistedEditingFlow',
    inputSchema: CollaborativeAIAssistedEditingInputSchema,
    outputSchema: CollaborativeAIAssistedEditingOutputSchema,
  },
  async input => {
    const {output} = await collaborativeAIAssistedEditingPrompt(input);
    return output!;
  }
);
