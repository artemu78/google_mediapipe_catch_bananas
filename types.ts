// Manually define the necessary types based on MediaPipe documentation.
// This avoids needing the @mediapipe/tasks-vision package at build time.
export interface Landmark {
    x: number;
    y: number;
    z: number;
    visibility?: number;
}

export interface HandLandmarkerResult {
    landmarks: Landmark[][];
    worldLandmarks: Landmark[][];
    handedness: {
        score: number;
        index: number;
        categoryName: string;
        displayName: string;
    }[][];
}

export type Gesture = "PINCH" | "POINT" | "RAISED_HAND" | "NONE";

export const HAND_CONNECTIONS: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [5, 9], [9, 10], [10, 11], [11, 12],
    [9, 13], [13, 14], [14, 15], [15, 16],
    [13, 17], [17, 18], [18, 19], [19, 20],
    [0, 17]
];

export type FruitType = 'apple' | 'banana' | 'strawberry';

export interface Fruit {
    id: number;
    type: FruitType;
    x: number;
    y: number;
    speed: number;
}
