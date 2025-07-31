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
      title: "المكفوفين",
      description: "تحكم صوتي كامل وقراءة واضحة",
      onClick: onSelectBlind,
      color: "from-indigo-500 to-purple-600"
    },
    {
      icon: <EarOff className="w-12 h-12" />,
      title: "الصم والبكم", 
      description: "لغة الإشارة ومحادثة نصية",
      onClick: onSelectDeaf,
      color: "from-teal-500 to-cyan-600"
    },
    {
      icon: <HandHeart className="w-12 h-12" />,
      title: "ذوي الإعاقة الحركية",
      description: "تحكم بالصوت والإيماءات",
      onClick: onSelectMobility,
      color: "from-rose-500 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6,
          // WCAG 2.1 - Respect reduced motion preference
          ...(window.matchMedia('(prefers-reduced-motion: reduce)').matches && {
            duration: 0.01
          })
        }}
        className="max-w-lg sm:max-w-2xl mx-auto"
        role="navigation"
        aria-label="خيارات الوصولية"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            size="lg"
            className="flex items-center gap-2 btn-accessible text-sm sm:text-base px-3 sm:px-4"
            aria-label="العودة إلى الصفحة الرئيسية"
            role="button"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            العودة
          </Button>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <img 
              src="/lovable-uploads/6fba5ecd-28ee-4ef2-a788-da02b0dd1cf1.png" 
              alt="شعار تطبيق يُسر البنكي" 
              className="w-6 h-6 sm:w-8 sm:h-8"
              role="img"
            />
            <h1 className="text-xl sm:text-2xl font-bold text-primary" id="page-title">يُسر</h1>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8 sm:mb-12 px-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3 sm:mb-4 leading-tight" id="section-title">اختر نوع المساعدة</h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed" role="doc-subtitle">
            صُممت واجهاتنا خصيصاً لتناسب احتياجاتك
          </p>
        </div>

        {/* Accessibility Options */}
        <div className="space-y-4 sm:space-y-6" role="menu" aria-labelledby="section-title">
          {accessibilityOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2,
                // WCAG 2.1 - Respect reduced motion
                ...(window.matchMedia('(prefers-reduced-motion: reduce)').matches && {
                  duration: 0.01,
                  delay: 0
                })
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              // WCAG 2.1 - Disable hover/tap effects for reduced motion
              {...(window.matchMedia('(prefers-reduced-motion: reduce)').matches && {
                whileHover: {},
                whileTap: {}
              })}
            >
              <Button
                onClick={option.onClick}
                className="w-full h-auto p-4 sm:p-6 bg-transparent hover:bg-accent/10 text-foreground btn-accessible rounded-2xl border-0 transition-all duration-300 hover:scale-[1.02] min-h-[80px] sm:min-h-[100px]"
                aria-label={`${option.title} - ${option.description}`}
                role="menuitem"
                tabIndex={0}
              >
                <div className="flex items-center gap-4 sm:gap-6 w-full">
                  <div className={`bg-gradient-to-br ${option.color} p-3 sm:p-4 rounded-2xl text-white shadow-lg flex-shrink-0`}>
                    <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center">
                      {option.icon}
                    </div>
                  </div>
                  <div className="text-right flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-foreground truncate" id={`option-${index}-title`}>
                      {option.title}
                    </h3>
                    <p 
                      className="text-muted-foreground text-sm sm:text-base leading-tight" 
                      id={`option-${index}-description`}
                      aria-describedby={`option-${index}-title`}
                    >
                      {option.description}
                    </p>
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Help Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            delay: 0.8,
            // WCAG 2.1 - Respect reduced motion
            ...(window.matchMedia('(prefers-reduced-motion: reduce)').matches && {
              delay: 0
            })
          }}
          className="mt-12 text-center"
          role="complementary"
          aria-label="معلومات المساعدة"
        >
          <div className="bg-accent/20 rounded-xl p-6">
            <h3 className="font-bold text-primary mb-2" id="help-title">
              <span aria-hidden="true">💡</span> هل تحتاج مساعدة؟
            </h3>
            <p 
              className="text-muted-foreground text-sm"
              aria-describedby="help-title"
            >
              يمكنك التبديل بين الواجهات في أي وقت من خلال الإعدادات
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AccessibilityNavigation;