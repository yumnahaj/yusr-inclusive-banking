import { motion } from "framer-motion";
import { Camera, CameraOff, Hand, RotateCcw, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useOptimizedHandGestureRecognition, GestureType } from "@/hooks/useOptimizedHandGestureRecognition";
import FallbackGestureInterface from "./FallbackGestureInterface";
import GestureErrorBoundary from "./GestureErrorBoundary";
import { useState } from "react";

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

  if (!isVisible) {
    return null;}
          
       
      

          {/* دليل الإيماءات */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-4 text-center">🤲 دليل الإيماءات</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-3xl mb-2">✋</div>
                <p className="font-semibold">يد مفتوحة</p>
                <p className="text-gray-600">رصيدي الحالي</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">👊</div>
                <p className="font-semibold">قبضة مغلقة</p>
                <p className="text-gray-600">كشف الحساب</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">👉</div>
                <p className="font-semibold">إشارة لليمين</p>
                <p className="text-gray-600">تحويل أموال</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🤚</div>
                <p className="font-semibold">يد مرفوعة</p>
                <p className="text-gray-600">مساعدة فورية</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">👌</div>
                <p className="font-semibold">إيماءة موافقة</p>
                <p className="text-gray-600">الإعدادات</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
    </GestureErrorBoundary>
  );
};

export default HandGestureCamera;
