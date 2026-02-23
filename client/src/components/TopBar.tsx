import React, { useState, useEffect } from 'react';
import { formatTime, formatDate } from '../lib/os-utils';
import { NaniLogo } from '../assets/Icons';
import logoImg from '@/assets/nanitech-logo.png';
import { useAppState } from '../hooks/use-app-state';
import Search from './Search';
import ControlPanel from './ControlPanel';
import { useIsMobile } from '../hooks/use-mobile';

const TopBar: React.FC = () => {
  const { settings } = useAppState();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const isMobile = useIsMobile();
  
  // Update clock
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, settings.clockSettings.showSeconds ? 1000 : 60000); // Update every second or minute
    
    return () => clearInterval(interval);
  }, [settings.clockSettings.showSeconds]);

  return (
    <div className={`top-bar ${isMobile ? 'mobile-top-bar' : ''}`}>
      <div className="flex items-center gap-2">
        <img
          src={logoImg}
          alt="NaniTech logo"
          className="h-6 w-auto object-contain"
        />
        <span className="text-light font-medium text-sm">NaniOS</span>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        {/* Browser Search Icon */}
        <Search className="mr-1 md:mr-2" />
        
        <div className="text-xs md:text-sm text-light-secondary truncate">
          {!isMobile && settings.clockSettings.showDate && (
            <span className="mr-2">{formatDate(currentTime)}</span>
          )}
          <span>
            {formatTime(
              currentTime, 
              settings.clockSettings.format24h, 
              !isMobile && settings.clockSettings.showSeconds
            )}
          </span>
        </div>
        
        {/* Control Panel */}
        <ControlPanel />
      </div>
    </div>
  );
};

export default TopBar;
