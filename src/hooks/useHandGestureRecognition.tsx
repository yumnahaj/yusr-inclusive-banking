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

  // اكتشاف نوع الجهاز
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // تحليل إيماءة اليد محسن للجوال
  const analyzeGesture = (landmarks: any[]): GestureType => {
    if (!landmarks || landmarks.length === 0) return 'none';

    const hand = landmarks[0];
    if (!hand || hand.length < 21) return 'none';

    // النقاط الأساسية لليد
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
    const wrist = hand[0];

    // حساب الأصابع المرفوعة مع تحسين للجوال
    const thumb_ratio = facingMode === 'user' ? 
      (thumb_tip.x - thumb_mcp.x) : (thumb_mcp.x - thumb_tip.x);
    const isThumbUp = thumb_ratio > 0.02;
    
    const isIndexUp = (index_mcp.y - index_tip.y) > 0.05;
    const isMiddleUp = (middle_pip.y - middle_tip.y) > 0.05;
    const isRingUp = (ring_pip.y - ring_tip.y) > 0.05;
    const isPinkyUp = (pinky_pip.y - pinky_tip.y) > 0.05;

    const fingersUp = [isThumbUp, isIndexUp, isMiddleUp, isRingUp, isPinkyUp].filter(Boolean).length;

    console.log('📱 Mobile Gesture Analysis:', {
      fingersUp,
      thumbRatio: thumb_ratio,
      isThumbUp,
      isIndexUp,
      isMiddleUp,
      isRingUp,
      isPinkyUp,
      facingMode
    });

    // تحليل الإيماءات مبسط للجوال
    if (fingersUp >= 4) {
      console.log('✋ Detected: open_hand');
      return 'open_hand';
    } else if (fingersUp === 0) {
      console.log('👊 Detected: closed_fist');
      return 'closed_fist';
    } else if (isIndexUp && fingersUp === 1) {
      console.log('👉 Detected: pointing_right');
      return 'pointing_right';
    } else if (fingersUp === 3 && !isThumbUp && !isPinkyUp) {
      console.log('🤚 Detected: raised_hand');
      return 'raised_hand';
    } else if (isThumbUp && isIndexUp && fingersUp === 2) {
      // OK gesture مبسط للجوال
      const distance = Math.sqrt(
        Math.pow(thumb_tip.x - index_tip.x, 2) + 
        Math.pow(thumb_tip.y - index_tip.y, 2)
      );
      console.log('👌 OK distance:', distance);
      if (distance < 0.1) {
        console.log('👌 Detected: ok_gesture');
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

      // نظام استقرار مبسط للجوال - فقط إطارين
      const requiredFrames = isMobile ? 2 : 3;
      if (gestureCountRef.current.count >= requiredFrames && gesture !== currentGesture && gesture !== 'none') {
        console.log('🎯 Stable gesture detected:', gesture);
        setCurrentGesture(gesture);
        onGestureDetected(gesture);
        gestureCountRef.current = { gesture: 'none', count: 0 };
        
        // تأخير قصير لتجنب التفعيل المتكرر
        setTimeout(() => {
          gestureCountRef.current = { gesture: 'none', count: 0 };
        }, 1000);
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

      // إعدادات كاميرا محسنة للجوال
      const constraints = {
        video: {
          facingMode,
          width: { ideal: isMobile ? 480 : 640 },
          height: { ideal: isMobile ? 360 : 480 },
          frameRate: { ideal: isMobile ? 15 : 25, max: isMobile ? 20 : 30 }
        },
        audio: false
      };
      
      console.log('📱 Camera constraints:', constraints);

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

      // إعدادات MediaPipe محسنة للجوال
      const mobileSettings = {
        maxNumHands: 1,
        modelComplexity: (isMobile ? 0 : 1) as 0 | 1, // تقليل التعقيد للجوال
        minDetectionConfidence: isMobile ? 0.5 : 0.7,
        minTrackingConfidence: isMobile ? 0.4 : 0.5,
        selfieMode: facingMode === 'user'
      };
      
      console.log('🤖 MediaPipe settings:', mobileSettings);
      hands.setOptions(mobileSettings);

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