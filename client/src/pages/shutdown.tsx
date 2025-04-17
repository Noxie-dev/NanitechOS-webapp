import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { NaniLogo } from '../assets/Icons';

const Shutdown = () => {
  const [redirecting, setRedirecting] = useState(false);
  
  useEffect(() => {
    // After 3 seconds, set redirecting state
    const timer = setTimeout(() => {
      setRedirecting(true);
    }, 3000);
    
    // After 5 seconds, redirect back to home
    const redirectTimer = setTimeout(() => {
      window.location.href = '/';
    }, 5000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimer);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 1 }}
        animate={redirecting ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <NaniLogo size="xl" className="text-accent mb-6" />
        <h1 className="text-light text-2xl font-medium mb-2">Shutting down...</h1>
        <p className="text-light/60 text-center max-w-md">
          Thank you for using NaniOS. Your session is now ending.
        </p>
      </motion.div>
      
      {redirecting && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <NaniLogo size="xl" className="text-accent mb-6" />
          <h1 className="text-light text-2xl font-medium mb-2">Restarting...</h1>
          <p className="text-light/60 text-center max-w-md">
            Just kidding! Returning to NaniOS...
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Shutdown;