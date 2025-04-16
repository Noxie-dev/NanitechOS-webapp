import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NaniLogo } from '../assets/Icons';

const MobileDetector: React.FC = () => {
  const [isVerySmallScreen, setIsVerySmallScreen] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsVerySmallScreen(window.innerWidth < 320);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  if (!isVerySmallScreen) return null;
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <NaniLogo size="lg" className="text-accent mb-4" />
      <h2 className="text-light text-lg font-medium mb-2">Screen Size Notice</h2>
      <p className="text-light/70 text-sm mb-4">
        Your screen is very small. For the best experience, please use a device with a larger screen.
      </p>
      <p className="text-xs text-light/50">
        You can continue using NaniOS, but some features may not display correctly.
      </p>
    </motion.div>
  );
};

export default MobileDetector;