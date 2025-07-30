import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, FileText, DollarSign, MapPin, Settings, Phone, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
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
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة
          </Button>
          
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/6fba5ecd-28ee-4ef2-a788-da02b0dd1cf1.png" alt="يُسر" className="w-12 h-12" />
            <h1 className="text-2xl font-bold text-primary">يُسر</h1>
          </div>
        </div>

        {/* Welcome Section */}
        <Card className="mb-8 gradient-primary text-white border-0">
          <CardContent className="p-8">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-2">أهلاً وسهلاً، محمد</h2>
              <p className="text-white/80">كيف يمكننا مساعدتك اليوم؟</p>
            </motion.div>
          </CardContent>
        </Card>

        {/* Banking Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20"
                onClick={service.action}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full ${service.color} flex items-center justify-center mx-auto mb-4 text-white shadow-lg`}>
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
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
          className="mt-8"
        >
          <Card className="border-dashed border-2 border-muted-foreground/30">
            <CardContent className="p-6 text-center">
              <Phone className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-bold mb-2">دعم فني</h3>
              <p className="text-muted-foreground text-sm mb-4">
                هل تحتاج مساعدة؟ فريق الدعم متاح ٢٤/٧
              </p>
              <Button className="btn-accessible gradient-primary text-white border-0">
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