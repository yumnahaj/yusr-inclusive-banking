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
  const gestureCountRef = useRef<{ gesture: GestureType; count: number }>({ gesture: 'none', count: 0 });

  // تحليل إيماءة اليد بناءً على النقاط المكتشفة
  const analyzeGesture = (landmarks: any[]): GestureType => {
    if (!landmarks || landmarks.length === 0) return 'none';

    const hand = landmarks[0];
    if (!hand || hand.length < 21) return 'none';

    // النقاط الأساسية لليد
    const thumb_tip = hand[4];
    const thumb_ip = hand[3];
    const thumb_mcp = hand[2];
    const index_tip = hand[8];
    const index_pip = hand[6];
    const index_mcp = hand[5];
    const middle_tip = hand[12];
    const middle_pip = hand[10];
    const middle_mcp = hand[9];
    const ring_tip = hand[16];
    const ring_pip = hand[14];
    const ring_mcp = hand[13];
    const pinky_tip = hand[20];
    const pinky_pip = hand[18];
    const pinky_mcp = hand[17];
    const wrist = hand[0];

    // حساب الأصابع المرفوعة بطريقة محسنة
    const isThumbUp = thumb_tip.x > thumb_mcp.x; // للإبهام نستخدم X بدلاً من Y
    const isIndexUp = index_tip.y < index_pip.y && index_pip.y < index_mcp.y;
    const isMiddleUp = middle_tip.y < middle_pip.y && middle_pip.y < middle_mcp.y;
    const isRingUp = ring_tip.y < ring_pip.y && ring_pip.y < ring_mcp.y;
    const isPinkyUp = pinky_tip.y < pinky_pip.y && pinky_pip.y < pinky_mcp.y;

    // عدد الأصابع المرفوعة
    const fingersUp = [isThumbUp, isIndexUp, isMiddleUp, isRingUp, isPinkyUp].filter(Boolean).length;

    console.log('Gesture Analysis:', {
      fingersUp,
      isThumbUp,
      isIndexUp,
      isMiddleUp,
      isRingUp,
      isPinkyUp
    });

    // تحليل الإيماءات بدقة محسنة
    if (fingersUp === 5) {
      console.log('Detected: open_hand');
      return 'open_hand'; // ✋ يد مفتوحة
    } else if (fingersUp === 0) {
      console.log('Detected: closed_fist');
      return 'closed_fist'; // 👊 قبضة مغلقة
    } else if (isIndexUp && !isMiddleUp && !isRingUp && !isPinkyUp) {
      // تحقق من اتجاه الإشارة بطريقة محسنة
      const pointing_direction = index_tip.x - wrist.x;
      console.log('Pointing direction:', pointing_direction);
      if (Math.abs(pointing_direction) > 0.05) {
        console.log('Detected: pointing_right');
        return 'pointing_right'; // 👉 إشارة
      }
    } else if (fingersUp === 4 && !isThumbUp) {
      console.log('Detected: raised_hand');
      return 'raised_hand'; // 🤚 يد مرفوعة (بدون الإبهام)
    } else if (isThumbUp && isIndexUp && !isMiddleUp && !isRingUp && !isPinkyUp) {
      // تحقق من شكل OK بحد أكثر مرونة
      const thumb_index_distance = Math.sqrt(
        Math.pow(thumb_tip.x - index_tip.x, 2) + 
        Math.pow(thumb_tip.y - index_tip.y, 2)
      );
      console.log('OK gesture distance:', thumb_index_distance);
      if (thumb_index_distance < 0.08) {
        console.log('Detected: ok_gesture');
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
      
      // نظام استقرار الإيماءة
      if (gesture === gestureCountRef.current.gesture) {
        gestureCountRef.current.count++;
      } else {
        gestureCountRef.current = { gesture, count: 1 };
      }

      // إرسال الإيماءة فقط إذا كانت مستقرة لـ 3 إطارات على الأقل
      if (gestureCountRef.current.count >= 3 && gesture !== currentGesture && gesture !== 'none') {
        console.log('Stable gesture detected:', gesture);
        setCurrentGesture(gesture);
        onGestureDetected(gesture);
        gestureCountRef.current = { gesture: 'none', count: 0 }; // إعادة تعيين لتجنب التكرار
      } else if (gesture === 'none') {
        setCurrentGesture('none');
        gestureCountRef.current = { gesture: 'none', count: 0 };
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
        modelComplexity: 1, // زيادة التعقيد للحصول على دقة أفضل
        minDetectionConfidence: 0.6, // تقليل قليلاً للحساسية
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