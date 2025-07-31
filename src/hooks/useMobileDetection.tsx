import { useState, useEffect } from 'react';

interface DeviceCapabilities {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  hasCamera: boolean;
  supportsMediaPipe: boolean;
  hasWebRTC: boolean;
  hasVibration: boolean;
  performanceLevel: 'low' | 'medium' | 'high';
}

export const useMobileDetection = (): DeviceCapabilities => {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    isIOS: false,
    isAndroid: false,
    hasCamera: false,
    supportsMediaPipe: false,
    hasWebRTC: false,
    hasVibration: false,
    performanceLevel: 'medium'
  });

  useEffect(() => {
    const detectCapabilities = async () => {
      const userAgent = navigator.userAgent.toLowerCase();
      
      // Device detection
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isIOS = /iphone|ipad|ipod/i.test(userAgent);
      const isAndroid = /android/i.test(userAgent);
      
      // Feature detection
      const hasWebRTC = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      const hasVibration = 'vibrate' in navigator;
      
      // Camera detection
      let hasCamera = false;
      if (hasWebRTC) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          hasCamera = devices.some(device => device.kind === 'videoinput');
        } catch (error) {
          console.warn('Could not enumerate devices:', error);
          hasCamera = hasWebRTC; // Assume camera exists if WebRTC is available
        }
      }
      
      // MediaPipe support detection
      const supportsMediaPipe = !!(
        hasWebRTC &&
        window.Worker &&
        'WebAssembly' in window &&
        (!isMobile || (isMobile && !isIOS)) // iOS has limited MediaPipe support
      );
      
      // Performance level estimation
      let performanceLevel: 'low' | 'medium' | 'high' = 'medium';
      if (isMobile) {
        // Check device memory and hardware concurrency for mobile performance estimation
        const memory = (navigator as any).deviceMemory;
        const cores = navigator.hardwareConcurrency;
        
        if (memory && memory < 4 || cores < 4) {
          performanceLevel = 'low';
        } else if (memory && memory >= 6 && cores >= 6) {
          performanceLevel = 'high';
        }
      } else {
        performanceLevel = 'high'; // Assume desktop has good performance
      }
      
      setCapabilities({
        isMobile,
        isIOS,
        isAndroid,
        hasCamera,
        supportsMediaPipe,
        hasWebRTC,
        hasVibration,
        performanceLevel
      });
    };

    detectCapabilities();
  }, []);

  return capabilities;
};