'use server';
/**
 * @fileOverview Generates an animation plan from a text prompt.
 *
 * - generateAnimationPlan - A function that generates a plan from a text prompt.
 * - GenerateAnimationPlanInput - The input type for the generateAnimationPlan function.
 * - GenerateAnimationPlanOutput - The return type for the generateAnimationPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAnimationPlanInputSchema = z.object({
  prompt: z.string().describe('The prompt to generate a plan from.'),
});
export type GenerateAnimationPlanInput = z.infer<typeof GenerateAnimationPlanInputSchema>;


const SubtaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(["completed", "in-progress", "pending", "need-help", "failed"]),
  priority: z.enum(["high", "medium", "low"]),
  tools: z.array(z.string()).optional(),
});

const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(["completed", "in-progress", "pending", "need-help", "failed"]),
  priority: z.enum(["high", "medium", "low"]),
  level: z.number(),
  dependencies: z.array(z.string()),
  subtasks: z.array(SubtaskSchema),
});

const GenerateAnimationPlanOutputSchema = z.object({
    tasks: z.array(TaskSchema),
});

export type GenerateAnimationPlanOutput = z.infer<typeof GenerateAnimationPlanOutputSchema>;

export async function generateAnimationPlan(input: GenerateAnimationPlanInput): Promise<GenerateAnimationPlanOutput> {
  return generateAnimationPlanFlow(input);
}

const generateAnimationPlanPrompt = ai.definePrompt({
  name: 'generateAnimationPlanPrompt',
  input: {schema: GenerateAnimationPlanInputSchema},
  output: {schema: GenerateAnimationPlanOutputSchema},
  prompt: `You are an expert animation project planner. A user will provide a prompt for an animation, and you will break it down into a detailed project plan. The plan should consist of high-level tasks, each with specific subtasks.

  For the user prompt: {{{prompt}}}

  Generate a list of tasks to create this animation. Each task must have:
  - id: A unique identifier (e.g., "1", "2").
  - title: A concise title for the task.
  - description: A brief description of the task.
  - status: The initial status, usually "pending" or "in-progress".
  - priority: "high", "medium", or "low".
  - level: The dependency level (0 for initial tasks, 1 for tasks that depend on level 0 tasks, etc.).
  - dependencies: An array of task IDs this task depends on.
  - subtasks: An array of smaller, actionable steps to complete the task. Each subtask needs an id, title, description, status, priority, and an optional list of tools (e.g., ["character-designer", "scene-builder"]).

  Create a logical plan that flows from concept to final animation. Start with tasks like 'Concept & Storyboarding', move to 'Asset Creation', then 'Animation', and finally 'Post-production'. Be creative with the task and subtask descriptions based on the user's prompt.`,
});

const generateAnimationPlanFlow = ai.defineFlow(
  {
    name: 'generateAnimationPlanFlow',
    inputSchema: GenerateAnimationPlanInputSchema,
    outputSchema: GenerateAnimationPlanOutputSchema,
  },
  async (input) => {
    // For demonstration, we'll return a detailed mock plan.
    // In a real scenario, you might call a more powerful model here.
    if (input.prompt) {
        const {output} = await generateAnimationPlanPrompt(input);
        if (output) return output;
    }
    
    // Fallback mock data if the prompt fails or is empty
    return {
        tasks: [
          {
            id: "1",
            title: "Concept & Storyboarding",
            description: "Develop the initial concept and create a visual storyboard.",
            status: "in-progress",
            priority: "high",
            level: 0,
            dependencies: [],
            subtasks: [
              { id: "1.1", title: "Flesh out the narrative", description: "Write a short script or story outline.", status: "completed", priority: "high", tools: ["script-writer", "narrative-agent"] },
              { id: "1.2", title: "Sketch key scenes", description: "Create rough sketches for the main scenes in the animation.", status: "in-progress", priority: "high", tools: ["sketch-artist-tool", "storyboard-pro"] },
              { id: "1.3", title: "Define art style", description: "Create a moodboard and style guide for the animation's visual aesthetic.", status: "pending", priority: "medium", tools: ["style-analyzer", "moodboard-creator"] },
            ],
          },
          {
            id: "2",
            title: "Character & Asset Design",
            description: "Design the main characters and any necessary background assets or props.",
            status: "pending",
            priority: "high",
            level: 1,
            dependencies: ["1"],
            subtasks: [
                { id: "2.1", title: "Design main character", description: "Create detailed character sheets for the protagonist.", status: "pending", priority: "high", tools: ["character-designer-3d", "texture-painter"] },
                { id: "2.2", title: "Design background elements", description: "Create the environment and key set pieces.", status: "pending", priority: "medium", tools: ["environment-generator", "asset-library"] },
            ]
          },
          {
            id: "3",
            title: "Animation Production",
            description: "Animate the scenes based on the storyboard and created assets.",
            status: "pending",
            priority: "high",
            level: 2,
            dependencies: ["1", "2"],
            subtasks: [
                { id: "3.1", title: "Animate Scene 1: The Introduction", description: "Block out the main character movements and camera angles.", status: "pending", priority: "high", tools: ["animator-rig", "timeline-editor"] },
                { id: "3.2", title: "Animate Scene 2: The Climax", description: "Animate the key action sequence.", status: "pending", priority: "high", tools: ["physics-simulator", "animator-rig"] },
                { id: "3.3", title: "Add secondary animations", description: "Add smaller details like cloth simulation and facial expressions.", status: "pending", priority: "medium", tools: ["cloth-fx", "face-rig"] },
            ]
          },
          {
            id: "4",
            title: "Post-Production",
            description: "Add sound, music, color grading, and final effects.",
            status: "pending",
            priority: "medium",
            level: 3,
            dependencies: ["3"],
            subtasks: [
                { id: "4.1", title: "Sound Design & Foley", description: "Add sound effects and foley to the animation.", status: "pending", priority: "medium", tools: ["sfx-library", "audio-editor"] },
                { id: "4.2", title: "Compose Original Score", description: "Write and record a musical score to accompany the animation.", status: "pending", priority: "high", tools: ["music-composer-ai", "daw-integrator"] },
                { id: "4.3", title: "Color Grading & Final Render", description: "Perform final color correction and render the final video file.", status: "pending", priority: "high", tools: ["color-grader", "render-farm-api"] },
            ]
          }
        ]
    };
  }
);
