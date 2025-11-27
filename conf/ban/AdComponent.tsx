"use client"
import { useEffect } from 'react';

const AdComponent = () => {
  useEffect(() => {
    // Dynamically load the external script when component mounts
    const script = document.createElement('script');
    script.src = '//pl27925108.effectivegatecpm.com/b2fb934c1e50a7138eae41d6e2423f8c/invoke.js';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return <div id="container-b2fb934c1e50a7138eae41d6e2423f8c"></div>;
};

export default AdComponent;
