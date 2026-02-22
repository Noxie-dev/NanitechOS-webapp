import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getIconByName } from '../assets/Icons';
import { useAppState } from '../hooks/use-app-state';
import { useQuery } from '@tanstack/react-query';

import founderImg from "../assets/founder.jpg";

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
  const teamContent = contents?.find(c => c.title === "Team")?.content || companyInfo.teamContent || "";

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
          <div className="space-y-8 pb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent to-warning rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-dark/80 rounded-2xl overflow-hidden border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  <div className="h-[300px] md:h-full relative overflow-hidden">
                    <img 
                      src={founderImg} 
                      alt="NaniTech Founder" 
                      className="absolute inset-0 w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-700 scale-105 hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-dark/80"></div>
                  </div>
                  <div className="p-8 flex flex-col justify-center space-y-4">
                    <div className="inline-block px-3 py-1 rounded-full bg-warning/20 border border-warning/30 text-warning text-xs font-bold tracking-widest uppercase mb-2">
                      Founder & Lead Builder
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">
                      Architecting <span className="text-warning">Impact</span>
                    </h2>
                    <p className="text-light-secondary text-sm leading-relaxed italic border-l-2 border-accent/50 pl-4">
                      "This isn’t just development. It’s building intelligent systems with purpose."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
              <div className="lg:col-span-8 space-y-6">
                {formatContent(teamContent)}
              </div>
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-accent/5 border border-accent/20 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-accent font-bold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                    Current Focus
                  </h3>
                  <ul className="space-y-3 text-sm text-light-secondary">
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-accent"></div>
                      SaaS Product Architecture
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-accent"></div>
                      Strategic AI Integration
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-accent"></div>
                      Emerging Market Scalability
                    </li>
                  </ul>
                </div>
              </div>
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
