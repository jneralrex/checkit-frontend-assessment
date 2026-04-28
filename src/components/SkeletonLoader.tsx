/**
 * Skeleton loader component for listing cards
 * Provides visual feedback during data loading
 */

export function PokemonCardSkeleton() {
  return (
    <div className="card p-4 space-y-4">
      {/* Image skeleton */}
      <div className="skeleton h-48 w-full rounded-md" />

      {/* Title skeleton */}
      <div className="skeleton h-6 w-3/4 rounded" />

      {/* Meta skeleton */}
      <div className="space-y-2">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-5/6 rounded" />
      </div>
    </div>
  );
}

export function PokemonListSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PokemonCardSkeleton key={i} />
      ))}
    </div>
  );
}
