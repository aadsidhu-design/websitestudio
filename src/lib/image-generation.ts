import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API client for image generation
// Using dedicated image generation API key for better resource management
const API_KEY = "AIzaSyA1biX5s_EqbM_IpKDZruTo0wcxtKThmNo";

const genAI = new GoogleGenerativeAI(API_KEY);

// Use the Gemini 2.5 Flash Image model (Nano Banana)
export const imageModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

export interface ImageGenerationOptions {
    prompt: string;
    referenceImages?: string[]; // Base64 encoded images
    aspectRatio?: "1:1" | "3:2" | "2:3" | "3:4" | "4:3" | "16:9" | "9:16";
    count?: number; // Number of images to generate (max 10)
}

/**
 * Generate images using Gemini 2.5 Flash Image
 * @param options Image generation options
 * @returns Array of generated image URLs (base64)
 */
export async function generateImages(options: ImageGenerationOptions): Promise<string[]> {
    try {
        const { prompt, referenceImages = [], aspectRatio, count = 1 } = options;

        // Build the prompt parts
        const parts: any[] = [];

        // Add the text prompt
        let fullPrompt = prompt;
        if (aspectRatio) {
            fullPrompt += `\n\nGenerate image with aspect ratio: ${aspectRatio}`;
        }
        if (count > 1) {
            fullPrompt += `\n\nGenerate ${count} variations.`;
        }
        parts.push(fullPrompt);

        // Add reference images if provided
        if (referenceImages.length > 0) {
            for (const img of referenceImages.slice(0, 3)) { // Max 3 images
                parts.push({
                    inlineData: {
                        data: img.split(',')[1], // Remove data:image/...;base64, prefix
                        mimeType: img.substring(img.indexOf(':') + 1, img.indexOf(';'))
                    }
                });
            }
        }

        // Generate the images
        const result = await imageModel.generateContent(parts);
        const response = await result.response;

        // Extract images from response
        // Note: The actual API response format may vary - this is a placeholder
        // We'll need to parse the response to extract generated images
        const generatedImages: string[] = [];

        // For now, return placeholder - in production, parse response.candidates
        // Each candidate may contain image data in parts
        const candidates = (response as any).candidates || [];
        for (const candidate of candidates) {
            if (candidate.content?.parts) {
                for (const part of candidate.content.parts) {
                    if (part.inlineData) {
                        const imageData = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                        generatedImages.push(imageData);
                    }
                }
            }
        }

        return generatedImages.length > 0 ? generatedImages : [];
    } catch (error) {
        console.error("Error generating images:", error);
        throw error;
    }
}

/**
 * Edit an existing image using natural language prompts
 */
export async function editImage(
    imageData: string,
    editPrompt: string
): Promise<string> {
    try {
        const parts = [
            editPrompt,
            {
                inlineData: {
                    data: imageData.split(',')[1],
                    mimeType: imageData.substring(imageData.indexOf(':') + 1, imageData.indexOf(';'))
                }
            }
        ];

        const result = await imageModel.generateContent(parts);
        const response = await result.response;

        // Extract edited image
        const candidates = (response as any).candidates || [];
        if (candidates[0]?.content?.parts) {
            for (const part of candidates[0].content.parts) {
                if (part.inlineData) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
        }

        throw new Error("No image returned from edit operation");
    } catch (error) {
        console.error("Error editing image:", error);
        throw error;
    }
}
