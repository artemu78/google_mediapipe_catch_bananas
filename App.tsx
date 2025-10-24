import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useHandLandmarker } from './hooks/useHandLandmarker';
import { useGameLogic } from './hooks/useGameLogic';
import { useAudio } from './hooks/useAudio';
import { drawLandmarks, drawConnectors } from './utils/drawing';
import Header from './components/Header';
import VirtualCursor from './components/VirtualCursor';
import Loader from './components/Loader';
import GameStats from './components/GameStats';
import GameOverlay from './components/GameOverlay';
import GestureDisplay from './components/GestureDisplay';
import CameraPrompt from './components/CameraPrompt';
import FruitItem from './components/FruitItem';
import AudioElements from './components/AudioElements';
import { HandLandmarkerResult, Gesture } from './types';
import packageJson from './package.json';

const App: React.FC = () => {
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevGestureRef = useRef<Gesture>('NONE');

  useEffect(() => {
    console.log(`🍌 Catch Bananas v${packageJson.version}`);
  }, []);

  const { playCatchSound, playLevelUpSound, playMissSound, audioRefs } = useAudio(isMuted);

  const onResults = useCallback((results: HandLandmarkerResult) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video && results.landmarks) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const landmarks of results.landmarks) {
          drawConnectors(ctx, landmarks, { color: '#06b6d4', lineWidth: 3 });
          drawLandmarks(ctx, landmarks, { color: '#67e8f9', radius: 4 });
        }
      }
    }
  }, []);

  const { isLoading, detectedGesture, cursorPosition, startHandDetection } = useHandLandmarker({ onResults });

  const { score, pinchCount, fruits, totalBananasSpawned, speedLevel } = useGameLogic({
    isGameRunning,
    isCameraEnabled,
    detectedGesture,
    cursorPosition,
    isMirrored,
    onCatch: playCatchSound,
    onLevelUp: playLevelUpSound,
    onMiss: playMissSound
  });

  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' }
      });
      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = stream;

        const onPlaying = () => {
          if (video) {
            startHandDetection(video);
            setIsCameraEnabled(true);
            video.removeEventListener('playing', onPlaying);
          }
        };

        video.addEventListener('playing', onPlaying);
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setError("Could not access webcam. Please check permissions and try again.");
    }
  };

  const stopGameAndReset = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    setIsCameraEnabled(false);
    setIsGameRunning(false);
    setError(null);
  };

  useEffect(() => {
    if (detectedGesture === 'RAISED_HAND' && prevGestureRef.current !== 'RAISED_HAND') {
      setIsGameRunning(prev => !prev);
    }
    prevGestureRef.current = detectedGesture;
  }, [detectedGesture]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      <Header
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(prev => !prev)}
        onStopGame={stopGameAndReset}
        isCameraEnabled={isCameraEnabled}
      />

      <AudioElements audioRefs={audioRefs} />

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="relative w-full max-w-5xl aspect-video bg-slate-800 rounded-lg shadow-2xl overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${isMirrored ? 'transform scaleX-[-1]' : ''} ${!isCameraEnabled ? 'hidden' : ''}`}
          ></video>

          {!isCameraEnabled ? (
            <CameraPrompt error={error} onEnableCamera={enableCamera} />
          ) : (
            <>
              <GameStats
                score={score}
                speedLevel={speedLevel}
                pinchCount={pinchCount}
                totalBananasSpawned={totalBananasSpawned}
              />

              {!isGameRunning && !isLoading && (
                <GameOverlay
                  isMirrored={isMirrored}
                  onToggleMirror={() => setIsMirrored(prev => !prev)}
                />
              )}

              {isGameRunning && fruits.map(fruit => (
                <FruitItem key={fruit.id} fruit={fruit} isMirrored={isMirrored} />
              ))}

              <canvas
                ref={canvasRef}
                className={`absolute top-0 left-0 w-full h-full ${isMirrored ? 'transform scaleX-[-1]' : ''}`}
              ></canvas>

              {isLoading && <Loader />}
              {!isLoading && (
                <>
                  <VirtualCursor position={cursorPosition} gesture={detectedGesture} isMirrored={isMirrored} />
                  <GestureDisplay gesture={detectedGesture} />
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
