import { motion } from "framer-motion";
import { Building2, Heart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import yusrLogo from "@/assets/yusr-logo.png";

interface MainNavigationProps {
  onSelectBanking: () => void;
  onSelectAccessibility: () => void;
}

const MainNavigation = ({ onSelectBanking, onSelectAccessibility }: MainNavigationProps) => {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        <img src="/lovable-uploads/6fba5ecd-28ee-4ef2-a788-da02b0dd1cf1.png" alt="يُسر" className="w-32 h-32 mx-auto mb-8" />
        
        <h1 className="text-hero text-white mb-4">مرحباً بك في يُسر</h1>
        <p className="text-white/80 text-lg mb-12">اختر طريقة الدخول المناسبة لك</p>

        <div className="space-y-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="overflow-hidden border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6">
                <Button
                  onClick={onSelectBanking}
                  className="w-full h-auto p-0 bg-transparent hover:bg-transparent text-white"
                  aria-label="الدخول للبنك التقليدي"
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Building2 className="w-8 h-8" />
                    </div>
                    <div className="text-right flex-1">
                      <h3 className="text-xl font-bold mb-1">🏦 البنك التقليدي</h3>
                      <p className="text-white/70 text-sm">الخدمات البنكية العادية</p>
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
              <CardContent className="p-6">
                <Button
                  onClick={onSelectAccessibility}
                  className="w-full h-auto p-0 bg-transparent hover:bg-transparent text-white"
                  aria-label="الدخول لواجهة ذوي الهمم"
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Heart className="w-8 h-8" />
                    </div>
                    <div className="text-right flex-1">
                      <h3 className="text-xl font-bold mb-1">♿ واجهة ذوي الهمم</h3>
                      <p className="text-white/70 text-sm">خدمات متخصصة وسهلة الوصول</p>
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