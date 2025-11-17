'use client';
import { Loader } from "lucide-react";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <AnimatedGradientBackground
        gradientColors={["#1a1a1a", "#4285F4", "#F4B400", "#1a1a1a"]}
        gradientStops={[40, 50, 60, 100]}
        startingGap={100}
        Breathing={true}
        animationSpeed={0.01}
        breathingRange={2}
      />
      <div className="z-10 flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <Loader className="h-16 w-16 animate-spin text-primary-foreground/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 flex items-center justify-center bg-primary/90 rounded-full shadow-lg">
                <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path
                    d="M8 22.0002C10.3333 22.0002 14 22.0002 14 18.0002C14 14.0002 8 16.0002 8 10.0002C8 4.00024 18 2.00024 18 2.00024"
                    stroke="hsl(var(--primary-foreground))"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M8 14C8 14 6 14.5 6 16C6 17.5 8 18 8 18"
                    stroke="hsl(var(--primary-foreground))"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                </svg>
            </div>
          </div>
        </div>
        <p className="text-xl font-medium text-primary-foreground/90 animate-pulse">
          Robin is thinking...
        </p>
      </div>
    </div>
  );
}
