'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { StoryboardOption } from '@/app/types';
import { CheckCircle } from 'lucide-react';
import { Logo } from './logo';

export default function StoryboardSelection({
  storyboardOptions,
  onSelect,
}: {
  storyboardOptions: StoryboardOption[];
  onSelect: (option: StoryboardOption) => void;
}) {
  return (
    <div className="container mx-auto py-12 px-4 bg-gradient-to-br from-[#111] to-[#222] min-h-screen">
      <div className="flex flex-col items-center text-center mb-12">
        <Logo />
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Choose Your Story's Path</h2>
        <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
          The AI has generated a few creative directions. Select the storyboard that best matches your vision.
        </p>
      </div>

      <div className="grid gap-12 lg:gap-16">
        {storyboardOptions.map((option, index) => (
          <Card key={index} className="overflow-hidden bg-card/50 border-border/30 shadow-2xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Storyboard Option {index + 1}</CardTitle>
              <CardDescription>A unique visual interpretation of your prompt.</CardDescription>
            </CardHeader>
            <CardContent>
              <Carousel
                opts={{
                  align: 'start',
                }}
                className="w-full"
              >
                <CarouselContent>
                  {option.frames.map((frame, frameIndex) => (
                    <CarouselItem key={frameIndex} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <div className="p-1 h-full">
                        <Card className="flex flex-col h-full overflow-hidden bg-card/70 border-border/40">
                          <CardContent className="p-0 relative aspect-video w-full">
                            <Image
                              src={frame.imageUrl}
                              alt={frame.description}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                              unoptimized
                            />
                             <Badge
                              variant="secondary"
                              className="absolute top-2 left-2 bg-black/50 text-white backdrop-blur-sm"
                            >
                              Frame {frameIndex + 1}
                            </Badge>
                          </CardContent>
                           <div className="p-4 flex-grow flex items-center">
                             <p className="text-sm text-muted-foreground">{frame.description}</p>
                           </div>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="ml-12" />
                <CarouselNext className="mr-12" />
              </Carousel>
            </CardContent>
            <CardFooter className="bg-transparent px-6 py-4">
              <Button onClick={() => onSelect(option)} size="lg" className="w-full sm:w-auto ml-auto">
                <CheckCircle className="mr-2 h-5 w-5" />
                Animate This Storyboard
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
