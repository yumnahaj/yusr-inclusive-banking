import React, { useEffect, useRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useEyeTracking } from '@/hooks/useEyeTracking';

interface EyeTrackingButtonProps extends ButtonProps {
  children: React.ReactNode;
  trackingId: string;
}

const EyeTrackingButton = ({ children, trackingId, ...props }: EyeTrackingButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { registerButton, unregisterButton } = useEyeTracking();

  useEffect(() => {
    if (buttonRef.current) {
      registerButton(trackingId, buttonRef.current);
      
      return () => {
        unregisterButton(trackingId);
      };
    }
  }, [trackingId, registerButton, unregisterButton]);

  return (
    <Button
      ref={buttonRef}
      {...props}
      style={{
        transition: 'all 0.3s ease',
        ...props.style
      }}
    >
      {children}
    </Button>
  );
};

export default EyeTrackingButton;