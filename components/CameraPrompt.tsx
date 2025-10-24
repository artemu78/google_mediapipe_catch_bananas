import React from 'react';

interface CameraPromptProps {
  error: string | null;
  onEnableCamera: () => void;
}

const CameraPrompt: React.FC<CameraPromptProps> = ({ error, onEnableCamera }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-center">
      {error ? (
        <p className="text-red-400 mb-4">{error}</p>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-2 text-slate-300">Enable Your Camera</h2>
          <p className="text-slate-400 mb-4">Allow camera access to start gesture control.</p>
          <button
            onClick={onEnableCamera}
            className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg"
          >
            Enable Camera
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraPrompt;
