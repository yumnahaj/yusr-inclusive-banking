import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GestureType } from "@/hooks/useOptimizedHandGestureRecognition";
import { Hand, Zap, DollarSign, FileText, HelpCircle, Settings } from "lucide-react";

interface FallbackGestureInterfaceProps {
  onGestureDetected: (gesture: GestureType) => void;
  isVisible: boolean;
  onClose: () => void;
}

const FallbackGestureInterface = ({ onGestureDetected, isVisible, onClose }: FallbackGestureInterfaceProps) => {
  const gestureOptions = [
    {
      gesture: 'open_hand' as GestureType,
      icon: <DollarSign className="w-8 h-8" />,
      title: 'رصيدي الحالي',
      description: 'عرض الرصيد المتاح',
      emoji: '✋'
    },
    {
      gesture: 'closed_fist' as GestureType,
      icon: <FileText className="w-8 h-8" />,
      title: 'كشف الحساب',
      description: 'عرض حركات الحساب',
      emoji: '👊'
    },
    {
      gesture: 'pointing_right' as GestureType,
      icon: <Zap className="w-8 h-8" />,
      title: 'تحويل أموال',
      description: 'إرسال واستقبال الأموال',
      emoji: '👉'
    },
    {
      gesture: 'raised_hand' as GestureType,
      icon: <HelpCircle className="w-8 h-8" />,
      title: 'مساعدة فورية',
      description: 'الحصول على المساعدة',
      emoji: '🤚'
    },
    {
      gesture: 'ok_gesture' as GestureType,
      icon: <Settings className="w-8 h-8" />,
      title: 'الإعدادات',
      description: 'تخصيص التطبيق',
      emoji: '👌'
    }
  ];

  if (!isVisible) return null;

  return (
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
              التحكم التفاعلي
            </h2>
            <Button onClick={onClose} variant="outline">
              إغلاق
            </Button>
          </div>

       

          {/* أزرار الإيماءات البديلة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gestureOptions.map((option) => (
              <motion.div
                key={option.gesture}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => {
                    onGestureDetected(option.gesture);
                    // تأثير اهتزاز إذا كان متاحاً
                    if ('vibrate' in navigator) {
                      navigator.vibrate([50, 30, 50]);
                    }
                  }}
                  variant="outline"
                  className="w-full h-auto p-4 flex flex-col items-center gap-3 text-right hover:bg-primary/5"
                >
                  <div className="flex items-center gap-3 w-full">
                    <span className="text-3xl">{option.emoji}</span>
                    {option.icon}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{option.title}</h3>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* نصائح للحصول على تجربة أفضل */}
          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <h3 className="font-bold text-lg mb-3">💡 للحصول على تجربة أفضل</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <h4 className="font-semibold mb-1">🖥️ على الكمبيوتر:</h4>
                <ul className="list-disc list-inside text-gray-600">
                  <li>استخدم متصفح Chrome الحديث</li>
                  <li>تأكد من وصول الكاميرا</li>
                  <li>جرب تشغيل تتبع الإيماءات</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-1">📱 على الجوال:</h4>
                <ul className="list-disc list-inside text-gray-600">
                  <li>حدث المتصفح للإصدار الأحدث</li>
                  <li>امنح إذن الوصول للكاميرا</li>
                  <li>استخدم الأزرار التفاعلية</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FallbackGestureInterface;
