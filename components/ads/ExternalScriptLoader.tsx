'use client'
import React, { useEffect, useState, useRef } from 'react';

// Type declaration for the aclib global variable
declare global {
  interface Window {
    aclib?: {
      runPop: (config: { zoneId: string; containerId?: string; container?: HTMLElement }) => void;
      runBanner: (config: { zoneId: string; containerId?: string; container?: HTMLElement }) => void;
    };
  }
}
 
const ExternalScriptLoader = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  //  console.log("ExternalScriptLoader useEffect called");
    
    const initializeAd = () => {
      // Ensure the container element exists in the DOM
      const container = containerRef.current || document.getElementById('ad-container');
      if (!container) {
        console.error('Ad container not found');
        return false;
      }

      // Verify container is actually in the DOM and has a parent
      if (!container.parentElement) {
        console.error('Ad container is not attached to DOM');
        return false;
      }

      // Log container details for debugging
      // console.log('Container details:', {
      //   id: container.id,
      //   parentElement: container.parentElement?.tagName,
      //   offsetParent: container.offsetParent !== null,
      //   isConnected: container.isConnected,
      //   offsetWidth: container.offsetWidth,
      //   offsetHeight: container.offsetHeight
      // });

      // Check if aclib is available
      if (typeof window.aclib === 'undefined' || typeof window.aclib.runBanner !== 'function') {
      //  console.log('aclib not yet available, waiting...');
        return false;
      }

      // Ad libraries often work by finding a script tag and using script.nextSibling or script.parentElement
      // Try both approaches: script as sibling before container, and script inside container
      
      // Remove any existing ad scripts
      const existing1 = document.getElementById('ad-init-script-10661882');
      const existing2 = document.getElementById('ad-init-script-10661882-alt');
      if (existing1) existing1.remove();
      if (existing2) existing2.remove();
      
      // Approach 1: Script tag as sibling BEFORE the container
      // Library might use script.nextSibling to find container
      if (container.parentElement) {
        const adScriptBefore = document.createElement('script');
        adScriptBefore.id = 'ad-init-script-10661882';
        adScriptBefore.type = 'text/javascript';
        adScriptBefore.setAttribute('data-zone-id', '10661882');
        adScriptBefore.setAttribute('data-zone', '10661882');
        container.parentElement.insertBefore(adScriptBefore, container);
        // console.log("Script tag created BEFORE container:", adScriptBefore);
        // console.log("Script nextSibling:", adScriptBefore.nextSibling);
      }
      
      // Approach 2: Script tag INSIDE the container
      // Library might use script.parentElement to find container
      const adScriptInside = document.createElement('script');
      adScriptInside.id = 'ad-init-script-10661882-alt';
      adScriptInside.type = 'text/javascript';
      adScriptInside.setAttribute('data-zone-id', '10661882');
      adScriptInside.setAttribute('data-zone', '10661882');
      container.appendChild(adScriptInside);
      // console.log("Script tag created INSIDE container:", adScriptInside);
      // console.log("Script parentElement:", adScriptInside.parentElement);
      
      // Now call runBanner - the library should find one of the script tags
      try {
        if (window.aclib && typeof window.aclib.runBanner === 'function') {
       //   console.log("Calling runBanner - library should find script tag");
          window.aclib.runBanner({
            zoneId: '10661882',
          });
        }
        
        // Monitor the container for content injection
        const checkAdContent = () => {
          const checkContainer = containerRef.current || document.getElementById('ad-container');
          if (checkContainer) {
            // console.log('Checking ad container:', {
            //   children: checkContainer.children.length,
            //   innerHTML: checkContainer.innerHTML.substring(0, 200),
            //   offsetWidth: checkContainer.offsetWidth,
            //   offsetHeight: checkContainer.offsetHeight,
            //   computedStyle: window.getComputedStyle(checkContainer).display,
            //   visibility: window.getComputedStyle(checkContainer).visibility,
            //   opacity: window.getComputedStyle(checkContainer).opacity,
            //   zIndex: window.getComputedStyle(checkContainer).zIndex
            // });
            
            // Check for iframes or other ad content
            const iframes = checkContainer.querySelectorAll('iframe');
            const images = checkContainer.querySelectorAll('img');
            const divs = checkContainer.querySelectorAll('div');
            
            // console.log('Ad container content:', {
            //   iframes: iframes.length,
            //   images: images.length,
            //   divs: divs.length,
            //   allElements: checkContainer.querySelectorAll('*').length
            // });
            
            const hasContent = checkContainer.children.length > 0 || 
                             checkContainer.innerHTML.trim().length > 0 ||
                             checkContainer.offsetHeight > 100; // Should be at least 100px if ad loaded
            if (hasContent) {
          //    console.log('Ad content detected in container');
              setScriptLoaded(true);
            } else {
              console.warn('No ad content detected in container');
            }
          }
        };
        
        // Check multiple times as ads load asynchronously
        setTimeout(checkAdContent, 500);
        setTimeout(checkAdContent, 1500);
        setTimeout(checkAdContent, 3000);
        
        setScriptLoaded(true);
        return true;
      } catch (error: any) {
        console.error('Error running banner script:', error);
        console.error('Error stack:', error?.stack);
        console.error('Error message:', error?.message);
        
        // The error might be happening asynchronously inside the library
        // Wait and check if ad was actually loaded despite the error
        setTimeout(() => {
          const checkContainer = containerRef.current || document.getElementById('ad-container');
          if (checkContainer) {
            const hasContent = checkContainer.children.length > 0 || 
                             checkContainer.innerHTML.trim().length > 0 ||
                             checkContainer.offsetHeight > 0;
            if (hasContent) {
              console.log('Ad appears to have loaded despite error');
              setScriptLoaded(true);
            } else {
              console.error('Ad did not load');
              setScriptError(true);
            }
          } else {
            setScriptError(true);
          }
        }, 1500);
        
        return false;
      }
    };

    // Use requestAnimationFrame to ensure DOM is fully painted
    const waitForReady = () => {
      // Wait for next frame to ensure React has finished rendering
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          waitForAdLib();
        });
      });
    };

    const waitForAdLib = () => {
      // Check if aclib is already available (loaded from layout.tsx)
      if (typeof window.aclib !== 'undefined' && typeof window.aclib.runBanner === 'function') {
       // console.log("aclib already available");
        // Use requestAnimationFrame to ensure container is fully rendered
        requestAnimationFrame(() => {
          setTimeout(() => {
            initializeAd();
          }, 200);
        });
        return;
      }

      // Poll for aclib to become available (since it's loaded in layout.tsx)
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait
      const checkInterval = setInterval(() => {
        attempts++;
        if (typeof window.aclib !== 'undefined' && typeof window.aclib.runBanner === 'function') {
          clearInterval(checkInterval);
       //   console.log("aclib became available after", attempts * 100, "ms");
          requestAnimationFrame(() => {
            setTimeout(() => {
              initializeAd();
            }, 200);
          });
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          console.error('aclib did not become available after waiting');
          setScriptError(true);
        }
      }, 100);
    };

    // Set up MutationObserver to watch for content injection (outside initializeAd)
    let observer: MutationObserver | null = null;
    const container = containerRef.current || document.getElementById('ad-container');
    if (container) {
      observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length > 0) {
          //  console.log('Content added to ad container:', mutation.addedNodes);
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) { // Element node
                const element = node as HTMLElement;
                // console.log('Added element:', {
                //   tagName: element.tagName,
                //   id: element.id,
                //   className: element.className,
                //   style: element.getAttribute('style'),
                //   computedDisplay: window.getComputedStyle(element).display,
                //   computedVisibility: window.getComputedStyle(element).visibility,
                //   computedOpacity: window.getComputedStyle(element).opacity,
                //   offsetWidth: element.offsetWidth,
                //   offsetHeight: element.offsetHeight
                // });
                
                // Check if element is hidden
                if (element.offsetWidth === 0 && element.offsetHeight === 0) {
                  console.warn('Injected element has zero dimensions - might be hidden');
                }
              }
            });
          }
        });
      });
      
      // Start observing the container
      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }

    // Wait for component to mount and DOM to be ready
    if (document.readyState === 'complete') {
      waitForReady();
    } else {
      window.addEventListener('load', waitForReady);
      // Also try immediately in case load already fired
      waitForReady();
    }
    
    // Cleanup observer on unmount
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div 
      className='border' 

    >
      {/* {scriptError && (
        <div style={{color: 'red', fontSize: '12px'}}>
          Script failed to load
        </div>
      )}
      {scriptLoaded && (
        <div style={{color: 'green', fontSize: '12px'}}>
          Script loaded successfully
        </div>
      )} */}
      {/* The ad content will be rendered by the script */}
      {/* Some ad libraries need the container to be a direct child or have specific structure */}
      <div 
        id="ad-container" 
        ref={containerRef}
        data-zone-id="10661882"
        data-zone="10661882"
    
      >
        {/* Ad will be injected here by the library */}
      </div>
    </div>
  );
};
 
export default ExternalScriptLoader;
