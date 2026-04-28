'use client';

import { ErrorDisplay } from '@/components/ErrorDisplay';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-custom py-12">
      <ErrorDisplay
        title="Page Error"
        message={error.message || 'An unexpected error occurred while loading this page.'}
        onRetry={reset}
      />
    </div>
  );
}
