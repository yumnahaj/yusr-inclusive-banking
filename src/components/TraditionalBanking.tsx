import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, FileText, DollarSign, MapPin, Settings, Phone, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, cloneElement } from "react";
import BalanceView from "./BalanceView";
import StatementView from "./StatementView";
import TransferView from "./TransferView";

interface TraditionalBankingProps {
  onBack: () => void;
}

const TraditionalBanking = ({ onBack }: TraditionalBankingProps) => {
  const [currentView, setCurrentView] = useState<"main" | "balance" | "statement" | "transfer">("main");
  const [balance] = useState("12,450");

  if (currentView === "balance") {
    return <BalanceView onBack={() => setCurrentView("main")} balance={balance} />;
  }

  if (currentView === "statement") {
    return <StatementView onBack={() => setCurrentView("main")} />;
  }

  if (currentView === "transfer") {
    return <TransferView onBack={() => setCurrentView("main")} />;
  }

  const bankingServices = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "تحويل أموال",
      description: "تحويل سريع وآمن",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      action: () => setCurrentView("transfer")
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "كشف حساب",
      description: "عرض العمليات الأخيرة",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      action: () => setCurrentView("statement")
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "الرصيد الحالي",
      description: `${balance} ريال سعودي`,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      action: () => setCurrentView("balance")
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "الفروع والصرافات",
      description: "اقرب فرع أو صراف",
      color: "bg-gradient-to-br from-orange-500 to-orange-600"
    },
    {
      icon: <Banknote className="w-8 h-8" />,
      title: "الزكاة والتبرعات",
      description: "تحويل للمواقع الرسمية",
      color: "bg-gradient-to-br from-amber-500 to-amber-600"
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "الإعدادات",
      description: "إعدادات الحساب",
      color: "bg-gradient-to-br from-gray-500 to-gray-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg sm:max-w-2xl lg:max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 md:mb-8 gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            size="lg"
            className="flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            العودة
          </Button>
          
          <div className="flex items-center gap-2 sm:gap-3 order-first sm:order-last">
            <img src="/lovable-uploads/195fdd24-a424-43bb-b88e-b79ef654b40e.png" alt="يُسر" className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">يُسر</h1>
          </div>
        </div>

        {/* Welcome Section */}
        <Card className="mb-4 sm:mb-6 md:mb-8 gradient-primary text-white border-0 mx-1 sm:mx-0">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">أهلاً وسهلاً، محمد</h2>
              <p className="text-white/80 text-sm sm:text-base">كيف يمكننا مساعدتك اليوم؟</p>
            </motion.div>
          </CardContent>
        </Card>

        {/* Banking Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 px-1 sm:px-0">
          {bankingServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 min-h-[140px] sm:min-h-[160px]"
                onClick={service.action}
              >
                <CardContent className="p-3 sm:p-4 md:p-6 text-center flex flex-col justify-center h-full">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full ${service.color} flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 text-white shadow-lg`}>
                    {cloneElement(service.icon, { className: "w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" })}
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2 text-foreground leading-tight">{service.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-tight">{service.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-4 sm:mt-6 md:mt-8 mx-1 sm:mx-0"
        >
          <Card className="border-dashed border-2 border-muted-foreground/30">
            <CardContent className="p-4 sm:p-6 text-center">
              <Phone className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mx-auto mb-2 sm:mb-3 text-primary" />
              <h3 className="font-bold mb-1 sm:mb-2 text-sm sm:text-base">دعم فني</h3>
              <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 leading-tight">
                هل تحتاج مساعدة؟ فريق الدعم متاح ٢٤/٧
              </p>
              <Button className="btn-accessible gradient-primary text-white border-0 text-sm sm:text-base px-4 sm:px-6 py-2 min-h-[44px]">
                تواصل معنا
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TraditionalBanking;