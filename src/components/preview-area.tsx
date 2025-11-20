import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Smartphone, Tablet, Monitor, Code, Eye, Download, Share2, MessageSquarePlus, MousePointer2, Square, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TaskWorker } from './task-worker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Logo } from './logo';
import { motion, AnimatePresence } from 'framer-motion';

interface PreviewAreaProps {
    isGenerating: boolean;
    onAddComment?: (comment: string, x: number, y: number) => void;
}

interface VisualComment {
    id: string;
    x: number;
    y: number;
    text: string;
}

interface SelectionBox {
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    width: number;
    height: number;
    isDragging: boolean;
}

export function PreviewArea({ isGenerating, onAddComment }: PreviewAreaProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
    const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    // Playback State
    const [currentFrame, setCurrentFrame] = useState(1);
    const totalFrames = 60;
    const [currentTime, setCurrentTime] = useState("00:00");

    // Selection State
    const [selection, setSelection] = useState<SelectionBox | null>(null);
    const [comments, setComments] = useState<VisualComment[]>([]);
    const [commentPosition, setCommentPosition] = useState<{ x: number, y: number } | null>(null);
    const [commentText, setCommentText] = useState('');

    const containerRef = useRef<HTMLDivElement>(null);

    // Playback Simulation
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentFrame(prev => {
                    const next = prev + 1;
                    if (next > totalFrames) {
                        setIsPlaying(false);
                        return 1;
                    }
                    return next;
                });
                // Update mock time
                setCurrentTime(prev => {
                    const [min, sec] = prev.split(':').map(Number);
                    let newSec = sec + 1;
                    let newMin = min;
                    if (newSec >= 60) {
                        newMin++;
                        newSec = 0;
                    }
                    return `${newMin.toString().padStart(2, '0')}:${newSec.toString().padStart(2, '0')}`;
                });
            }, 100); // 10fps for demo
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (viewMode === 'code') return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setSelection({
            startX: x,
            startY: y,
            currentX: x,
            currentY: y,
            width: 0,
            height: 0,
            isDragging: true
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!selection?.isDragging) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setSelection(prev => {
            if (!prev) return null;
            const width = Math.abs(x - prev.startX);
            const height = Math.abs(y - prev.startY);
            const left = Math.min(x, prev.startX);
            const top = Math.min(y, prev.startY);

            return {
                ...prev,
                currentX: x,
                currentY: y,
                width,
                height,
                // Store normalized coordinates for rendering
                startX: prev.startX,
                startY: prev.startY
            };
        });
    };

    const handleMouseUp = () => {
        if (selection?.isDragging) {
            // Finalize selection or trigger comment if it's just a click
            if (selection.width < 5 && selection.height < 5) {
                // It was a click
                if (onAddComment) {
                    setCommentPosition({ x: selection.startX, y: selection.startY });
                }
                setSelection(null);
            } else {
                // It was a drag selection - keep it for a moment or show actions
                // For now, we'll just keep it to show the box
                setSelection(prev => prev ? { ...prev, isDragging: false } : null);
            }
        }
    };

    const submitComment = () => {
        if (commentPosition && onAddComment) {
            const newComment = { id: Date.now().toString(), x: commentPosition.x, y: commentPosition.y, text: commentText };
            setComments([...comments, newComment]);
            onAddComment(commentText, commentPosition.x, commentPosition.y);
            setCommentPosition(null);
            setCommentText('');
        }
    };

    const getSelectionStyle = () => {
        if (!selection) return {};
        const left = Math.min(selection.startX, selection.currentX);
        const top = Math.min(selection.startY, selection.currentY);
        return {
            left,
            top,
            width: selection.width,
            height: selection.height
        };
    };

    return (
        <div className="flex flex-col h-full bg-background/50 backdrop-blur-sm">
            {/* Toolbar */}
            <div className="h-14 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between px-4 shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Logo />
                    </Link>
                    <div className="h-6 w-px bg-border/50" />
                    <div className="flex items-center bg-muted/50 rounded-lg p-1 border border-border/50">
                        <Button variant="ghost" size="icon" onClick={() => setDevice('desktop')} className={cn("h-7 w-7 rounded-md transition-all", device === 'desktop' && "bg-background shadow-sm")}>
                            <Monitor className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDevice('tablet')} className={cn("h-7 w-7 rounded-md transition-all", device === 'tablet' && "bg-background shadow-sm")}>
                            <Tablet className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDevice('mobile')} className={cn("h-7 w-7 rounded-md transition-all", device === 'mobile' && "bg-background shadow-sm")}>
                            <Smartphone className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className={cn("gap-2 text-xs font-medium", selection ? "text-primary bg-primary/10" : "text-muted-foreground")}>
                        <Square className="w-3.5 h-3.5" />
                        {selection ? "Area Selected" : "Select Area"}
                    </Button>
                    <div className="h-6 w-px bg-border/50 mx-2" />
                    <Button variant="outline" size="sm" className="gap-2 h-8 text-xs">
                        <Share2 className="w-3.5 h-3.5" /> Share
                    </Button>
                    <Button size="sm" className="gap-2 h-8 text-xs shadow-sm">
                        <Download className="w-3.5 h-3.5" /> Export
                    </Button>
                </div>

                <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1 border border-border/50">
                    <Button variant="ghost" size="icon" onClick={() => setViewMode('preview')} className={cn("h-7 w-7 rounded-md transition-all", viewMode === 'preview' && "bg-background shadow-sm")}>
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setViewMode('code')} className={cn("h-7 w-7 rounded-md transition-all", viewMode === 'code' && "bg-background shadow-sm")}>
                        <Code className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8 bg-muted/10">
                {/* Grid Background */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                />

                <motion.div
                    layout
                    ref={containerRef}
                    className={cn(
                        "bg-background shadow-2xl transition-all duration-500 relative overflow-hidden group ring-1 ring-border/10",
                        device === 'mobile' ? "w-[375px] h-[667px] rounded-[40px] border-[8px] border-foreground/10" :
                            device === 'tablet' ? "w-[768px] h-[1024px] rounded-[30px] border-[8px] border-foreground/10" :
                                "w-full h-full rounded-xl border border-border/50"
                    )}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {/* Blank Canvas Content */}
                    <div className="w-full h-full bg-background">
                        {/* This is where the generated content would go. Currently blank as requested. */}
                        {isGenerating && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-10">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                    <p className="text-sm font-medium text-muted-foreground animate-pulse">Generating frame {currentFrame}...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Selection Box */}
                    {selection && (
                        <div
                            className="absolute border-2 border-primary bg-primary/10 pointer-events-none z-20 rounded-sm"
                            style={getSelectionStyle()}
                        />
                    )}

                    {/* Task Workers Overlay */}
                    {isGenerating && (
                        <>
                            <TaskWorker id="1" name="Builder" color="#10b981" x={20} y={30} status="Constructing DOM..." />
                            <TaskWorker id="2" name="Designer" color="#f59e0b" x={80} y={60} status="Computing styles..." />
                        </>
                    )}

                    {/* Comments Overlay */}
                    {comments.map(comment => (
                        <div
                            key={comment.id}
                            className="absolute w-8 h-8 bg-primary rounded-full border-2 border-background shadow-lg flex items-center justify-center text-xs font-bold transform -translate-x-1/2 -translate-y-1/2 z-40 group/pin text-primary-foreground cursor-pointer hover:scale-110 transition-transform"
                            style={{ left: comment.x, top: comment.y }}
                        >
                            <MessageSquarePlus className="w-4 h-4" />
                            <div className="absolute top-full mt-2 bg-popover p-3 rounded-xl shadow-xl text-xs w-48 hidden group-hover/pin:block z-50 text-popover-foreground border border-border animate-in fade-in zoom-in-95 duration-200">
                                {comment.text}
                            </div>
                        </div>
                    ))}

                    {/* Comment Popover */}
                    {commentPosition && (
                        <Popover open={true} onOpenChange={() => setCommentPosition(null)}>
                            <PopoverTrigger asChild>
                                <div
                                    className="absolute w-4 h-4 bg-primary rounded-full border-2 border-background shadow-lg z-50 cursor-pointer animate-bounce"
                                    style={{ left: commentPosition.x, top: commentPosition.y }}
                                />
                            </PopoverTrigger>
                            <PopoverContent className="w-72 p-3 rounded-2xl shadow-2xl border-border/50" side="right" align="start">
                                <div className="space-y-3">
                                    <h4 className="font-medium text-sm">Add Comment</h4>
                                    <Input
                                        autoFocus
                                        placeholder="What should we change here?"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                                        className="rounded-xl bg-muted/50 border-transparent focus:bg-background transition-colors"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <Button size="sm" variant="ghost" onClick={() => setCommentPosition(null)} className="rounded-lg h-8 text-xs">Cancel</Button>
                                        <Button size="sm" onClick={submitComment} className="rounded-lg h-8 text-xs">Post Comment</Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </motion.div>
            </div>

            {/* Playback Controls */}
            <div className="h-16 border-t border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20">
                <div className="flex items-center gap-4 w-1/3">
                    <span className="font-mono text-sm text-muted-foreground tabular-nums">{currentTime}</span>
                </div>

                <div className="flex items-center gap-4 justify-center w-1/3">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted/50"><SkipBack className="w-5 h-5" /></Button>
                    <Button
                        size="icon"
                        className="w-12 h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:scale-105 transition-all"
                        onClick={() => setIsPlaying(!isPlaying)}
                    >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted/50"><SkipForward className="w-5 h-5" /></Button>
                </div>

                <div className="flex items-center gap-3 justify-end w-1/3">
                    <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1 px-2 border border-border/50">
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Frame</span>
                        <div className="flex items-center gap-1">
                            <input
                                type="number"
                                value={currentFrame}
                                onChange={(e) => setCurrentFrame(Math.min(totalFrames, Math.max(1, parseInt(e.target.value) || 1)))}
                                className="w-8 bg-transparent text-right font-mono text-sm focus:outline-none"
                            />
                            <span className="text-muted-foreground font-mono text-sm">/ {totalFrames}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
