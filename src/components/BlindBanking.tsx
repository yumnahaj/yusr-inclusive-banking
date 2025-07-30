import { motion } from "framer-motion";
import { ArrowLeft, Volume2, Mic, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface BlindBankingProps {
  onBack: () => void;
}

const BlindBanking = ({ onBack }: BlindBankingProps) => {
  const [balance] = useState("12,345");
  const [isListening, setIsListening] = useState(false);

  const bankingOptions = [
    {
      icon: <Volume2 className="w-8 h-8" />,
      title: "كشف الحساب",
      description: "الاستماع لآخر العمليات",
      ariaLabel: "كشف الحساب - اضغط للاستماع للعمليات الأخيرة"
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "تحويل أموال",
      description: "أمر صوتي للتحويل",
      ariaLabel: "تحويل أموال - اضغط لبدء التحويل بالأمر الصوتي"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "رصيدي",
      description: "الاستماع للرصيد الحالي",
      ariaLabel: "رصيدي - اضغط للاستماع للرصيد الحالي"
    }
  ];

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleOptionClick = (title: string) => {
    switch (title) {
      case "رصيدي":
        speakText(`رصيدك الحالي ${balance} ريال سعودي`);
        break;
      case "كشف الحساب":
        speakText("آخر العمليات: تحويل 500 ريال إلى أحمد محمد، إيداع 1000 ريال، سحب 200 ريال من الصراف الآلي");
        break;
      case "تحويل أموال":
        speakText("قل اسم المستفيد والمبلغ. مثال: حول 100 ريال إلى سارة أحمد");
        setIsListening(true);
        setTimeout(() => setIsListening(false), 5000);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6" role="main" aria-label="واجهة البنك للمكفوفين">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            size="lg"
            className="flex items-center gap-2 text-xl p-6"
            aria-label="العودة للصفحة السابقة"
            onFocus={() => speakText("زر العودة")}
          >
            <ArrowLeft className="w-6 h-6" />
            العودة
          </Button>
          
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/6fba5ecd-28ee-4ef2-a788-da02b0dd1cf1.png" alt="يُسر" className="w-12 h-12" />
            <h1 className="text-3xl font-bold text-primary">يُسر للمكفوفين</h1>
          </div>
        </div>

        {/* Voice Status */}
        {isListening && (
          <div className="mb-6 text-center">
            <div className="bg-primary/20 rounded-xl p-4">
              <p className="text-primary font-bold text-xl">🎤 أستمع إليك الآن...</p>
            </div>
          </div>
        )}

        {/* Current Balance - Large and Prominent */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="mb-12"
        >
          <Card 
            className="text-center p-8 border-2 border-primary cursor-pointer hover:bg-primary/5"
            onClick={() => speakText(`رصيدك الحالي ${balance} ريال سعودي`)}
            role="button"
            tabIndex={0}
            aria-label={`رصيدك الحالي ${balance} ريال سعودي - اضغط للاستماع`}
            onFocus={() => speakText("رصيدك الحالي")}
          >
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-primary mb-4">الرصيد الحالي</h2>
              <p className="text-6xl font-bold text-primary">{balance}</p>
              <p className="text-xl text-muted-foreground mt-2">ريال سعودي</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Banking Options */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-primary mb-8">الخدمات البنكية</h2>
          
          {bankingOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
                <CardContent className="p-8">
                  <Button
                    onClick={() => handleOptionClick(option.title)}
                    className="w-full h-auto p-0 bg-transparent hover:bg-transparent text-foreground text-right"
                    aria-label={option.ariaLabel}
                    onFocus={() => speakText(option.title)}
                  >
                    <div className="flex items-center gap-6 w-full">
                      <div className="bg-primary/20 p-6 rounded-2xl text-primary flex-shrink-0">
                        {option.icon}
                      </div>
                      <div className="text-right flex-1">
                        <h3 className="text-2xl font-bold mb-2">{option.title}</h3>
                        <p className="text-muted-foreground text-lg">{option.description}</p>
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Help Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="bg-accent/20 rounded-xl p-6">
            <h3 className="font-bold text-primary mb-2">💡 تعليمات الاستخدام</h3>
            <p className="text-muted-foreground">
              اضغط على أي زر للاستماع للمحتوى • استخدم الأوامر الصوتية للتحكم • اضغط مرتين للتأكيد
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BlindBanking;