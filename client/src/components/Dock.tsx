import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getIconByName } from '../assets/Icons';
import { useAppState } from '../hooks/use-app-state';
import { useIsMobile } from '../hooks/use-mobile';

interface DockProps {
  onItemClick: (id: string) => void;
}

const Dock: React.FC<DockProps> = ({ onItemClick }) => {
  const { dockApps, windows, settings } = useAppState();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const isMobile = useIsMobile();

  return (
    <div className={`dock-container ${isMobile ? 'mobile-dock-container' : ''}`}>
      <motion.div 
        className={`dock ${isMobile ? 'mobile-dock' : ''}`}
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
              className={`dock-item ${isMobile ? 'mobile-dock-item' : ''}`}
              whileHover={!isMobile ? { 
                scale: settings.dockSettings.magnification ? 1.15 : 1.05, 
                y: -5,
                backgroundColor: 'rgba(255, 255, 255, 0.15)' 
              } : {}}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => !isMobile && setHoveredItem(app.id)}
              onHoverEnd={() => !isMobile && setHoveredItem(null)}
              onClick={() => onItemClick(app.id)}
              style={{ position: 'relative' }}
            >
              {getIconByName(app.icon, { 
                size: isMobile ? 'md' : 'lg', 
                className: 'text-light' 
              })}
              
              {/* Indicator dot for open windows */}
              {isOpen && (
                <div className={`absolute -bottom-1 ${isMobile ? 'w-0.5 h-0.5' : 'w-1 h-1'} bg-accent rounded-full`}></div>
              )}
              
              {/* Labels on mobile */}
              {isMobile && (
                <div className="text-[10px] text-light/80 mt-1 text-center overflow-hidden text-ellipsis max-w-full">
                  {app.title}
                </div>
              )}
              
              {/* Tooltip (desktop only) */}
              {!isMobile && (
                <AnimatePresence>
                  {isHovered && settings.dockSettings.showLabels && (
                    <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: -35 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute left-1/2 transform -translate-x-1/2 bg-secondary/90 text-white py-1 px-2.5 rounded text-xs whitespace-nowrap"
                    style={{ pointerEvents: 'none' }}
                  >
                      {app.tooltip}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Dock;
