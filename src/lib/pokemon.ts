/**
 * PokéAPI data fetching layer
 * Abstracts all API interactions for Pokemon data
 */

import type { Pokemon, PokemonListResponse, PokemonListItem } from '@/types/pokemon';

const API_BASE = 'https://pokeapi.co/api/v2';
const CACHE_DURATION = 3600; // 1 hour in seconds

/**
 * Fetch a paginated list of Pokemon with caching
 * Used for listing page
 */
export async function getPokemonList(
  limit: number = 20,
  offset: number = 0
): Promise<PokemonListResponse> {
  const url = `${API_BASE}/pokemon?limit=${limit}&offset=${offset}`;

  const response = await fetch(url, {
    next: {
      revalidate: CACHE_DURATION, // ISR: revalidate every hour
      tags: ['pokemon-list'],
    },
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon list: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch detailed Pokemon data by ID
 * Used for detail page
 */
export async function getPokemonById(id: number | string): Promise<Pokemon> {
  const url = `${API_BASE}/pokemon/${id}`;

  const response = await fetch(url, {
    next: {
      revalidate: CACHE_DURATION, // ISR: revalidate every hour
      tags: [`pokemon-${id}`],
    },
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon ${id}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Search Pokemon by name
 * Uses PokéAPI name-based search
 */
export async function searchPokemon(query: string): Promise<Pokemon | null> {
  if (!query || query.length === 0) {
    return null;
  }

  try {
    const url = `${API_BASE}/pokemon/${query.toLowerCase()}`;
    const response = await fetch(url, {
      next: { revalidate: CACHE_DURATION },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

/**
 * Get Pokemon by type filter
 * Fetches all Pokemon of a specific type
 */
export async function getPokemonByType(
  type: string
): Promise<Array<{ pokemon: { name: string; url: string } }>> {
  const url = `${API_BASE}/type/${type.toLowerCase()}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: CACHE_DURATION },
    });

    if (!response.ok) {
      return [];
    }

    const data: { pokemon: Array<{ pokemon: { name: string; url: string } }> } =
      await response.json();
    return data.pokemon;
  } catch {
    return [];
  }
}

/**
 * Transform raw Pokemon list response into display-friendly format
 */
export async function transformPokemonListItems(
  results: Array<{ name: string; url: string }>
): Promise<PokemonListItem[]> {
  // Extract IDs from URLs and create list items
  const items = results.map((pokemon) => {
    const id = parseInt(pokemon.url.split('/').filter(Boolean).pop() || '0', 10);
    return {
      id,
      name: pokemon.name,
      image: getOfficialArtworkUrl(id),
      types: [],
    };
  });

  return items;
}

/**
 * Generate official Pokemon artwork URL
 * Uses the official-artwork endpoint from PokéAPI
 */
export function getOfficialArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/**
 * Get ID from Pokemon URL
 */
export function getIdFromUrl(url: string): number {
  return parseInt(url.split('/').filter(Boolean).pop() || '0', 10);
}
