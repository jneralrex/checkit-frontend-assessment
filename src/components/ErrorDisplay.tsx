/**
 * Error component for error boundaries
 * Displays user-friendly error messages
 */

export function ErrorDisplay({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again later.',
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="container-custom py-12">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-red-900 mb-2">{title}</h2>
        <p className="text-red-700 mb-6 max-w-md mx-auto">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary"
            aria-label="Retry loading"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
