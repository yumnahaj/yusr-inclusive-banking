import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BalanceViewProps {
  onBack: () => void;
  balance: string;
}

const BalanceView = ({ onBack, balance }: BalanceViewProps) => {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg sm:max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            size="lg"
            className="flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            العودة
          </Button>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <img src="/lovable-uploads/195fdd24-a424-43bb-b88e-b79ef654b40e.png" alt="يُسر" className="w-10 h-10 sm:w-16 sm:h-16" />
            <h1 className="text-lg sm:text-2xl font-bold text-primary">الرصيد الحالي</h1>
          </div>
        </div>

        <Card className="text-center gradient-primary text-white border-0 mx-2 sm:mx-0">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl px-2">رصيدك الحالي</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-3 sm:mb-4 break-all leading-tight px-2">
              {balance}
            </div>
            <div className="text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6">ريال سعودي</div>
            <div className="text-sm sm:text-base text-white/80 px-2 leading-relaxed">
              آخر تحديث: اليوم {new Date().toLocaleTimeString('ar-SA')}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BalanceView;