import { useEffect, useRef, useState } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

export type GestureType = 'open_hand' | 'closed_fist' | 'pointing_right' | 'raised_hand' | 'ok_gesture' | 'none';

interface HandGestureRecognitionProps {
  onGestureDetected: (gesture: GestureType) => void;
  isActive: boolean;
}

export const useHandGestureRecognition = ({ onGestureDetected, isActive }: HandGestureRecognitionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<Hands | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentGesture, setCurrentGesture] = useState<GestureType>('none');

  // تحليل إيماءة اليد بناءً على النقاط المكتشفة
  const analyzeGesture = (landmarks: any[]): GestureType => {
    if (!landmarks || landmarks.length === 0) return 'none';

    const hand = landmarks[0];
    if (!hand || hand.length < 21) return 'none';

    // النقاط الأساسية لليد
    const thumb_tip = hand[4];
    const thumb_ip = hand[3];
    const index_tip = hand[8];
    const index_pip = hand[6];
    const middle_tip = hand[12];
    const middle_pip = hand[10];
    const ring_tip = hand[16];
    const ring_pip = hand[14];
    const pinky_tip = hand[20];
    const pinky_pip = hand[18];
    const wrist = hand[0];

    // حساب المسافات والزوايا
    const isThumbUp = thumb_tip.y < thumb_ip.y;
    const isIndexUp = index_tip.y < index_pip.y;
    const isMiddleUp = middle_tip.y < middle_pip.y;
    const isRingUp = ring_tip.y < ring_pip.y;
    const isPinkyUp = pinky_tip.y < pinky_pip.y;

    // عدد الأصابع المرفوعة
    const fingersUp = [isThumbUp, isIndexUp, isMiddleUp, isRingUp, isPinkyUp].filter(Boolean).length;

    // تحليل الإيماءات
    if (fingersUp === 5) {
      return 'open_hand'; // ✋ يد مفتوحة
    } else if (fingersUp === 0 || fingersUp === 1) {
      return 'closed_fist'; // 👊 قبضة مغلقة
    } else if (isIndexUp && !isMiddleUp && !isRingUp && !isPinkyUp) {
      // تحقق من اتجاه الإشارة
      const pointing_direction = index_tip.x - wrist.x;
      if (pointing_direction > 0.1) {
        return 'pointing_right'; // 👉 إشارة لليمين
      }
    } else if (fingersUp === 4 && !isThumbUp) {
      return 'raised_hand'; // 🤚 يد مرفوعة (بدون الإبهام)
    } else if (isThumbUp && isIndexUp && !isMiddleUp && !isRingUp && !isPinkyUp) {
      // تحقق من شكل OK
      const thumb_index_distance = Math.sqrt(
        Math.pow(thumb_tip.x - index_tip.x, 2) + 
        Math.pow(thumb_tip.y - index_tip.y, 2)
      );
      if (thumb_index_distance < 0.05) {
        return 'ok_gesture'; // 👌 إيماءة OK
      }
    }

    return 'none';
  };

  const onResults = (results: Results) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // مسح اللوحة
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const gesture = analyzeGesture(results.multiHandLandmarks);
      
      if (gesture !== currentGesture) {
        setCurrentGesture(gesture);
        if (gesture !== 'none') {
          onGestureDetected(gesture);
        }
      }

      // رسم النقاط على اللوحة (اختياري للتصحيح)
      ctx.fillStyle = '#ff0000';
      results.multiHandLandmarks.forEach((landmarks) => {
        landmarks.forEach((landmark) => {
          ctx.beginPath();
          ctx.arc(
            landmark.x * canvas.width,
            landmark.y * canvas.height,
            3,
            0,
            2 * Math.PI
          );
          ctx.fill();
        });
      });
    } else {
      setCurrentGesture('none');
    }
  };

  const startCamera = async () => {
    if (!videoRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      // إعداد MediaPipe Hands
      const hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      hands.onResults(onResults);
      handsRef.current = hands;

      // إعداد الكاميرا
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (handsRef.current && videoRef.current) {
            await handsRef.current.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480
      });

      cameraRef.current = camera;
      await camera.start();
      setIsLoading(false);
    } catch (err) {
      console.error('Error starting camera:', err);
      setError('لا يمكن الوصول إلى الكاميرا');
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    if (handsRef.current) {
      handsRef.current.close();
      handsRef.current = null;
    }
    setCurrentGesture('none');
  };

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  return {
    videoRef,
    canvasRef,
    isLoading,
    error,
    currentGesture,
    startCamera,
    stopCamera
  };
};