import { motion } from "framer-motion";
import { Building2, Accessibility, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import yusrLogo from "@/assets/yusr-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

interface MainNavigationProps {
  onSelectBanking: () => void;
  onSelectAccessibility: () => void;
}

const MainNavigation = ({ onSelectBanking, onSelectAccessibility }: MainNavigationProps) => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4 sm:p-6">
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
        className="max-w-sm sm:max-w-md w-full text-center px-2"
        role="navigation"
        aria-label="القائمة الرئيسية"
        id="main-navigation"
      >
        <img 
          src="/lovable-uploads/195fdd24-a424-43bb-b88e-b79ef654b40e.png" 
          alt="شعار تطبيق يُسر البنكي الرقمي" 
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-8 sm:mb-10"
          role="img"
        />
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 sm:mb-6 font-bold leading-tight" id="page-title">
          {t('main.welcome')} <span className="text-primary">يُسر</span>
        </h1>
        <p className="text-white/80 text-lg sm:text-xl lg:text-2xl mb-10 sm:mb-14 px-2" role="doc-subtitle">
          {t('main.accessibility.desc')}
        </p>

        <div className="space-y-6 sm:space-y-8" role="menu" aria-label="خيارات الدخول">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            // WCAG 2.1 - Respect reduced motion
            {...(window.matchMedia('(prefers-reduced-motion: reduce)').matches && {
              whileHover: {},
              whileTap: {}
            })}
          >
            <div
              onClick={onSelectBanking}
              className="w-full h-auto p-6 sm:p-8 md:p-10 bg-transparent text-white btn-accessible min-h-[80px] sm:min-h-[100px] cursor-pointer"
              aria-label="الدخول للبنك التقليدي - الخدمات البنكية العادية"
              role="menuitem"
              tabIndex={0}
            >
              <div className="flex items-center gap-4 sm:gap-6 w-full">
                <Building2 className="w-8 h-8 sm:w-12 sm:h-12 flex-shrink-0" />
                <div className="text-right flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 truncate">{t('main.traditional')}</h3>
                  <p className="text-white/70 text-lg sm:text-xl leading-tight">{t('main.traditional.desc')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              onClick={onSelectAccessibility}
              className="w-full h-auto p-6 sm:p-8 md:p-10 bg-transparent text-white btn-accessible min-h-[80px] sm:min-h-[100px] cursor-pointer"
              aria-label="الدخول لواجهة ذوي الهمم - خدمات متخصصة وسهلة الوصول"
              role="menuitem"
              tabIndex={0}
            >
              <div className="flex items-center gap-4 sm:gap-6 w-full">
                <Accessibility className="w-8 h-8 sm:w-12 sm:h-12 flex-shrink-0" />
                <div className="text-right flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 truncate">{t('main.accessibility')}</h3>
                  <p className="text-white/70 text-lg sm:text-xl leading-tight">{t('main.accessibility.desc')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 pt-6 border-t border-white/20"
          >
            <div className="flex items-center justify-center gap-2 text-white/60">
              <Shield className="w-4 h-4" />
              <span className="text-sm">{t('main.security')}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default MainNavigation;