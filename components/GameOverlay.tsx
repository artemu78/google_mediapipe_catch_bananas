import React from 'react';

interface GameOverlayProps {
  isMirrored: boolean;
  onToggleMirror: () => void;
}

const GameOverlay: React.FC<GameOverlayProps> = ({ isMirrored, onToggleMirror }) => {
  return (
    <div className="absolute inset-0 bg-slate-900/70 flex flex-col items-center justify-center text-center p-8 z-20">
      <div className="mb-10 animate-pulse">
        <p className="text-6xl mb-4">🖐️</p>
        <h2 className="text-3xl font-bold text-white">Raise your hand to start</h2>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-lg shadow-xl backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-cyan-400 mb-2">Before You Begin! 🎯</h3>
        <p className="text-slate-300 mb-4 max-w-sm">
          Point your index finger at the screen. Does the blue cursor follow it? If the cursor moves in the opposite direction, click the button below to fix it.
        </p>
        <button
          onClick={onToggleMirror}
          className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg text-lg flex items-center justify-center mx-auto"
          aria-label="Mirror camera feed"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M12 22V2" />
            <path d="M8 7L4 12L8 17" />
            <path d="M16 7L20 12L16 17" />
          </svg>
          Mirror Pinch Cursor
        </button>
      </div>
    </div>
  );
};

export default GameOverlay;
