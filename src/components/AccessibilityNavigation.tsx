import { motion } from "framer-motion";
import { ArrowLeft, Eye, EarOff, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import yusrLogo from "@/assets/yusr-logo.png";

interface AccessibilityNavigationProps {
  onBack: () => void;
  onSelectBlind: () => void;
  onSelectDeaf: () => void;
  onSelectMobility: () => void;
}

const AccessibilityNavigation = ({ 
  onBack, 
  onSelectBlind, 
  onSelectDeaf, 
  onSelectMobility 
}: AccessibilityNavigationProps) => {
  
  const accessibilityOptions = [
    {
      icon: <Eye className="w-12 h-12" />,
      title: "🧑‍🦯 واجهة المكفوفين",
      description: "تحكم صوتي كامل وقراءة واضحة",
      onClick: onSelectBlind,
      color: "from-indigo-500 to-purple-600"
    },
    {
      icon: <EarOff className="w-12 h-12" />,
      title: "🧏‍♂️ واجهة الصم والبكم", 
      description: "لغة الإشارة ومحادثة نصية",
      onClick: onSelectDeaf,
      color: "from-teal-500 to-cyan-600"
    },
    {
      icon: <HandHeart className="w-12 h-12" />,
      title: "🧑‍🦽 واجهة ذوي الإعاقة الحركية",
      description: "تحكم بالصوت والإيماءات",
      onClick: onSelectMobility,
      color: "from-rose-500 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
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
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة
          </Button>
          
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/6fba5ecd-28ee-4ef2-a788-da02b0dd1cf1.png" alt="يُسر" className="w-8 h-8" />
            <h1 className="text-2xl font-bold text-primary">يُسر</h1>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-primary mb-4">اختر نوع المساعدة</h1>
          <p className="text-muted-foreground text-lg">
            صُممت واجهاتنا خصيصاً لتناسب احتياجاتك
          </p>
        </div>

        {/* Accessibility Options */}
        <div className="space-y-6">
          {accessibilityOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30">
                <CardContent className="p-8">
                  <Button
                    onClick={option.onClick}
                    className="w-full h-auto p-0 bg-transparent hover:bg-transparent text-foreground"
                    aria-label={option.title}
                  >
                    <div className="flex items-center gap-6 w-full">
                      <div className={`bg-gradient-to-br ${option.color} p-4 rounded-2xl text-white shadow-lg flex-shrink-0`}>
                        {option.icon}
                      </div>
                      <div className="text-right flex-1">
                        <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                        <p className="text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Help Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="bg-accent/20 rounded-xl p-6">
            <h3 className="font-bold text-primary mb-2">💡 هل تحتاج مساعدة؟</h3>
            <p className="text-muted-foreground text-sm">
              يمكنك التبديل بين الواجهات في أي وقت من خلال الإعدادات
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AccessibilityNavigation;