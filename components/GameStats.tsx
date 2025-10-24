import React from 'react';

interface GameStatsProps {
    score: number;
    speedLevel: number;
    pinchCount: number;
    totalBananasSpawned: number;
}

const GameStats: React.FC<GameStatsProps> = ({ score, speedLevel, pinchCount, totalBananasSpawned }) => {
    return (
        <div className="absolute top-4 left-4 bg-slate-900/50 backdrop-blur-sm p-3 rounded-lg shadow-lg z-30 grid grid-cols-4 gap-x-6 text-center">
            <div>
                <p className="text-sm text-slate-400">Score</p>
                <p className="font-bold text-xl text-cyan-400">{score}</p>
            </div>
            <div>
                <p className="text-sm text-slate-400">Speed</p>
                <p className="font-bold text-xl text-green-400">{speedLevel}</p>
            </div>
            <div>
                <p className="text-sm text-slate-400">Pinches</p>
                <p className="font-bold text-xl">{pinchCount}</p>
            </div>
            <div>
                <p className="text-sm text-slate-400">Total Bananas</p>
                <p className="font-bold text-xl text-yellow-400">{totalBananasSpawned}</p>
            </div>
        </div>
    );
};

export default GameStats;
