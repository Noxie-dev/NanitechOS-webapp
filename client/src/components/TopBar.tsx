import React, { useState, useEffect } from 'react';
import { formatTime, formatDate } from '../lib/os-utils';
import { NaniLogo } from '../assets/Icons';
import { useAppState } from '../hooks/use-app-state';
import Search from './Search';

const TopBar: React.FC = () => {
  const { settings } = useAppState();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Update clock
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, settings.clockSettings.showSeconds ? 1000 : 60000); // Update every second or minute
    
    return () => clearInterval(interval);
  }, [settings.clockSettings.showSeconds]);

  return (
    <div className="top-bar">
      <div className="flex items-center gap-2">
        <NaniLogo size="sm" className="text-accent" />
        <span className="text-light font-medium text-sm">NaniOS</span>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Browser Search Icon */}
        <Search className="mr-2" />
        
        <div className="text-sm text-light-secondary">
          {settings.clockSettings.showDate && (
            <span className="mr-2">{formatDate(currentTime)}</span>
          )}
          <span>
            {formatTime(
              currentTime, 
              settings.clockSettings.format24h, 
              settings.clockSettings.showSeconds
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
