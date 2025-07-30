import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import MainNavigation from "@/components/MainNavigation";
import TraditionalBanking from "@/components/TraditionalBanking";
import AccessibilityNavigation from "@/components/AccessibilityNavigation";
import EmergencyButton from "@/components/EmergencyButton";

type AppState = 
  | "splash" 
  | "main" 
  | "traditional" 
  | "accessibility"
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
            onSelectBlind={() => setAppState("blind")}
            onSelectDeaf={() => setAppState("deaf")}
            onSelectMobility={() => setAppState("mobility")}
          />
        );

      // Placeholder for future accessibility interfaces
      case "blind":
      case "deaf":
      case "mobility":
        return (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center p-8">
              <h1 className="text-3xl font-bold text-primary mb-4">قريباً</h1>
              <p className="text-muted-foreground mb-6">
                هذه الواجهة تحت التطوير وستكون متاحة قريباً
              </p>
              <button
                onClick={() => setAppState("accessibility")}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors"
              >
                العودة
              </button>
            </div>
          </div>
        );
      
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
