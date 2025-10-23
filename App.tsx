
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useHandLandmarker } from './hooks/useHandLandmarker';
import { drawLandmarks, drawConnectors } from './utils/drawing';
import Header from './components/Header';
import VirtualCursor from './components/VirtualCursor';
import Loader from './components/Loader';
import { HandLandmarkerResult, Gesture, Fruit, FruitType } from './types';

// Base64 encoded audio files
const CATCH_SOUND = 'data:audio/wav;base64,UklGRlgCAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQCAAA7Nz5AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZWYAWlpZWFhXV1RTUlFQT0xLR0ZFRENCQUA/PDs5NzU0MzIxMC8uLQorKScoJyYlJCMhICAfHh0cGxoZGBcWFRQT vigenteBAwICAQEB/v7+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn';
const LEVEL_UP_SOUND = 'data:audio/wav;base64,UklGRkACAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YSwBAAB/f3+AgYKDhIeJiYqLjI2Oj5CRkpOUl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfa29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/wABAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICEiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZWY=';
const MISS_SOUND = 'data:audio/wav;base64,UklGRiAAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAP9/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f-HR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0-';

const App: React.FC = () => {
    const [isCameraEnabled, setIsCameraEnabled] = useState(false);
    const [isGameRunning, setIsGameRunning] = useState(false);
    const [isMirrored, setIsMirrored] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [pinchCount, setPinchCount] = useState(0);
    const [fruits, setFruits] = useState<Fruit[]>([]);
    const [totalBananasSpawned, setTotalBananasSpawned] = useState(0);
    const [speedLevel, setSpeedLevel] = useState(1);
    
    const gameLoopRef = useRef<number>();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const prevGestureRef = useRef<Gesture>('NONE');
    const catchSoundRef = useRef<HTMLAudioElement>(null);
    const levelUpSoundRef = useRef<HTMLAudioElement>(null);
    const missSoundRef = useRef<HTMLAudioElement>(null);

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

    // Game loop for fruit animation and spawning
    useEffect(() => {
        const gameLoop = () => {
            // Move fruits down
            setFruits(prevFruits =>
                prevFruits
                    .map(fruit => ({ ...fruit, y: fruit.y + fruit.speed }))
                    .filter(fruit => fruit.y < 1.1) // Remove fruits that are off-screen
            );

            // Add new fruit randomly
            if (Math.random() < 0.03) { // Control spawn rate
                const fruitTypes: FruitType[] = ['apple', 'banana', 'strawberry'];
                const type = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
                
                if (type === 'banana') {
                    setTotalBananasSpawned(prev => prev + 1);
                }

                const newFruit: Fruit = {
                    id: Date.now() + Math.random(),
                    type: type,
                    x: Math.random(),
                    y: -0.1, // Start just above the screen
                    speed: (0.0025 + Math.random() * 0.0025) * speedLevel
                };
                setFruits(prevFruits => [...prevFruits, newFruit]);
            }

            gameLoopRef.current = requestAnimationFrame(gameLoop);
        };
        
        if (isCameraEnabled && isGameRunning) {
            gameLoopRef.current = requestAnimationFrame(gameLoop);
        }

        return () => {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        };
    }, [isCameraEnabled, isGameRunning, speedLevel]);

    // Collision detection for catching bananas and playing sounds
    useEffect(() => {
        if (isGameRunning && detectedGesture === 'PINCH' && cursorPosition) {
            const cursorX = isMirrored ? 1 - cursorPosition.x : cursorPosition.x;

            let wasCatchSuccessful = false;
            const nextFruits = fruits.filter(fruit => {
                if (wasCatchSuccessful) return true; // Only catch one fruit per frame

                const distance = Math.sqrt(
                    Math.pow(cursorX - fruit.x, 2) + 
                    Math.pow(cursorPosition.y - fruit.y, 2)
                );

                if (distance < 0.05 && fruit.type === 'banana') {
                    wasCatchSuccessful = true;
                    return false; // Remove this fruit
                }
                return true; // Keep this fruit
            });

            if (wasCatchSuccessful) {
                if (!isMuted && catchSoundRef.current) {
                    catchSoundRef.current.currentTime = 0;
                    catchSoundRef.current.play();
                }

                setFruits(nextFruits);
                setScore(prevScore => {
                    const newScore = prevScore + 1;
                    // Increase speed level every 4 bananas
                    if (newScore > 0 && newScore % 4 === 0) {
                        if (!isMuted && levelUpSoundRef.current) {
                            levelUpSoundRef.current.currentTime = 0;
                            levelUpSoundRef.current.play();
                        }
                        setSpeedLevel(prevLevel => prevLevel + 1);
                    }
                    return newScore;
                });
            }
        }
    }, [detectedGesture, cursorPosition, isMirrored, isGameRunning, fruits, isMuted]);


    // Handle gesture events (start/stop game, count pinches, play miss sound)
    useEffect(() => {
        // Toggle game state with raised hand
        if (detectedGesture === 'RAISED_HAND' && prevGestureRef.current !== 'RAISED_HAND') {
            setIsGameRunning(prev => !prev);
        }

        // Count pinch gestures and play MISS sound on new pinch
        if (isGameRunning && detectedGesture === 'PINCH' && prevGestureRef.current !== 'PINCH') {
            setPinchCount(prev => prev + 1);
            
            // Check if this new pinch is a miss
            let isCatch = false;
            if (cursorPosition) {
                const cursorX = isMirrored ? 1 - cursorPosition.x : cursorPosition.x;
                for (const fruit of fruits) {
                     const distance = Math.sqrt(
                        Math.pow(cursorX - fruit.x, 2) +
                        Math.pow(cursorPosition.y - fruit.y, 2)
                    );
                    if (distance < 0.05 && fruit.type === 'banana') {
                        isCatch = true;
                        break;
                    }
                }
            }

            if (!isCatch && !isMuted && missSoundRef.current) {
                missSoundRef.current.currentTime = 0;
                missSoundRef.current.play();
            }
        }

        prevGestureRef.current = detectedGesture;
    }, [detectedGesture, isGameRunning, cursorPosition, isMirrored, fruits, isMuted]);

    // Reset stats when game is stopped
    useEffect(() => {
        if (!isGameRunning) {
            setFruits([]);
            setScore(0);
            setPinchCount(0);
            setTotalBananasSpawned(0);
            setSpeedLevel(1);
        }
    }, [isGameRunning]);

    const getGestureEmoji = (gesture: Gesture): string => {
        switch (gesture) {
            case 'PINCH': return '🤏';
            case 'POINT': return '👆';
            case 'RAISED_HAND': return '🖐️';
            default: return '🖐️';
        }
    };

    const getFruitEmoji = (type: FruitType): string => {
        switch (type) {
            case 'apple': return '🍎';
            case 'banana': return '🍌';
            case 'strawberry': return '🍓';
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
            <Header isMuted={isMuted} onToggleMute={() => setIsMuted(prev => !prev)} />

            {/* Audio elements */}
            <audio ref={catchSoundRef} src={CATCH_SOUND} preload="auto"></audio>
            <audio ref={levelUpSoundRef} src={LEVEL_UP_SOUND} preload="auto"></audio>
            <audio ref={missSoundRef} src={MISS_SOUND} preload="auto"></audio>

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="relative w-full max-w-5xl aspect-video bg-slate-800 rounded-lg shadow-2xl overflow-hidden">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className={`w-full h-full object-cover ${isMirrored ? 'transform scaleX-[-1]' : ''} ${!isCameraEnabled ? 'hidden' : ''}`}
                    ></video>

                    {!isCameraEnabled ? (
                         <div className="absolute inset-0 flex items-center justify-center text-center">
                             {error ? (
                                <p className="text-red-400 mb-4">{error}</p>
                            ) : (
                                <div>
                                    <h2 className="text-2xl font-bold mb-2 text-slate-300">Enable Your Camera</h2>
                                    <p className="text-slate-400 mb-4">Allow camera access to start gesture control.</p>
                                    <button
                                        onClick={enableCamera}
                                        className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg"
                                    >
                                        Enable Camera
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
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

                            {!isGameRunning && isCameraEnabled && !isLoading && (
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
                                            onClick={() => setIsMirrored(prev => !prev)}
                                            className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg text-lg flex items-center justify-center mx-auto"
                                            aria-label="Mirror camera feed"
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                                <path d="M12 22V2"/>
                                                <path d="M8 7L4 12L8 17"/>
                                                <path d="M16 7L20 12L16 17"/>
                                            </svg>
                                            Mirror Pinch Cursor
                                        </button>
                                    </div>
                                </div>
                            )}

                            {isGameRunning && fruits.map(fruit => (
                                <div
                                    key={fruit.id}
                                    className="absolute text-4xl z-10"
                                    style={{
                                        left: `${fruit.x * 100}%`,
                                        top: `${fruit.y * 100}%`,
                                        transform: 'translateX(-50%)',
                                        userSelect: 'none'
                                    }}
                                >
                                    {getFruitEmoji(fruit.type)}
                                </div>
                            ))}

                            <canvas
                                ref={canvasRef}
                                className={`absolute top-0 left-0 w-full h-full ${isMirrored ? 'transform scaleX-[-1]' : ''}`}
                            ></canvas>
                            {isLoading && <Loader />}
                            {!isLoading && (
                                <>
                                    <VirtualCursor position={cursorPosition} gesture={detectedGesture} isMirrored={isMirrored} />
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/50 backdrop-blur-sm p-3 rounded-lg flex items-center gap-6 shadow-lg z-30">
                                        <div className="flex items-center gap-4">
                                            <span className="text-4xl">{getGestureEmoji(detectedGesture)}</span>
                                            <div>
                                                <p className="text-sm text-slate-400">Gesture</p>
                                                <p className="font-bold text-lg">{detectedGesture}</p>
                                            </div>
                                        </div>
                                    </div>
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
