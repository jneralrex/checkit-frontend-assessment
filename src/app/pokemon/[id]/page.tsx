import { getPokemonById } from '@/lib/pokemon';
import { Breadcrumb } from '@/components/Breadcrumb';
import { EmptyState } from '@/components/EmptyState';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import type { Metadata } from 'next';

interface PokemonDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PokemonDetailPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const pokemon = await getPokemonById(id);

    const imageUrl =
      pokemon.sprites.other?.['official-artwork']?.front_default ||
      pokemon.sprites.front_default ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

    return {
      title: `${pokemon.name} - Pokémon Explorer`,
      description: `Detailed information about ${pokemon.name}. Types: ${pokemon.types.map((t) => t.type.name).join(', ')}`,
      openGraph: {
        title: `${pokemon.name} - Pokémon Explorer`,
        description: `Explore ${pokemon.name} with detailed stats and abilities.`,
        images: [
          {
            url: imageUrl,
            width: 300,
            height: 300,
            alt: pokemon.name,
          },
        ],
      },
    };
  } catch {
    return {
      title: 'Pokémon - Pokémon Explorer',
      description: 'View detailed Pokémon information.',
    };
  }
}

async function PokemonDetailContent({ id }: { id: string }) {
  try {
    const pokemon = await getPokemonById(id);

    const imageUrl =
      pokemon.sprites.other?.['official-artwork']?.front_default ||
      pokemon.sprites.front_default ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

    return (
      <>
        <Breadcrumb
          items={[
            { label: 'Pokédex', href: '/' },
            { label: pokemon.name, href: `/pokemon/${pokemon.id}` },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column: Image and basic info */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-slate-100 rounded-xl p-8 aspect-square flex items-center justify-center overflow-hidden">
              <Image
                src={imageUrl}
                alt={pokemon.name}
                width={300}
                height={300}
                className="object-contain w-full h-full"
                priority
              />
            </div>

            <div className="card p-6 space-y-4">
              <h1 className="text-3xl font-bold text-slate-900 capitalize">
                {pokemon.name}
              </h1>
              <p className="text-lg text-blue-600 font-semibold">
                #{pokemon.id.toString().padStart(3, '0')}
              </p>

              {/* Types */}
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-2">Type</h3>
                <div className="flex flex-wrap gap-2">
                  {pokemon.types.map((typeSlot) => (
                    <span
                      key={typeSlot.type.name}
                      className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium capitalize"
                    >
                      {typeSlot.type.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Basic measurements */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Height</p>
                  <p className="text-lg font-bold text-slate-900">
                    {(pokemon.height / 10).toFixed(1)} m
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Weight</p>
                  <p className="text-lg font-bold text-slate-900">
                    {(pokemon.weight / 10).toFixed(1)} kg
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Stats and abilities */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Base Stats</h2>
              <div className="space-y-4">
                {pokemon.stats.map((stat) => (
                  <div key={stat.stat.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700 capitalize">
                        {stat.stat.name.replace('-', ' ')}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {stat.base_stat}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, (stat.base_stat / 150) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Abilities */}
            {pokemon.abilities.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Abilities</h2>
                <div className="space-y-3">
                  {pokemon.abilities.map((ability) => (
                    <div
                      key={ability.ability.name}
                      className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
                    >
                      <span className="text-lg">
                        {ability.is_hidden ? '⭐' : '🎯'}
                      </span>
                      <div>
                        <p className="font-medium text-slate-900 capitalize">
                          {ability.ability.name.replace('-', ' ')}
                        </p>
                        {ability.is_hidden && (
                          <p className="text-xs text-slate-500">Hidden Ability</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <Link href="/" className="btn-primary">
            ← Back to Pokédex
          </Link>
        </div>
      </>
    );
  } catch (error) {
    console.error('Failed to fetch Pokemon detail:', error);
    return (
      <EmptyState
        title="Pokémon not found"
        description="The Pokémon you're looking for doesn't exist. Check the ID and try again."
      />
    );
  }
}

export default async function PokemonDetailPage({ params }: PokemonDetailPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="animate-pulse h-96 bg-slate-200 rounded-lg" />}>
      <PokemonDetailContent id={id} />
    </Suspense>
  );
}
