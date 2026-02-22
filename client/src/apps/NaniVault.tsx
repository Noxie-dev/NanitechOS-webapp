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

  const { data: contents, isLoading } = useQuery<any[]>({
    queryKey: ['/api/content'],
  });

  const storyContent = contents?.find(c => c.title === "Our Story")?.content || "";
  const missionContent = contents?.find(c => c.title === "Our Mission")?.content || "";
  const valuesContent = contents?.find(c => c.title === "Our Values")?.content || "";

  const formatContent = (text: string) => {
    return text.split('\n\n').filter(p => p.trim()).map((paragraph, index) => {
      if (paragraph.includes('•') || paragraph.includes('- ') || /^\d+\./.test(paragraph)) {
        const lines = paragraph.split('\n').filter(l => l.trim());
        return (
          <ul key={index} className="space-y-2 ml-4">
            {lines.map((line, i) => {
              const isNumber = /^\d+\./.test(line);
              return (
                <li key={i} className="text-light-secondary flex items-start gap-2">
                  <span className="text-warning mt-1.5 min-w-[1.2rem]">{isNumber ? line.split('.')[0] + '.' : '•'}</span>
                  <span>{isNumber ? line.replace(/^\d+\.\s*/, '') : line.replace(/^[•-]\s*/, '')}</span>
                </li>
              );
            })}
          </ul>
        );
      }
      
      const isHeading = paragraph.length < 100 && (
        paragraph.includes(':') || 
        paragraph.toLowerCase().includes('approach') || 
        paragraph.toLowerCase().includes('ai, for us') ||
        paragraph.toLowerCase().includes('our mission') ||
        paragraph.toLowerCase().includes('our values')
      );
      
      return (
        <p key={index} className={`${isHeading ? 'text-lg font-semibold text-warning mt-4' : 'text-light-secondary leading-relaxed'}`}>
          {paragraph}
        </p>
      );
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      );
    }

    switch (activeSection) {
      case 'story':
        return (
          <div className="space-y-6 pb-8">
            <h2 className="text-2xl font-bold mb-6 text-light border-b border-accent/30 pb-2">Our Story</h2>
            <div className="space-y-4">
              {formatContent(storyContent)}
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
          <div className="space-y-6 pb-8">
            <h2 className="text-2xl font-bold mb-6 text-light border-b border-accent/30 pb-2">Our Values</h2>
            <div className="space-y-4">
              {formatContent(valuesContent)}
            </div>
          </div>
        );

      case 'mission':
        return (
          <div className="space-y-6 pb-8">
            <h2 className="text-2xl font-bold mb-6 text-light border-b border-accent/30 pb-2">Our Mission</h2>
            <div className="space-y-4">
              {formatContent(missionContent)}
            </div>
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
