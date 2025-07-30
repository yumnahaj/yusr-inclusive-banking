import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatementViewProps {
  onBack: () => void;
}

const StatementView = ({ onBack }: StatementViewProps) => {
  const transactions = [
    { date: "2024-01-30", description: "تحويل إلى أحمد محمد", amount: "-500", type: "out" },
    { date: "2024-01-29", description: "إيداع راتب", amount: "+5000", type: "in" },
    { date: "2024-01-28", description: "سحب من الصراف الآلي", amount: "-200", type: "out" },
    { date: "2024-01-27", description: "شراء من متجر السلام", amount: "-150", type: "out" },
    { date: "2024-01-26", description: "تحويل من سارة أحمد", amount: "+300", type: "in" }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
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
            <img src="/lovable-uploads/195fdd24-a424-43bb-b88e-b79ef654b40e.png" alt="يُسر" className="w-16 h-16" />
            <h1 className="text-2xl font-bold text-primary">كشف الحساب</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">آخر العمليات البنكية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-r-4 ${
                    transaction.type === 'in' 
                      ? 'border-green-500 bg-green-50 dark:bg-green-950' 
                      : 'border-red-500 bg-red-50 dark:bg-red-950'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-lg">{transaction.description}</div>
                      <div className="text-muted-foreground">{transaction.date}</div>
                    </div>
                    <div className={`text-2xl font-bold ${
                      transaction.type === 'in' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount} ر.س
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default StatementView;