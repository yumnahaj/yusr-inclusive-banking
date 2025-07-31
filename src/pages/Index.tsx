import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import MainNavigation from "@/components/MainNavigation";
import TraditionalBanking from "@/components/TraditionalBanking";
import AccessibilityNavigation from "@/components/AccessibilityNavigation";
import BlindBanking from "@/components/BlindBanking";
import DeafBanking from "@/components/DeafBanking";
import MobilityBanking from "@/components/MobilityBanking";
import EmergencyButton from "@/components/EmergencyButton";
import VoiceVerification from "@/components/VoiceVerification";
import FaceVerification from "@/components/FaceVerification";
import SkipLinks from "@/components/SkipLinks";

type AppState = 
  | "splash" 
  | "main" 
  | "traditional" 
  | "accessibility"
  | "voice-verification"
  | "blind"
  | "deaf" 
  | "mobility"
  | "face-verification-traditional"
  | "face-verification-deaf"
  | "face-verification-mobility";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("splash");

  // WCAG 2.1 - Set page title for screen readers
  useEffect(() => {
    const pageTitles = {
      splash: "يُسر - تطبيق البنك الرقمي",
      main: "يُسر - الصفحة الرئيسية",
      traditional: "يُسر - البنك التقليدي",
      accessibility: "يُسر - واجهة ذوي الهمم",
      "voice-verification": "يُسر - التحقق الصوتي",
      blind: "يُسر - واجهة المكفوفين",
      deaf: "يُسر - واجهة الصم والبكم",
      mobility: "يُسر - واجهة ذوي الإعاقة الحركية",
      "face-verification-traditional": "يُسر - التحقق بالوجه",
      "face-verification-deaf": "يُسر - التحقق بالوجه",
      "face-verification-mobility": "يُسر - التحقق بالوجه",
    };
    
    document.title = pageTitles[appState] || "يُسر - تطبيق البنك الرقمي";
    
    // WCAG 2.1 - Announce page changes to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `تم تحميل صفحة ${pageTitles[appState]}`;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, [appState]);

  const renderCurrentScreen = () => {
    switch (appState) {
      case "splash":
        return <SplashScreen onComplete={() => setAppState("main")} />;
      
      case "main":
        return (
          <MainNavigation
            onSelectBanking={() => setAppState("face-verification-traditional")}
            onSelectAccessibility={() => setAppState("accessibility")}
          />
        );

      case "face-verification-traditional":
        return (
          <FaceVerification 
            onSuccess={() => setAppState("traditional")}
            onCancel={() => setAppState("main")}
            title="البنك التقليدي"
          />
        );

      case "face-verification-deaf":
        return (
          <FaceVerification 
            onSuccess={() => setAppState("deaf")}
            onCancel={() => setAppState("accessibility")}
            title="واجهة الصم والبكم"
          />
        );

      case "face-verification-mobility":
        return (
          <FaceVerification 
            onSuccess={() => setAppState("mobility")}
            onCancel={() => setAppState("accessibility")}
            title="واجهة ذوي الإعاقة الحركية"
          />
        );
      
      case "traditional":
        return <TraditionalBanking onBack={() => setAppState("main")} />;
      
      case "accessibility":
        return (
          <AccessibilityNavigation
            onBack={() => setAppState("main")}
            onSelectBlind={() => setAppState("voice-verification")}
            onSelectDeaf={() => setAppState("face-verification-deaf")}
            onSelectMobility={() => setAppState("face-verification-mobility")}
          />
        );

      case "voice-verification":
        return (
          <VoiceVerification
            onVerified={() => setAppState("blind")}
            onBack={() => setAppState("accessibility")}
          />
        );

      case "blind":
        return <BlindBanking onBack={() => setAppState("accessibility")} />;
      
      case "deaf":
        return <DeafBanking onBack={() => setAppState("accessibility")} />;
      
      case "mobility":
        return <MobilityBanking onBack={() => setAppState("accessibility")} />;
      
      default:
        return null;
    }
  };

  return (
    <>
      {/* WCAG 2.1 - Skip links for keyboard navigation */}
      <SkipLinks />
      
      {/* WCAG 2.1 - Main landmark */}
      <main id="main-content" role="main">
        {renderCurrentScreen()}
      </main>
      
      {/* WCAG 2.1 - Emergency button with proper accessibility */}
      {appState !== "splash" && (
        <aside aria-label="أزرار الطوارئ">
          <EmergencyButton />
        </aside>
      )}
      
      {/* WCAG 2.1 - Screen reader announcements */}
      <div id="announcements" aria-live="polite" aria-atomic="true" className="sr-only"></div>
    </>
  );
};

export default Index;
