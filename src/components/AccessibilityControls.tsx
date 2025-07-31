import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Type, Volume2, Contrast, ZoomIn, ZoomOut, Globe } from "lucide-react";

interface AccessibilityControlsProps {
  onClose?: () => void;
}

const AccessibilityControls = ({ onClose }: AccessibilityControlsProps) => {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [readingMode, setReadingMode] = useState(false);
  const [language, setLanguage] = useState('ar');

  // WCAG 2.1 - Font size controls (minimum 16px, maximum 24px)
  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 2, 24);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 2, 16);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  // WCAG 2.1 - High contrast mode
  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.body.classList.toggle('high-contrast', !highContrast);
  };

  // WCAG 2.1 - Reading mode (simplified layout)
  const toggleReadingMode = () => {
    setReadingMode(!readingMode);
    document.body.classList.toggle('reading-mode', !readingMode);
  };

  // WCAG 2.1 - Text-to-speech for reading mode
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      speechSynthesis.speak(utterance);
    }
  };

  // Language toggle
  const toggleLanguage = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLanguage);
    localStorage.setItem('app-language', newLanguage);
    // You would typically implement full app language change here
    window.location.reload(); // Temporary solution to reload with new language
  };

  // WCAG 2.1 - Load user preferences
  useEffect(() => {
    const savedFontSize = localStorage.getItem('accessibility-font-size');
    const savedHighContrast = localStorage.getItem('accessibility-high-contrast');
    const savedReadingMode = localStorage.getItem('accessibility-reading-mode');
    const savedLanguage = localStorage.getItem('app-language');

    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize));
      document.documentElement.style.fontSize = `${savedFontSize}px`;
    }
    
    if (savedHighContrast === 'true') {
      setHighContrast(true);
      document.body.classList.add('high-contrast');
    }
    
    if (savedReadingMode === 'true') {
      setReadingMode(true);
      document.body.classList.add('reading-mode');
    }

    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // WCAG 2.1 - Save user preferences
  useEffect(() => {
    localStorage.setItem('accessibility-font-size', fontSize.toString());
    localStorage.setItem('accessibility-high-contrast', highContrast.toString());
    localStorage.setItem('accessibility-reading-mode', readingMode.toString());
    localStorage.setItem('app-language', language);
  }, [fontSize, highContrast, readingMode, language]);

  return (
    <Card className="fixed top-4 right-4 z-50 w-80 shadow-xl">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">إعدادات الوصولية</h2>
          {onClose && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              aria-label="إغلاق إعدادات الوصولية"
            >
              ✕
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {/* Font Size Controls */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              حجم الخط
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={decreaseFontSize}
                aria-label="تصغير الخط"
                disabled={fontSize <= 16}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm px-2">{fontSize}px</span>
              <Button
                variant="outline"
                size="sm"
                onClick={increaseFontSize}
                aria-label="تكبير الخط"
                disabled={fontSize >= 24}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* High Contrast Toggle */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Contrast className="w-4 h-4" />
              التباين العالي
            </span>
            <Button
              variant={highContrast ? "default" : "outline"}
              size="sm"
              onClick={toggleHighContrast}
              aria-label={highContrast ? "إيقاف التباين العالي" : "تشغيل التباين العالي"}
            >
              {highContrast ? "مُفعل" : "مُعطل"}
            </Button>
          </div>

          {/* Reading Mode Toggle */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              وضع القراءة
            </span>
            <Button
              variant={readingMode ? "default" : "outline"}
              size="sm"
              onClick={toggleReadingMode}
              aria-label={readingMode ? "إيقاف وضع القراءة" : "تشغيل وضع القراءة"}
            >
              {readingMode ? "مُفعل" : "مُعطل"}
            </Button>
          </div>

          {/* Text to Speech */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              قراءة النص
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => speakText("تم تفعيل قارئ النصوص")}
              aria-label="تجربة قارئ النصوص"
            >
              تجربة
            </Button>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              اللغة
            </span>
            <Button
              variant={language === 'en' ? "default" : "outline"}
              size="sm"
              onClick={toggleLanguage}
              aria-label={language === 'ar' ? "تغيير إلى الإنجليزية" : "Change to Arabic"}
            >
              {language === 'ar' ? "English" : "العربية"}
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
          <p>هذه الإعدادات تتوافق مع معايير WCAG 2.1 لسهولة الوصول</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilityControls;