import React, { useState, useEffect } from 'react';
import TopBar from './TopBar';
import Dock from './Dock';
import Window from './Window';
import { useAppState } from '../hooks/use-app-state';
import NaniVault from '../apps/NaniVault';
import Launchpad from '../apps/Launchpad';
import NaniAssist from '../apps/NaniAssist';
import Settings from '../apps/Settings';
import { backgrounds } from '../assets/backgrounds';

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
      default:
        return <div>Window content not found</div>;
    }
  };

  return (
    <div 
      className="desktop-environment"
      style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: `url("${wallpaper}")`,
        backgroundSize: 'cover',
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
            position={window.position}
            size={window.size}
            zIndex={window.zIndex}
            isFocused={window.isFocused}
            isMinimized={window.isMinimized}
            isMaximized={window.isMaximized}
            onClose={() => closeWindow(window.id)}
            onFocus={() => focusWindow(window.id)}
            onMove={(position) => moveWindow(window.id, position)}
            onMinimize={() => minimizeWindow(window.id)}
            onMaximize={() => maximizeWindow(window.id)}
            onRestore={() => restoreWindow(window.id)}
            desktopSize={desktopSize}
          >
            {getWindowContent(window.id)}
          </Window>
        )
      ))}

      {/* Dock */}
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
    </div>
  );
};

export default Desktop;
