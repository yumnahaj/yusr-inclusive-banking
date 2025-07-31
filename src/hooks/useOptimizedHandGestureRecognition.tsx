import { useEffect, useRef, useState } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { useMobileDetection } from './useMobileDetection';

export type GestureType = 'open_hand' | 'closed_fist' | 'pointing_right' | 'raised_hand' | 'ok_gesture' | 'none';

interface OptimizedHandGestureRecognitionProps {
  onGestureDetected: (gesture: GestureType) => void;
  isActive: boolean;
  facingMode?: 'user' | 'environment';
}

export const useOptimizedHandGestureRecognition = ({ 
  onGestureDetected, 
  isActive, 
  facingMode = 'user' 
}: OptimizedHandGestureRecognitionProps) => {
  const capabilities = useMobileDetection();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<Hands | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentGesture, setCurrentGesture] = useState<GestureType>('none');
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Gesture debouncing
  const lastGestureTime = useRef<number>(0);
  const gestureDebounce = capabilities.isMobile ? 1500 : 1000;

  // Enhanced gesture analysis with mobile optimizations
  const analyzeGesture = (landmarks: any[]): GestureType => {
    if (!landmarks || landmarks.length === 0) return 'none';

    const hand = landmarks[0];
    if (!hand || hand.length < 21) return 'none';

    // Hand landmark points
    const thumb_tip = hand[4];
    const thumb_mcp = hand[2];
    const index_tip = hand[8];
    const index_pip = hand[6];
    const index_mcp = hand[5];
    const middle_tip = hand[12];
    const middle_pip = hand[10];
    const ring_tip = hand[16];
    const ring_pip = hand[14];
    const pinky_tip = hand[20];
    const pinky_pip = hand[18];

    // Adaptive thresholds based on device performance
    const baseThreshold = capabilities.performanceLevel === 'low' ? 0.01 : 
                         capabilities.performanceLevel === 'medium' ? 0.02 : 0.03;
    const verticalThreshold = capabilities.performanceLevel === 'low' ? 0.02 : 
                             capabilities.performanceLevel === 'medium' ? 0.04 : 0.05;

    // Finger detection with camera mirroring consideration
    const thumb_ratio = facingMode === 'user' ? 
      (thumb_tip.x - thumb_mcp.x) : (thumb_mcp.x - thumb_tip.x);
    const isThumbUp = Math.abs(thumb_ratio) > baseThreshold;
    
    const isIndexUp = (index_mcp.y - index_tip.y) > verticalThreshold;
    const isMiddleUp = (middle_pip.y - middle_tip.y) > verticalThreshold;
    const isRingUp = (ring_pip.y - ring_tip.y) > verticalThreshold;
    const isPinkyUp = (pinky_pip.y - pinky_tip.y) > verticalThreshold;

    const fingersUp = [isThumbUp, isIndexUp, isMiddleUp, isRingUp, isPinkyUp].filter(Boolean).length;

    // Gesture recognition with mobile-optimized thresholds
    if (fingersUp >= 4 || (capabilities.isMobile && fingersUp >= 3 && isIndexUp && isMiddleUp)) {
      return 'open_hand';
    } 
    
    if (fingersUp === 0 || (capabilities.isMobile && fingersUp <= 1 && !isIndexUp)) {
      return 'closed_fist';
    } 
    
    if (isIndexUp && !isMiddleUp && !isRingUp && !isPinkyUp) {
      return 'pointing_right';
    }
    
    if ((fingersUp === 3 && isIndexUp && isMiddleUp && isRingUp) || 
        (capabilities.isMobile && fingersUp >= 2 && isIndexUp && isMiddleUp)) {
      return 'raised_hand';
    }
    
    if (isThumbUp && isIndexUp && fingersUp === 2) {
      const distance = Math.sqrt(
        Math.pow(thumb_tip.x - index_tip.x, 2) + 
        Math.pow(thumb_tip.y - index_tip.y, 2)
      );
      const okThreshold = capabilities.isMobile ? 0.15 : 0.08;
      if (distance < okThreshold) {
        return 'ok_gesture';
      }
    }

    return 'none';
  };

  const onResults = (results: Results) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const gesture = analyzeGesture(results.multiHandLandmarks);
      setCurrentGesture(gesture);
      
      const now = Date.now();
      if (gesture !== 'none' && (now - lastGestureTime.current) > gestureDebounce) {
        lastGestureTime.current = now;
        onGestureDetected(gesture);
        
        // Haptic feedback on mobile
        if (capabilities.hasVibration) {
          navigator.vibrate([50, 30, 50]);
        }
      }

      // Draw landmarks for debugging
      if (gesture !== 'none') {
        ctx.fillStyle = '#00ff00';
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 1;
        
        results.multiHandLandmarks.forEach((landmarks) => {
          landmarks.forEach((landmark, index) => {
            ctx.beginPath();
            ctx.arc(
              landmark.x * canvas.width,
              landmark.y * canvas.height,
              index === 8 || index === 4 ? 4 : 2,
              0,
              2 * Math.PI
            );
            ctx.fill();
          });
        });
      }
    } else {
      setCurrentGesture('none');
    }
  };

  const processFrame = async () => {
    if (handsRef.current && videoRef.current && videoRef.current.readyState === 4) {
      try {
        await handsRef.current.send({ image: videoRef.current });
      } catch (error) {
        console.warn('Frame processing error:', error);
      }
    }
    if (isActive && handsRef.current) {
      animationRef.current = requestAnimationFrame(processFrame);
    }
  };

  const getOptimizedConstraints = () => {
    if (!capabilities.hasWebRTC) return null;

    const baseConstraints = {
      video: {
        facingMode,
        width: { min: 320, ideal: 640, max: 1280 },
        height: { min: 240, ideal: 480, max: 720 },
        frameRate: { min: 5, ideal: 15, max: 30 }
      },
      audio: false
    };

    // Adjust based on performance level
    if (capabilities.performanceLevel === 'low') {
      baseConstraints.video.width = { min: 320, ideal: 480, max: 640 };
      baseConstraints.video.height = { min: 240, ideal: 360, max: 480 };
      baseConstraints.video.frameRate = { min: 5, ideal: 10, max: 15 };
    } else if (capabilities.performanceLevel === 'high') {
      baseConstraints.video.frameRate = { min: 15, ideal: 30, max: 60 };
    }

    return baseConstraints;
  };

  const startCamera = async () => {
    if (!videoRef.current || !capabilities.hasCamera) {
      setError('الكاميرا غير متوفرة على هذا الجهاز');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const constraints = getOptimizedConstraints();
      if (!constraints) {
        throw new Error('WebRTC not supported');
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (primaryError) {
        // Fallback to basic constraints
        console.warn('Primary camera constraints failed, trying basic:', primaryError);
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false
        });
      }

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      
      await new Promise<void>((resolve, reject) => {
        const video = videoRef.current!;
        video.onloadedmetadata = () => {
          video.play().then(resolve).catch(reject);
        };
        video.onerror = reject;
        setTimeout(() => reject(new Error('Video loading timeout')), 10000);
      });

      // Initialize MediaPipe only if supported
      if (capabilities.supportsMediaPipe) {
        await initializeMediaPipe();
      } else {
        throw new Error('MediaPipe not supported on this device');
      }
      
      setIsInitialized(true);
      setIsLoading(false);
      
    } catch (err) {
      console.error('Camera initialization failed:', err);
      handleCameraError(err);
    }
  };

  const initializeMediaPipe = async () => {
    try {
      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      // Performance-optimized MediaPipe settings
      const handsOptions = {
        maxNumHands: 1,
        modelComplexity: (capabilities.performanceLevel === 'low' ? 0 : 
                         capabilities.performanceLevel === 'medium' ? 0 : 1) as 0 | 1,
        minDetectionConfidence: capabilities.performanceLevel === 'low' ? 0.3 : 0.5,
        minTrackingConfidence: capabilities.performanceLevel === 'low' ? 0.3 : 0.5,
        selfieMode: facingMode === 'user'
      };

      hands.setOptions(handsOptions);
      hands.onResults(onResults);
      handsRef.current = hands;

      // Start processing with appropriate frame rate
      const frameRate = capabilities.performanceLevel === 'low' ? 100 : 
                       capabilities.performanceLevel === 'medium' ? 66 : 33;
      
      const startProcessing = () => {
        processFrame();
        setTimeout(startProcessing, frameRate);
      };
      
      startProcessing();
      
    } catch (error) {
      console.error('MediaPipe initialization failed:', error);
      throw new Error('فشل في تحميل نظام تتبع الإيماءات');
    }
  };

  const handleCameraError = (err: any) => {
    let errorMessage = 'حدث خطأ في الكاميرا';
    
    if (err instanceof Error) {
      if (err.name === 'NotAllowedError' || err.message.includes('Permission')) {
        errorMessage = 'يرجى السماح بالوصول للكاميرا من إعدادات المتصفح';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'لم يتم العثور على كاميرا متاحة';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'الكاميرا غير مدعومة في هذا المتصفح';
      } else if (err.message.includes('MediaPipe')) {
        errorMessage = 'تتبع الإيماءات غير مدعوم على هذا الجهاز. جرب متصفحاً آخر';
      }
    }
    
    setError(errorMessage);
    setIsLoading(false);
  };

  const stopCamera = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    if (handsRef.current) {
      handsRef.current.close();
      handsRef.current = null;
    }
    
    setCurrentGesture('none');
    setIsInitialized(false);
  };

  useEffect(() => {
    if (isActive && capabilities.hasCamera) {
      startCamera();
    } else {
      stopCamera();
    }

    return stopCamera;
  }, [isActive, facingMode, capabilities.hasCamera]);

  return {
    videoRef,
    canvasRef,
    isLoading,
    error,
    currentGesture,
    startCamera,
    stopCamera,
    capabilities,
    isInitialized
  };
};