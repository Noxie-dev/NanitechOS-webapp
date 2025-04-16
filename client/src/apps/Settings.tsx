import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getIconByName } from '../assets/Icons';
import { useAppState } from '../hooks/use-app-state';
import { backgrounds } from '../assets/backgrounds';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { settings, updateSettings, wallpaper, setWallpaper } = useAppState();
  const { toast } = useToast();
  
  // Local state to track changes before saving
  const [localSettings, setLocalSettings] = useState({ ...settings });
  const [selectedWallpaper, setSelectedWallpaper] = useState(wallpaper);

  const handleToggleChange = (settingPath: string, value: boolean) => {
    // Update nested settings using path notation (e.g., 'dockSettings.magnification')
    const pathParts = settingPath.split('.');
    const newSettings = { ...localSettings };
    
    let current: any = newSettings;
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]];
    }
    current[pathParts[pathParts.length - 1]] = value;
    
    setLocalSettings(newSettings);
  };

  const handleApplyChanges = () => {
    updateSettings(localSettings);
    setWallpaper(selectedWallpaper);
    
    toast({
      title: "Settings Updated",
      description: "Your settings have been successfully applied.",
      variant: "default",
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-6 text-white">System Settings</h2>
      
      <div className="settings-grid">
        {/* Appearance */}
        <div className="settings-card">
          <div className="settings-header">
            {getIconByName('settings', { className: 'text-accent' })}
            <span>Appearance</span>
          </div>
          <div className="mt-2 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-light-secondary">Dark Mode</span>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={localSettings.darkMode}
                  onChange={(e) => handleToggleChange('darkMode', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-light-secondary">Show Desktop Icons</span>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={localSettings.showDesktopIcons}
                  onChange={(e) => handleToggleChange('showDesktopIcons', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-light-secondary">Blur Effects</span>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={localSettings.blurEffects}
                  onChange={(e) => handleToggleChange('blurEffects', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
        
        {/* System */}
        <div className="settings-card">
          <div className="settings-header">
            {getIconByName('settings', { className: 'text-accent' })}
            <span>System</span>
          </div>
          <div className="mt-2 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-light-secondary">Animations</span>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={localSettings.animations}
                  onChange={(e) => handleToggleChange('animations', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Dock */}
        <div className="settings-card">
          <div className="settings-header">
            {getIconByName('apps', { className: 'text-accent' })}
            <span>Dock</span>
          </div>
          <div className="mt-2 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-light-secondary">Magnification</span>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={localSettings.dockSettings.magnification}
                  onChange={(e) => handleToggleChange('dockSettings.magnification', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-light-secondary">Auto-hide</span>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={localSettings.dockSettings.autoHide}
                  onChange={(e) => handleToggleChange('dockSettings.autoHide', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-light-secondary">Show Labels</span>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={localSettings.dockSettings.showLabels}
                  onChange={(e) => handleToggleChange('dockSettings.showLabels', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Date & Time */}
        <div className="settings-card">
          <div className="settings-header">
            {getIconByName('clock', { className: 'text-accent' })}
            <span>Date & Time</span>
          </div>
          <div className="mt-2 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-light-secondary">24-hour Format</span>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={localSettings.clockSettings.format24h}
                  onChange={(e) => handleToggleChange('clockSettings.format24h', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-light-secondary">Show Seconds</span>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={localSettings.clockSettings.showSeconds}
                  onChange={(e) => handleToggleChange('clockSettings.showSeconds', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-light-secondary">Show Date</span>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={localSettings.clockSettings.showDate}
                  onChange={(e) => handleToggleChange('clockSettings.showDate', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wallpaper Selection */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3 text-white">Wallpaper</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {backgrounds.map((bg) => (
            <motion.div
              key={bg.id}
              className={`relative overflow-hidden rounded-lg cursor-pointer ${
                selectedWallpaper === bg.url ? 'ring-2 ring-accent' : ''
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedWallpaper(bg.url)}
            >
              <div 
                className="h-20 bg-cover bg-center"
                style={{ backgroundImage: `url(${bg.url})` }}
              ></div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-1 px-2">
                <span className="text-xs text-white truncate block">{bg.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Apply Button */}
      <div className="mt-6 pt-4 border-t border-gray-700/50 flex justify-end">
        <motion.button 
          className="bg-accent hover:bg-accent/80 text-white py-2 px-4 rounded-md transition"
          whileHover={{ backgroundColor: 'rgba(0, 168, 255, 0.8)' }}
          whileTap={{ scale: 0.97 }}
          onClick={handleApplyChanges}
        >
          Apply Changes
        </motion.button>
      </div>
    </div>
  );
};

export default Settings;
