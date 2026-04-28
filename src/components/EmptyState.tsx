/**
 * Empty state component
 * Displayed when search returns no results
 */

export function EmptyState({
  title = 'No Pokemon found',
  description = 'Try adjusting your search or filters.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="container-custom py-12">
      <div className="flex flex-col items-center justify-center text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-600 max-w-md">{description}</p>
      </div>
    </div>
  );
}
