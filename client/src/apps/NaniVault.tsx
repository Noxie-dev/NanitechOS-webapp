import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getIconByName } from '../assets/Icons';
import { useAppState } from '../hooks/use-app-state';
import { useQuery } from '@tanstack/react-query';

interface VaultItem {
  id: string;
  icon: string;
  title: string;
}

const NaniVault: React.FC = () => {
  const { companyInfo } = useAppState();
  const [activeSection, setActiveSection] = useState<string>('story');

  const sections: VaultItem[] = [
    { id: 'story', icon: 'document', title: 'Our Story' },
    { id: 'team', icon: 'team', title: 'Team' },
    { id: 'values', icon: 'idea', title: 'Values' },
    { id: 'mission', icon: 'rocket', title: 'Mission' }
  ];

  // Split paragraphs for story content
  const storyParagraphs = companyInfo.story.split('\n\n').filter(p => p.trim());

  const renderContent = () => {
    switch (activeSection) {
      case 'story':
        return (
          <div className="space-y-6 pb-8">
            <h2 className="text-2xl font-bold mb-6 text-light border-b border-accent/30 pb-2">Our Story</h2>
            <div className="space-y-4">
              {storyParagraphs.map((paragraph, index) => {
                if (paragraph.includes('•') || paragraph.includes('- ')) {
                  const lines = paragraph.split('\n').filter(l => l.trim());
                  return (
                    <ul key={index} className="space-y-2 ml-4">
                      {lines.map((line, i) => (
                        <li key={i} className="text-light-secondary flex items-start gap-2">
                          <span className="text-warning mt-1.5">•</span>
                          <span>{line.replace(/^[•-]\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                
                const isHeading = paragraph.length < 100 && (paragraph.includes(':') || paragraph.toLowerCase().includes('approach') || paragraph.toLowerCase().includes('ai, for us'));
                
                return (
                  <p key={index} className={`${isHeading ? 'text-lg font-semibold text-warning mt-4' : 'text-light-secondary leading-relaxed'}`}>
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        );

      case 'team':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-light">Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {companyInfo.team.map((member, index) => (
                <div key={index} className="bg-dark/50 p-3 rounded-lg">
                  <h3 className="font-medium text-accent">{member.name}</h3>
                  <p className="text-sm text-light-secondary">{member.position}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'values':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-light">Our Values</h2>
            <div className="space-y-4">
              {companyInfo.values.map((value, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-accent/20 p-2 rounded-md">
                    {getIconByName('idea', { className: 'text-accent' })}
                  </div>
                  <div>
                    <h3 className="font-medium text-light">{value.name}</h3>
                    <p className="text-sm text-light-secondary">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'mission':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-light">Our Mission</h2>
            <div className="bg-dark/50 p-4 rounded-lg mb-4">
              <p className="text-light-secondary italic">
                {companyInfo.mission.split('\n\n')[0]}
              </p>
            </div>
            <p className="text-light-secondary">
              {companyInfo.mission.split('\n\n')[1]}
            </p>
          </div>
        );

      default:
        return <div>Select a section to view content</div>;
    }
  };

  return (
    <div className="flex h-full">
      <div className="sidebar-nav border-r border-gray-700/50">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`sidebar-item ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            {getIconByName(section.icon, { size: 'sm' })}
            <span>{section.title}</span>
          </div>
        ))}
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NaniVault;
