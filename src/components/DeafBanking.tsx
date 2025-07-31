import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, CreditCard, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import SignLanguageIcon from "./SignLanguageIcon";
import BalanceView from "./BalanceView";
import StatementView from "./StatementView";
import TransferView from "./TransferView";

interface DeafBankingProps {
  onBack: () => void;
}

const DeafBanking = ({ onBack }: DeafBankingProps) => {
  const [balance] = useState("12,345");
  const [showSignLanguageVideo, setShowSignLanguageVideo] = useState(false);
  const [currentView, setCurrentView] = useState<"main" | "balance" | "statement" | "transfer">("main");

  if (currentView === "balance") {
    return <BalanceView onBack={() => setCurrentView("main")} balance={balance} />;
  }

  if (currentView === "statement") {
    return <StatementView onBack={() => setCurrentView("main")} />;
  }

  if (currentView === "transfer") {
    return <TransferView onBack={() => setCurrentView("main")} />;
  }

  const bankingOptions = [
    {
      icon: <CreditCard className="w-8 h-8" />,
      signIcon: "balance",
      title: "رصيدي الحالي",
      description: "عرض الرصيد مع فيديو لغة الإشارة",
      color: "from-blue-500 to-blue-600",
      action: "balance"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      signIcon: "statement",
      title: "كشف الحساب",
      description: "عرض العمليات مع الشرح بلغة الإشارة",
      color: "from-green-500 to-green-600",
      action: "statement"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      signIcon: "transfer",
      title: "تحويل أموال",
      description: "نموذج تحويل مع فيديو توضيحي",
      color: "from-purple-500 to-purple-600",
      action: "transfer"
    },
    {
      icon: <Settings className="w-8 h-8" />,
      signIcon: "help",
      title: "مساعدة فورية",
      description: "محادثة نصية أو فيديو بلغة الإشارة",
      color: "from-orange-500 to-orange-600",
      action: "help"
    }
  ];

  const handleOptionClick = (action: string) => {
    setShowSignLanguageVideo(true);
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    
    setTimeout(() => {
      setShowSignLanguageVideo(false);
      switch (action) {
        case "balance":
          setCurrentView("balance");
          break;
        case "statement":
          setCurrentView("statement");
          break;
        case "transfer":
          setCurrentView("transfer");
          break;
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg sm:max-w-xl md:max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex justify-end mb-4">
            <Button
              onClick={onBack}
              variant="outline"
              size="lg"
              className="flex items-center gap-2 text-sm sm:text-base md:text-xl p-3 sm:p-4 md:p-6 min-h-[44px]"
              aria-label="العودة للصفحة السابقة"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              العودة
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <img src="/lovable-uploads/195fdd24-a424-43bb-b88e-b79ef654b40e.png" alt="يُسر" className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16" />
            <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-primary text-center">يُسر للصم والبكم</h1>
          </div>
        </div>

        {/* Sign Language Video Area */}
        {showSignLanguageVideo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <Card className="bg-primary/10 border-primary">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/20 rounded-xl p-8 mb-4">
                  <div className="w-32 h-24 mx-auto bg-primary/30 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">🤟</span>
                  </div>
                </div>
                <p className="text-primary font-bold text-xl">فيديو لغة الإشارة قيد التشغيل</p>
                <p className="text-muted-foreground">شرح الخدمة المطلوبة بلغة الإشارة</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Current Balance Display */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="mb-6 sm:mb-8 md:mb-12 mx-1 sm:mx-0"
        >
          <Card 
            className="text-center p-4 sm:p-6 md:p-8 border-2 border-primary cursor-pointer hover:bg-primary/5 transition-all duration-300"
            onClick={() => handleOptionClick("balance")}
          >
            <CardContent className="p-3 sm:p-4 md:p-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-3 sm:mb-4">💰 الرصيد الحالي</h2>
              <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-2 break-all">{balance}</p>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground">ريال سعودي</p>
              <div className="mt-3 sm:mt-4 flex justify-center">
                <SignLanguageIcon type="balance" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Banking Options */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6 mx-1 sm:mx-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-primary mb-4 sm:mb-6 md:mb-8">🏦 الخدمات البنكية</h2>
          
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
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <Button
                    onClick={() => handleOptionClick(option.action)}
                    className="w-full h-auto p-0 bg-transparent hover:bg-transparent text-foreground min-h-[80px] sm:min-h-[100px]"
                    aria-label={option.title}
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6 w-full">
                      <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                        <SignLanguageIcon type={option.signIcon as any} className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                        <div className={`bg-gradient-to-br ${option.color} p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl text-white shadow-lg flex-shrink-0 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24`}>
                          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">{option.icon}</div>
                        </div>
                      </div>
                      <div className="text-center sm:text-right flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 leading-tight">{option.title}</h3>
                        
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Visual Feedback & Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 sm:mt-8 md:mt-12 space-y-3 sm:space-y-4 mx-1 sm:mx-0"
        >
          <div className="bg-accent/20 rounded-xl p-4 sm:p-6 text-center">
            <h3 className="font-bold text-primary mb-2 text-sm sm:text-base">📱 تعليمات الاستخدام</h3>
            <p className="text-muted-foreground text-xs sm:text-sm leading-tight">
              👆 اضغط على أي خدمة لمشاهدة فيديو لغة الإشارة • 📳 اهتزاز للتأكيد • 💬 محادثة نصية متاحة
            </p>
          </div>
          
          <div className="bg-primary/10 rounded-xl p-4 sm:p-6 text-center">
            <h3 className="font-bold text-primary mb-2 text-sm sm:text-base">🎥 مترجم لغة الإشارة</h3>
            <p className="text-muted-foreground text-xs sm:text-sm leading-tight">
              جميع العمليات البنكية مدعومة بفيديو توضيحي بلغة الإشارة السعودية
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DeafBanking;