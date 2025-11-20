import { GoogleGenerativeAI, Part } from "@google/generative-ai";

// Initialize the API client for chat/text generation
// Using dedicated chat API key for better resource management
const API_KEY = "AIzaSyA0V1sOQgBhpzKWiCOPu_G9q1cjemDWSRQ";

const genAI = new GoogleGenerativeAI(API_KEY);

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export type GeminiInput = string | Array<string | Part>;

export async function generateContent(prompt: GeminiInput) {
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating content:", error);
        throw error;
    }
}

export async function generateObject<T>(prompt: GeminiInput): Promise<T> {
    try {
        // If prompt is an array, we need to append the JSON instruction to the text part
        let finalPrompt: GeminiInput = prompt;
        const jsonInstruction = "\n\nRespond strictly with valid JSON.";

        if (typeof prompt === 'string') {
            finalPrompt = prompt + jsonInstruction;
        } else if (Array.isArray(prompt)) {
            // Find the last string part and append instruction, or add a new string part
            const lastStringIndex = prompt.map((p, i) => typeof p === 'string' ? i : -1).reduce((a, b) => Math.max(a, b), -1);

            if (lastStringIndex !== -1) {
                const newPrompt = [...prompt];
                newPrompt[lastStringIndex] = (newPrompt[lastStringIndex] as string) + jsonInstruction;
                finalPrompt = newPrompt;
            } else {
                finalPrompt = [...prompt, jsonInstruction];
            }
        }

        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        let jsonString = text.replace(/```json\n?|```/g, "").trim();

        // Sometimes the model adds extra text before or after the JSON
        const firstBracket = jsonString.indexOf('[');
        const lastBracket = jsonString.lastIndexOf(']');
        const firstBrace = jsonString.indexOf('{');
        const lastBrace = jsonString.lastIndexOf('}');

        // Determine if we are looking for an array or object
        // Simple heuristic: whichever comes first
        if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
            if (lastBracket !== -1) {
                jsonString = jsonString.substring(firstBracket, lastBracket + 1);
            }
        } else if (firstBrace !== -1) {
            if (lastBrace !== -1) {
                jsonString = jsonString.substring(firstBrace, lastBrace + 1);
            }
        }

        return JSON.parse(jsonString) as T;
    } catch (error) {
        console.error("Error generating object:", error);
        throw error;
    }
}
