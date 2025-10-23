
import { Landmark, HAND_CONNECTIONS } from '../types';

interface DrawingOptions {
  color?: string;
  lineWidth?: number;
  radius?: number;
}

export function drawConnectors(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  options: DrawingOptions = {}
) {
  const { color = 'white', lineWidth = 2 } = options;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  HAND_CONNECTIONS.forEach((pair) => {
    const [startIdx, endIdx] = pair;
    const startLandmark = landmarks[startIdx];
    const endLandmark = landmarks[endIdx];

    if (startLandmark && endLandmark) {
      ctx.beginPath();
      ctx.moveTo(startLandmark.x * ctx.canvas.width, startLandmark.y * ctx.canvas.height);
      ctx.lineTo(endLandmark.x * ctx.canvas.width, endLandmark.y * ctx.canvas.height);
      ctx.stroke();
    }
  });
}

export function drawLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  options: DrawingOptions = {}
) {
  const { color = 'white', radius = 5 } = options;
  ctx.fillStyle = color;

  landmarks.forEach((landmark) => {
    if (landmark) {
      ctx.beginPath();
      ctx.arc(
        landmark.x * ctx.canvas.width,
        landmark.y * ctx.canvas.height,
        radius,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  });
}
