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
    <div className="min-h-screen bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
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
            <h1 className="text-2xl font-bold text-primary">الرصيد الحالي</h1>
          </div>
        </div>

        <Card className="text-center gradient-primary text-white border-0">
          <CardHeader>
            <CardTitle className="text-3xl">رصيدك الحالي</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-8xl font-bold mb-4">{balance}</div>
            <div className="text-2xl">ريال سعودي</div>
            <div className="mt-6 text-white/80">
              آخر تحديث: اليوم {new Date().toLocaleTimeString('ar-SA')}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BalanceView;