import React, { useState, useEffect } from 'react';
import { MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskWorkerProps {
    id: string;
    name: string;
    color: string;
    x: number;
    y: number;
    status?: string;
}

export function TaskWorker({ name, color, x, y, status }: TaskWorkerProps) {
    const [isClicking, setIsClicking] = useState(false);

    // Simulate random clicking
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                setIsClicking(true);
                setTimeout(() => setIsClicking(false), 200);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="absolute pointer-events-none transition-all duration-[1500ms] ease-in-out z-50 will-change-transform"
            style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(-50%, -50%) scale(${isClicking ? 0.9 : 1})`
            }}
        >
            <div className={cn("relative transition-transform duration-100", isClicking && "scale-90")}>
                <MousePointer2
                    className={cn("w-5 h-5 fill-current drop-shadow-md")}
                    style={{ color: color }}
                />
                {isClicking && (
                    <span
                        className="absolute -top-2 -left-2 w-8 h-8 rounded-full opacity-50 animate-ping"
                        style={{ backgroundColor: color }}
                    />
                )}
            </div>
            <div
                className="ml-4 px-2 py-1 rounded-md text-xs font-medium text-white shadow-md whitespace-nowrap transition-opacity duration-300"
                style={{ backgroundColor: color }}
            >
                {name}
                {status && <span className="opacity-80 ml-1">- {status}</span>}
            </div>
        </div>
    );
}
