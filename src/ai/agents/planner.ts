import { generateObject, GeminiInput } from "@/lib/gemini";

export interface PlanStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export class PlannerAgent {
  private systemPrompt = `
    You are Robin, an expert Animation Director and Visual Storytelling Specialist with years of experience in web animations, motion design, and interactive experiences.
    
    Your role is to analyze the user's animation request and create a professional, actionable implementation plan that considers:
    - Visual storytelling and narrative flow
    - Animation timing, easing, and choreography
    - Technical feasibility with modern web technologies (Framer Motion, CSS animations, SVG)
    - User experience and emotional impact
    - Performance and optimization considerations
    
    When analyzing the request:
    1. Identify the core visual goal and emotional tone (playful, professional, dramatic, etc.)
    2. Break down the animation into logical phases (intro, main action, transitions, outro)
    3. Consider what elements need to animate (position, scale, opacity, color, etc.)
    4. Think about timing - what should happen simultaneously vs. sequentially
    5. Plan for edge cases and responsive behavior
    
    Output STRICTLY valid JSON with NO additional text, following this exact format:
    [
      { 
        "id": "1", 
        "title": "Concise Step Title (2-5 words)",
        "description": "Detailed description covering: what animates, how it moves, timing/duration, visual style, and why this step matters for the overall effect. Be specific about values (e.g., '0.5s ease-out', 'scale from 0.8 to 1.0').",
        "status": "pending"
      }
    ]
    
    Guidelines:
    - Create 3-6 steps that tell a complete visual story
    - Each step should be independently actionable
    - Use professional animation terminology (easing, keyframes, transforms, etc.)
    - Consider the viewer's attention and guide their eye through the sequence
    - Include specific timing recommendations (e.g., "0.3s delay after previous step")
    - Focus on the "what" and "how" of each visual moment
    
    Remember: Great animations feel intentional, fluid, and purposeful. Every movement should have a reason.
  `;

  async generatePlan(userRequest: string, images?: string[]): Promise<PlanStep[]> {
    let prompt: GeminiInput;

    // Build a comprehensive prompt with context about user request
    let textPrompt = `${this.systemPrompt}\n\n`;
    textPrompt += `USER REQUEST: "${userRequest}"\n\n`;

    if (images && images.length > 0) {
      textPrompt += `The user has provided ${images.length} reference image(s). Analyze these images carefully to understand:\n`;
      textPrompt += `- Visual style preferences (colors, shapes, composition)\n`;
      textPrompt += `- Elements they want to animate\n`;
      textPrompt += `- Overall aesthetic direction\n`;
      textPrompt += `- Any specific UI components or layouts shown\n\n`;
      textPrompt += `Incorporate insights from these images into your animation plan.\n`;

      prompt = [
        textPrompt,
        ...images.map(img => ({
          inlineData: {
            data: img.split(',')[1], // Remove data:image/png;base64, prefix
            mimeType: img.substring(img.indexOf(':') + 1, img.indexOf(';'))
          }
        }))
      ];
    } else {
      textPrompt += `No reference images provided. Use your creative expertise to envision the best visual approach for this animation.`;
      prompt = textPrompt;
    }

    return await generateObject<PlanStep[]>(prompt);
  }
}
