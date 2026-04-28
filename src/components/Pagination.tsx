'use client';

/**
 * Pagination component
 * Provides navigation between pages
 */

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
}

export function Pagination({
  currentPage,
  hasNextPage,
  hasPreviousPage,
  totalPages,
}: PaginationProps) {
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    // Preserve search query if it exists
    if (searchParams.get('q')) {
      params.set('q', searchParams.get('q') || '');
    }
    return `?${params.toString()}`;
  };

  const getPrevButtonClass = () => {
    return hasPreviousPage
      ? 'bg-blue-500 text-white hover:bg-blue-600'
      : 'bg-slate-200 text-slate-400 cursor-not-allowed pointer-events-none';
  };

  const getNextButtonClass = () => {
    return hasNextPage
      ? 'bg-blue-500 text-white hover:bg-blue-600'
      : 'bg-slate-200 text-slate-400 cursor-not-allowed pointer-events-none';
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <Link
        href={createPageUrl(currentPage - 1)}
        className={`px-2 text-[12px] md:px-4 py-2 rounded-lg font-medium transition ${getPrevButtonClass()}`}
        onClick={(e) => !hasPreviousPage && e.preventDefault()}
      >
        ← Previous
      </Link>

      <span className="text-sm font-medium text-slate-600 px-4">
        Page <span className="font-bold text-slate-900">{currentPage}</span> of{' '}
        <span className="font-bold text-slate-900">{totalPages}</span>
      </span>

      <Link
        href={createPageUrl(currentPage + 1)}
        className={`px-2 text-[12px] md:px-4 py-2 rounded-lg font-medium transition ${getNextButtonClass()}`}
        onClick={(e) => !hasNextPage && e.preventDefault()}
      >
        Next →
      </Link>
    </div>
  );
}
