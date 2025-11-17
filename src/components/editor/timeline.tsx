import Image from 'next/image';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { AnimationFrame } from '@/app/types';

export default function Timeline({
  frames,
  activeIndex,
  onSelectFrame,
}: {
  frames: AnimationFrame[];
  activeIndex: number;
  onSelectFrame: (index: number) => void;
}) {
  return (
    <div className="flex-shrink-0 bg-muted/20 border-b border-border">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-2 p-2">
          {frames.map((frame, index) => (
            <div key={frame.id} className="flex-shrink-0">
              <Button
                variant="ghost"
                className={cn(
                  'h-auto p-1 border-2 bg-card',
                  activeIndex === index
                    ? 'border-primary shadow-lg'
                    : 'border-transparent hover:border-primary/50'
                )}
                onClick={() => onSelectFrame(index)}
              >
                <div className="relative w-32 h-20 rounded-sm overflow-hidden">
                  <Image
                    src={frame.url}
                    alt={`Frame ${index + 1}`}
                    fill
                    sizes="128px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </Button>
              <p className="text-xs text-center mt-1 text-muted-foreground">Frame {index + 1}</p>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
