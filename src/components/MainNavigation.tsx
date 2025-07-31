import { motion } from "framer-motion";
import { Building2, Accessibility, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import yusrLogo from "@/assets/yusr-logo.png";

interface MainNavigationProps {
  onSelectBanking: () => void;
  onSelectAccessibility: () => void;
}

const MainNavigation = ({ onSelectBanking, onSelectAccessibility }: MainNavigationProps) => {
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
          className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 mx-auto mb-6 sm:mb-8"
          role="img"
        />
        
        <h1 className="text-2xl sm:text-3xl md:text-hero text-white mb-3 sm:mb-4 font-bold leading-tight" id="page-title">مرحباً بك في يُسر</h1>
        <p className="text-white/80 text-base sm:text-lg mb-8 sm:mb-12 px-2" role="doc-subtitle">اختر طريقة الدخول المناسبة لك</p>

        <div className="space-y-4 sm:space-y-6" role="menu" aria-label="خيارات الدخول">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            // WCAG 2.1 - Respect reduced motion
            {...(window.matchMedia('(prefers-reduced-motion: reduce)').matches && {
              whileHover: {},
              whileTap: {}
            })}
          >
            <Card className="overflow-hidden border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <Button
                  onClick={onSelectBanking}
                  className="w-full h-auto p-0 bg-transparent hover:bg-transparent text-white btn-accessible min-h-[60px] sm:min-h-[70px]"
                  aria-label="الدخول للبنك التقليدي - الخدمات البنكية العادية"
                  role="menuitem"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-3 sm:gap-4 w-full">
                    <div className="bg-white/20 p-2 sm:p-3 rounded-full flex-shrink-0">
                      <Building2 className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div className="text-right flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold mb-1 truncate">البنك التقليدي</h3>
                      <p className="text-white/70 text-sm leading-tight">الخدمات البنكية العادية</p>
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="overflow-hidden border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <Button
                  onClick={onSelectAccessibility}
                  className="w-full h-auto p-0 bg-transparent hover:bg-transparent text-white btn-accessible min-h-[60px] sm:min-h-[70px]"
                  aria-label="الدخول لواجهة ذوي الهمم - خدمات متخصصة وسهلة الوصول"
                  role="menuitem"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-3 sm:gap-4 w-full">
                    <div className="bg-white/20 p-2 sm:p-3 rounded-full flex-shrink-0">
                      <Accessibility className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div className="text-right flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold mb-1 truncate">ذوي الهمم</h3>
                      <p className="text-white/70 text-sm leading-tight">خدمات متخصصة وسهلة الوصول</p>
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 pt-6 border-t border-white/20"
          >
            <div className="flex items-center justify-center gap-2 text-white/60">
              <Shield className="w-4 h-4" />
              <span className="text-sm">محمي بتقنية أبشر</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default MainNavigation;