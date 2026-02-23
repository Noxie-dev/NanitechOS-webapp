import React, { useState, useEffect } from 'react';
import TopBar from './TopBar';
import Dock from './Dock';
import Window from './Window';
import { useAppState } from '../hooks/use-app-state';
import NaniVault from '../apps/NaniVault';
import Launchpad from '../apps/Launchpad';
import NaniAssist from '../apps/NaniAssist';
import Settings from '../apps/Settings';
import Services from '../apps/Services';
import ActivityBin from '../apps/ActivityBin';
import { backgrounds } from '../assets/backgrounds';
import { useIsMobile } from '../hooks/use-mobile';

const Desktop: React.FC = () => {
  const { 
    windows, 
    activeWindowId, 
    wallpaper, 
    openWindow, 
    closeWindow, 
    focusWindow, 
    moveWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow
  } = useAppState();
  
  const isMobile = useIsMobile();
  const [desktopSize, setDesktopSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Update desktop size on window resize
  useEffect(() => {
    const handleResize = () => {
      setDesktopSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Force maximize windows on mobile
  useEffect(() => {
    if (isMobile) {
      windows.forEach(window => {
        if (window.isOpen && !window.isMaximized) {
          maximizeWindow(window.id);
        }
      });
    }
  }, [isMobile, windows]);

  // Map window IDs to content components
  const getWindowContent = (windowId: string) => {
    switch (windowId) {
      case 'vault':
        return <NaniVault />;
      case 'launchpad':
        return <Launchpad />;
      case 'assist':
        return <NaniAssist />;
      case 'settings':
        return <Settings />;
      case 'services':
        return <Services />;
      case 'activity':
        return <ActivityBin />;
      default:
        return <div>Window content not found</div>;
    }
  };

  const isLogoWallpaper = wallpaper.includes('nanitech-logo');

  return (
    <div 
      className="desktop-environment"
      id="desktop-environment"
      style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: `url("${wallpaper}")`,
        backgroundSize: isLogoWallpaper ? 'contain' : 'cover',
        backgroundRepeat: isLogoWallpaper ? 'no-repeat' : 'repeat',
        backgroundPosition: 'center',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Top Bar */}
      <TopBar />

      {/* Windows */}
      {windows.map(window => (
        window.isOpen && (
          <Window
            key={window.id}
            id={window.id}
            title={window.title}
            icon={window.icon}
            position={isMobile ? { x: 0, y: 0 } : window.position}
            size={isMobile ? { width: desktopSize.width, height: desktopSize.height - 40 } : window.size}
            zIndex={window.zIndex}
            isFocused={window.isFocused}
            isMinimized={window.isMinimized}
            isMaximized={isMobile ? true : window.isMaximized}
            onClose={() => closeWindow(window.id)}
            onFocus={() => focusWindow(window.id)}
            onMove={(position) => moveWindow(window.id, position)}
            onMinimize={isMobile ? () => {} : () => minimizeWindow(window.id)} 
            onMaximize={isMobile ? () => {} : () => maximizeWindow(window.id)}
            onRestore={isMobile ? () => {} : () => restoreWindow(window.id)}
            desktopSize={desktopSize}
            isMobileDevice={isMobile}
          >
            {getWindowContent(window.id)}
          </Window>
        )
      ))}

      {/* Dock - hidden in mobile if a window is open and in focus */}
      {(!isMobile || !windows.some(w => w.isOpen && w.isFocused)) && (
        <Dock 
          onItemClick={(id) => {
            const window = windows.find(w => w.id === id);
            if (window) {
              if (window.isOpen) {
                focusWindow(id);
              } else {
                openWindow(id);
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default Desktop;
