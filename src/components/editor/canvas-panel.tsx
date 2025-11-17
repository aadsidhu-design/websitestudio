import Image from 'next/image';
import { Card } from '@/components/ui/card';
import type { AnimationFrame } from '@/app/types';

export default function CanvasPanel({ activeFrame }: { activeFrame: AnimationFrame }) {
  if (!activeFrame) {
    return (
      <Card className="w-full max-w-4xl aspect-video flex items-center justify-center bg-muted/30">
        <p className="text-muted-foreground">Select a frame to view</p>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-5xl aspect-video rounded-lg overflow-hidden shadow-2xl shadow-primary/10">
      <div className="relative w-full h-full">
        <Image
          key={activeFrame.id}
          src={activeFrame.url}
          alt="Active animation frame"
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-contain"
          unoptimized
        />
      </div>
    </Card>
  );
}
