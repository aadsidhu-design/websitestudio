import { Clapperboard } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="AnimAI Studio Logo">
      <Clapperboard className="h-7 w-7 text-primary" />
      <h1 className="text-xl font-bold tracking-tighter sm:text-2xl">AnimAI Studio</h1>
    </div>
  );
}
