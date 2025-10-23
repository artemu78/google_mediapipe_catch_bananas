import React from 'react';
import { Gesture } from '../types';

interface VirtualCursorProps {
    position: { x: number; y: number } | null;
    gesture: Gesture;
    isMirrored: boolean;
}

const VirtualCursor: React.FC<VirtualCursorProps> = ({ position, gesture, isMirrored }) => {
    if (!position) {
        return null;
    }

    const isPinching = gesture === 'PINCH';

    const cursorClasses = `
        absolute w-8 h-8 rounded-full border-4
        transform -translate-x-1/2 -translate-y-1/2
        pointer-events-none transition-all duration-100 ease-out z-40
        ${isPinching ? 'bg-red-500/50 border-red-400 scale-125' : 'bg-cyan-500/50 border-cyan-400 scale-100'}
    `;

    const glowClasses = `
        absolute w-12 h-12 rounded-full
        transform -translate-x-1/2 -translate-y-1/2
        pointer-events-none transition-all duration-150 z-40
        animate-pulse
        ${isPinching ? 'bg-red-500/20' : 'bg-cyan-500/20'}
    `;

    // Adjust the x-coordinate based on the mirroring setting
    const displayX = (isMirrored ? 1 - position.x : position.x) * 100;
    const displayY = position.y * 100;
    console.log(`left:${displayX} top:${displayY}`)
    return (
        <>
            <div
                className={glowClasses}
                style={{ left: `${displayX}%`, top: `${displayY}%` }}
            />
            <div
                className={cursorClasses}
                style={{ left: `${displayX}%`, top: `${displayY}%` }}
            />
        </>
    );
};

export default VirtualCursor;