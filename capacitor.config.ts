import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1d232554647f4dc5995a6665b52dec25',
  appName: 'yusr-inclusive-banking',
  webDir: 'dist',
  server: {
    url: 'https://1d232554-647f-4dc5-995a-6665b52dec25.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false
    }
  }
};

export default config;