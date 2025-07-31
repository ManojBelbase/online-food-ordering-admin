import * as faceapi from 'face-api.js';

let modelsLoaded = false;
let modelsLoading = false;
let modelsLoadPromise: Promise<void> | null = null;

export const preloadFaceRecognitionModels = (): Promise<void> => {
  if (modelsLoaded) {
    return Promise.resolve();
  }
  
  if (modelsLoading && modelsLoadPromise) {
    return modelsLoadPromise;
  }
  
  modelsLoading = true;
  const MODEL_URL = '/models';
  
  modelsLoadPromise = Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ])
  .then(() => {
    modelsLoaded = true;
    modelsLoading = false;
    console.log('Face recognition models preloaded successfully');
  })
  .catch((error) => {
    modelsLoading = false;
    console.error('Failed to preload face recognition models:', error);
    throw error;
  });
  
  return modelsLoadPromise;
};

export const areFaceRecognitionModelsLoaded = (): boolean => {
  return modelsLoaded;
};

export const loadFaceRecognitionModels = (): Promise<void> => {
  return preloadFaceRecognitionModels();
};