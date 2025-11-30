import * as faceapi from 'face-api.js';
import type { BlinkResult, LivenessResult } from '../types/auth';

// Advanced Anti-spoofing: Multiple validation techniques
export const detectLiveness = async (video: HTMLVideoElement): Promise<LivenessResult> => {
  const frames: number[] = [];
  const positions: { x: number; y: number }[] = [];

  // Capture 6 frames over 1.2 seconds
  for (let i = 0; i < 6; i++) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const detection = await faceapi.detectSingleFace(video);
    if (!detection) {
      return {
        isLive: false,
        confidence: 0,
        details: { sizeVariation: false, movementDetected: false, textureValid: false }
      };
    }

    frames.push(detection.box.width * detection.box.height);
    positions.push({ x: detection.box.x, y: detection.box.y });
  }

  // 1. Size variation check (depth movement)
  const avgSize = frames.reduce((a, b) => a + b) / frames.length;
  const sizeVariance = frames.reduce((sum, val) => sum + Math.pow(val - avgSize, 2), 0) / frames.length;
  const sizeCheck = sizeVariance > 100;

  // 2. Position variation check (lateral movement)
  const avgX = positions.reduce((sum, pos) => sum + pos.x, 0) / positions.length;
  const avgY = positions.reduce((sum, pos) => sum + pos.y, 0) / positions.length;
  const posVariance = positions.reduce((sum, pos) =>
    sum + Math.pow(pos.x - avgX, 2) + Math.pow(pos.y - avgY, 2), 0) / positions.length;
  const movementCheck = posVariance > 50;

  // 3. Texture analysis (basic screen detection)
  const textureCheck = await analyzeTexture(video);

  // Combined validation: Must pass at least 2 out of 3 checks
  const passedChecks = (sizeCheck ? 1 : 0) + (movementCheck ? 1 : 0) + (textureCheck ? 1 : 0);
  const isLive = passedChecks >= 2;
  const confidence = passedChecks / 3;

  return {
    isLive,
    confidence,
    details: {
      sizeVariation: sizeCheck,
      movementDetected: movementCheck,
      textureValid: textureCheck
    }
  };
};

// Texture analysis for screen detection
const analyzeTexture = async (video: HTMLVideoElement): Promise<boolean> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Check for screen refresh patterns (simplified)
  let screenPattern = 0;
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    if (Math.abs(r - g) < 5 && Math.abs(g - b) < 5) screenPattern++;
  }
  const screenRatio = screenPattern / (imageData.data.length / 4);

  return screenRatio < 0.8; // Less than 80% uniform color indicates real face
};

// Simple blink detection for STANDARD level
export const detectBlink = async (video: HTMLVideoElement): Promise<BlinkResult> => {
  const eyeRatios: number[] = [];

  // Capture 8 frames over 0.8 seconds (faster)
  for (let i = 0; i < 8; i++) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const detection = await faceapi.detectSingleFace(video).withFaceLandmarks();

    if (detection) {
      const eyeRatio = calculateEyeAspectRatio(detection.landmarks);
      eyeRatios.push(eyeRatio);
    }
  }

  if (eyeRatios.length < 4) {
    return { blinkDetected: false, blinkCount: 0 };
  }

  // Detect blinks by finding significant drops in eye aspect ratio
  let blinkCount = 0;
  const threshold = 0.08; // More sensitive

  for (let i = 1; i < eyeRatios.length - 1; i++) {
    const prev = eyeRatios[i - 1];
    const curr = eyeRatios[i];
    const next = eyeRatios[i + 1];

    // Blink pattern: high -> low -> high
    if (prev > curr + threshold && next > curr + threshold) {
      blinkCount++;
    }
  }

  return {
    blinkDetected: blinkCount > 0,
    blinkCount
  };
};

// Calculate eye aspect ratio for blink detection
const calculateEyeAspectRatio = (landmarks: faceapi.FaceLandmarks68): number => {
  // Get eye landmark points
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();

  // Calculate eye aspect ratio for left eye
  const leftEAR = calculateSingleEyeRatio(leftEye);
  const rightEAR = calculateSingleEyeRatio(rightEye);

  return (leftEAR + rightEAR) / 2;
};

const calculateSingleEyeRatio = (eyePoints: faceapi.Point[]): number => {
  // Eye aspect ratio formula: (|p2-p6| + |p3-p5|) / (2 * |p1-p4|)
  const p1 = eyePoints[0];
  const p2 = eyePoints[1];
  const p3 = eyePoints[2];
  const p4 = eyePoints[3];
  const p5 = eyePoints[4];
  const p6 = eyePoints[5];

  const vertical1 = Math.sqrt(Math.pow(p2.x - p6.x, 2) + Math.pow(p2.y - p6.y, 2));
  const vertical2 = Math.sqrt(Math.pow(p3.x - p5.x, 2) + Math.pow(p3.y - p5.y, 2));
  const horizontal = Math.sqrt(Math.pow(p1.x - p4.x, 2) + Math.pow(p1.y - p4.y, 2));

  return (vertical1 + vertical2) / (2 * horizontal);
};

export const ValidationPresets = {
  BASIC: { liveness: true, blink: false },
  STANDARD: { liveness: true, blink: true }
} as const;

export type ValidationLevel = keyof typeof ValidationPresets;