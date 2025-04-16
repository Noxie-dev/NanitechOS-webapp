import React, { useState, useEffect, useCallback } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';

// Define types for search results
interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'page' | 'article' | 'blog' | 'news' | 'contact' | 'team' | 'resource';
  url: string;
  imageUrl?: string;
  category?: string;
  snippet?: string;
  createdAt?: string;
  icon?: string;
}

interface SearchProps {
  className?: string;
}

export default function Search({ className }: SearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search input to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search results
  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ['/api/search', debouncedQuery],
    queryFn: async ({ queryKey }) => {
      const query = queryKey[1] as string;
      if (!query.trim()) return [];
      
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Search failed');
        }
        const data = await response.json();
        return data as SearchResult[];
      } catch (error) {
        console.error('Search error:', error);
        return [] as SearchResult[];
      }
    },
    enabled: debouncedQuery.trim().length > 0,
  });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // CMD+K or CTRL+K to open search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsOpen(prev => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Format the text snippet with highlighted search terms
  const formatSnippet = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.trim()})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-accent/20 text-accent font-medium px-0.5 rounded-sm">{part}</mark> : part
    );
  };

  // Get icon for result type
  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'page': return '🌐';
      case 'article': return '📄';
      case 'blog': return '✍️';
      case 'news': return '📰';
      case 'contact': return '✉️';
      case 'team': return '👥';
      case 'resource': return '📚';
      default: return '🔍';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("rounded-full hover:bg-background/10", className)}
          aria-label="Search"
        >
          <SearchIcon className="h-5 w-5 text-light" />
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[700px] max-w-[95vw] p-0 overflow-hidden bg-transparent border-none" 
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <div className="flex flex-col h-[80vh] bg-black/80 backdrop-blur-md text-light rounded-lg">
          {/* This is for accessibility, visually hidden */}
          <div className="sr-only" id="dialog-title">Search NaniOS</div>
          <div className="sr-only" id="dialog-description">Search across all content in NaniOS</div>
          
          {/* Search input - Google-like */}
          <div className="p-2 sm:p-4 border-b border-white/10">
            <div className="flex items-center gap-1 sm:gap-2 bg-white/10 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
              <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5 text-light/70" />
              <input
                className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base text-light placeholder:text-light/50"
                placeholder="Search NaniOS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                aria-labelledby="dialog-title"
              />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 sm:h-6 sm:w-6 p-0 rounded-full text-light/70 hover:text-light hover:bg-white/10" 
                  onClick={() => setSearchQuery('')}
                >
                  ×
                </Button>
              )}
            </div>
            <div className="text-[10px] sm:text-xs text-light/50 mt-1 sm:mt-2 flex justify-between">
              <span className="hidden sm:inline">Press ESC to close</span>
              <span className="sm:hidden">Tap outside to close</span>
              <span>{searchResults.length} results</span>
            </div>
          </div>

          {/* Search results - Google-like */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-4 text-light">
            {isLoading ? (
              <div className="flex justify-center items-center h-24">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-accent"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-4 sm:space-y-6">
                {searchResults.map((result) => (
                  <div key={result.id} className="search-result">
                    <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-light/60">
                      <span>{getTypeIcon(result.type)}</span>
                      <span className="capitalize">{result.type}</span>
                      {result.category && (
                        <>
                          <span>•</span>
                          <span>{result.category}</span>
                        </>
                      )}
                    </div>
                    
                    <a href={result.url} className="block mt-1 group" onClick={() => setIsOpen(false)}>
                      <h3 className="text-sm sm:text-base font-medium text-accent group-hover:underline">
                        {formatSnippet(result.title, debouncedQuery)}
                      </h3>
                      <p className="text-xs sm:text-sm text-light/70 line-clamp-2 mt-1">
                        {formatSnippet(result.snippet || result.content.substring(0, 150) + '...', debouncedQuery)}
                      </p>
                    </a>
                    
                    {result.imageUrl && (
                      <div className="mt-2 rounded overflow-hidden w-12 h-12 sm:w-16 sm:h-16 bg-black/30">
                        <img 
                          src={result.imageUrl} 
                          alt={result.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : searchQuery.trim() !== '' && (
              <div className="text-center py-6 sm:py-10">
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🔍</div>
                <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2 text-light">No results found</h3>
                <p className="text-xs sm:text-sm text-light/70">
                  Try searching with different keywords or browse the applications.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}