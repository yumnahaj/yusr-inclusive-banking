import { useState } from "react";
import { Phone } from "lucide-react";
import { Wheelchair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AccessibilityControls from "./AccessibilityControls";

const EmergencyButton = () => {
  const { toast } = useToast();
  const [showAccessibilityControls, setShowAccessibilityControls] = useState(false);

  const handleEmergencyClick = () => {
    // Simulate emergency call functionality
    toast({
      title: "🚨 استغاثة سريعة - يُسر معك",
      description: "جاري الاتصال بأقرب مساعد وإرسال موقعك...",
      variant: "destructive",
    });
    
    // Vibrate if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  return (
    <>
      {/* WCAG 2.1 - Emergency button with enhanced accessibility */}
      <Button
        onClick={handleEmergencyClick}
        className="btn-emergency text-xs sm:text-sm"
        aria-label="استغاثة سريعة - يُسر معك - الضغط للاتصال بالطوارئ"
        title="اضغط للطوارئ - يُسر معك"
        role="button"
        tabIndex={0}
        // WCAG 2.1 - Keyboard support
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleEmergencyClick();
          }
        }}
      >
        <Phone className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" aria-hidden="true" />
      </Button>

      {/* WCAG 2.1 - Accessibility controls toggle */}
      <Button
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent hover:bg-accent/80 text-accent-foreground btn-accessible"
        onClick={() => setShowAccessibilityControls(!showAccessibilityControls)}
        aria-label={showAccessibilityControls ? "إخفاء إعدادات الوصولية" : "إظهار إعدادات الوصولية"}
        title="إعدادات الوصولية - WCAG 2.1"
        role="button"
        tabIndex={0}
      >
           <accessibility className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" aria-hidden="true" />
      </Button>


      {/* WCAG 2.1 - Accessibility controls panel */}
      {showAccessibilityControls && (
        <AccessibilityControls onClose={() => setShowAccessibilityControls(false)} />
      )}
    </>
  );
};

export default EmergencyButton;
