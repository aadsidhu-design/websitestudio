'use client';

import { useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleAdjustFrame, handleCollaborate } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Users, Wand2 } from 'lucide-react';
import type { AnimationFrame } from '@/app/types';
import { useToast } from "@/hooks/use-toast";

const initialAdjustState: { adjustedFrame: AnimationFrame | null; error: string | null } = {
  adjustedFrame: null,
  error: null,
};
const initialCollaborateState: { editedFrame: AnimationFrame | null; error: string | null } = {
  editedFrame: null,
  error: null,
};


function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      <Sparkles className="mr-2 h-4 w-4" />
      {pending ? 'Thinking...' : children}
    </Button>
  );
}

export default function ControlsPanel({
  activeFrame,
  onFrameAdjusted,
  updateHistory,
}: {
  activeFrame: AnimationFrame;
  onFrameAdjusted: (frame: AnimationFrame) => void;
  updateHistory: () => void;
}) {
  const [adjustState, adjustAction] = useActionState(handleAdjustFrame, initialAdjustState);
  const [collaborateState, collaborateAction] = useActionState(handleCollaborate, initialCollaborateState);

  const { toast } = useToast();

  useEffect(() => {
    if (adjustState.adjustedFrame) {
      onFrameAdjusted(adjustState.adjustedFrame);
      toast({ title: 'Frame Adjusted', description: 'The AI has updated the frame.' });
    }
    if (adjustState.error) {
      toast({ variant: 'destructive', title: 'Adjustment Failed', description: adjustState.error });
    }
  }, [adjustState, onFrameAdjusted, toast]);

  useEffect(() => {
    if (collaborateState.editedFrame) {
      onFrameAdjusted(collaborateState.editedFrame);
      toast({ title: 'Frame Edited', description: 'The AI has applied the collaborative edits.' });
    }
    if (collaborateState.error) {
      toast({ variant: 'destructive', title: 'Edit Failed', description: collaborateState.error });
    }
  }, [collaborateState, onFrameAdjusted, toast]);

  const onFormSubmit = (action: (formData: FormData) => void) => (formData: FormData) => {
    updateHistory();
    action(formData);
  };

  return (
    <div className="p-4 h-full">
      <Tabs defaultValue="adjust" className="flex flex-col h-full">
        <TabsList className="grid w-full grid-cols-2 bg-card/50 border border-border/30">
          <TabsTrigger value="adjust"><Wand2 className="h-4 w-4 mr-2" />Adjust</TabsTrigger>
          <TabsTrigger value="collaborate"><Users className="h-4 w-4 mr-2" />Collaborate</TabsTrigger>
        </TabsList>
        <TabsContent value="adjust" className="flex-grow">
          <Card className="h-full border-0 shadow-none bg-transparent">
            <CardHeader>
              <CardTitle>AI Frame Adjustment</CardTitle>
              <CardDescription>Describe the changes you want to make to the selected frame.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={onFormSubmit(adjustAction)} className="space-y-4">
                <input type="hidden" name="frameDataUri" value={activeFrame.url} />
                <input type="hidden" name="frameId" value={activeFrame.id} />
                <div className="space-y-2">
                  <Label htmlFor="adjustmentInstructions">Adjustment Instructions</Label>
                  <Textarea
                    id="adjustmentInstructions"
                    name="adjustmentInstructions"
                    placeholder="e.g., 'Make the robot's eyes glow brighter' or 'Change the sky to a deep purple'"
                    className="min-h-[150px] bg-card/50 border-border/30"
                    required
                  />
                </div>
                <SubmitButton>Adjust Frame</SubmitButton>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="collaborate" className="flex-grow">
          <Card className="h-full border-0 shadow-none bg-transparent">
            <CardHeader>
              <CardTitle>Collaborative Editing</CardTitle>
              <CardDescription>Use team feedback to guide AI-powered revisions.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={onFormSubmit(collaborateAction)} className="space-y-4">
                <input type="hidden" name="frameDataUri" value={activeFrame.url} />
                <input type="hidden" name="frameId" value={activeFrame.id} />
                <div className="space-y-2">
                  <Label htmlFor="comments">Feedback & Comments</Label>
                  <Textarea
                    id="comments"
                    name="comments"
                    placeholder="- 'Character looks stiff' (from Lead Animator)&#10;- 'Color palette is too dark' (from Art Director)"
                    className="min-h-[100px] bg-card/50 border-border/30"
                  />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="desiredChanges">Desired Changes</Label>
                  <Textarea
                    id="desiredChanges"
                    name="desiredChanges"
                    placeholder="Summarize the action items. e.g., 'Loosen the character's pose and brighten the overall color palette.'"
                    className="min-h-[100px] bg-card/50 border-border/30"
                    required
                  />
                </div>
                <SubmitButton>Apply Edits</SubmitButton>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
