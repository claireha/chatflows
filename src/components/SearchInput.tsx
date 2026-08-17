import React, { useState, useEffect } from 'react';
import { SearchIcon } from './icons/SearchIcon';

interface SearchInputProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  useSimplifiedSidebar?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = "Search HubSpot",
  useSimplifiedSidebar = false,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.getElementById('global-search');
        searchInput?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="flex items-center border border-[hsl(0_0%_54%)] rounded-full px-3 py-1.5 w-full transition-colors bg-[#333333] hover:bg-[#666666]">
        <input
          id="global-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-sidebar-foreground text-sm font-extralight bg-transparent border-none outline-none placeholder-sidebar-foreground"
        />
        <div className="flex items-center ml-2 flex-shrink-0">
          <SearchIcon className="w-4 h-4 text-sidebar-foreground" />
        </div>
      </div>
    </form>
  );
};
