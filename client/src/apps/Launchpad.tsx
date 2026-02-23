import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getIconByName } from '../assets/Icons';
import { useQuery } from '@tanstack/react-query';
import { useAppState } from '../hooks/use-app-state';

interface AppItem {
  id: number;
  name: string;
  icon: string;
  category: string;
  windowId?: string;
}

const Launchpad: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredApps, setFilteredApps] = useState<AppItem[]>([]);
  const { openWindow } = useAppState();

  // Fetch app data
  const { data: apps = [] } = useQuery<AppItem[]>({
    queryKey: ['/api/launchpad-apps'],
    queryFn: async () => {
      const response = await fetch('/api/launchpad-apps');
      if (!response.ok) {
        throw new Error('Failed to fetch launchpad apps');
      }
      return response.json();
    }
  });

  // Filter apps when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredApps(apps);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = apps.filter(app => 
      app.name.toLowerCase().includes(term) || 
      app.category.toLowerCase().includes(term)
    );
    
    setFilteredApps(filtered);
  }, [searchTerm, apps]);

  // Get appropriate background color based on icon name
  const getIconBackground = (iconName: string) => {
    const colors: Record<string, string> = {
      document: 'bg-blue-500/20 text-blue-400',
      'plus-circle': 'bg-purple-500/20 text-purple-400',
      file: 'bg-green-500/20 text-green-400',
      chart: 'bg-yellow-500/20 text-yellow-400',
      video: 'bg-red-500/20 text-red-400',
      clock: 'bg-teal-500/20 text-teal-400',
      mail: 'bg-pink-500/20 text-pink-400',
      sparkles: 'bg-orange-500/20 text-orange-400'
    };
    
    return colors[iconName] || 'bg-accent/20 text-accent';
  };

  return (
    <div className="p-3">
      <div className="search-bar mb-4 flex items-center gap-2 p-2 bg-white/10 rounded-lg">
        {getIconByName('search', { size: 'sm', className: 'text-light opacity-70' })}
        <input 
          type="text" 
          className="bg-transparent border-0 text-light text-sm p-2 flex-1 outline-none placeholder-light/50"
          placeholder="Search apps..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="launchpad-grid">
        {filteredApps.length === 0 ? (
          <div className="col-span-full text-center py-10 text-light-secondary">
            No apps match your search
          </div>
        ) : (
          filteredApps.map((app) => (
            <motion.div
              key={app.id}
              className="app-item"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const winId = app.windowId ?? app.name.toLowerCase();
                if (winId) openWindow(winId);
              }}
              role="button"
              tabIndex={0}
            >
              <div className={`app-icon ${getIconBackground(app.icon)}`}>
                {getIconByName(app.icon)}
              </div>
              <div className="app-name">{app.name}</div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Launchpad;
