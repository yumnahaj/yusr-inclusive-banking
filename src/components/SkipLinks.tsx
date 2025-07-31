import React from 'react';

interface SkipLinksProps {
  mainContentId?: string;
  navigationId?: string;
}

const SkipLinks = ({ 
  mainContentId = "main-content", 
  navigationId = "main-navigation" 
}: SkipLinksProps) => {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a 
        href={`#${mainContentId}`}
        className="skip-link"
        aria-label="تخطى إلى المحتوى الرئيسي"
      >
        تخطى إلى المحتوى الرئيسي
      </a>
      <a 
        href={`#${navigationId}`}
        className="skip-link"
        aria-label="تخطى إلى القائمة الرئيسية"
      >
        تخطى إلى القائمة الرئيسية
      </a>
    </div>
  );
};

export default SkipLinks;