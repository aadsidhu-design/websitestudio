'use client';

import React, { useState, useEffect } from 'react';
import { ChatInterface, Message } from './chat-interface';
import { PreviewArea } from './preview-area';
import { StoryboardView } from './storyboard-view';
import { PlanningView } from './planning-view';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import Landing from './landing';
import { GenerateAnimationPlanOutput } from '@/ai/flows/generate-animation-plan';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './sidebar';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { PanelsTopLeft, Radar } from 'lucide-react'
import Link from 'next/link'

export default function LovableBuilder() {
    const { user, loading } = useAuth();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<'PLAN' | 'STORYBOARD' | 'PREVIEW'>('PLAN');
    const [isGenerating, setIsGenerating] = useState(false);
    const [storyboardFrames, setStoryboardFrames] = useState<any[]>([]);
    const [planSteps, setPlanSteps] = useState<any[]>([]);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hi! I'm Robin. What would you like to build today?",
            timestamp: new Date(),
            isTyping: false,
        }
    ]);

    // Check for pending prompt after login
    useEffect(() => {
        if (user && !loading) {
            const pendingPrompt = sessionStorage.getItem('pendingPrompt');
            const pendingImage = sessionStorage.getItem('pendingImage');

            if (pendingPrompt) {
                sessionStorage.removeItem('pendingPrompt');
                sessionStorage.removeItem('pendingImage');

                // Auto-submit the pending prompt
                const images = pendingImage ? [pendingImage] : undefined;
                handlePlanGenerated(pendingPrompt, images);
            }
        }
    }, [user, loading]);

    const addMessage = (role: 'user' | 'assistant', content: string, isTyping = false) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role,
            content,
            timestamp: new Date(),
            isTyping
        }]);
    };

    const handlePlanGenerated = async (userMessage: string, images?: string[]) => {
        setIsGenerating(true);
        addMessage('user', userMessage);
        setActiveTab('PLAN');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, step: 'PLANNING', images })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            if (data.type === 'plan') {
                setPlanSteps(data.data);
                addMessage('assistant', "I've created a plan for your animation. Please review it.", true);
            } else {
                addMessage('assistant', data.data || "I'm not sure how to help with that yet.", true);
            }
        } catch (error) {
            console.error("Error generating plan:", error);
            addMessage('assistant', "Sorry, I encountered an error generating the plan. Please try again.", true);
            toast({
                title: "Error",
                description: "Failed to generate plan",
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePlanApproved = async () => {
        setIsGenerating(true);
        setActiveTab('STORYBOARD');
        addMessage('user', "The plan looks good. Let's proceed to the storyboard.");

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: JSON.stringify(planSteps), step: 'STORYBOARD' })
            });

            if (!response.ok) throw new Error("Failed to generate storyboard");

            const data = await response.json();
            if (data.type === 'storyboard') {
                setStoryboardFrames(data.data);
                addMessage('assistant', "Here is the storyboard based on the plan. Does it look good?", true);
            } else {
                addMessage('assistant', "I couldn't generate the storyboard. Let's try again.", true);
            }
        } catch (error) {
            console.error("Error generating storyboard:", error);
            addMessage('assistant', "Sorry, something went wrong generating the storyboard.", true);
            toast({
                title: "Error",
                description: "Failed to generate storyboard",
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleStoryboardApproved = () => {
        setActiveTab('PREVIEW');
        setIsGenerating(true);
        addMessage('user', "Storyboard approved. Start building!");
        addMessage('assistant', "Great! I'm starting the generation process now.", true);

        // In a real app, we would trigger the coder agent here for each frame
        // For now, we'll simulate the "working" state but use real data if we had it
        setTimeout(() => {
            setIsGenerating(false);
            addMessage('assistant', "Animation generated! You can now edit it or export.", true);
            toast({
                title: "Success",
                description: "Animation generated successfully!",
            });
        }, 3000);
    };

    const handleRegenerateFrame = async (frameId: string, feedback?: string) => {
        setStoryboardFrames(prev =>
            prev.map(f => f.id === frameId ? { ...f, isGenerating: true, error: undefined } : f)
        );

        addMessage('user', `Regenerating frame ${frameId}${feedback ? ` with feedback: ${feedback}` : ''}`);

        try {
            // Simulate regeneration - in production, call actual API
            await new Promise(resolve => setTimeout(resolve, 2000));

            setStoryboardFrames(prev =>
                prev.map(f => f.id === frameId ? { ...f, isGenerating: false } : f)
            );

            addMessage('assistant', `Frame ${frameId} has been regenerated!`, true);
        } catch (error) {
            setStoryboardFrames(prev =>
                prev.map(f => f.id === frameId ? { ...f, isGenerating: false, error: 'Failed to regenerate' } : f)
            );
            toast({
                title: "Error",
                description: "Failed to regenerate frame",
                variant: "destructive"
            });
        }
    };

    const handleSendMessage = async (message: string) => {
        // If we are in the initial state or explicitly planning
        if (activeTab === 'PLAN' || messages.length <= 1) {
            await handlePlanGenerated(message);
            return;
        }

        addMessage('user', message);
        setIsGenerating(true);

        try {
            // Determine context based on active tab
            let step = 'CHAT';
            if (activeTab === 'STORYBOARD') step = 'STORYBOARD_EDIT';
            if (activeTab === 'PREVIEW') step = 'EDITING';

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, step })
            });

            if (!response.ok) throw new Error("Failed to get response");

            const data = await response.json();

            // Handle different response types
            if (data.type === 'plan') {
                setPlanSteps(data.data);
                setActiveTab('PLAN');
                addMessage('assistant', "I've updated the plan based on your feedback.", true);
            } else if (data.type === 'storyboard') {
                setStoryboardFrames(data.data);
                setActiveTab('STORYBOARD');
                addMessage('assistant', "I've updated the storyboard.", true);
            } else if (data.type === 'code') {
                // Handle code update
                addMessage('assistant', "I've updated the code.", true);
            } else {
                addMessage('assistant', data.data || "I heard you, but I'm not sure what to do next.", true);
            }

        } catch (error) {
            console.error("Error sending message:", error);
            addMessage('assistant', "Sorry, I'm having trouble connecting right now.", true);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAddComment = (comment: string, x: number, y: number) => {
        console.log("Added comment:", comment, x, y);
        addMessage('user', `Added comment at (${Math.round(x)}, ${Math.round(y)}): ${comment}`);
        handleSendMessage(`Fix the issue at (${Math.round(x)}, ${Math.round(y)}): ${comment}`);
    };

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 border-b border-border/40 flex items-center px-4 justify-between bg-background/80 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-3 hover:opacity-85 transition-opacity">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/80 via-primary to-primary/70 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30">
                                <PanelsTopLeft className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Robin Studio</p>
                                <p className="text-sm font-semibold leading-tight">Storyboard-first builder</p>
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
                            {['PLAN', 'STORYBOARD', 'PREVIEW'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                                        activeTab === tab
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex-1 flex overflow-hidden relative">
                    <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border-none">
                        <ResizablePanel defaultSize={35} minSize={25} maxSize={50} className="bg-background border-r border-border/40">
                            <div className="h-full flex flex-col">
                                {activeTab === 'PLAN' && (
                                    planSteps.length > 0 ? (
                                        <div className="h-full overflow-y-auto p-4">
                                            <PlanningView
                                                steps={planSteps}
                                                onApprove={handlePlanApproved}
                                            />
                                        </div>
                                    ) : (
                                        <ChatInterface
                                            messages={messages}
                                            onSendMessage={handleSendMessage}
                                            isGenerating={isGenerating}
                                        />
                                    )
                                )}
                                {activeTab === 'STORYBOARD' && (
                                    <div className="h-full overflow-y-auto p-4">
                                        <StoryboardView
                                            frames={storyboardFrames}
                                            onRegenerateFrame={handleRegenerateFrame}
                                            onApprove={handleStoryboardApproved}
                                        />
                                    </div>
                                )}
                                {activeTab === 'PREVIEW' && (
                                    <div className="h-full flex flex-col">
                                        <div className="flex-1 overflow-hidden">
                                            {/* Chat context for preview edits */}
                                            <ChatInterface
                                                messages={messages}
                                                onSendMessage={handleSendMessage}
                                                isGenerating={isGenerating}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ResizablePanel>
                        <ResizableHandle withHandle className="bg-border/40 hover:bg-primary/50 transition-colors w-1" />
                        <ResizablePanel defaultSize={65}>
                            <div className="h-full bg-muted/10 relative">
                                {activeTab === 'PREVIEW' ? (
                                    <PreviewArea
                                        isGenerating={isGenerating}
                                        onAddComment={handleAddComment}
                                    />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-muted-foreground">
                                        <div className="text-center space-y-4 max-w-md p-8">
                                            <div className="w-20 h-20 bg-muted rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-sm">
                                                <span className="text-4xl">🤖</span>
                                            </div>
                                            <h3 className="text-2xl font-semibold text-foreground">Chat with Robin to start animating or creating</h3>
                                            <p className="text-base">Describe your animation idea in the chat, and Robin will help you plan, storyboard, and build it.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
            </div>
        </div>
    );
}
