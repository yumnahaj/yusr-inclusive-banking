import { useEffect, useRef, useState } from 'react';
import { Hands, Results } from '@mediapipe/hands';

export type GestureType = 'open_hand' | 'closed_fist' | 'pointing_right' | 'raised_hand' | 'ok_gesture' | 'none';

interface HandGestureRecognitionProps {
  onGestureDetected: (gesture: GestureType) => void;
  isActive: boolean;
  facingMode?: 'user' | 'environment';
}

export const useHandGestureRecognition = ({ onGestureDetected, isActive, facingMode = 'user' }: HandGestureRecognitionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<Hands | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
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

  const processFrame = async () => {
    if (handsRef.current && videoRef.current && videoRef.current.readyState === 4) {
      await handsRef.current.send({ image: videoRef.current });
    }
    if (isActive && handsRef.current) {
      animationRef.current = requestAnimationFrame(processFrame);
    }
  };

  const startCamera = async () => {
    if (!videoRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      // طلب الإذن للوصول إلى الكاميرا مع constraints محددة للأجهزة المحمولة
      const constraints = {
        video: {
          facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30, max: 30 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      videoRef.current.srcObject = stream;
      await new Promise((resolve) => {
        videoRef.current!.onloadedmetadata = () => {
          videoRef.current!.play();
          resolve(null);
        };
      });

      // إعداد MediaPipe Hands
      const hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 0, // تقليل التعقيد للأجهزة المحمولة
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5
      });

      hands.onResults(onResults);
      handsRef.current = hands;

      // بدء معالجة الإطارات
      processFrame();
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error starting camera:', err);
      let errorMessage = 'لا يمكن الوصول إلى الكاميرا';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = 'تم رفض الإذن للوصول إلى الكاميرا';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'لم يتم العثور على كاميرا';
        } else if (err.name === 'NotSupportedError') {
          errorMessage = 'الكاميرا غير مدعومة في هذا المتصفح';
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
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