/**
 * useSearch hook
 * Manages search state with URL synchronization
 */

'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export function useSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = useMemo(() => searchParams.get('q') || '', [searchParams]);
  const page = useMemo(() => parseInt(searchParams.get('page') || '1', 10), [searchParams]);

  const updateQuery = useCallback(
    (newQuery: string) => {
      const params = new URLSearchParams(searchParams);
      if (newQuery) {
        params.set('q', newQuery);
        params.set('page', '1'); // Reset to first page
      } else {
        params.delete('q');
        params.delete('page');
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const updatePage = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', newPage.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const resetSearch = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return {
    query,
    page,
    updateQuery,
    updatePage,
    resetSearch,
  };
}
