'use client';

import { Megaphone, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export const DevelopmentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // The banner is only shown if it hasn't been dismissed before.
    if (localStorage.getItem('hideDevBanner') !== 'true') {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('hideDevBanner', 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative bg-indigo-600 text-white">
      <div className="container mx-auto py-3 px-12 text-center text-sm">
        <div className="flex items-center justify-center gap-3">
          <Megaphone className="w-5 h-5 flex-shrink-0" />
          <p>
            <strong>Under Development:</strong> This app is free to use during development and will remain free after completion. We're a free resume builder with no hidden fees. As a thank you, we're planning giveaways in 2026, including the latest iPhones and Samsung models!
          </p>
        </div>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute top-1/2 right-4 -translate-y-1/2 p-1 rounded-full hover:bg-indigo-700 transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
