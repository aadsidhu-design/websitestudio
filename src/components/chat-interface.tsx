import React, { useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { motion, AnimatePresence } from "framer-motion";
import { PulseLoader } from "react-spinners";
import { PromptBox } from './ui/prompt-box';
import { Clock, Sparkles, User, Bot, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import ReactMarkdown from 'react-markdown';

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
    const [copiedId, setCopiedId] = React.useState<string | null>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isGenerating]);

    const copyToClipboard = (content: string, id: string) => {
        navigator.clipboard.writeText(content);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="flex flex-col h-full bg-[#111111] text-gray-200 font-sans">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-6 max-w-3xl mx-auto pb-4">
                    {messages.length <= 1 && !isGenerating && (
                        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8 text-center">
                            <h2 className="text-2xl font-medium text-white">What can I build for you?</h2>
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
                                        className="text-sm text-left p-4 rounded-xl bg-[#1a1a1a] hover:bg-[#222] transition-colors text-gray-400 hover:text-white"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <AnimatePresence initial={false}>
                        {messages.filter(m => m.role !== 'system').map((message, index) => (
                            <motion.div
                                key={message.id} // Changed key to message.id for stability
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className={cn(
                                    "flex w-full",
                                    message.role === 'user' ? "justify-end" : "justify-start"
                                )}
                            >
                                <div
                                    className={cn(
                                        "max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed relative group",
                                        message.role === 'user'
                                            ? "bg-transparent text-white"
                                            : "bg-[#1a1a1a] text-gray-300"
                                    )}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="absolute -right-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => copyToClipboard(message.content, message.id)}
                                                className="p-1.5 rounded-lg hover:bg-[#222] text-gray-500 hover:text-white transition-colors"
                                            >
                                                {copiedId === message.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    )}

                                    {message.role === 'assistant' ? (
                                        <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-[#111] prose-pre:border prose-pre:border-white/5">
                                            <ReactMarkdown>{message.content}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        <div className="whitespace-pre-wrap">{message.content}</div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isGenerating && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start w-full"
                        >
                            <div className="bg-[#1a1a1a] rounded-2xl p-4 flex items-center gap-3">
                                <div className="flex space-x-1">
                                    <motion.div
                                        className="w-2 h-2 bg-gray-500 rounded-full"
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                                    />
                                    <motion.div
                                        className="w-2 h-2 bg-gray-500 rounded-full"
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                    />
                                    <motion.div
                                        className="w-2 h-2 bg-gray-500 rounded-full"
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                    />
                                </div>
                                <span className="text-sm text-gray-500 font-medium">Thinking...</span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </ScrollArea>

            <div className="p-4 bg-[#111111]">
                <div className="max-w-3xl mx-auto relative">
                    <PromptBox
                        onSubmit={(value) => onSendMessage(typeof value === 'string' ? value : '')}
                        isLoading={isGenerating}
                        placeholder="Ask Robin to create something..."
                        className="bg-[#1a1a1a] border-white/5 focus-within:border-white/10 shadow-lg"
                    />
                </div>
            </div>
        </div>
    );
}
