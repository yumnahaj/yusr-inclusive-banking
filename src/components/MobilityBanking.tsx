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
  const [showBalance, setShowBalance] = useState(false);
  const [showStatement, setShowStatement] = useState(false);
  const [transactions] = useState([
    { date: "2024-01-15", description: "تحويل إلى أحمد محمد", amount: "-500" },
    { date: "2024-01-14", description: "إيداع راتب", amount: "+3000" },
    { date: "2024-01-13", description: "سحب من الصراف", amount: "-200" },
  ]);

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
      voiceCommand: "أعرض رصيدي",
      gesture: "انظر للشاشة لمدة 3 ثوان",
      action: "balance"
    },
    {
      icon: <FileText className="w-12 h-12" />,
      title: "كشف الحساب",
      description: "آخر العمليات البنكية",
      voiceCommand: "افتح كشف الحساب",
      gesture: "حرك رأسك لليمين ثم للأعلى",
      action: "statement"
    },
    {
      icon: <Mic className="w-12 h-12" />,
      title: "تحويل أموال",
      description: "تحويل بالأمر الصوتي",
      voiceCommand: "حول أموال",
      gesture: "أشر بإصبعك نحو الشاشة",
      action: "transfer"
    }
  ];

  const handleVoiceCommand = (action: string) => {
    setIsListening(true);
    
    // Simulate vibration feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
    
    switch (action) {
      case "balance":
        setShowBalance(true);
        setShowStatement(false);
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(`رصيدك الحالي ${balance} ريال سعودي`);
          utterance.lang = 'ar-SA';
          speechSynthesis.speak(utterance);
        }
        break;
      case "statement":
        setShowStatement(true);
        setShowBalance(false);
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(`تم فتح كشف الحساب`);
          utterance.lang = 'ar-SA';
          speechSynthesis.speak(utterance);
        }
        break;
      case "transfer":
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(`قل اسم المستفيد والمبلغ`);
          utterance.lang = 'ar-SA';
          speechSynthesis.speak(utterance);
        }
        break;
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
            <img src="/lovable-uploads/195fdd24-a424-43bb-b88e-b79ef654b40e.png" alt="يُسر" className="w-16 h-16" />
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
            onClick={() => handleVoiceCommand("balance")}
            role="button"
            tabIndex={0}
          >
            <CardContent className="p-6">
              <h2 className="text-3xl font-bold text-primary mb-6">💰 الرصيد الحالي</h2>
              <p className="text-8xl font-bold text-primary mb-4">{balance}</p>
              <p className="text-2xl text-muted-foreground">ريال سعودي</p>
              <div className="mt-6">
                <p className="text-lg text-muted-foreground">
                  {controlMethod === "voice" && "قل: 'أعرض رصيدي'"}
                  {controlMethod === "eye" && "انظر للشاشة لمدة 3 ثوان"}
                  {controlMethod === "gesture" && "أشر بإصبعك نحو الشاشة"}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Balance Details */}
        {showBalance && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-2 border-green-500 bg-green-50">
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-green-700">تفاصيل الرصيد</h3>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setShowBalance(false)}
                  >
                    إغلاق
                  </Button>
                </div>
                <div className="space-y-4 text-xl">
                  <div className="flex justify-between">
                    <span>الرصيد المتاح:</span>
                    <span className="font-bold text-green-600">{balance} ريال</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الرصيد المحجوز:</span>
                    <span className="font-bold text-orange-600">0 ريال</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Statement Details */}
        {showStatement && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-2 border-blue-500 bg-blue-50">
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-blue-700">كشف الحساب</h3>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setShowStatement(false)}
                  >
                    إغلاق
                  </Button>
                </div>
                <div className="space-y-4">
                  {transactions.map((transaction, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-white rounded-lg text-lg">
                      <div>
                        <p className="font-semibold">{transaction.description}</p>
                        <p className="text-muted-foreground">{transaction.date}</p>
                      </div>
                      <span className={`font-bold ${
                        transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount} ريال
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

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
                    onClick={() => handleVoiceCommand(option.action)}
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
                        <div className="space-y-2">
                          <p className="text-primary font-semibold text-lg">
                            🎤 صوتي: "{option.voiceCommand}"
                          </p>
                          <p className="text-blue-600 font-semibold text-lg">
                            👁️ بصري: {option.gesture}
                          </p>
                        </div>
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