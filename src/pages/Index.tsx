import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import MainNavigation from "@/components/MainNavigation";
import TraditionalBanking from "@/components/TraditionalBanking";
import AccessibilityNavigation from "@/components/AccessibilityNavigation";
import BlindBanking from "@/components/BlindBanking";
import DeafBanking from "@/components/DeafBanking";
import MobilityBanking from "@/components/MobilityBanking";
import EmergencyButton from "@/components/EmergencyButton";
import VoiceVerification from "@/components/VoiceVerification";

type AppState = 
  | "splash" 
  | "main" 
  | "traditional" 
  | "accessibility"
  | "voice-verification"
  | "blind"
  | "deaf" 
  | "mobility";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("splash");

  const renderCurrentScreen = () => {
    switch (appState) {
      case "splash":
        return <SplashScreen onComplete={() => setAppState("main")} />;
      
      case "main":
        return (
          <MainNavigation
            onSelectBanking={() => setAppState("traditional")}
            onSelectAccessibility={() => setAppState("accessibility")}
          />
        );
      
      case "traditional":
        return <TraditionalBanking onBack={() => setAppState("main")} />;
      
      case "accessibility":
        return (
          <AccessibilityNavigation
            onBack={() => setAppState("main")}
            onSelectBlind={() => setAppState("voice-verification")}
            onSelectDeaf={() => setAppState("deaf")}
            onSelectMobility={() => setAppState("mobility")}
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
      {renderCurrentScreen()}
      {appState !== "splash" && <EmergencyButton />}
    </>
  );
};

export default Index;
