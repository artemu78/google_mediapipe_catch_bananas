import { useState, useRef, useEffect } from 'react';
import { Fruit, FruitType, Gesture } from '../types';

interface UseGameLogicProps {
  isGameRunning: boolean;
  isCameraEnabled: boolean;
  detectedGesture: Gesture;
  cursorPosition: { x: number; y: number } | null;
  isMirrored: boolean;
  onCatch: () => void;
  onLevelUp: () => void;
  onMiss: () => void;
}

export const useGameLogic = ({
  isGameRunning,
  isCameraEnabled,
  detectedGesture,
  cursorPosition,
  isMirrored,
  onCatch,
  onLevelUp,
  onMiss
}: UseGameLogicProps) => {
  const [score, setScore] = useState(0);
  const [pinchCount, setPinchCount] = useState(0);
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [totalBananasSpawned, setTotalBananasSpawned] = useState(0);
  const [speedLevel, setSpeedLevel] = useState(1);
  const gameLoopRef = useRef<number>();
  const prevGestureRef = useRef<Gesture>('NONE');

  // Game loop for fruit animation and spawning
  useEffect(() => {
    const gameLoop = () => {
      setFruits(prevFruits =>
        prevFruits
          .map(fruit => ({ ...fruit, y: fruit.y + fruit.speed }))
          .filter(fruit => fruit.y < 1.1)
      );

      if (Math.random() < 0.03) {
        const fruitTypes: FruitType[] = ['apple', 'banana', 'strawberry'];
        const type = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];

        if (type === 'banana') {
          setTotalBananasSpawned(prev => prev + 1);
        }

        const newFruit: Fruit = {
          id: Date.now() + Math.random(),
          type: type,
          x: Math.random(),
          y: -0.1,
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

  // Collision detection
  useEffect(() => {
    if (isGameRunning && detectedGesture === 'PINCH' && cursorPosition) {
      const cursorX = isMirrored ? 1 - cursorPosition.x : cursorPosition.x;

      let wasCatchSuccessful = false;
      const nextFruits = fruits.filter(fruit => {
        if (wasCatchSuccessful) return true;

        const distance = Math.sqrt(
          Math.pow(cursorX - fruit.x, 2) +
          Math.pow(cursorPosition.y - fruit.y, 2)
        );

        if (distance < 0.05 && fruit.type === 'banana') {
          wasCatchSuccessful = true;
          return false;
        }
        return true;
      });

      if (wasCatchSuccessful) {
        onCatch();
        setFruits(nextFruits);
        setScore(prevScore => {
          const newScore = prevScore + 1;
          if (newScore > 0 && newScore % 4 === 0) {
            onLevelUp();
            setSpeedLevel(prevLevel => prevLevel + 1);
          }
          return newScore;
        });
      }
    }
  }, [detectedGesture, cursorPosition, isMirrored, isGameRunning, fruits, onCatch, onLevelUp]);

  // Handle gesture events
  useEffect(() => {
    if (isGameRunning && detectedGesture === 'PINCH' && prevGestureRef.current !== 'PINCH') {
      setPinchCount(prev => prev + 1);

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

      if (!isCatch) {
        onMiss();
      }
    }

    prevGestureRef.current = detectedGesture;
  }, [detectedGesture, isGameRunning, cursorPosition, isMirrored, fruits, onMiss]);

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

  return {
    score,
    pinchCount,
    fruits,
    totalBananasSpawned,
    speedLevel,
    prevGestureRef
  };
};
