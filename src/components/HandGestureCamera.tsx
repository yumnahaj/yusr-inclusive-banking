import { motion } from "framer-motion";
import { Camera, CameraOff, Hand, RotateCcw, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useOptimizedHandGestureRecognition, GestureType } from "@/hooks/useOptimizedHandGestureRecognition";
import FallbackGestureInterface from "./FallbackGestureInterface";
import GestureErrorBoundary from "./GestureErrorBoundary";
import { useState, useEffect } from "react";  // استورد useEffect مع useState هنا فقط

interface HandGestureCameraProps {
  onGestureDetected: (gesture: GestureType) => void;
  isVisible: boolean;
  onClose: () => void;
}

const HandGestureCamera = ({ onGestureDetected, isVisible, onClose }: HandGestureCameraProps) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [showFallback, setShowFallback] = useState(false);

  const { 
    videoRef, 
    canvasRef, 
    isLoading, 
    error, 
    currentGesture,
    stopCamera,
    startCamera,
    capabilities,
    isInitialized
  } = useOptimizedHandGestureRecognition({
    onGestureDetected,
    isActive: isCameraActive,
    facingMode
  });

  useEffect(() => {
    switch(currentGesture) {
      case 'closed_fist':
        console.log('فتح كشف الحساب');
        // تقدر تضيف هنا فتح مودال أو أي فعل
        break;
      case 'open_hand':
        console.log('فتح رصيدي');
        break;
      case 'pointing_right':
        console.log('تحويل أموال');
        break;
      case 'raised_hand':
        console.log('فتح المساعدة');
        break;
      case 'ok_gesture':
        console.log('فتح الإعدادات');
        break;
      default:
        break;
    }
  }, [currentGesture]);

  const toggleCamera = () => {
    setIsCameraActive(!isCameraActive);
  };

  const switchCamera = async () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    if (isCameraActive) {
      stopCamera();
      setTimeout(() => {
        startCamera();
      }, 100);
    }
  };

  const getGestureEmoji = (gesture: GestureType): string => {
    switch (gesture) {
      case 'open_hand': return '✋';
      case 'closed_fist': return '👊';
      case 'pointing_right': return '👉';
      case 'raised_hand': return '🤚';
      case 'ok_gesture': return '👌';
      default: return '🤲';
    }
  };

  const getGestureArabicName = (gesture: GestureType): string => {
    switch (gesture) {
      case 'open_hand': return 'يد مفتوحة - رصيدي';
      case 'closed_fist': return 'قبضة مغلقة - كشف الحساب';
      case 'pointing_right': return 'إشارة - تحويل أموال';
      case 'raised_hand': return 'يد مرفوعة - مساعدة';
      case 'ok_gesture': return 'إيماءة موافقة - إعدادات';
      default: return 'لا توجد إيماءة مكتشفة';
    }
  };

  if (!isVisible) return null;

  return (
    <GestureErrorBoundary
      fallback={
        <FallbackGestureInterface
          onGestureDetected={onGestureDetected}
          isVisible={isVisible}
          onClose={onClose}
        />
      }
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <Card 
          className="w-full max-w-2xl bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          <CardContent className="p-6">
            {/* ...باقي JSX كما عندك */}
          </CardContent>
        </Card>
      </motion.div>
    </GestureErrorBoundary>
  );
};

export default HandGestureCamera;
