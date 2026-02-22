import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

// Define the window type
export interface WindowState {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isFocused: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  originalSize?: { width: number; height: number };
  originalPosition?: { x: number; y: number };
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
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
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
      story: `NaniTech was founded with a clear mission: to build intelligent digital products that solve real problems and scale with purpose — especially in fast-growing, high-impact markets.

Rooted in the African tech ecosystem and inspired by global innovation, we work at the intersection of SaaS, startups, and AI-driven development. We understand the realities founders and businesses face: limited resources, high expectations, and the need to move fast without breaking what matters.

That’s why our approach is both innovative and practical.

We design and build apps, web apps, and websites either:
• AI-first, from the ground up, where intelligence is part of the foundation
• Or by meaningfully integrating AI into existing platforms, enhancing performance, productivity, and decision-making without unnecessary disruption

AI, for us, is not hype. It’s a tool — one we use deliberately to help our clients:
• Increase productivity and efficiency
• Unlock new revenue streams
• Improve customer experience and engagement
• Scale sustainably in competitive markets

We build with startups in mind and SaaS at heart — focusing on clean architecture, scalability, and long-term value. Every solution is crafted to grow with the business, adapt to change, and stay relevant in a rapidly evolving digital landscape.

At NaniTech, we believe African innovation belongs on the global stage. We build technology that reflects that belief — bold, intelligent, and built for impact.`,
      team: [],
      values: [],
      mission: '',
      teamContent: `NaniTech is founder-led and builder-driven.

At its core is a hands-on technologist and strategist who believes that software should do more than function — it should solve real problems, unlock opportunity, and create measurable impact.

What started as a deep curiosity about systems, platforms, and digital ecosystems evolved into a focused mission: to build intelligent SaaS products that improve productivity, expand access, and generate real value for businesses and users alike.

A Builder’s Mindset
I approach development as both a technical challenge and a strategic opportunity. Whether architecting a web platform, integrating AI into an existing system, or designing a product from the ground up, I focus on:
• Clean, scalable foundations
• Thoughtful system architecture
• Practical innovation over hype
• Long-term sustainability over shortcuts

Every feature must earn its place. Every integration must serve a purpose.

AI With Intention
AI isn’t an add-on — it’s a capability. I believe in building AI-powered systems that are meaningful, not superficial. That means:
• Automating intelligently
• Enhancing decision-making
• Improving operational efficiency
• Increasing revenue potential
• Strengthening competitive advantage

From AI-first applications to smart integrations within existing platforms, the goal is always the same: make technology work harder so people can work smarter.

Entrepreneurial and Execution-Focused
Building in emerging and high-growth markets requires resilience, adaptability, and strategic thinking. I understand the realities of startups — limited resources, ambitious goals, and the need to move quickly without sacrificing quality.

NaniTech reflects that mindset: lean, deliberate, and focused on building products that scale.

While NaniTech collaborates with partners and specialists when needed, it is guided by a strong, hands-on leadership approach — ensuring every solution meets high standards of innovation, performance, and impact.

This isn’t just development.
It’s building intelligent systems with purpose.`
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
      isMinimized: false,
      isMaximized: false,
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
      isMinimized: false,
      isMaximized: false,
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
      isMinimized: false,
      isMaximized: false,
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
      isMinimized: false,
      isMaximized: false,
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

  // Minimize a window
  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(windowItem => {
      if (windowItem.id === id) {
        return { ...windowItem, isMinimized: true };
      }
      return windowItem;
    }));
    
    // Set the next active window (the one with the highest z-index)
    const remainingWindows = windows.filter(w => w.isOpen && !w.isMinimized && w.id !== id);
    if (remainingWindows.length > 0) {
      const highestZ = Math.max(...remainingWindows.map(w => w.zIndex));
      const nextActive = remainingWindows.find(w => w.zIndex === highestZ);
      if (nextActive) {
        setActiveWindowId(nextActive.id);
        setWindows(prev => prev.map(windowItem => {
          if (windowItem.id === nextActive.id) {
            return { ...windowItem, isFocused: true };
          }
          return { ...windowItem, isFocused: false };
        }));
      } else {
        setActiveWindowId(null);
      }
    } else {
      setActiveWindowId(null);
    }
  };

  // Maximize a window
  const maximizeWindow = (id: string) => {
    // Get viewport dimensions
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
    setWindows(prev => prev.map(windowItem => {
      if (windowItem.id === id) {
        // Save current size and position if not maximized
        if (!windowItem.isMaximized) {
          return {
            ...windowItem,
            isMaximized: true,
            isMinimized: false,
            originalSize: { ...windowItem.size },
            originalPosition: { ...windowItem.position },
            // Set to full viewport size with a small margin
            size: { width: viewportWidth - 40, height: viewportHeight - 80 },
            position: { x: 20, y: 40 }
          };
        } else {
          // Already maximized, do nothing
          return windowItem;
        }
      }
      return windowItem;
    }));
    
    // Focus the window
    focusWindow(id);
  };

  // Restore a window from minimized or maximized state
  const restoreWindow = (id: string) => {
    setWindows(prev => prev.map(windowItem => {
      if (windowItem.id === id) {
        if (windowItem.isMaximized && windowItem.originalSize && windowItem.originalPosition) {
          // Restore from maximized
          return {
            ...windowItem,
            isMaximized: false,
            isMinimized: false,
            size: windowItem.originalSize,
            position: windowItem.originalPosition
          };
        } else if (windowItem.isMinimized) {
          // Restore from minimized
          return {
            ...windowItem,
            isMinimized: false
          };
        }
        return windowItem;
      }
      return windowItem;
    }));
    
    // Focus the window
    focusWindow(id);
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
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
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