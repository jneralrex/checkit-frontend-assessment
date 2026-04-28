import { PokemonListSkeleton } from '@/components/SkeletonLoader';

export default function Loading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-10 bg-slate-200 rounded w-1/4 animate-pulse mb-4" />
        <div className="h-10 bg-slate-200 rounded w-full animate-pulse" />
      </div>
      <PokemonListSkeleton count={20} />
    </div>
  );
}
