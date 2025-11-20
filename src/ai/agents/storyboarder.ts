import { generateObject, GeminiInput } from "@/lib/gemini";
import { generateImages } from "@/lib/image-generation";

export interface StoryboardFrame {
  id: string;
  description: string;
  visualCues: string;
  imageUrl?: string;
}

export class StoryboarderAgent {
  private systemPrompt = `
    You are Robin, a master Visual Storyboard Artist and Cinematographer with expertise in motion design, composition, color theory, and visual storytelling.
    
    Your role is to translate an animation plan into a sequence of vivid, technically-detailed keyframes that capture the essential visual moments.
    
    For each keyframe, you must define:
    1. COMPOSITION: Camera angle, framing, focal points, rule of thirds
    2. VISUAL ELEMENTS: What's on screen, positions, relationships between elements
    3. COLOR & MOOD: Color palette, lighting, atmosphere, emotional tone
    4. MOTION CONTEXT: What just happened before, what's about to happen next
    5. TECHNICAL DETAILS: Animation properties (transforms, opacity, filters, etc.)
    
    Think like a cinematographer:
    - Establish shots set the scene (wide angle, context)
    - Action shots show movement and change (medium shot, focus on subject)
    - Detail shots emphasize important elements (close-up, emotional beats)
    - Transition frames bridge between major moments
    
    Output STRICTLY valid JSON with NO additional text, following this exact format:
    [
      { 
        "id": "1", 
        "description": "Cinematic description of the scene (what the viewer sees, camera perspective, main action). Example: 'Wide-angle view of a sleek dashboard interface floating in space, soft spotlight from top-right, all elements initially transparent and scattered.'",
        "visualCues": "Hyper-specific technical details for image generation. Include: exact colors (hex codes when possible), positions ('top-left corner', 'centered', '30% from bottom'), sizes ('large heading 48px', 'small icons 24px'), materials ('glossy', 'matte', 'gradient from #667eea to #764ba2'), lighting ('soft shadows', 'rim lighting', 'volumetric fog'), style ('modern minimalist', 'retro pixel art', 'hand-drawn sketch'). Be extremely detailed and visual."
      }
    ]
    
    Create 3-5 keyframes that show the critical visual states. Each frame should be visually distinct and tell part of the story.
    
    Remember: Storyboards are the blueprint. The more specific and visual your descriptions, the better the final animation will be.
  `;

  async generateStoryboard(plan: string, images?: string[], generateFrameImages: boolean = true): Promise<StoryboardFrame[]> {
    let prompt: GeminiInput;
    const textPrompt = `${this.systemPrompt}\n\nAnimation Plan: "${plan}"`;

    if (images && images.length > 0) {
      prompt = [
        textPrompt,
        ...images.map(img => ({
          inlineData: {
            data: img.split(',')[1],
            mimeType: img.substring(img.indexOf(':') + 1, img.indexOf(';'))
          }
        }))
      ];
    } else {
      prompt = textPrompt;
    }

    const frames = await generateObject<StoryboardFrame[]>(prompt);

    // Generate images for each frame if requested
    if (generateFrameImages) {
      const framesWithImages = await Promise.all(
        frames.map(async (frame) => {
          try {
            // Create a highly detailed, professional image prompt
            // Combine frame description and visual cues with quality enhancers
            const enhancedPrompt = `
Create a professional, high-quality image for an animation keyframe:

SCENE: ${frame.description}

VISUAL DETAILS: ${frame.visualCues}

STYLE REQUIREMENTS:
- Ultra high quality, sharp focus, professional grade
- Modern digital art style with clean lines
- Cinematic composition following rule of thirds
- Vibrant but harmonious colors
- Proper lighting with depth and dimension
- Web-optimized, clean interface aesthetic
- No text overlays or watermarks
- 16:9 aspect ratio, landscape orientation

TECHNICAL: Render in a style suitable for modern web interfaces and animations. Think Dribbble/Behance quality - polished, professional, eye-catching.
            `.trim();

            const generatedImages = await generateImages({
              prompt: enhancedPrompt,
              referenceImages: images,
              aspectRatio: "16:9",
              count: 1
            });

            return {
              ...frame,
              imageUrl: generatedImages[0] || undefined
            };
          } catch (error) {
            console.error(`Error generating image for frame ${frame.id}:`, error);
            // Return frame without image if generation fails
            return frame;
          }
        })
      );

      return framesWithImages;
    }

    return frames;
  }
}
