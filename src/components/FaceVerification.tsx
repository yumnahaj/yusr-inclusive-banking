import { motion } from "framer-motion";
import { Camera, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface FaceVerificationProps {
  onSuccess: () => void;
  onCancel: () => void;
  title: string;
}

const FaceVerification = ({ onSuccess, onCancel, title }: FaceVerificationProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);

  useEffect(() => {
    // Auto start verification after component mounts
    const timer = setTimeout(() => {
      setIsVerifying(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVerifying) {
      // Simulate face verification process
      const verificationTimer = setTimeout(() => {
        setIsVerifying(false);
        setVerificationComplete(true);
        
        // Auto proceed after success
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }, 3000);

      return () => clearTimeout(verificationTimer);
    }
  }, [isVerifying, onSuccess]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <Card className="text-center border-2 border-primary">
          <CardContent className="p-8">
            <div className="mb-6">
              <img src="/lovable-uploads/6fba5ecd-28ee-4ef2-a788-da02b0dd1cf1.png" alt="يُسر" className="w-20 h-20 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-primary mb-2">{title}</h1>
              <p className="text-muted-foreground">التحقق من بصمة الوجه</p>
            </div>

            <div className="mb-8">
              <div className="w-32 h-32 mx-auto border-4 border-primary rounded-full flex items-center justify-center mb-4 relative overflow-hidden">
                {!isVerifying && !verificationComplete && (
                  <Camera className="w-12 h-12 text-primary" />
                )}
                
                {isVerifying && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
                  />
                )}
                
                {verificationComplete && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-8 h-8 text-white" />
                  </motion.div>
                )}
              </div>

              {!isVerifying && !verificationComplete && (
                <p className="text-muted-foreground">انظر إلى الكاميرا للتحقق من هويتك</p>
              )}
              
              {isVerifying && (
                <p className="text-primary font-bold">جاري التحقق من بصمة الوجه...</p>
              )}
              
              {verificationComplete && (
                <p className="text-green-600 font-bold">تم التحقق بنجاح!</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                onClick={onCancel}
                variant="outline"
                className="flex-1"
                disabled={isVerifying}
              >
                <X className="w-4 h-4 ml-2" />
                إلغاء
              </Button>
              
              {!isVerifying && !verificationComplete && (
                <Button
                  onClick={() => setIsVerifying(true)}
                  className="flex-1 gradient-primary text-white border-0"
                >
                  <Camera className="w-4 h-4 ml-2" />
                  بدء التحقق
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default FaceVerification;