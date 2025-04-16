import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getIconByName } from '../assets/Icons';
import { constrainToViewport } from '../lib/os-utils';
import Draggable from 'react-draggable';

interface WindowProps {
  id: string;
  title: string;
  icon: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isFocused: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  children: React.ReactNode;
  onClose: () => void;
  onFocus: () => void;
  onMove: (position: { x: number; y: number }) => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onRestore: () => void;
  desktopSize: { width: number; height: number };
  isMobileDevice?: boolean;
}

const Window: React.FC<WindowProps> = ({
  id,
  title,
  icon,
  position,
  size,
  zIndex,
  isFocused,
  isMinimized,
  isMaximized,
  children,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  onMaximize,
  onRestore,
  desktopSize,
  isMobileDevice = false
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  // Ensure window is placed correctly on mount (not on mobile)
  useEffect(() => {
    if (!isMobileDevice) {
      // Center window if position is at origin
      if (position.x === 0 && position.y === 0) {
        const x = (desktopSize.width - size.width) / 2;
        const y = (desktopSize.height - size.height) / 2;
        onMove({ x, y });
      }
    }
  }, []);

  // Constrain window to viewport on resize (not needed on mobile)
  useEffect(() => {
    if (!isMobileDevice && !isMaximized) {
      const constrained = constrainToViewport(
        position.x,
        position.y,
        size.width,
        size.height,
        desktopSize.width,
        desktopSize.height
      );
      
      if (constrained.x !== position.x || constrained.y !== position.y) {
        onMove(constrained);
      }
    }
  }, [desktopSize, position, size, isMobileDevice, isMaximized]);

  const handleDragStop = (_e: any, data: { x: number; y: number }) => {
    const constrained = constrainToViewport(
      data.x,
      data.y,
      size.width,
      size.height,
      desktopSize.width,
      desktopSize.height
    );
    
    onMove(constrained);
  };

  // Skip rendering if minimized
  if (isMinimized) {
    return null;
  }

  const handleMaximizeClick = () => {
    if (isMaximized) {
      onRestore();
    } else {
      onMaximize();
    }
  };

  // Define window classes based on mobile/desktop and maximized states
  const windowClasses = [
    'os-window',
    isFocused ? 'ring-1 ring-accent/50' : '',
    isMaximized ? 'maximized' : '',
    isMobileDevice ? 'mobile-window' : ''
  ].filter(Boolean).join(' ');

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-header"
      position={position}
      onStop={handleDragStop}
      onMouseDown={onFocus}
      disabled={isMaximized || isMobileDevice} // Disable dragging when maximized or on mobile
    >
      <motion.div
        ref={nodeRef}
        className={windowClasses}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        style={{
          width: `${size.width}px`,
          height: `${size.height}px`,
          zIndex: zIndex
        }}
      >
        <div className="window-header">
          <div className="window-title" onDoubleClick={isMobileDevice ? undefined : handleMaximizeClick}>
            {getIconByName(icon, { size: 'sm', className: 'text-white' })}
            <span>{title}</span>
          </div>
          <div className="window-controls">
            {!isMobileDevice && (
              <>
                <button 
                  className="control-button minimize-btn" 
                  onClick={onMinimize}
                  title="Minimize"
                ></button>
                <button 
                  className="control-button maximize-btn" 
                  onClick={handleMaximizeClick}
                  title={isMaximized ? "Restore" : "Maximize"}
                ></button>
              </>
            )}
            <button 
              className="control-button close-btn" 
              onClick={onClose}
              title="Close"
            ></button>
          </div>
        </div>
        <div className={`window-content ${isMobileDevice ? 'mobile-window-content' : ''}`}>
          {children}
        </div>
      </motion.div>
    </Draggable>
  );
};

export default Window;
