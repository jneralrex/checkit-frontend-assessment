import { Suspense } from 'react';
import { getPokemonList, transformPokemonListItems, searchPokemon } from '@/lib/pokemon';
import { PokemonCard } from '@/components/PokemonCard';
import { SearchFilters } from '@/components/SearchFilters';
import { Pagination } from '@/components/Pagination';
import { PokemonListSkeleton } from '@/components/SkeletonLoader';
import { EmptyState } from '@/components/EmptyState';
import type { Metadata } from 'next';

const ITEMS_PER_PAGE = 20;

export const metadata: Metadata = {
  title: 'Pokémon Explorer - Browse Pokédex',
  description: 'Browse and discover Pokémon from the official Pokédex with advanced filtering.',
};

async function PokemonListContent({
  page,
  searchQuery,
}: {
  page: number;
  searchQuery: string;
}) {
  try {
    // If there's a search query, search for that specific Pokémon
    if (searchQuery) {
      const searchResult = await searchPokemon(searchQuery);
      if (!searchResult) {
        return (
          <EmptyState
            title={`No Pokémon found for "${searchQuery}"`}
            description="Try searching for a different Pokémon or clear your search to browse all."
          />
        );
      }

      // Return single search result
      return (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <PokemonCard
              pokemon={{
                id: searchResult.id,
                name: searchResult.name,
                image: searchResult.sprites.other?.['official-artwork']?.front_default || searchResult.sprites.front_default || null,
                types: searchResult.types.map((t) => t.type.name),
              }}
            />
          </div>
        </>
      );
    }

    // Regular paginated listing
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const data = await getPokemonList(ITEMS_PER_PAGE, offset);

    if (!data.results || data.results.length === 0) {
      return <EmptyState />;
    }

    const pokemonItems = await transformPokemonListItems(data.results);
    const totalPages = Math.ceil(data.count / ITEMS_PER_PAGE);

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pokemonItems.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          hasNextPage={data.next !== null}
          hasPreviousPage={data.previous !== null}
        />
      </>
    );
  } catch (error) {
    console.error('Failed to fetch Pokemon list:', error);
    return (
      <EmptyState
        title="Unable to load Pokémon"
        description="There was an error loading the Pokédex. Please refresh the page."
      />
    );
  }
}

interface HomeProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const query = params.q || '';

  if (page < 1) {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Pokédex</h2>
          <SearchFilters />
        </div>
        <EmptyState
          title="Invalid page"
          description="Please use valid page numbers."
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Pokédex</h2>
        <SearchFilters />
      </div>

      <Suspense fallback={<PokemonListSkeleton />}>
        <PokemonListContent page={page} searchQuery={query} />
      </Suspense>
    </div>
  );
}
