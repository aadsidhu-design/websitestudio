import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Upload, Download, Undo2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EditorHeader({ onUndo, canUndo }: { onUndo: () => void; canUndo: boolean; }) {
  const { toast } = useToast();

  const handleNotImplemented = () => {
    toast({
      title: 'Feature Not Implemented',
      description: 'This functionality will be available in a future version.',
    });
  };

  return (
    <header className="flex-shrink-0 border-b border-border/30 h-16 bg-card/30">
      <div className="container-fluid mx-auto px-4 h-full flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onUndo} disabled={!canUndo}>
            <Undo2 className="h-4 w-4 mr-2" />
            Undo
          </Button>
          <Separator orientation="vertical" className="h-6 mx-2" />
          <Button variant="ghost" size="icon" onClick={handleNotImplemented} aria-label="Import">
            <Upload className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleNotImplemented} aria-label="Export">
            <Download className="h-5 w-5" />
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleNotImplemented}>
            Export Project
          </Button>
        </div>
      </div>
    </header>
  );
}
