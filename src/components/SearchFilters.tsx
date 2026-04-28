'use client';

/**
 * Search and filter component
 * Handles client-side search with debounce and URL state management
 */

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface SearchFiltersProps {
  onSearchChange?: (query: string) => void;
}

export function SearchFilters({ onSearchChange }: SearchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Handle search input with debounce
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);

      if (query) {
        params.set('q', query);
        params.set('page', '1'); // Reset to first page on new search
      } else {
        params.delete('q');
        params.delete('page');
      }

      router.push(`${pathname}?${params.toString()}`);
      onSearchChange?.(query);
    }, 300); // 300ms debounce

    setDebounceTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [query, router, pathname, searchParams, onSearchChange]);

  return (
    <div className="w-full mb-6">
      <input
        type="text"
        placeholder="Search Pokemon by name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input-search text-base placeholder:text-slate-400"
        aria-label="Search Pokemon"
      />
      {query && (
        <p className="text-sm text-slate-500 mt-2">
          Searching for: <span className="font-semibold text-slate-700">{query}</span>
        </p>
      )}
    </div>
  );
}
