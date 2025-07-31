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
};

export default FallbackGestureInterface;
