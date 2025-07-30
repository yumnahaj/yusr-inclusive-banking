import { motion } from "framer-motion";
import { Mic, MicOff, Shield, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface VoiceVerificationProps {
  onVerified: () => void;
  onBack: () => void;
}

const VoiceVerification = ({ onVerified, onBack }: VoiceVerificationProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'intro' | 'recording' | 'processing' | 'success' | 'failed'>('intro');
  const [audioLevel, setAudioLevel] = useState(0);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    speakText("مرحباً بك في نظام التحقق من بصمة الصوت. سنحتاج منك قول عبارة معينة للتحقق من هويتك");
  }, []);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setVerificationStep('recording');
      speakText("قل العبارة التالية: مرحباً، أنا أريد الدخول إلى حسابي البنكي في تطبيق يُسر");
      
      // Simulate recording and verification process
      setTimeout(() => {
        setVerificationStep('processing');
        speakText("جاري معالجة بصمة الصوت...");
      }, 3000);

      setTimeout(() => {
        setVerificationStep('success');
        speakText("تم التحقق من بصمة الصوت بنجاح. مرحباً بك");
      }, 5000);

      setTimeout(() => {
        onVerified();
      }, 7000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      setVerificationStep('failed');
      speakText("حدث خطأ في الوصول للمايكروفون. تأكد من السماح للتطبيق باستخدام المايكروفون");
    }
  };

  const getStatusIcon = () => {
    switch (verificationStep) {
      case 'recording':
        return <Mic className="w-16 h-16 text-primary animate-pulse" />;
      case 'processing':
        return <Shield className="w-16 h-16 text-yellow-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'failed':
        return <XCircle className="w-16 h-16 text-red-500" />;
      default:
        return <MicOff className="w-16 h-16 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (verificationStep) {
      case 'intro':
        return "اضغط على زر البدء للتحقق من بصمة الصوت";
      case 'recording':
        return "قل العبارة المطلوبة بوضوح...";
      case 'processing':
        return "جاري التحقق من بصمة الصوت...";
      case 'success':
        return "تم التحقق بنجاح! جاري توجيهك...";
      case 'failed':
        return "فشل التحقق. حاول مرة أخرى";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg mx-auto"
      >
        <Card className="text-center p-8">
          <CardContent className="space-y-8">
            <div className="flex items-center justify-center mb-6">
              <img src="/lovable-uploads/6fba5ecd-28ee-4ef2-a788-da02b0dd1cf1.png" alt="يُسر" className="w-16 h-16" />
              <h1 className="text-2xl font-bold text-primary mr-4">التحقق من بصمة الصوت</h1>
            </div>

            <motion.div
              animate={{ scale: verificationStep === 'recording' ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 1, repeat: verificationStep === 'recording' ? Infinity : 0 }}
              className="flex justify-center"
            >
              {getStatusIcon()}
            </motion.div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold">{getStatusText()}</h2>
              
              {verificationStep === 'intro' && (
                <p className="text-muted-foreground">
                  سنحتاج منك قول عبارة معينة للتحقق من هويتك الصوتية
                </p>
              )}
              
              {verificationStep === 'recording' && (
                <div className="bg-primary/10 rounded-lg p-4">
                  <p className="font-bold text-primary mb-2">قل العبارة التالية:</p>
                  <p className="text-lg">"مرحباً، أنا أريد الدخول إلى حسابي البنكي في تطبيق يُسر"</p>
                </div>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              {verificationStep === 'intro' && (
                <>
                  <Button
                    onClick={startRecording}
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <Mic className="w-5 h-5" />
                    بدء التحقق
                  </Button>
                  <Button
                    onClick={onBack}
                    variant="outline"
                    size="lg"
                  >
                    العودة
                  </Button>
                </>
              )}
              
              {verificationStep === 'failed' && (
                <>
                  <Button
                    onClick={() => {
                      setVerificationStep('intro');
                      setIsRecording(false);
                    }}
                    size="lg"
                  >
                    المحاولة مرة أخرى
                  </Button>
                  <Button
                    onClick={onBack}
                    variant="outline"
                    size="lg"
                  >
                    العودة
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VoiceVerification;