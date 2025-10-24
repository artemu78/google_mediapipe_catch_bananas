import React from 'react';
import { Gesture } from '../types';

interface GestureDisplayProps {
  gesture: Gesture;
}

const getGestureEmoji = (gesture: Gesture): string => {
  switch (gesture) {
    case 'PINCH': return '🤏';
    case 'POINT': return '👆';
    case 'RAISED_HAND': return '🖐️';
    default: return '🖐️';
  }
};

const GestureDisplay: React.FC<GestureDisplayProps> = ({ gesture }) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/50 backdrop-blur-sm p-3 rounded-lg flex items-center gap-6 shadow-lg z-30">
      <div className="flex items-center gap-4">
        <span className="text-4xl">{getGestureEmoji(gesture)}</span>
        <div>
          <p className="text-sm text-slate-400">Gesture</p>
          <p className="font-bold text-lg">{gesture}</p>
        </div>
      </div>
    </div>
  );
};

export default GestureDisplay;
