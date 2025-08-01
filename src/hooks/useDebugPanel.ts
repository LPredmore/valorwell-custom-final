/**
 * Hook for managing debug panel state and keyboard shortcuts
 */

import { useState, useEffect } from 'react';

export const useDebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Open debug panel with Ctrl/Cmd + Shift + D
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        setIsOpen(prev => !prev);
      }

      // Close debug panel with Escape
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isOpen]);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev)
  };
};