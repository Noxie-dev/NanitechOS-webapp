import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

// Define the window type
export interface WindowState {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isFocused: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

// Define the app state
export interface AppState {
  windows: WindowState[];
  activeWindowId: string | null;
  dockApps: { id: string; title: string; icon: string; tooltip: string }[];
  settings: {
    darkMode: boolean;
    animations: boolean;
    blurEffects: boolean;
    showDesktopIcons: boolean;
    dockSettings: {
      magnification: boolean;
      autoHide: boolean;
      showLabels: boolean;
    };
    clockSettings: {
      format24h: boolean;
      showSeconds: boolean;
      showDate: boolean;
    };
  };
  wallpaper: string;
  companyInfo: {
    story: string;
    team: { name: string; position: string }[];
    values: { name: string; description: string }[];
    mission: string;
  };
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  moveWindow: (id: string, position: { x: number; y: number }) => void;
  resizeWindow: (id: string, size: { width: number; height: number }) => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  setWallpaper: (wallpaper: string) => void;
}

// Create the context
const AppStateContext = createContext<AppState | undefined>(undefined);

// Provider component
export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [zIndexCounter, setZIndexCounter] = useState(100);
  const [wallpaper, setWallpaper] = useState<string>('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1600&ixlib=rb-4.0.3');

  // Fetch settings
  const { data: settingsData } = useQuery({
    queryKey: ['/api/settings'],
    queryFn: async () => {
      const response = await fetch('/api/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      return response.json();
    },
    initialData: {
      darkMode: true,
      animations: true,
      blurEffects: true,
      showDesktopIcons: false,
      dockSettings: {
        magnification: true,
        autoHide: false,
        showLabels: true
      },
      clockSettings: {
        format24h: false,
        showSeconds: false,
        showDate: true
      }
    }
  });

  // Fetch company info
  const { data: companyInfoData } = useQuery({
    queryKey: ['/api/company-info'],
    queryFn: async () => {
      const response = await fetch('/api/company-info');
      if (!response.ok) {
        throw new Error('Failed to fetch company info');
      }
      return response.json();
    },
    initialData: {
      story: '',
      team: [],
      values: [],
      mission: ''
    }
  });

  // Define initial windows
  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: 'vault',
      title: 'NaniVault',
      icon: 'folder',
      isOpen: false,
      isFocused: false,
      position: { x: 0, y: 0 },
      size: { width: 700, height: 500 },
      zIndex: 10
    },
    {
      id: 'launchpad',
      title: 'Launchpad',
      icon: 'apps',
      isOpen: false,
      isFocused: false,
      position: { x: 0, y: 0 },
      size: { width: 800, height: 550 },
      zIndex: 10
    },
    {
      id: 'assist',
      title: 'NaniAssist',
      icon: 'terminal',
      isOpen: false,
      isFocused: false,
      position: { x: 0, y: 0 },
      size: { width: 650, height: 480 },
      zIndex: 10
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings',
      isOpen: false,
      isFocused: false,
      position: { x: 0, y: 0 },
      size: { width: 750, height: 520 },
      zIndex: 10
    }
  ]);

  // Define dock apps
  const dockApps = [
    { id: 'vault', title: 'NaniVault', icon: 'folder', tooltip: 'NaniVault' },
    { id: 'launchpad', title: 'Launchpad', icon: 'apps', tooltip: 'Launchpad' },
    { id: 'assist', title: 'NaniAssist', icon: 'terminal', tooltip: 'NaniAssist' },
    { id: 'settings', title: 'Settings', icon: 'settings', tooltip: 'Settings' }
  ];

  // Center a window on the screen
  const centerWindow = (windowId: string) => {
    const windowItem = windows.find(w => w.id === windowId);
    if (!windowItem) return;

    // Using window global object for viewport dimensions
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    const x = Math.max(0, (viewportWidth - windowItem.size.width) / 2);
    const y = Math.max(0, (viewportHeight - windowItem.size.height) / 2);

    return { x, y };
  };

  // Window management functions
  const openWindow = (id: string) => {
    setWindows(prev => prev.map(windowItem => {
      if (windowItem.id === id) {
        const centeredPosition = centerWindow(id) || windowItem.position;
        return {
          ...windowItem,
          isOpen: true,
          isFocused: true,
          position: centeredPosition,
          zIndex: zIndexCounter
        };
      }
      return { ...windowItem, isFocused: false };
    }));
    setActiveWindowId(id);
    setZIndexCounter(prev => prev + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.map(windowItem => {
      if (windowItem.id === id) {
        return { ...windowItem, isOpen: false, isFocused: false };
      }
      return windowItem;
    }));
    
    // Set the next active window (the one with the highest z-index)
    const remainingWindows = windows.filter(w => w.isOpen && w.id !== id);
    if (remainingWindows.length > 0) {
      const highestZ = Math.max(...remainingWindows.map(w => w.zIndex));
      const nextActive = remainingWindows.find(w => w.zIndex === highestZ);
      if (nextActive) {
        setActiveWindowId(nextActive.id);
        setWindows(prev => prev.map(windowItem => {
          if (windowItem.id === nextActive.id) {
            return { ...windowItem, isFocused: true };
          }
          return windowItem;
        }));
      } else {
        setActiveWindowId(null);
      }
    } else {
      setActiveWindowId(null);
    }
  };

  const focusWindow = (id: string) => {
    setWindows(prev => prev.map(windowItem => {
      if (windowItem.id === id) {
        return { ...windowItem, isFocused: true, zIndex: zIndexCounter };
      }
      return { ...windowItem, isFocused: false };
    }));
    setActiveWindowId(id);
    setZIndexCounter(prev => prev + 1);
  };

  const moveWindow = (id: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(windowItem => {
      if (windowItem.id === id) {
        return { ...windowItem, position };
      }
      return windowItem;
    }));
  };

  const resizeWindow = (id: string, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(windowItem => {
      if (windowItem.id === id) {
        return { ...windowItem, size };
      }
      return windowItem;
    }));
  };

  const updateSettings = (newSettings: Partial<AppState['settings']>) => {
    // In a real app, we would save settings to the server here
  };

  // Position windows in the center on initial render
  useEffect(() => {
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    setWindows(prev => prev.map(windowItem => {
      const x = (viewportWidth - windowItem.size.width) / 2;
      const y = (viewportHeight - windowItem.size.height) / 2;
      return { ...windowItem, position: { x, y } };
    }));
  }, []);

  const value: AppState = {
    windows,
    activeWindowId,
    dockApps,
    settings: settingsData,
    wallpaper,
    companyInfo: companyInfoData,
    openWindow,
    closeWindow,
    focusWindow,
    moveWindow,
    resizeWindow,
    updateSettings,
    setWallpaper
  };

  const providerProps = { value }; 
  return React.createElement(AppStateContext.Provider, providerProps, children);
};

// Hook to use app state
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};