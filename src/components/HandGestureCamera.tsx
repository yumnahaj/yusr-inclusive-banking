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

  if (!isVisible) return null;

  // Show fallback interface if gesture recognition is not supported
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
              <Hand className="w-8 h-8" />
              التحكم بإيماءات اليد
            </h2>
            <Button onClick={onClose} variant="outline">
              إغلاق
            </Button>
          </div>

          {/* منطقة الكاميرا */}
          <div className="relative mb-6">
            <div className="bg-gray-100 rounded-lg overflow-hidden w-full max-w-md aspect-[4/3] flex items-center justify-center">
              {isCameraActive ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    className={`w-full h-full object-cover ${facingMode === 'user' ? 'transform scale-x-[-1]' : ''}`}
                    autoPlay
                    playsInline
                    muted
                  />
                  <canvas
                    ref={canvasRef}
                    className={`absolute top-0 left-0 w-full h-full ${facingMode === 'user' ? 'transform scale-x-[-1]' : ''}`}
                    
                  />
                  {/* مؤشر نوع الكاميرا */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {facingMode === 'user' ? 'الكاميرا الأمامية' : 'الكاميرا الخلفية'}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">اضغط لتشغيل الكاميرا</p>
                </div>
              )}
            </div>

            {/* إظهار الإيماءة المكتشفة */}
            {isCameraActive && (
              <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getGestureEmoji(currentGesture)}</span>
                  <span className="text-sm">{getGestureArabicName(currentGesture)}</span>
                </div>
              </div>
            )}
          </div>

          {/* أزرار التحكم */}
          <div className="flex justify-center gap-4 mb-6">
            <Button
              onClick={toggleCamera}
              disabled={isLoading}
              className="flex items-center gap-2"
              variant={isCameraActive ? "destructive" : "default"}
            >
              {isCameraActive ? (
                <>
                  <CameraOff className="w-5 h-5" />
                  إيقاف الكاميرا
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  تشغيل الكاميرا
                </>
              )}
            </Button>
            
            {isCameraActive && (
              <Button
                onClick={switchCamera}
                disabled={isLoading}
                className="flex items-center gap-2"
                variant="outline"
              >
                <RotateCcw className="w-5 h-5" />
                {facingMode === 'user' ? 'الكاميرا الخلفية' : 'الكاميرا الأمامية'}
              </Button>
            )}
          </div>

          {/* رسائل الحالة */}
          {isLoading && (
            <div className="text-center py-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-primary">جاري تحميل الكاميرا...</p>
              </div>
              {capabilities.isMobile && (
                <p className="text-sm text-gray-600">قد يستغرق الأمر وقتاً أطول على الجوال</p>
              )}
            </div>
          )}

 
          
       
      

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
