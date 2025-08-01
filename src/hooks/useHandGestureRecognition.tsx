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
      let constraints;
      
      if (isMobile) {
        // إعدادات خاصة للجوال
        constraints = {
          video: {
            facingMode,
            width: { min: 320, ideal: 640, max: 1280 },
            height: { min: 240, ideal: 480, max: 720 },
            frameRate: { min: 10, ideal: 15, max: 20 },
            aspectRatio: { ideal: 4/3 }
          },
          audio: false
        };
      } else {
        // إعدادات للكمبيوتر
        constraints = {
          video: {
            facingMode,
            width: { ideal: 640 },
            height: { ideal: 480 },
            frameRate: { ideal: 30 }
          },
          audio: false
        };
      }
      
      console.log('📱 Camera constraints for', isMobile ? 'mobile' : 'desktop', ':', constraints);

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      videoRef.current.srcObject = stream;
      
      // انتظار تحميل البيانات الوصفية للفيديو
      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current) {
          reject(new Error('Video ref is null'));
          return;
        }
        
        const video = videoRef.current;
        
        video.onloadedmetadata = () => {
          console.log('📱 Video metadata loaded:', {
            width: video.videoWidth,
            height: video.videoHeight,
            duration: video.duration
          });
          
          video.play().then(() => {
            console.log('📱 Video playback started');
            resolve();
          }).catch(reject);
        };
        
        video.onerror = () => {
          reject(new Error('Failed to load video'));
        };
        
        // timeout للأمان
        setTimeout(() => {
          reject(new Error('Video loading timeout'));
        }, 10000);
      });

  const hands = new Hands({
       locateFile: (file) => {
          return `https://lkgbogpytkwpdgwywrrz.supabase.co/storage/v1/object/public/hand//hands_solution_packed_assets.data${file}`;
       }
  });


      // إعدادات MediaPipe مُحسنة خصيصاً للجوال
      let handsOptions;
      
      if (isMobile) {
        handsOptions = {
          maxNumHands: 1,
          modelComplexity: 0, // أقل تعقيد للجوال
          minDetectionConfidence: 0.3, // عتبة أقل للجوال
          minTrackingConfidence: 0.3, // عتبة أقل للجوال
          selfieMode: facingMode === 'user'
        };
      } else {
        handsOptions = {
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.5,
          selfieMode: facingMode === 'user'
        };
      }
      
      console.log('🤖 MediaPipe settings for', isMobile ? 'mobile' : 'desktop', ':', handsOptions);
      hands.setOptions(handsOptions);

      hands.onResults(onResults);
      handsRef.current = hands;

      // بدء معالجة الإطارات مع معدل مناسب للجهاز
      processFrame();
      
      setIsLoading(false);
      console.log('✅ Camera and MediaPipe initialized successfully for', isMobile ? 'mobile' : 'desktop');
      
    } catch (err) {
      console.error('❌ Error starting camera:', err);
      let errorMessage = 'لا يمكن الوصول إلى الكاميرا';
      
      if (err instanceof Error) {
        console.error('Error details:', err.message);
        
        if (err.name === 'NotAllowedError' || err.message.includes('Permission')) {
          errorMessage = 'تم رفض الإذن للوصول إلى الكاميرا. يرجى السماح بالوصول للكاميرا من إعدادات المتصفح';
        } else if (err.name === 'NotFoundError' || err.message.includes('device')) {
          errorMessage = 'لم يتم العثور على كاميرا. تأكد من وجود كاميرا متصلة';
        } else if (err.name === 'NotSupportedError' || err.message.includes('support')) {
          errorMessage = 'الكاميرا غير مدعومة في هذا المتصفح';
        } else if (err.name === 'OverconstrainedError' || err.message.includes('constraint')) {
          errorMessage = 'إعدادات الكاميرا غير متوافقة. جاري المحاولة بإعدادات مبسطة...';
          
          // محاولة مع إعدادات مبسطة
          setTimeout(() => {
            startCameraWithBasicSettings();
          }, 1000);
          return;
        } else if (err.message.includes('timeout')) {
          errorMessage = 'انتهت مهلة تحميل الكاميرا. يرجى إعادة المحاولة';
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // دالة احتياطية للكاميرا بإعدادات أساسية
  const startCameraWithBasicSettings = async () => {
    if (!videoRef.current) return;

    try {
      setError(null);
      setIsLoading(true);

      const basicConstraints = {
        video: true,
        audio: false
      };

      console.log('📱 Trying with basic camera settings');
      const stream = await navigator.mediaDevices.getUserMedia(basicConstraints);
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      
      await videoRef.current.play();

      // إعداد MediaPipe بإعدادات أساسية
      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 0,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
        selfieMode: true
      });

      hands.onResults(onResults);
      handsRef.current = hands;
      processFrame();
      
      setIsLoading(false);
      console.log('✅ Camera started with basic settings');
      
    } catch (err) {
      console.error('❌ Even basic camera failed:', err);
      setError('فشل في تشغيل الكاميرا حتى مع الإعدادات الأساسية');
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
