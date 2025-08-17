import { useEffect } from 'react';

export const useDevToolsProtection = () => {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable common dev tools keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I (Developer Tools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+C (Element Selector)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+S (Save Page)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
    };

    // DevTools detection by checking window size changes
    let devtools = { open: false, orientation: null };
    const threshold = 160;
    
    const checkDevTools = () => {
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtools.open) {
          devtools.open = true;
          // Redirect or show warning when dev tools detected
          document.body.innerHTML = `
            <div style="
              position: fixed; 
              top: 0; 
              left: 0; 
              width: 100%; 
              height: 100%; 
              background: #000; 
              color: #fff; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-family: Arial, sans-serif; 
              font-size: 24px;
              z-index: 999999;
            ">
              Access Denied - Developer Tools Detected
            </div>
          `;
        }
      } else {
        devtools.open = false;
      }
    };

    // Console warning
    const consoleWarning = () => {
      console.clear();
      console.log('%cSTOP!', 'color: red; font-size: 50px; font-weight: bold;');
      console.log('%cThis is a browser feature intended for developers. Unauthorized access is prohibited.', 'color: red; font-size: 16px;');
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    // Check for dev tools periodically
    const interval = setInterval(checkDevTools, 500);
    
    // Show console warning
    consoleWarning();
    
    // Clear console periodically
    const consoleClearInterval = setInterval(() => {
      console.clear();
      consoleWarning();
    }, 1000);

    // Disable text selection
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
      clearInterval(consoleClearInterval);
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, []);
};