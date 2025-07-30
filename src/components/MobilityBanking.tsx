import { motion } from "framer-motion";
import { ArrowLeft, Mic, Eye, Hand, CreditCard, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface MobilityBankingProps {
  onBack: () => void;
}

const MobilityBanking = ({ onBack }: MobilityBankingProps) => {
  const [balance] = useState("12,345");
  const [controlMethod, setControlMethod] = useState<"voice" | "eye" | "gesture">("voice");
  const [isListening, setIsListening] = useState(false);

  const controlMethods = [
    {
      type: "voice" as const,
      icon: <Mic className="w-6 h-6" />,
      title: "🎤 تحكم صوتي",
      description: "استخدم صوتك للتحكم"
    },
    {
      type: "eye" as const,
      icon: <Eye className="w-6 h-6" />,
      title: "👁️ تتبع العين",
      description: "تحكم بحركة العين"
    },
    {
      type: "gesture" as const,
      icon: <Hand className="w-6 h-6" />,
      title: "🤚 إيماءات اليد",
      description: "تحكم بإيماءات بسيطة"
    }
  ];

  const bankingOptions = [
    {
      icon: <CreditCard className="w-12 h-12" />,
      title: "رصيدي الحالي",
      description: "عرض الرصيد الحالي",
      voiceCommand: "أعرض رصيدي"
    },
    {
      icon: <FileText className="w-12 h-12" />,
      title: "كشف الحساب",
      description: "آخر العمليات البنكية",
      voiceCommand: "افتح كشف الحساب"
    },
    {
      icon: <Mic className="w-12 h-12" />,
      title: "تحويل أموال",
      description: "تحويل بالأمر الصوتي",
      voiceCommand: "حول أموال"
    }
  ];

  const handleVoiceCommand = (command: string) => {
    setIsListening(true);
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`تم تنفيذ أمر: ${command}`);
      utterance.lang = 'ar-SA';
      speechSynthesis.speak(utterance);
    }
    
    // Simulate vibration feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
    
    setTimeout(() => setIsListening(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            size="lg"
            className="flex items-center gap-2 text-xl p-6"
            aria-label="العودة للصفحة السابقة"
          >
            <ArrowLeft className="w-6 h-6" />
            العودة
          </Button>
          
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/6fba5ecd-28ee-4ef2-a788-da02b0dd1cf1.png" alt="يُسر" className="w-12 h-12" />
            <h1 className="text-3xl font-bold text-primary">يُسر لذوي الإعاقة الحركية</h1>
          </div>
        </div>

        {/* Control Method Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-primary mb-4 text-center">🎛️ اختر طريقة التحكم</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {controlMethods.map((method) => (
              <Button
                key={method.type}
                onClick={() => setControlMethod(method.type)}
                variant={controlMethod === method.type ? "default" : "outline"}
                className="h-auto p-4 text-right"
              >
                <div className="flex items-center gap-3 w-full">
                  {method.icon}
                  <div>
                    <p className="font-bold">{method.title}</p>
                    <p className="text-sm opacity-70">{method.description}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Voice Status */}
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <Card className="bg-primary/10 border-primary">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-3">
                  <Mic className="w-8 h-8 text-primary animate-pulse" />
                  <p className="text-primary font-bold text-xl">
                    {controlMethod === "voice" ? "🎤 أستمع إليك..." : 
                     controlMethod === "eye" ? "👁️ أتتبع عينيك..." : 
                     "🤚 أراقب إيماءاتك..."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Current Balance - Extra Large for Easy Access */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="mb-12"
        >
          <Card 
            className="text-center p-12 border-4 border-primary cursor-pointer hover:bg-primary/5 transition-all duration-300"
            onClick={() => handleVoiceCommand("عرض الرصيد")}
            role="button"
            tabIndex={0}
          >
            <CardContent className="p-6">
              <h2 className="text-3xl font-bold text-primary mb-6">💰 الرصيد الحالي</h2>
              <p className="text-8xl font-bold text-primary mb-4">{balance}</p>
              <p className="text-2xl text-muted-foreground">ريال سعودي</p>
              <div className="mt-6">
                <p className="text-lg text-muted-foreground">
                  قل: "أعرض رصيدي" أو انقر مرة واحدة
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Banking Options - Large and Spaced */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center text-primary mb-8">🏦 الخدمات البنكية</h2>
          
          {bankingOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border-3 hover:border-primary">
                <CardContent className="p-12">
                  <Button
                    onClick={() => handleVoiceCommand(option.title)}
                    className="w-full h-auto p-0 bg-transparent hover:bg-transparent text-foreground"
                    aria-label={`${option.title} - ${option.voiceCommand}`}
                  >
                    <div className="flex items-center gap-8 w-full">
                      <div className="bg-primary/20 p-8 rounded-3xl text-primary flex-shrink-0">
                        {option.icon}
                      </div>
                      <div className="text-right flex-1">
                        <h3 className="text-3xl font-bold mb-3">{option.title}</h3>
                        <p className="text-muted-foreground text-xl mb-2">{option.description}</p>
                        <p className="text-primary font-semibold text-lg">
                          🎤 قل: "{option.voiceCommand}"
                        </p>
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Control Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 space-y-6"
        >
          <div className="bg-accent/20 rounded-xl p-8">
            <h3 className="font-bold text-primary mb-4 text-2xl text-center">🎛️ تعليمات التحكم</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Mic className="w-12 h-12 text-primary mx-auto mb-3" />
                <h4 className="font-bold text-lg mb-2">التحكم الصوتي</h4>
                <p className="text-muted-foreground">استخدم الأوامر الصوتية المكتوبة تحت كل خدمة</p>
              </div>
              <div>
                <Eye className="w-12 h-12 text-primary mx-auto mb-3" />
                <h4 className="font-bold text-lg mb-2">تتبع العين</h4>
                <p className="text-muted-foreground">انظر للخدمة لمدة 3 ثوان لتنفيذها</p>
              </div>
              <div>
                <Hand className="w-12 h-12 text-primary mx-auto mb-3" />
                <h4 className="font-bold text-lg mb-2">الإيماءات</h4>
                <p className="text-muted-foreground">استخدم إيماءات بسيطة أمام الكاميرا</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MobilityBanking;