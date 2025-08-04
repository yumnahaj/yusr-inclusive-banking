import { useEffect, useRef, useState, useCallback } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

interface EyeTrackingData {
  x: number;
  y: number;
  confidence: number;
}

interface UseEyeTrackingReturn {
  isTracking: boolean;
  startTracking: () => void;
  stopTracking: () => void;
  eyePosition: EyeTrackingData | null;
  registerButton: (id: string, element: HTMLElement) => void;
  unregisterButton: (id: string) => void;
}

interface ButtonData {
  element: HTMLElement;
  gazeStartTime: number | null;
  isGazing: boolean;
}

export const useEyeTracking = (): UseEyeTrackingReturn => {
  const [isTracking, setIsTracking] = useState(false);
  const [eyePosition, setEyePosition] = useState<EyeTrackingData | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const buttonsRef = useRef<Map<string, ButtonData>>(new Map());
  const animationFrameRef = useRef<number>();

  const GAZE_THRESHOLD = 3000; // 3 seconds
  const PROXIMITY_THRESHOLD = 100; // pixels

  const checkButtonGaze = useCallback(() => {
    if (!eyePosition) return;

    buttonsRef.current.forEach((buttonData, buttonId) => {
      const rect = buttonData.element.getBoundingClientRect();
      const buttonCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };

      const distance = Math.sqrt(
        Math.pow(eyePosition.x - buttonCenter.x, 2) + 
        Math.pow(eyePosition.y - buttonCenter.y, 2)
      );

      const isLookingAtButton = distance < PROXIMITY_THRESHOLD;

      if (isLookingAtButton && !buttonData.isGazing) {
        // Start gazing
        buttonData.isGazing = true;
        buttonData.gazeStartTime = Date.now();
        buttonData.element.style.boxShadow = '0 0 20px hsl(var(--primary))';
        buttonData.element.style.transform = 'scale(1.02)';
      } else if (!isLookingAtButton && buttonData.isGazing) {
        // Stop gazing
        buttonData.isGazing = false;
        buttonData.gazeStartTime = null;
        buttonData.element.style.boxShadow = '';
        buttonData.element.style.transform = '';
      } else if (isLookingAtButton && buttonData.isGazing && buttonData.gazeStartTime) {
        // Check if gaze duration threshold is met
        const gazeDuration = Date.now() - buttonData.gazeStartTime;
        if (gazeDuration >= GAZE_THRESHOLD) {
          // Trigger click
          buttonData.element.click();
          buttonData.isGazing = false;
          buttonData.gazeStartTime = null;
          buttonData.element.style.boxShadow = '';
          buttonData.element.style.transform = '';
          
          // Add visual feedback for successful gaze click
          buttonData.element.style.backgroundColor = 'hsl(var(--primary))';
          setTimeout(() => {
            buttonData.element.style.backgroundColor = '';
          }, 200);
        } else {
          // Show progress indicator
          const progress = gazeDuration / GAZE_THRESHOLD;
          const intensity = Math.min(progress * 2, 1);
          buttonData.element.style.boxShadow = `0 0 ${20 + intensity * 20}px hsl(var(--primary) / ${0.5 + intensity * 0.5})`;
        }
      }
    });

    if (isTracking) {
      animationFrameRef.current = requestAnimationFrame(checkButtonGaze);
    }
  }, [eyePosition, isTracking]);

  const onResults = useCallback((results: any) => {
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0];
      
      // Eye landmarks indices in MediaPipe Face Mesh
      const leftEyeIndices = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
      const rightEyeIndices = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];

      // Calculate average eye position
      let avgX = 0, avgY = 0;
      const allEyeIndices = [...leftEyeIndices, ...rightEyeIndices];
      
      allEyeIndices.forEach(index => {
        if (landmarks[index]) {
          avgX += landmarks[index].x;
          avgY += landmarks[index].y;
        }
      });

      avgX = (avgX / allEyeIndices.length) * window.innerWidth;
      avgY = (avgY / allEyeIndices.length) * window.innerHeight;

      setEyePosition({
        x: avgX,
        y: avgY,
        confidence: 0.8 // MediaPipe doesn't provide confidence directly
      });
    }
  }, []);

  const startTracking = useCallback(async () => {
    try {
      // Create video element
      const video = document.createElement('video');
      video.style.display = 'none';
      document.body.appendChild(video);
      videoRef.current = video;

      // Initialize MediaPipe Face Mesh
      const faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      faceMesh.onResults(onResults);
      faceMeshRef.current = faceMesh;

      // Initialize camera
      const camera = new Camera(video, {
        onFrame: async () => {
          if (faceMeshRef.current) {
            await faceMeshRef.current.send({ image: video });
          }
        },
        width: 640,
        height: 480
      });

      await camera.start();
      cameraRef.current = camera;
      setIsTracking(true);

      // Start button gaze checking
      checkButtonGaze();

    } catch (error) {
      console.error('Error starting eye tracking:', error);
    }
  }, [onResults, checkButtonGaze]);

  const stopTracking = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
    }
    
    if (videoRef.current) {
      document.body.removeChild(videoRef.current);
      videoRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Reset all button styles
    buttonsRef.current.forEach((buttonData) => {
      buttonData.element.style.boxShadow = '';
      buttonData.element.style.transform = '';
      buttonData.element.style.backgroundColor = '';
    });

    setIsTracking(false);
    setEyePosition(null);
    faceMeshRef.current = null;
    cameraRef.current = null;
  }, []);

  const registerButton = useCallback((id: string, element: HTMLElement) => {
    buttonsRef.current.set(id, {
      element,
      gazeStartTime: null,
      isGazing: false
    });
  }, []);

  const unregisterButton = useCallback((id: string) => {
    const buttonData = buttonsRef.current.get(id);
    if (buttonData) {
      buttonData.element.style.boxShadow = '';
      buttonData.element.style.transform = '';
      buttonData.element.style.backgroundColor = '';
    }
    buttonsRef.current.delete(id);
  }, []);

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    isTracking,
    startTracking,
    stopTracking,
    eyePosition,
    registerButton,
    unregisterButton
  };
};