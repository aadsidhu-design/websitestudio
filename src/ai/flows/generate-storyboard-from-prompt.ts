'use server';
/**
 * @fileOverview Generates a storyboard from a text prompt.
 *
 * - generateStoryboard - A function that generates a storyboard from a text prompt.
 * - GenerateStoryboardInput - The input type for the generateStoryboard function.
 * - GenerateStoryboardOutput - The return type for the generateStoryboard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStoryboardInputSchema = z.object({
  prompt: z.string().describe('The prompt to generate a storyboard from.'),
  numOptions: z
    .number()
    .min(1)
    .max(5)
    .default(3)
    .describe('The number of storyboard options to generate.'),
  model: z
    .enum(['googleai/gemini-2.5-flash-image-preview', 'googleai/imagen-4.0-fast-generate-001'])
    .default('googleai/gemini-2.5-flash-image-preview')
    .describe('The model to use for generating the storyboard.'),
});
export type GenerateStoryboardInput = z.infer<typeof GenerateStoryboardInputSchema>;

const GenerateStoryboardOutputSchema = z.object({
  storyboardOptions: z.array(
    z.object({
      frames: z.array(
        z.object({
          imageUrl: z.string().describe('The URL of the generated image.'),
          description: z.string().describe('A description of the frame.'),
        })
      ),
    })
  ),
});
export type GenerateStoryboardOutput = z.infer<typeof GenerateStoryboardOutputSchema>;

export async function generateStoryboard(input: GenerateStoryboardInput): Promise<GenerateStoryboardOutput> {
  return generateStoryboardFlow(input);
}

const framePrompt = ai.definePrompt({
  name: 'framePrompt',
  input: {schema: z.object({description: z.string()})},
  prompt: `Generate an image based on the following description: {{{description}}}`,
});

const generateStoryboardFlow = ai.defineFlow(
  {
    name: 'generateStoryboardFlow',
    inputSchema: GenerateStoryboardInputSchema,
    outputSchema: GenerateStoryboardOutputSchema,
  },
  async input => {
    const storyboardOptions = [];

    for (let i = 0; i < input.numOptions; i++) {
      const frames = [];
      // Example: Generate 5 frames per option, adjust as needed
      for (let j = 0; j < 5; j++) {
        // Create a description for each frame, you might want to use a more sophisticated method
        const frameDescription = `${input.prompt} - Frame ${j + 1}`;

        // Use the selected model to generate the image based on the description
        let imageResult;
        if (input.model === 'googleai/gemini-2.5-flash-image-preview') {
          const {media} = await ai.generate({
            model: input.model,
            prompt: frameDescription,
            config: {
              responseModalities: ['TEXT', 'IMAGE'],
            },
          });

          imageResult = media?.url;
        } else {
          const {media} = await ai.generate({
            model: input.model,
            prompt: frameDescription,
          });
          imageResult = media?.url;
        }
        if (!imageResult) {
          console.warn('no image returned, skipping');
          continue;
        }

        frames.push({
          imageUrl: imageResult,
          description: frameDescription,
        });
      }

      storyboardOptions.push({
        frames: frames,
      });
    }

    return {storyboardOptions};
  }
);
