import { useState, useEffect, useRef, useCallback } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { HandLandmarkerResult, Landmark, Gesture } from '../types';

interface UseHandLandmarkerProps {
    onResults: (results: HandLandmarkerResult) => void;
}

export const useHandLandmarker = ({ onResults }: UseHandLandmarkerProps) => {
    const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [detectedGesture, setDetectedGesture] = useState<Gesture>('NONE');
    const [cursorPosition, setCursorPosition] = useState<{ x: number, y: number } | null>(null);

    const animationFrameId = useRef<number>();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const lastUpdateTime = useRef<number>(0);
    const THROTTLE_MS = 33; // ~60fps, adjust to 33 for ~30fps if needed

    const initializeHandLandmarker = useCallback(async () => {
        try {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
            );
            const marker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                    delegate: "GPU",
                },
                runningMode: "VIDEO",
                numHands: 1,
            });
            setHandLandmarker(marker);
            setIsLoading(false);
            console.log("Hand Landmarker initialized");
        } catch (e) {
            console.error("Failed to initialize Hand Landmarker", e);
        }
    }, []);

    useEffect(() => {
        initializeHandLandmarker();

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            if (handLandmarker) {
                handLandmarker.close();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initializeHandLandmarker]);

    const detectGesture = (landmarks: Landmark[]): Gesture => {
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const middleTip = landmarks[12];
        const ringTip = landmarks[16];
        const pinkyTip = landmarks[20];

        // Pinch detection (highest priority)
        const pinchDistance = Math.sqrt(
            Math.pow(thumbTip.x - indexTip.x, 2) +
            Math.pow(thumbTip.y - indexTip.y, 2)
        );

        if (pinchDistance < 0.06) { // Threshold for pinch
            return 'PINCH';
        }

        // Raised Hand detection (all fingers up)
        const isIndexUp = indexTip.y < landmarks[6].y;
        const isMiddleUp = middleTip.y < landmarks[10].y;
        const isRingUp = ringTip.y < landmarks[14].y;
        const isPinkyUp = pinkyTip.y < landmarks[18].y;

        if (isIndexUp && isMiddleUp && isRingUp && isPinkyUp) {
            return 'RAISED_HAND';
        }

        // Pointing detection
        if (indexTip.y < middleTip.y) {
            return 'POINT';
        }

        return 'NONE';
    };


    const predictWebcam = useCallback(() => {
        if (!handLandmarker || !videoRef.current || !videoRef.current.srcObject) {
            animationFrameId.current = requestAnimationFrame(predictWebcam);
            return;
        }

        const startTimeMs = performance.now();
        const results: HandLandmarkerResult = handLandmarker.detectForVideo(videoRef.current, startTimeMs);

        if (results.landmarks && results.landmarks.length > 0) {
            const landmarks = results.landmarks[0];
            onResults(results);

            const gesture = detectGesture(landmarks);
            setDetectedGesture(gesture);

            // Throttle cursor position updates
            const now = performance.now();
            if (now - lastUpdateTime.current >= THROTTLE_MS) {
                const indexFingerTip = landmarks[8];
                const newPosition = { x: indexFingerTip.x, y: indexFingerTip.y };
                setCursorPosition(newPosition);
                lastUpdateTime.current = now;
            }
        } else {
            setDetectedGesture('NONE');
            setCursorPosition(null);
        }

        animationFrameId.current = requestAnimationFrame(predictWebcam);
    }, [handLandmarker, onResults]);

    const startHandDetection = useCallback((video: HTMLVideoElement) => {
        videoRef.current = video;
        if (!isLoading && handLandmarker) {
            predictWebcam();
        }
    }, [isLoading, handLandmarker, predictWebcam]);

    // Auto-start prediction when model is loaded and video is ready
    useEffect(() => {
        if (!isLoading && handLandmarker && videoRef.current) {
            predictWebcam();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, handLandmarker]);

    return { isLoading, detectedGesture, cursorPosition, startHandDetection };
};
