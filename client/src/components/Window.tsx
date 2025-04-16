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
  children: React.ReactNode;
  onClose: () => void;
  onFocus: () => void;
  onMove: (position: { x: number; y: number }) => void;
  desktopSize: { width: number; height: number };
}

const Window: React.FC<WindowProps> = ({
  id,
  title,
  icon,
  position,
  size,
  zIndex,
  isFocused,
  children,
  onClose,
  onFocus,
  onMove,
  desktopSize
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  // Ensure window is placed correctly on mount
  useEffect(() => {
    // Center window if position is at origin
    if (position.x === 0 && position.y === 0) {
      const x = (desktopSize.width - size.width) / 2;
      const y = (desktopSize.height - size.height) / 2;
      onMove({ x, y });
    }
  }, []);

  // Constrain window to viewport on resize
  useEffect(() => {
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
  }, [desktopSize, position, size]);

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

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-header"
      position={position}
      onStop={handleDragStop}
      onMouseDown={onFocus}
    >
      <motion.div
        ref={nodeRef}
        className={`os-window ${isFocused ? 'ring-1 ring-accent/50' : ''}`}
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
          <div className="window-title">
            {getIconByName(icon, { size: 'sm', className: 'text-light' })}
            <span>{title}</span>
          </div>
          <div className="window-controls">
            <button className="control-button minimize-btn"></button>
            <button className="control-button maximize-btn"></button>
            <button className="control-button close-btn" onClick={onClose}></button>
          </div>
        </div>
        <div className="window-content">{children}</div>
      </motion.div>
    </Draggable>
  );
};

export default Window;
