import React from 'react';
import { 
  FolderIcon, 
  Squares2X2Icon, 
  CommandLineIcon, 
  Cog6ToothIcon,
  DocumentIcon,
  PlusCircleIcon,
  ClockIcon,
  ChartBarIcon,
  VideoCameraIcon,
  EnvelopeIcon,
  SparklesIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  UserGroupIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export interface IconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10'
};

export const getIconByName = (name: string, props: IconProps = {}): React.ReactElement => {
  const { className = '', size = 'md' } = props;
  const sizeClass = iconSizes[size];
  const combinedClassName = `${sizeClass} ${className}`;
  
  switch(name.toLowerCase()) {
    case 'folder':
      return <FolderIcon className={combinedClassName} />;
    case 'apps':
      return <Squares2X2Icon className={combinedClassName} />;
    case 'terminal':
      return <CommandLineIcon className={combinedClassName} />;
    case 'settings':
      return <Cog6ToothIcon className={combinedClassName} />;
    case 'document':
      return <DocumentIcon className={combinedClassName} />;
    case 'plus-circle':
      return <PlusCircleIcon className={combinedClassName} />;
    case 'clock':
      return <ClockIcon className={combinedClassName} />;
    case 'chart':
      return <ChartBarIcon className={combinedClassName} />;
    case 'video':
      return <VideoCameraIcon className={combinedClassName} />;
    case 'mail':
      return <EnvelopeIcon className={combinedClassName} />;
    case 'sparkles':
      return <SparklesIcon className={combinedClassName} />;
    case 'close':
      return <XMarkIcon className={combinedClassName} />;
    case 'search':
      return <MagnifyingGlassIcon className={combinedClassName} />;
    case 'refresh':
      return <ArrowPathIcon className={combinedClassName} />;
    case 'team':
      return <UserGroupIcon className={combinedClassName} />;
    case 'idea':
      return <LightBulbIcon className={combinedClassName} />;
    case 'rocket':
      return <RocketLaunchIcon className={combinedClassName} />;
    case 'file':
      return <BookOpenIcon className={combinedClassName} />;
    case 'shield':
      return <ShieldCheckIcon className={combinedClassName} />;
    case 'academic':
      return <AcademicCapIcon className={combinedClassName} />;
    case 'arrow-right':
      return <ArrowRightIcon className={combinedClassName} />;
    case 'services':
      return <BriefcaseIcon className={combinedClassName} />;
    case 'bin':
      return <TrashIcon className={combinedClassName} />;
    default:
      return <div className={combinedClassName}>?</div>;
  }
};

// Logo component
export const NaniLogo: React.FC<IconProps> = ({ className = '', size = 'md' }) => {
  const sizeClass = iconSizes[size];
  
  return (
    <svg className={`${sizeClass} ${className}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00a8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 17L12 22L22 17" stroke="#00a8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12L12 17L22 12" stroke="#00a8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};
