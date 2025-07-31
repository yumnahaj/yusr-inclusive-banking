import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import MainNavigation from "@/components/MainNavigation";
import TraditionalBanking from "@/components/TraditionalBanking";
import AccessibilityNavigation from "@/components/AccessibilityNavigation";
import BlindBanking from "@/components/BlindBanking";
import DeafBanking from "@/components/DeafBanking";
import MobilityBanking from "@/components/MobilityBanking";
import EmergencyButton from "@/components/EmergencyButton";
import FingerprintVerification from "@/components/FingerprintVerification";
import FaceVerification from "@/components/FaceVerification";
import SkipLinks from "@/components/SkipLinks";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";

type AppState = 
  | "splash" 
  | "main" 
  | "traditional" 
  | "accessibility"
  | "fingerprint-verification"
  | "blind"
  | "deaf" 
  | "mobility"
  | "face-verification-traditional"
  | "face-verification-deaf"
  | "face-verification-mobility";

const IndexContent = () => {
  const [appState, setAppState] = useState<AppState>("splash");
  const { t } = useLanguage();

  // WCAG 2.1 - Set page title for screen readers
  useEffect(() => {
    const pageTitles = {
      splash: t('page.splash'),
      main: t('page.main'),
      traditional: t('page.traditional'),
      accessibility: t('page.accessibility'),
      "fingerprint-verification": t('page.fingerprint'),
      blind: t('page.blind'),
      deaf: t('page.deaf'),
      mobility: t('page.mobility'),
      "face-verification-traditional": t('page.faceVerification'),
      "face-verification-deaf": t('page.faceVerification'),
      "face-verification-mobility": t('page.faceVerification'),
    };
    
    document.title = pageTitles[appState] || t('page.splash');
    
    // WCAG 2.1 - Announce page changes to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = t('announce.pageLoaded').replace('{page}', pageTitles[appState]);
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, [appState, t]);

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
            title={t('main.traditional')}
          />
        );

      case "face-verification-deaf":
        return (
          <FaceVerification 
            onSuccess={() => setAppState("deaf")}
            onCancel={() => setAppState("accessibility")}
            title={t('accessibility.deaf')}
          />
        );

      case "face-verification-mobility":
        return (
          <FaceVerification 
            onSuccess={() => setAppState("mobility")}
            onCancel={() => setAppState("accessibility")}
            title={t('accessibility.mobility')}
          />
        );
      
      case "traditional":
        return <TraditionalBanking onBack={() => setAppState("main")} />;
      
      case "accessibility":
        return (
          <AccessibilityNavigation
            onBack={() => setAppState("main")}
            onSelectBlind={() => setAppState("fingerprint-verification")}
            onSelectDeaf={() => setAppState("face-verification-deaf")}
            onSelectMobility={() => setAppState("face-verification-mobility")}
          />
        );

      case "fingerprint-verification":
        return (
          <FingerprintVerification
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
        <aside aria-label={t('common.back')}>
          <EmergencyButton />
        </aside>
      )}
      
      {/* WCAG 2.1 - Screen reader announcements */}
      <div id="announcements" aria-live="polite" aria-atomic="true" className="sr-only"></div>
    </>
  );
};

const Index = () => {
  return (
    <LanguageProvider>
      <IndexContent />
    </LanguageProvider>
  );
};

export default Index;
