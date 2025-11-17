import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loader className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium text-foreground">Processing with AI...</p>
      </div>
    </div>
  );
}
