import React, { useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { motion, AnimatePresence } from "framer-motion";
import { PulseLoader } from "react-spinners";
import { AiInput } from './ai-input';
import { Clock, Sparkles } from 'lucide-react';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isTyping?: boolean;
    order?: number;
}

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (message: string) => void;
    isGenerating: boolean;
}

export function ChatInterface({ messages, onSendMessage, isGenerating }: ChatInterfaceProps) {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isGenerating]);

    return (
        <div className="flex flex-col h-full bg-background text-foreground font-sans">
            <ScrollArea className="flex-1 px-4 py-4" ref={scrollAreaRef}>
                <div className="space-y-8 max-w-3xl mx-auto">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-6 opacity-0 animate-in fade-in duration-500">
                            <h2 className="text-2xl font-semibold tracking-tight text-foreground/80">Chat with Robin to start creating</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                                {[
                                    "Create a bouncing ball animation",
                                    "Design a character walk cycle",
                                    "Explain the principles of squash and stretch",
                                    "Generate a storyboard for a chase scene"
                                ].map((prompt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => onSendMessage(prompt)}
                                        className="text-sm text-left p-3 rounded-lg border border-border/40 hover:bg-accent/50 hover:border-accent transition-all duration-200 text-muted-foreground hover:text-foreground bg-card/50"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <AnimatePresence initial={false}>
                        {messages.map((message, index) => {
                            const isAssistant = message.role === 'assistant';
                            return (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="group w-full"
                                >
                                    <div className="flex flex-col gap-1">
                                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                            {isAssistant ? 'Robin' : 'You'}
                                        </div>

                                        <div className={cn(
                                            "text-base leading-relaxed text-foreground/90",
                                            isAssistant ? "" : ""
                                        )}>
                                            {isAssistant && message.isTyping ? (
                                                <TypewriterEffect
                                                    words={[message.content]}
                                                    className="text-base leading-relaxed"
                                                />
                                            ) : (
                                                <div className="whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
                                                    {message.content}
                                                </div>
                                            )}

                                            <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                                {message.order && (
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{`Step ${message.order}`}</span>
                                                    </div>
                                                )}
                                                {isAssistant && (
                                                    <div className="flex items-center gap-1">
                                                        <Sparkles className="w-3 h-3" />
                                                        <span>Storyboard aware</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {isGenerating && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col gap-1 w-full"
                        >
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                Robin
                            </div>
                            <div className="py-2">
                                <PulseLoader color="#94a3b8" size={6} speedMultiplier={0.6} />
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-border/40 bg-background/80 backdrop-blur-sm">
                <div className="max-w-3xl mx-auto">
                    <AiInput onSubmit={(formData) => onSendMessage(formData.get('prompt') as string)} disabled={isGenerating} />
                </div>
            </div>
        </div>
    );
}
