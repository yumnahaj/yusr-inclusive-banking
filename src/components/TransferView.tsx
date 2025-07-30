import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TransferViewProps {
  onBack: () => void;
}

const TransferView = ({ onBack }: TransferViewProps) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTransfer = async () => {
    if (!recipient || !amount) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate transfer process
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "تم التحويل بنجاح",
        description: `تم تحويل ${amount} ريال إلى ${recipient}`,
      });
      setRecipient("");
      setAmount("");
    }, 2000);
  };

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
            <h1 className="text-2xl font-bold text-primary">تحويل أموال</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">تحويل أموال سريع وآمن</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="recipient" className="text-lg font-bold">اسم المستفيد</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="أدخل اسم المستفيد"
                className="mt-2 text-lg p-4"
              />
            </div>

            <div>
              <Label htmlFor="amount" className="text-lg font-bold">المبلغ (ريال سعودي)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="أدخل المبلغ"
                className="mt-2 text-lg p-4"
              />
            </div>

            <Button
              onClick={handleTransfer}
              disabled={isLoading}
              className="w-full gradient-primary text-white border-0 text-lg p-6"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري التحويل...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  تحويل الآن
                </div>
              )}
            </Button>

            <div className="bg-accent/20 rounded-lg p-4 text-center">
              <p className="text-muted-foreground">
                سيتم خصم المبلغ فوراً من حسابك وإيداعه في حساب المستفيد
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TransferView;