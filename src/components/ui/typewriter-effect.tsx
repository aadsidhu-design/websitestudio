import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';



export function TypewriterEffect({ words, className, speed = 100, deleteSpeed = 50, pause = 1500 }: { words: string[], className?: string, speed?: number, deleteSpeed?: number, pause?: number }) {
    const [displayedText, setDisplayedText] = useState('');
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentWord = words[currentWordIndex];

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                // Typing
                if (displayedText.length < currentWord.length) {
                    setDisplayedText(currentWord.slice(0, displayedText.length + 1));
                } else {
                    // Finished typing, wait before deleting
                    setTimeout(() => setIsDeleting(true), pause);
                }
            } else {
                // Deleting
                if (displayedText.length > 0) {
                    setDisplayedText(currentWord.slice(0, displayedText.length - 1));
                } else {
                    // Finished deleting, move to next word
                    setIsDeleting(false);
                    setCurrentWordIndex((prev) => (prev + 1) % words.length);
                }
            }
        }, isDeleting ? deleteSpeed : speed + (Math.random() * 20 - 10));

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, currentWordIndex, words, speed, deleteSpeed, pause]);

    return (
        <span className={cn("inline-block", className)}>
            {displayedText}
            <span className="inline-block w-[2px] h-[1em] bg-current ml-[1px] animate-pulse align-middle" />
        </span>
    );
}
