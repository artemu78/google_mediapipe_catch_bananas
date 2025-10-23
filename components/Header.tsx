
import React from 'react';

interface HeaderProps {
    isMuted: boolean;
    onToggleMute: () => void;
    onStopGame: () => void;
    isCameraEnabled: boolean;
}

const Header: React.FC<HeaderProps> = ({ isMuted, onToggleMute, onStopGame, isCameraEnabled }) => {
    return (
        <header className="relative w-full p-4 bg-slate-900/80 backdrop-blur-sm shadow-md z-10 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-yellow-400 tracking-wider">
                    Pinch Banana
                </h1>
                <p className="text-slate-400 mt-1">Raise your hand to start/stop. Pinch the 🍌 to score.</p>
            </div>
            <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center gap-4">
                {isCameraEnabled && (
                    <button
                        onClick={onStopGame}
                        className="p-2 rounded-full bg-red-600/80 hover:bg-red-500/80 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                        aria-label="Stop game and release camera"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 6h12v12H6z" />
                        </svg>
                    </button>
                )}
                <button
                    onClick={onToggleMute}
                    className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/70 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
                >
                    {isMuted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                            <line x1="12" y1="19" x2="12" y2="23"></line>
                            <line x1="8" y1="23" x2="16" y2="23"></line>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                            <line x1="12" y1="19" x2="12" y2="23"></line>
                            <line x1="8" y1="23" x2="16" y2="23"></line>
                        </svg>
                    )}
                </button>
            </div>
        </header>
    );
};

export default Header;
