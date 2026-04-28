/**
 * Pokemon card component
 * Displays a single Pokemon with image, name, and metadata
 */

import Image from 'next/image';
import Link from 'next/link';
import type { PokemonListItem } from '@/types/pokemon';

interface PokemonCardProps {
  pokemon: PokemonListItem;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <Link href={`/pokemon/${pokemon.id}`} className="group">
      <div className="card overflow-hidden h-full flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-xl">
        {/* Image container */}
        <div className="relative w-full aspect-square bg-gradient-to-br from-blue-50 to-slate-100 overflow-hidden">
          {pokemon.image ? (
            <Image
              src={pokemon.image}
              alt={pokemon.name}
              fill
              className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
              priority={pokemon.id <= 4} // Priority load for first few Pokemon
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              unoptimized={process.env.NODE_ENV === 'development'} // For faster local dev
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <span className="text-center px-4">Image not available</span>
            </div>
          )}
        </div>

        {/* Content container */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-bold text-slate-900 capitalize mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {pokemon.name}
          </h3>

          {/* ID and types */}
          <div className="flex items-center justify-between mt-auto">
            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              #{pokemon.id.toString().padStart(3, '0')}
            </span>
            {pokemon.types.length > 0 && (
              <div className="flex gap-1 flex-wrap justify-end">
                {pokemon.types.slice(0, 2).map((type) => (
                  <span
                    key={type}
                    className="text-xs font-medium text-white bg-slate-500 px-2 py-1 rounded capitalize"
                  >
                    {type}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
