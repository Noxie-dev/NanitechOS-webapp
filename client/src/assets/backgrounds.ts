interface Background {
  id: string;
  name: string;
  url: string;
  category: 'abstract' | 'tech' | 'landscape';
  description?: string;
}

export const backgrounds: Background[] = [
  // Abstract geometric patterns
  {
    id: 'abstract-1',
    name: 'Blue Patterns',
    url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1600&ixlib=rb-4.0.3',
    category: 'abstract',
    description: 'Abstract blue geometric pattern'
  },
  {
    id: 'abstract-2',
    name: 'Digital Wave',
    url: 'https://images.unsplash.com/photo-1614849286899-66de7254de61?auto=format&fit=crop&q=80&w=1600&ixlib=rb-4.0.3',
    category: 'abstract',
    description: 'Digital wave pattern in blue tones'
  },
  {
    id: 'abstract-3',
    name: 'Fluid Shapes',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1600&ixlib=rb-4.0.3',
    category: 'abstract',
    description: 'Fluid abstract geometric shapes'
  },
  
  // Tech-themed backgrounds
  {
    id: 'tech-1',
    name: 'Circuit Board',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1600&ixlib=rb-4.0.3',
    category: 'tech',
    description: 'Digital circuit board pattern'
  },
  {
    id: 'tech-2',
    name: 'Data Visualization',
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1600&ixlib=rb-4.0.3',
    category: 'tech',
    description: 'Data visualization in blue and purple'
  },
  {
    id: 'tech-3',
    name: 'Code Matrix',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1600&ixlib=rb-4.0.3',
    category: 'tech',
    description: 'Digital code matrix pattern'
  }
];

export const getDefaultBackground = (): Background => {
  return backgrounds[0]; // Blue Patterns is the default
};

export const getBackgroundUrl = (id: string): string => {
  const background = backgrounds.find(bg => bg.id === id);
  return background ? background.url : getDefaultBackground().url;
};

export const getBackgroundsByCategory = (category: Background['category']): Background[] => {
  return backgrounds.filter(bg => bg.category === category);
};
