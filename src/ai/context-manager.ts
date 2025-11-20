import { generateContent } from "@/lib/gemini";

export interface Message {
    role: 'user' | 'model';
    content: string;
    timestamp: number;
}

export class ContextManager {
    private messages: Message[] = [];
    private maxTokens: number = 4000; // Conservative limit for context window

    constructor(initialMessages: Message[] = []) {
        this.messages = initialMessages;
    }

    addMessage(role: 'user' | 'model', content: string) {
        this.messages.push({
            role,
            content,
            timestamp: Date.now(),
        });
        this.pruneContext();
    }

    getHistory(): Message[] {
        return this.messages;
    }

    // Simple pruning strategy: keep system prompt + last N messages
    // In a real production app, we'd use a tokenizer to count exactly
    private async pruneContext() {
        const estimatedCharCount = this.messages.reduce((acc, msg) => acc + msg.content.length, 0);

        // Rough estimate: 4 chars ~= 1 token
        if (estimatedCharCount > this.maxTokens * 4) {
            console.log("Context too large, pruning...");

            // Keep the first message (usually system prompt or initial context)
            // and the last 10 messages
            if (this.messages.length > 10) {
                const first = this.messages[0];
                const last10 = this.messages.slice(-10);

                // Optional: Summarize the middle
                // const middle = this.messages.slice(1, -10);
                // const summary = await this.summarize(middle);

                this.messages = [first, ...last10];
            }
        }
    }

    // Helper to format history for Gemini API
    getFormattedHistory() {
        return this.messages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }],
        }));
    }
}
