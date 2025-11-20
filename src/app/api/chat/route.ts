import { NextRequest, NextResponse } from 'next/server';
import { PlannerAgent } from '@/ai/agents/planner';
import { StoryboarderAgent } from '@/ai/agents/storyboarder';
import { CoderAgent, FrameContext } from '@/ai/agents/coder';

const planner = new PlannerAgent();
const storyboarder = new StoryboarderAgent();
const coder = new CoderAgent();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, step, context, images, previousFrames } = body;

        // Simple orchestration logic based on the current workflow step
        let responseData: any = {};

        if (step === 'PLANNING') {
            const plan = await planner.generatePlan(message, images);
            responseData = { type: 'plan', data: plan };
        } else if (step === 'STORYBOARD') {
            // In a real app, we'd pass the approved plan
            const storyboard = await storyboarder.generateStoryboard(message, images);
            responseData = { type: 'storyboard', data: storyboard };
        } else if (step === 'STORYBOARD_EDIT') {
            // Handle edits to the storyboard (re-generating frames, etc.)
            // For now, we'll just re-run the storyboarder with the new feedback
            const storyboard = await storyboarder.generateStoryboard(message, images);
            responseData = { type: 'storyboard', data: storyboard };
        } else if (step === 'GENERATING' || step === 'EDITING') {
            const code = await coder.generateCode(message, previousFrames as FrameContext[]);
            responseData = { type: 'code', data: code };
        } else {
            // Default chat - just echo for now or use a general chat agent if available
            // In a real app, this would be a conversational agent
            responseData = { type: 'message', data: "I'm listening! We can start planning whenever you're ready." };
        }

        return NextResponse.json(responseData);
    } catch (error: any) {
        console.error("API Error Details:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
