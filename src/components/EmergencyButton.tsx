import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const EmergencyButton = () => {
  const { toast } = useToast();

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
    <Button
      onClick={handleEmergencyClick}
      className="btn-emergency"
      aria-label="استغاثة سريعة - يُسر معك"
      title="اضغط للطوارئ - يُسر معك"
    >
      <Phone className="w-6 h-6" />
    </Button>
  );
};

export default EmergencyButton;