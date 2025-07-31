import { motion } from "framer-motion";
import { Fingerprint, Shield, CheckCircle, XCircle, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface FingerprintVerificationProps {
  onVerified: () => void;
  onBack: () => void;
}

const FingerprintVerification = ({ onVerified, onBack }: FingerprintVerificationProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'intro' | 'scanning' | 'processing' | 'success' | 'failed'>('intro');
  const [scanProgress, setScanProgress] = useState(0);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    speakText("مرحباً بك في نظام التحقق من بصمة الإصبع. ضع إصبعك على المستشعر للتحقق من هويتك");
  }, []);

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setVerificationStep('scanning');
      speakText("ضع إصبعك على المستشعر واضغط بلطف");
      
      // Simulate fingerprint scanning progress
      const scanningInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(scanningInterval);
            setVerificationStep('processing');
            speakText("جاري معالجة بصمة الإصبع...");
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      setTimeout(() => {
        setVerificationStep('success');
        speakText("تم التحقق من بصمة الإصبع بنجاح. مرحباً بك");
        setScanProgress(0);
      }, 3500);

      setTimeout(() => {
        onVerified();
      }, 5500);

    } catch (error) {
      console.error('Error accessing fingerprint sensor:', error);
      setVerificationStep('failed');
      speakText("حدث خطأ في قراءة بصمة الإصبع. تأكد من وضع إصبعك بشكل صحيح على المستشعر");
      setScanProgress(0);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStep) {
      case 'scanning':
        return <Fingerprint className="w-16 h-16 text-primary animate-pulse" />;
      case 'processing':
        return <Shield className="w-16 h-16 text-accent animate-spin" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-success" />;
      case 'failed':
        return <XCircle className="w-16 h-16 text-destructive" />;
      default:
        return <Scan className="w-16 h-16 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (verificationStep) {
      case 'intro':
        return "اضغط على زر البدء للتحقق من بصمة الإصبع";
      case 'scanning':
        return "ضع إصبعك على المستشعر...";
      case 'processing':
        return "جاري التحقق من بصمة الإصبع...";
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
              <h1 className="text-2xl font-bold text-primary mr-4">التحقق من بصمة الإصبع</h1>
            </div>

            <motion.div
              animate={{ scale: verificationStep === 'scanning' ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 1, repeat: verificationStep === 'scanning' ? Infinity : 0 }}
              className="flex justify-center"
            >
              {getStatusIcon()}
            </motion.div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold">{getStatusText()}</h2>
              
              {verificationStep === 'intro' && (
                <p className="text-muted-foreground">
                  ضع إصبعك على مستشعر البصمة للتحقق من هويتك بشكل آمن
                </p>
              )}
              
              {verificationStep === 'scanning' && (
                <div className="bg-primary/10 rounded-lg p-4">
                  <p className="font-bold text-primary mb-2">جاري مسح بصمة الإصبع...</p>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-200" 
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{scanProgress}% مكتمل</p>
                </div>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              {verificationStep === 'intro' && (
                <>
                  <Button
                    onClick={startScanning}
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <Fingerprint className="w-5 h-5" />
                    بدء المسح
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
                      setIsScanning(false);
                      setScanProgress(0);
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

export default FingerprintVerification;