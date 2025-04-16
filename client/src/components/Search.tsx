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
      regex.test(part) ? <mark key={i} className="bg-yellow-200 text-black px-0.5 rounded">{part}</mark> : part
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
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
        <div className="flex flex-col h-[80vh] bg-background">
          {/* Search input - Google-like */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 bg-muted rounded-full px-4 py-2">
              <SearchIcon className="h-5 w-5 text-muted-foreground" />
              <input
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                placeholder="Search NaniOS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 rounded-full" 
                  onClick={() => setSearchQuery('')}
                >
                  ×
                </Button>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-2 flex justify-between">
              <span>Press ESC to close</span>
              <span>{searchResults.length} results</span>
            </div>
          </div>

          {/* Search results - Google-like */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-24">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-6">
                {searchResults.map((result) => (
                  <div key={result.id} className="search-result">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
                      <h3 className="text-base font-medium text-blue-600 group-hover:underline">
                        {formatSnippet(result.title, debouncedQuery)}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {formatSnippet(result.snippet || result.content.substring(0, 150) + '...', debouncedQuery)}
                      </p>
                    </a>
                    
                    {result.imageUrl && (
                      <div className="mt-2 rounded overflow-hidden w-16 h-16 bg-muted">
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
              <div className="text-center py-10">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground text-sm">
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