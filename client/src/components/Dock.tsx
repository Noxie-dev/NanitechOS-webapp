import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getIconByName } from '../assets/Icons';
import { useAppState } from '../hooks/use-app-state';

interface DockProps {
  onItemClick: (id: string) => void;
}

const Dock: React.FC<DockProps> = ({ onItemClick }) => {
  const { dockApps, windows, settings } = useAppState();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="dock-container">
      <motion.div 
        className="dock"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {dockApps.map((app) => {
          const isOpen = windows.find(w => w.id === app.id)?.isOpen || false;
          const isHovered = hoveredItem === app.id;
          
          return (
            <motion.div
              key={app.id}
              className="dock-item"
              whileHover={{ 
                scale: settings.dockSettings.magnification ? 1.15 : 1.05, 
                y: -5,
                backgroundColor: 'rgba(255, 255, 255, 0.15)' 
              }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setHoveredItem(app.id)}
              onHoverEnd={() => setHoveredItem(null)}
              onClick={() => onItemClick(app.id)}
              style={{ position: 'relative' }}
            >
              {getIconByName(app.icon, { 
                size: 'lg', 
                className: 'text-light' 
              })}
              
              {/* Indicator dot for open windows */}
              {isOpen && (
                <div className="absolute -bottom-1 w-1 h-1 bg-accent rounded-full"></div>
              )}
              
              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && settings.dockSettings.showLabels && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: -35 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute left-1/2 transform -translate-x-1/2 bg-secondary/90 text-light py-1 px-2.5 rounded text-xs whitespace-nowrap"
                    style={{ pointerEvents: 'none' }}
                  >
                    {app.tooltip}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Dock;
