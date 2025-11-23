'use client';

import { useEffect } from 'react';

/**
 * A custom React hook for handling keyboard shortcuts.
 *
 * @param hotkeys - An array of hotkey configurations.
 * @param hotkeys[].keys - An array of keys that trigger the callback (e.g., ['Control', 's']).
 * @param hotkeys[].callback - The function to execute when the keys are pressed.
 */
export function useHotkeys(hotkeys: { keys: string[]; callback: () => void }[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const hotkey of hotkeys) {
        if (hotkey.keys.every((key) => getIsKeyPressed(event, key))) {
          event.preventDefault();
          hotkey.callback();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hotkeys]);
}

function getIsKeyPressed(event: KeyboardEvent, key: string) {
  switch (key.toLowerCase()) {
    case 'control':
      return event.ctrlKey;
    case 'shift':
      return event.shiftKey;
    case 'alt':
      return event.altKey;
    case 'meta':
      return event.metaKey;
    default:
      return event.key.toLowerCase() === key.toLowerCase();
  }
}
