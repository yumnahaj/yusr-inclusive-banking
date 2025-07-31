import { motion } from "framer-motion";
import { ArrowLeft, Volume2, Mic, Eye, Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
interface BlindBankingProps {
  onBack: () => void;
}
const BlindBanking = ({
  onBack
}: BlindBankingProps) => {
  const [balance] = useState("12,345");
  const [isListening, setIsListening] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const bankingOptions = [{
    icon: <Volume2 className="w-8 h-8" />,
    title: "كشف الحساب",
    description: "الاستماع لآخر العمليات",
    ariaLabel: "كشف الحساب - اضغط للاستماع للعمليات الأخيرة"
  }, {
    icon: <Mic className="w-8 h-8" />,
    title: "تحويل أموال",
    description: "أمر صوتي للتحويل",
    ariaLabel: "تحويل أموال - اضغط لبدء التحويل بالأمر الصوتي"
  }, {
    icon: <Eye className="w-8 h-8" />,
    title: "رصيدي",
    description: "الاستماع للرصيد الحالي",
    ariaLabel: "رصيدي - اضغط للاستماع للرصيد الحالي"
  }];
  useEffect(() => {
    const welcomeText = "مرحباً بك في واجهة البنك للمكفوفين. الخدمات المتاحة: رصيدك الحالي، كشف الحساب، تحويل أموال. لتنفيذ أي خدمة اضغط على الزر مرتين أو قل نعم.";
    speakText(welcomeText);
    return () => {
      // Stop speech when component unmounts
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, []);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        // Announce button when tabbing
        setTimeout(() => {
          const focusedElement = document.activeElement;
          if (focusedElement && focusedElement.getAttribute('aria-label')) {
            const text = focusedElement.textContent || focusedElement.getAttribute('aria-label') || '';
            speakText(text);
          }
        }, 100);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  const speakText = (text: string) => {
    // Stop any currently playing speech
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    if ('speechSynthesis' in window) {
      // Better mobile speech synthesis
      const loadVoices = () => {
        const utterance = new SpeechSynthesisUtterance(text);

        // Enhanced mobile support
        const voices = speechSynthesis.getVoices();
        const arabicVoice = voices.find(voice => voice.lang.includes('ar') || voice.name.includes('Arabic') || voice.name.includes('Saudi'));
        if (arabicVoice) {
          utterance.voice = arabicVoice;
        }

        // Optimized settings for mobile
        utterance.lang = 'ar-SA';
        utterance.rate = 0.7; // Slower for better clarity
        utterance.pitch = 1.1;
        utterance.volume = 1;

        // Enhanced error handling
        utterance.onstart = () => {
          console.log('Speech started successfully');
          setIsListening(true);
        };
        utterance.onend = () => {
          console.log('Speech ended');
          setIsListening(false);
        };
        utterance.onerror = event => {
          console.error('Speech error:', event.error);
          setIsListening(false);

          // Show visual feedback if speech fails
          const fallbackMessage = `تعذر تشغيل الصوت: ${text}`;
          console.log(fallbackMessage);
        };
        speechRef.current = utterance;

        // Additional mobile fixes
        try {
          speechSynthesis.speak(utterance);
        } catch (error) {
          console.error('Speech synthesis failed:', error);
          setIsListening(false);
        }
      };

      // Improved voice loading for mobile
      const voices = speechSynthesis.getVoices();
      if (voices.length === 0) {
        // Wait for voices to load
        speechSynthesis.addEventListener('voiceschanged', loadVoices, {
          once: true
        });
        // Fallback timeout
        setTimeout(loadVoices, 1000);
      } else {
        loadVoices();
      }
    } else {
      console.warn('Speech synthesis not supported on this device');
      // Visual feedback when speech is not available
      setIsListening(false);
    }
  };
  const handleDoubleClick = () => {
    if (pendingAction) {
      executeAction(pendingAction);
      setAwaitingConfirmation(false);
      setPendingAction(null);
    }
  };
  const handleSingleClick = (action: string) => {
    setClickCount(prev => prev + 1);
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    if (clickCount === 0) {
      // First speak what the button does, then ask for confirmation
      let buttonDescription = "";
      switch (action) {
        case "رصيدي":
          buttonDescription = "رصيدك الحالي";
          break;
        case "كشف الحساب":
          buttonDescription = "كشف الحساب - عرض آخر العمليات";
          break;
        case "تحويل أموال":
          buttonDescription = "تحويل أموال بالأمر الصوتي";
          break;
      }
      speakText(`${buttonDescription}. اضغط مرة أخرى للتأكيد أو قل نعم`);
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
        setAwaitingConfirmation(true);
        setPendingAction(action);
        setTimeout(() => {
          setAwaitingConfirmation(false);
          setPendingAction(null);
        }, 3000);
      }, 300);
    } else if (clickCount === 1) {
      clearTimeout(clickTimeoutRef.current);
      setClickCount(0);
      executeAction(action);
      setAwaitingConfirmation(false);
      setPendingAction(null);
    }
  };
  const executeAction = (action: string) => {
    switch (action) {
      case "رصيدي":
        speakText(`رصيدك الحالي ${balance} ريال سعودي`);
        break;
      case "كشف الحساب":
        speakText("آخر العمليات: تحويل 500 ريال إلى أحمد محمد يوم الأحد، إيداع 1000 ريال يوم السبت، سحب 200 ريال من الصراف الآلي يوم الجمعة");
        break;
      case "تحويل أموال":
        speakText("قل اسم المستفيد والمبلغ. مثال: حول 100 ريال إلى سارة أحمد");
        setIsListening(true);
        setTimeout(() => setIsListening(false), 5000);
        break;
      case "high-contrast":
        const newHighContrast = !highContrast;
        setHighContrast(newHighContrast);
        speakText(newHighContrast ? "تم تفعيل وضع التباين العالي" : "تم إيقاف وضع التباين العالي");
        break;
    }
  };

  // Voice recognition for confirmation
  useEffect(() => {
    if (awaitingConfirmation && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        if (transcript.includes('نعم') || transcript.includes('موافق')) {
          if (pendingAction) {
            executeAction(pendingAction);
            setAwaitingConfirmation(false);
            setPendingAction(null);
          }
        }
      };
      recognition.start();
      return () => {
        recognition.stop();
      };
    }
  }, [awaitingConfirmation, pendingAction]);
  return <div className={`min-h-screen p-2 sm:p-6 transition-all duration-500 ${highContrast ? 'high-contrast' : ''}`} role="main" aria-label="واجهة البنك للمكفوفين">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6
    }} className="max-w-4xl mx-auto">
        {/* Header */}
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-end mb-4">
            <Button onClick={onBack} variant="outline" size="lg" className="flex items-center gap-3 text-lg sm:text-xl px-6 py-4 sm:px-8 sm:py-6 transition-all duration-300 min-h-[56px] sm:min-h-[64px] touch-manipulation btn-accessible" aria-label="العودة للصفحة السابقة" onFocus={() => speakText("زر العودة")}>
              <ArrowLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              العودة
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
            <img src="/lovable-uploads/195fdd24-a424-43bb-b88e-b79ef654b40e.png" alt="يُسر" className="w-12 h-12 sm:w-20 sm:h-20" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">يُسر للمكفوفين</h1>
          </div>
          
          <div className="flex justify-center">
            <Button onClick={() => executeAction("high-contrast")} variant="outline" size="lg" className="flex items-center gap-3 text-lg sm:text-xl px-6 py-4 sm:px-8 sm:py-6 transition-all duration-300 min-h-[56px] sm:min-h-[64px] touch-manipulation btn-accessible" aria-label="تبديل وضع التباين العالي لضعاف البصر" onFocus={() => speakText("زر التباين العالي")}>
              <Palette className="w-6 h-6 sm:w-8 sm:h-8" />
              <span className="hidden sm:inline">{highContrast ? 'إيقاف' : 'تفعيل'} التباين العالي</span>
              <span className="sm:hidden">تباين</span>
            </Button>
          </div>
        </div>

        {/* Voice Status */}
        {isListening && <div className="mb-6 sm:mb-8 text-center">
            <div className="rounded-xl p-6 sm:p-8 bg-primary/20">
              <p className="font-bold text-xl sm:text-2xl lg:text-3xl text-primary">🎤 أستمع إليك الآن...</p>
            </div>
          </div>}
        
        {/* Confirmation Status */}
        {awaitingConfirmation && <div className="mb-6 sm:mb-8 text-center">
            <div className="rounded-xl p-6 sm:p-8 bg-accent/20 border border-accent">
              <p className="font-bold text-xl sm:text-2xl lg:text-3xl text-accent-foreground">
                🔄 انتظار التأكيد - اضغط مرة أخرى أو قل "نعم"
              </p>
            </div>
          </div>}

        {/* Current Balance - Large and Prominent */}
        <motion.div initial={{
        scale: 0.9
      }} animate={{
        scale: 1
      }} className="mb-8 sm:mb-12">
          <Card className="text-center p-6 sm:p-10 md:p-12 border-2 cursor-pointer transition-all duration-300 touch-manipulation border-primary hover:bg-primary/5" onClick={() => handleSingleClick("رصيدي")} onDoubleClick={handleDoubleClick} role="button" tabIndex={0} aria-label={`رصيدك الحالي ${balance} ريال سعودي - اضغط مرتين للتأكيد`} onFocus={() => speakText("رصيدك الحالي")}>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-primary">الرصيد الحالي</h2>
              <p className="text-4xl sm:text-6xl lg:text-8xl font-bold text-primary balance-mobile">{balance}</p>
              <p className="text-lg sm:text-2xl lg:text-3xl mt-3 sm:mt-4 text-muted-foreground">ريال سعودي</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Banking Options */}
        <div className="space-y-6 sm:space-y-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-10 text-primary">الخدمات البنكية</h2>
          
          {bankingOptions.map((option, index) => <motion.div key={option.title} initial={{
          opacity: 0,
          x: 50
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.6,
          delay: index * 0.2
        }} whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.98
        }}>
              <Card className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border-2 touch-manipulation hover:border-primary">
                <CardContent className="p-6 sm:p-8 md:p-10 card-mobile">
                  <Button onClick={() => handleSingleClick(option.title)} onDoubleClick={handleDoubleClick} className="w-full h-auto p-0 bg-transparent hover:bg-transparent text-right min-h-[80px] sm:min-h-[120px] text-foreground" aria-label={`${option.ariaLabel} - اضغط مرتين للتأكيد`} onFocus={() => speakText(option.title)}>
                    <div className="flex items-center gap-4 sm:gap-6 md:gap-8 w-full">
                      <div className="p-4 sm:p-6 md:p-8 rounded-2xl flex-shrink-0 bg-primary/20 text-primary">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-2xl text-2xl sm:text-4xl md:text-5xl flex items-center justify-center">{option.icon}</div>
                      </div>
                      <div className="text-right flex-1 min-w-0">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 truncate">{option.title}</h3>
                        <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-tight"></p>
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>)}
        </div>

        {/* Help Instructions */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 1
      }} className="mt-8 sm:mt-12 text-center">
          <div className="rounded-xl p-6 sm:p-8 md:p-10 bg-accent/20">
            <h3 className="font-bold mb-3 sm:mb-4 text-lg sm:text-xl lg:text-2xl text-primary">💡 تعليمات الاستخدام</h3>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
              اضغط على أي زر للاستماع للمحتوى • اضغط مرتين للتأكيد أو قل "نعم" • استخدم التباين العالي لضعاف البصر
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>;
};
export default BlindBanking;