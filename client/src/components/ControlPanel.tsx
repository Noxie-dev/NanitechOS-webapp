import React, { useState, useRef } from 'react';
import {
  Wifi,
  Bluetooth,
  Battery,
  Settings,
  Power,
  Moon,
  Sun,
  Plane,
  Camera,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAppState } from '@/hooks/use-app-state';
import html2canvas from 'html2canvas';

interface SocialProfile {
  name: string;
  url: string;
  icon: React.ReactNode;
  strength: number; // 1-4 for signal strength
}

interface Department {
  name: string;
  email: string;
  role: string;
}

const ControlPanel = () => {
  const { toast } = useToast();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);
  const [isBluetoothModalOpen, setIsBluetoothModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPowerModalOpen, setIsPowerModalOpen] = useState(false);
  const [volume, setVolume] = useState(70);
  const [brightness, setBrightness] = useState(80);
  const [isAirplaneMode, setIsAirplaneMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isPowerSaving, setIsPowerSaving] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(55);
  const brightnessOverlayRef = useRef<HTMLDivElement | null>(null);
  
  // Social profiles for WiFi modal
  const socialProfiles: SocialProfile[] = [
    { name: 'Twitter', url: 'https://twitter.com/nanitech', icon: <i className="fa-brands fa-twitter"></i>, strength: 4 },
    { name: 'LinkedIn', url: 'https://linkedin.com/company/nanitech', icon: <i className="fa-brands fa-linkedin"></i>, strength: 3 },
    { name: 'GitHub', url: 'https://github.com/nanitech', icon: <i className="fa-brands fa-github"></i>, strength: 4 },
    { name: 'Instagram', url: 'https://instagram.com/nanitechofficial', icon: <i className="fa-brands fa-instagram"></i>, strength: 2 },
    { name: 'YouTube', url: 'https://youtube.com/c/nanitech', icon: <i className="fa-brands fa-youtube"></i>, strength: 1 },
  ];
  
  // Departments for Bluetooth modal
  const departments: Department[] = [
    { name: 'Customer Support', email: 'support@nanitech.com', role: 'Technical assistance and customer care' },
    { name: 'Sales Team', email: 'sales@nanitech.com', role: 'Product inquiries and business opportunities' },
    { name: 'Engineering', email: 'engineering@nanitech.com', role: 'Technical collaborations and integration support' },
    { name: 'Marketing', email: 'marketing@nanitech.com', role: 'Media relations and partnership opportunities' },
    { name: 'Careers', email: 'careers@nanitech.com', role: 'Job opportunities and talent acquisition' },
  ];

  // Handle airplane mode toggle
  const handleAirplaneModeToggle = () => {
    setIsAirplaneMode(!isAirplaneMode);
    
    if (!isAirplaneMode) {
      // Entering airplane mode
      document.body.classList.add('airplane-mode');
      toast({
        title: 'Airplane Mode Activated',
        description: 'Animations disabled. Using low-bandwidth mode.',
      });
    } else {
      // Exiting airplane mode
      document.body.classList.remove('airplane-mode');
      toast({
        title: 'Airplane Mode Deactivated',
        description: 'Normal functionality restored.',
      });
    }
  };

  // Handle screenshot
  const takeScreenshot = async () => {
    const desktopElement = document.getElementById('desktop-environment');
    if (desktopElement) {
      try {
        const canvas = await html2canvas(desktopElement);
        const image = canvas.toDataURL('image/png');
        
        // Create temporary link to download image
        const link = document.createElement('a');
        link.href = image;
        link.download = 'naniOS-screenshot.png';
        link.click();
        
        toast({
          title: 'Screenshot Captured',
          description: 'Image has been saved to your downloads.',
        });
        
        // Close panel after screenshot
        setIsPanelOpen(false);
      } catch (error) {
        toast({
          title: 'Screenshot Failed',
          description: 'Unable to capture screenshot. Please try again.',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Screenshot Failed',
        description: 'Desktop environment not found.',
        variant: 'destructive',
      });
    }
  };

  // Handle power button
  const handlePowerButton = () => {
    setIsPowerModalOpen(true);
  };

  // Shutdown system
  const shutdownSystem = () => {
    setIsPowerModalOpen(false);
    
    // Show shutdown animation
    document.body.classList.add('shutting-down');
    
    // Simulate shutdown and redirect
    setTimeout(() => {
      window.location.href = '/shutdown';
      // Alternatively, if allowed by browser: window.close();
    }, 2000);
  };

  // Handle brightness change
  const handleBrightnessChange = (value: number[]) => {
    const newBrightness = value[0];
    setBrightness(newBrightness);
    
    if (brightnessOverlayRef.current) {
      // Convert brightness from 0-100 to CSS brightness filter (0.3-1.0)
      const cssOpacity = (100 - newBrightness) / 100 * 0.7;
      brightnessOverlayRef.current.style.opacity = cssOpacity.toString();
    }
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    // If we had audio elements, we would adjust their volume here
  };

  // Handle contact connect (copy email or open mail client)
  const handleConnect = (email: string) => {
    // Try to copy email to clipboard
    navigator.clipboard.writeText(email).then(() => {
      toast({
        title: 'Email Copied',
        description: `${email} has been copied to clipboard.`,
      });
    }).catch(() => {
      // Fallback to mailto if clipboard fails
      window.location.href = `mailto:${email}`;
    });
  };

  return (
    <>
      {/* Brightness overlay - controlled by brightness slider */}
      <div 
        ref={brightnessOverlayRef} 
        className="fixed inset-0 bg-black pointer-events-none z-[100]" 
        style={{ opacity: (100 - brightness) / 100 * 0.7 }}
      />
    
      {/* Control panel button in top bar */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-white/10 relative text-light"
          onClick={() => setIsPanelOpen(!isPanelOpen)}
        >
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-800/80">
            <Battery className="h-4 w-4" />
            <span className="text-xs">{batteryLevel}%</span>
          </div>
        </Button>
      </div>

      {/* Control Panel Dropdown */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-10 right-2 w-80 bg-zinc-900/95 backdrop-blur-md rounded-xl shadow-xl z-20 border border-zinc-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 space-y-3">
              {/* Top row of icons */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1 bg-zinc-800 rounded-full px-3 py-1">
                  <Battery className="h-4 w-4 text-light/70" />
                  <span className="text-xs text-light">{batteryLevel}%</span>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-zinc-800" onClick={takeScreenshot}>
                    <Camera className="h-4 w-4 text-light/70" />
                  </Button>
                  
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-zinc-800" onClick={() => setIsSettingsModalOpen(true)}>
                    <Settings className="h-4 w-4 text-light/70" />
                  </Button>
                  
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-zinc-800" onClick={handlePowerButton}>
                    <Power className="h-4 w-4 text-light/70" />
                  </Button>
                </div>
              </div>
              
              {/* Volume slider */}
              <div className="flex items-center gap-3">
                {volume === 0 ? (
                  <VolumeX className="h-5 w-5 text-light/70" />
                ) : (
                  <Volume2 className="h-5 w-5 text-light/70" />
                )}
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  className="flex-1"
                  onValueChange={handleVolumeChange}
                />
              </div>
              
              {/* Brightness slider */}
              <div className="flex items-center gap-3">
                <Sun className="h-5 w-5 text-light/70" />
                <Slider
                  value={[brightness]}
                  max={100}
                  step={1}
                  className="flex-1"
                  onValueChange={handleBrightnessChange}
                />
              </div>
              
              {/* Connection controls */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <Button 
                  variant="default" 
                  className={cn(
                    "rounded-full justify-between text-left pl-4 pr-2 py-3 h-auto",
                    "bg-blue-500 hover:bg-blue-600 text-white"
                  )}
                  onClick={() => setIsWifiModalOpen(true)}
                >
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Wi-Fi</span>
                      <span className="text-xs opacity-80">Social Hub</span>
                    </div>
                  </div>
                  <div className="text-lg">›</div>
                </Button>
                
                <Button 
                  variant="default" 
                  className={cn(
                    "rounded-full justify-between text-left pl-4 pr-2 py-3 h-auto",
                    "bg-blue-500 hover:bg-blue-600 text-white"
                  )}
                  onClick={() => setIsBluetoothModalOpen(true)}
                >
                  <div className="flex items-center gap-2">
                    <Bluetooth className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Bluetooth</span>
                      <span className="text-xs opacity-80">Contacts</span>
                    </div>
                  </div>
                  <div className="text-lg">›</div>
                </Button>
                
                <Button 
                  variant="default" 
                  className={cn(
                    "rounded-full justify-between text-left pl-4 pr-2 py-3 h-auto",
                    "bg-zinc-800 hover:bg-zinc-700 text-white"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Battery className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Power Mode</span>
                      <span className="text-xs opacity-80">Balanced</span>
                    </div>
                  </div>
                  <div className="text-lg">›</div>
                </Button>
                
                <Button 
                  variant="default" 
                  className={cn(
                    "rounded-full justify-between text-left pl-4 pr-2 py-3 h-auto",
                    "bg-zinc-800 hover:bg-zinc-700 text-white"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Night Light</span>
                      <span className="text-xs opacity-80">Off</span>
                    </div>
                  </div>
                  <div className="text-lg">›</div>
                </Button>
              </div>
              
              {/* Bottom toggles */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Button 
                  variant="default" 
                  className={cn(
                    "rounded-full justify-start text-left pl-4 pr-2 py-3 h-auto",
                    isDarkMode ? "bg-blue-500 hover:bg-blue-600" : "bg-zinc-800 hover:bg-zinc-700",
                    "text-white"
                  )}
                  onClick={() => setIsDarkMode(!isDarkMode)}
                >
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    <span className="text-sm font-medium">Dark Style</span>
                  </div>
                </Button>
                
                <Button 
                  variant="default" 
                  className={cn(
                    "rounded-full justify-start text-left pl-4 pr-2 py-3 h-auto",
                    isAirplaneMode ? "bg-blue-500 hover:bg-blue-600" : "bg-zinc-800 hover:bg-zinc-700",
                    "text-white"
                  )}
                  onClick={handleAirplaneModeToggle}
                >
                  <div className="flex items-center gap-2">
                    <Plane className="h-4 w-4" />
                    <span className="text-sm font-medium">Airplane Mode</span>
                  </div>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wi-Fi Modal (Social Media Profiles) */}
      <Dialog open={isWifiModalOpen} onOpenChange={setIsWifiModalOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-900 text-light border-zinc-800">
          <DialogTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-blue-500" />
            Social Media Hub
          </DialogTitle>
          <DialogDescription>
            Connect with NaniTech on our social platforms
          </DialogDescription>
          
          <div className="space-y-3 mt-2">
            {socialProfiles.map((profile) => (
              <div 
                key={profile.name} 
                className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500">
                    {profile.icon}
                  </div>
                  <div>
                    <div className="font-medium">{profile.name}</div>
                    <div className="text-xs text-light/70">
                      <div className="flex items-center gap-1 mt-0.5">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div 
                            key={i} 
                            className={cn(
                              "h-1 rounded-full w-1",
                              i < profile.strength ? "bg-blue-500" : "bg-zinc-600"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs h-7 border-zinc-700 text-light/80"
                  onClick={() => window.open(profile.url, '_blank')}
                >
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Bluetooth Modal (Internal Contacts) */}
      <Dialog open={isBluetoothModalOpen} onOpenChange={setIsBluetoothModalOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-900 text-light border-zinc-800">
          <DialogTitle className="flex items-center gap-2">
            <Bluetooth className="h-5 w-5 text-blue-500" />
            Internal Contacts
          </DialogTitle>
          <DialogDescription>
            Connect with NaniTech departments
          </DialogDescription>
          
          <div className="space-y-3 mt-2">
            {departments.map((dept) => (
              <div 
                key={dept.name} 
                className="flex flex-col p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{dept.name}</div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-xs h-7 border-zinc-700 text-light/80"
                    onClick={() => handleConnect(dept.email)}
                  >
                    Connect
                  </Button>
                </div>
                <div className="text-xs text-light/70 mt-1">{dept.email}</div>
                <div className="text-xs text-light/60 mt-0.5">{dept.role}</div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-900 text-light border-zinc-800">
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-500" />
            System Settings
          </DialogTitle>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-light/90">Accessibility</h3>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-light/80">High Contrast</label>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-light/80">Reduce Motion</label>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-light/80">Dyslexic Font</label>
                <Switch />
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-light/90">Display & Sound</h3>
              
              <div>
                <label className="text-sm text-light/80 block mb-2">Font Size</label>
                <Slider defaultValue={[50]} max={100} step={1} />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-light/80">Dark Mode</label>
                <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-light/80">UI Sounds</label>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Power Modal */}
      <Dialog open={isPowerModalOpen} onOpenChange={setIsPowerModalOpen}>
        <DialogContent className="sm:max-w-xs bg-zinc-900 text-light border-zinc-800 text-center">
          <div className="space-y-4 py-4">
            <Power className="h-10 w-10 text-red-500 mx-auto" />
            
            <DialogTitle className="text-center mb-0">Shutdown System</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to exit NaniOS?
            </DialogDescription>
            
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="outline" onClick={() => setIsPowerModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={shutdownSystem}>
                Shutdown
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ControlPanel;