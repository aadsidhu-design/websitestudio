'use client';

import type { AnimationFrame } from '@/app/types';
import EditorHeader from './editor-header';
import Timeline from './timeline';
import ControlsPanel from './controls-panel';
import CanvasPanel from './canvas-panel';

export default function Editor({
  frames,
  activeFrameIndex,
  setActiveFrameIndex,
  onFrameAdjusted,
  onUndo,
  canUndo,
  updateHistory,
}: {
  frames: AnimationFrame[];
  activeFrameIndex: number;
  setActiveFrameIndex: (index: number) => void;
  onFrameAdjusted: (frame: AnimationFrame) => void;
  onUndo: () => void;
  canUndo: boolean;
  updateHistory: () => void;
}) {
  const activeFrame = frames[activeFrameIndex];

  return (
    <div className="flex flex-col h-screen bg-background">
      <EditorHeader onUndo={onUndo} canUndo={canUndo} />
      
      <div className="flex-grow flex flex-col overflow-hidden">
        <Timeline
          frames={frames}
          activeIndex={activeFrameIndex}
          onSelectFrame={setActiveFrameIndex}
        />
        
        <div className="flex-grow flex overflow-hidden">
          <div className="w-[380px] flex-shrink-0 border-r border-border overflow-y-auto">
            <ControlsPanel 
              activeFrame={activeFrame} 
              onFrameAdjusted={onFrameAdjusted} 
              updateHistory={updateHistory}
            />
          </div>
          <div className="flex-grow flex items-center justify-center p-4 lg:p-8 overflow-y-auto">
            <CanvasPanel activeFrame={activeFrame} />
          </div>
        </div>
      </div>
    </div>
  );
}
