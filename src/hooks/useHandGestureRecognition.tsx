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

    // حساب الأصابع المرفوعة مع تحسين أكبر للجوال
    const mobileThreshold = isMobile ? 0.015 : 0.03; // عتبة أقل للجوال
    const mobileVerticalThreshold = isMobile ? 0.03 : 0.05; // عتبة أقل للارتفاع
    
    // حساب الإبهام مع مراعاة الكاميرا الأمامية والخلفية
    const thumb_ratio = facingMode === 'user' ? 
      (thumb_tip.x - thumb_mcp.x) : (thumb_mcp.x - thumb_tip.x);
    const isThumbUp = Math.abs(thumb_ratio) > mobileThreshold;
    
    // حساب الأصابع الأخرى بعتبة أقل للجوال
    const isIndexUp = (index_mcp.y - index_tip.y) > mobileVerticalThreshold;
    const isMiddleUp = (middle_pip.y - middle_tip.y) > mobileVerticalThreshold;
    const isRingUp = (ring_pip.y - ring_tip.y) > mobileVerticalThreshold;
    const isPinkyUp = (pinky_pip.y - pinky_tip.y) > mobileVerticalThreshold;

    const fingersUp = [isThumbUp, isIndexUp, isMiddleUp, isRingUp, isPinkyUp].filter(Boolean).length;

    // إضافة معلومات تشخيصية مفصلة
    const debugInfo = {
      device: isMobile ? 'Mobile' : 'Desktop',
      facingMode,
      fingersUp,
      thumbRatio: thumb_ratio.toFixed(3),
      fingers: {
        thumb: isThumbUp,
        index: isIndexUp,
        middle: isMiddleUp,
        ring: isRingUp,
        pinky: isPinkyUp
      },
      thresholds: {
        mobile: mobileThreshold,
        vertical: mobileVerticalThreshold
      }
    };

    console.log('🔍 Detailed Gesture Analysis:', debugInfo);

    // تحليل الإيماءات مع شروط أكثر تساهلاً للجوال
    if (fingersUp >= 4 || (isMobile && fingersUp >= 3 && isIndexUp && isMiddleUp)) {
      console.log('✋ Detected: open_hand (fingers:', fingersUp, ')');
      return 'open_hand';
    } 
    
    if (fingersUp === 0 || (isMobile && fingersUp <= 1 && !isIndexUp)) {
      console.log('👊 Detected: closed_fist (fingers:', fingersUp, ')');
      return 'closed_fist';
    } 
    
    if (isIndexUp && !isMiddleUp && !isRingUp && !isPinkyUp) {
      console.log('👉 Detected: pointing_right (index only)');
      return 'pointing_right';
    }
    
    if ((fingersUp === 3 && isIndexUp && isMiddleUp && isRingUp) || 
        (isMobile && fingersUp >= 2 && isIndexUp && isMiddleUp)) {
      console.log('🤚 Detected: raised_hand (3 fingers up)');
      return 'raised_hand';
    }
    
    if (isThumbUp && isIndexUp && fingersUp === 2) {
      const distance = Math.sqrt(
        Math.pow(thumb_tip.x - index_tip.x, 2) + 
        Math.pow(thumb_tip.y - index_tip.y, 2)
      );
      console.log('👌 OK gesture check - distance:', distance.toFixed(3));
      if (distance < (isMobile ? 0.12 : 0.08)) { // عتبة أكبر للجوال
        console.log('👌 Detected: ok_gesture');
        return 'ok_gesture';
      }
    }

    return 'none';
  };

  // نظام تأخير الإيماءة لمنع التكرار
  const lastGestureTime = useRef<number>(0);
  const gestureDebounce = 2000; // 2 ثانية بين الإيماءات

  const onResults = (results: Results) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // مسح اللوحة
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const gesture = analyzeGesture(results.multiHandLandmarks);
      
      // تحديث الحالة الحالية
      setCurrentGesture(gesture);
      
      // إرسال الإيماءة فوراً مع debouncing
      const now = Date.now();
      if (gesture !== 'none' && gesture !== currentGesture && 
          (now - lastGestureTime.current) > gestureDebounce) {
        
        console.log('🎯 Gesture detected immediately:', gesture);
        lastGestureTime.current = now;
        onGestureDetected(gesture);
        
        // اهتزاز للتأكيد على الجوال
        if ('vibrate' in navigator && isMobile) {
          navigator.vibrate([100, 50, 100]);
        }
      }

      // رسم النقاط على اللوحة للتصحيح
      if (gesture !== 'none') {
        ctx.fillStyle = '#00ff00';
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        
        results.multiHandLandmarks.forEach((landmarks) => {
          // رسم النقاط
          landmarks.forEach((landmark, index) => {
            ctx.beginPath();
            ctx.arc(
              landmark.x * canvas.width,
              landmark.y * canvas.height,
              index === 8 || index === 4 ? 5 : 3, // نقاط أكبر للإبهام والسبابة
              0,
              2 * Math.PI
            );
            ctx.fill();
          });
          
          // رسم خطوط اليد
          const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4], // الإبهام
            [0, 5], [5, 6], [6, 7], [7, 8], // السبابة
            [0, 9], [9, 10], [10, 11], [11, 12], // الوسطى
            [0, 13], [13, 14], [14, 15], [15, 16], // البنصر
            [0, 17], [17, 18], [18, 19], [19, 20] // الخنصر
          ];
          
          ctx.beginPath();
          connections.forEach(([start, end]) => {
            ctx.moveTo(
              landmarks[start].x * canvas.width,
              landmarks[start].y * canvas.height
            );
            ctx.lineTo(
              landmarks[end].x * canvas.width,
              landmarks[end].y * canvas.height
            );
          });
          ctx.stroke();
        });
      }
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